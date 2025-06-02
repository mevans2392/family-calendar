import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormsModule } from '@angular/forms';
import { ScreenSizeService } from '../../services/screen-size.service';
import { CalendarEvent, FamilyMember } from '../../shared/shared-interfaces';
import { CalendarService } from '../../services/calendar.service';
import { FamilyMembersService } from '../../services/family-members.service';
import { Auth, user } from '@angular/fire/auth';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar', { static: false }) calendarComponent!: FullCalendarComponent;

  private screenService = inject(ScreenSizeService);
  private calendarService = inject(CalendarService);
  private familyService = inject(FamilyMembersService);
  private auth = inject(Auth);
  user$ = user(this.auth);

  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    height: 'auto',
    contentHeight: 'auto',
    expandRows: true,
  };

  uid: string = '';
  familyMembers: FamilyMember[] = [];
  showEventModal = false;
  newEventTitle = '';
  selectedUserId: string | null = null;
  selectedDate = '';
  startTime = '';
  endTime = '';
  editingEvent: CalendarEvent | null = null;
  currentMobileDate = new Date();
  private eventSub: any;

  get formattedMobileDate(): string {
    return this.currentMobileDate.toISOString().substring(0, 10);
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        this.loadEvents();
        this.loadMembers();
      }
    });
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('orientationchange', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  onVisibilityChange = () => {
    if (document.hidden) {
      setTimeout(() => this.onResize(), 100);
    }
  };

  getResponsiveView(): 'dayGridDay' | 'dayGridMonth' {
    return this.screenService.isMobile() ? 'dayGridDay' : 'dayGridMonth';
  }

  onResize = () => {
    setTimeout(() => {
      const newView = this.getResponsiveView();
      const calendarApi = this.calendarComponent.getApi?.();
      if (calendarApi && calendarApi.view.type !== newView) {
        calendarApi.changeView(newView);
      }
    }, 100);
  };

  async loadEvents() {
    if (this.eventSub) this.eventSub.unsubscribe();

    // Wait for family members before loading events
    const members$ = await this.familyService.getMembers();
    members$.subscribe(members => {
      this.familyMembers = members;

      // Now load events
      this.calendarService.loadEvents().then(stream$ => {
        this.eventSub = stream$.subscribe(events => {
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - 365);

          events.forEach(e => {
            if (new Date(e.date) < cutoff && e.id) {
              this.calendarService.deleteEvent(e.id);
            }
          });

          const calendarEvents = events.map(e => ({
            id: e.id,
            title: e.title,
            start: e.startTime ? `${e.date}T${e.startTime}` : e.date,
            end: e.endTime ? `${e.date}T${e.endTime}` : undefined,
            allDay: e.isAllDay,
            backgroundColor: this.getColorForUid(e.uid),
            extendedProps: { uid: e.uid, startTime: e.startTime, endTime: e.endTime },
          }));

          this.setCalendarOptions(calendarEvents);
        });
      });
    });
  }


  async loadMembers() {
    const members$ = await this.familyService.getMembers();
    members$.subscribe(members => this.familyMembers = members);
  }

  getColorForUid(uid: string): string {
    return this.familyMembers.find(m => m.id === uid)?.color || 'grey';
  }

  setCalendarOptions(events: any[]) {
    const isMobile = this.screenService.isMobile();
    const initialView = this.getResponsiveView();
    const titleFormat = isMobile ? { month: 'short', day: 'numeric' } : undefined;

    this.calendarOptions = {
      ...this.calendarOptions,
      initialView,
      fixedWeekCount: false,
      titleFormat,
      events,
      headerToolbar: { left: 'prev,next today', center: 'title', right: '' },
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      editable: false,
      eventTimeFormat: { hour: 'numeric', minute: '2-digit', meridiem: 'short' },
      eventDidMount: (info: any) => {
        const color = this.getColorForUid(info.event.extendedProps.uid);
        info.el.style.color = color;
        const dot = info.el.querySelector('.fc-event-dot') as HTMLElement;
        if (dot) dot.style.borderColor = color;
      },
      viewDidMount: () => this.onResize(),
      height: 'auto',
      contentHeight: 600,
    };

    setTimeout(() => {
      const api = this.calendarComponent.getApi?.();
      if (api) {
        api.changeView(initialView);
        if (isMobile) api.gotoDate(this.formattedMobileDate);
      }
    }, 0);
  }

  handleDateClick(arg: any) {
    this.selectedDate = arg.dateStr;
    this.newEventTitle = '';
    this.selectedUserId = null;
    this.startTime = '';
    this.endTime = '';
    this.editingEvent = null;
    this.showEventModal = true;
  }

  handleEventClick(info: any) {
    const event = info.event;
    this.editingEvent = {
      id: event.id,
      title: event.title,
      date: event.start.toISOString().substring(0, 10),
      isAllDay: event.allDay,
      uid: event.extendedProps.uid,
      startTime: event.extendedProps.startTime,
      endTime: event.extendedProps.endTime,
    };
    this.selectedDate = this.editingEvent.date;
    this.newEventTitle = event.title;
    this.selectedUserId = this.editingEvent.uid;
    this.startTime = this.editingEvent.startTime || '';
    this.endTime = this.editingEvent.endTime || '';
    this.showEventModal = true;
  }

  async deleteEvent() {
    if (!this.editingEvent?.id) return;
    const confirmDelete = confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;
    await this.calendarService.deleteEvent(this.editingEvent.id);
    this.showEventModal = false;
    this.clearForm();
  }

  async saveEvent() {
    if (!this.selectedUserId) {
      alert('Please select a user.');
      return;
    }
    const event: CalendarEvent = {
      id: this.editingEvent?.id,
      title: this.newEventTitle,
      date: this.selectedDate,
      uid: this.selectedUserId,
      startTime: this.startTime.trim(),
      endTime: this.endTime.trim(),
      isAllDay: !this.startTime.trim(),
    };
    await this.calendarService.saveEvent(event);
    this.showEventModal = false;
    this.clearForm();
  }

  clearForm() {
    this.newEventTitle = '';
    this.selectedDate = '';
    this.selectedUserId = null;
    this.startTime = '';
    this.endTime = '';
    this.editingEvent = null;
  }

  goToPreviousDay() {
    this.currentMobileDate.setDate(this.currentMobileDate.getDate() - 1);
    this.calendarComponent.getApi?.().gotoDate(this.currentMobileDate);
  }

  goToNextDay() {
    this.currentMobileDate.setDate(this.currentMobileDate.getDate() + 1);
    this.calendarComponent.getApi?.().gotoDate(this.currentMobileDate);
  }
}

