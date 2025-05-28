import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, query, orderBy, updateDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { ScreenSizeService } from '../screen-size.service';

interface CalendarEvent {
  id?: string;
  title: string;
  date: string;
  isAllDay: boolean;
  uid: string;
  userColor?: string;
  startTime?: string;
  endTime?: string;
}

const USER_COLORS: Record<string, string> = {
  'qpRdiNU87IShdxHrFf1uZZRyLql1': 'green',
  'kc0kSHF8wSbz4vbVyJ8TjFT3Hjo2': 'purple',
  'uid-3': 'red',
  'uid-4': 'blue',
  'uid-5': 'orange',
};

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  db: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  user$ = user(this.auth);
  screenService: ScreenSizeService = inject(ScreenSizeService);

  @ViewChild('calendar', { static: false })
  calendarComponent!: FullCalendarComponent;

  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    height: 'auto',
    contentHeight: 'auto',
    expandRows: true,
  };

  uid: string = '';
  showEventModal = false;
  newEventTitle = '';
  selectedUserId: string | null = null;
  selectedDate = '';
  startTime: string = '';
  endTime: string = '';
  editingEvent: CalendarEvent | null = null;

  currentMobileDate = new Date();
  private eventSub: any;

  users = [
    { uid: 'qpRdiNU87IShdxHrFf1uZZRyLql1', name: 'Dada' },
    { uid: 'kc0kSHF8wSbz4vbVyJ8TjFT3Hjo2', name: 'Mama' },
    { uid: 'uid-3', name: 'Riley' },
    { uid: 'uid-4', name: 'Mimi' },
    { uid: 'uid-5', name: 'Anyone' },
  ];

  get formattedMobileDate(): string {
    return this.currentMobileDate.toISOString().substring(0, 10);
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        this.loadEvents();
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
      if(calendarApi && calendarApi.view.type !== newView) {
        calendarApi.changeView(newView);
      }
    }, 100);
  }

  loadEvents(): void {
    if (this.eventSub) {
      this.eventSub.unsubscribe();
    }

    const ref = collection(this.db, 'calendarEvents');
    const q = query(ref, orderBy('date'));

    this.eventSub = collectionData(q, { idField: 'id' }).subscribe((events: any[]) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 365);

      events.forEach(e => {
        const eventDate = new Date(e.date);
        if (eventDate < cutoffDate) {
          deleteDoc(doc(this.db, 'calendarEvents', e.id)).catch(err => console.error('Delete Error:', err));
        }
      });

      const calendarEvents = events.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.startTime ? `${e.date}T${e.startTime.trim()}` : e.date,
        end: e.endTime ? `${e.date}T${e.endTime}` : undefined,
        allDay: e.isAllDay,
        backgroundColor: USER_COLORS[e.uid] || 'grey',
        extendedProps: { uid: e.uid, startTime: e.startTime, endTime: e.endTime }
      }));

      this.setCalendarOptions(calendarEvents);
    });
  }

  goToPreviousDay() {
    const newDate = new Date(this.currentMobileDate);
    newDate.setDate(newDate.getDate() - 1);
    this.currentMobileDate = newDate;

    const calendarApi = this.calendarComponent.getApi?.();
    if (calendarApi) {
      calendarApi.gotoDate(this.currentMobileDate);
    }
  }

  goToNextDay() {
    const newDate = new Date(this.currentMobileDate);
    newDate.setDate(newDate.getDate() + 1);
    this.currentMobileDate = newDate;

    const calendarApi = this.calendarComponent.getApi?.();
    if (calendarApi) {
      calendarApi.gotoDate(this.currentMobileDate);
    }
  }

  setCalendarOptions(events: any[]) {
    const isMobile = this.screenService.isMobile();
    const initialView = this.getResponsiveView();
    const titleFormat = isMobile ? { month: 'short', day: 'numeric' } : undefined;

    this.calendarOptions = {
      ...this.calendarOptions,
      initialView,
      titleFormat,
      events,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      editable: false,
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit',
        meridiem: 'short'
      },
      eventDidMount: (info: any) => {
        const uid = info.event.extendedProps.uid;
        const userColor = USER_COLORS[uid] || 'black';
        info.el.style.color = userColor;
        const dot = info.el.querySelector('.fc-event-dot') as HTMLElement;
        if (dot) {
          dot.style.borderColor = userColor;
        }
      },
      viewDidMount: () => {
        this.onResize();
      },
      height: 'auto',
      contentHeight: 600,
    };

    setTimeout(() => {
      const calendarApi = this.calendarComponent.getApi?.();
      if (calendarApi) {
        calendarApi.changeView(initialView);
        if (isMobile) {
          calendarApi.gotoDate(this.formattedMobileDate);
        }
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
    this.editingEvent = {
      id: info.event.id,
      title: info.event.title,
      date: info.event.start.toISOString(),
      isAllDay: info.event.allDay,
      uid: info.event.extendedProps.uid,
      startTime: info.event.extendedProps.startTime,
      endTime: info.event.extendedProps.endTime,
    };
    this.selectedDate = info.event.start.toISOString().substring(0, 10);
    this.newEventTitle = info.event.title;
    this.selectedUserId = info.event.extendedProps.uid || null;
    this.startTime = info.event.extendedProps.startTime || '';
    this.endTime = info.event.extendedProps.endTime || '';
    this.showEventModal = true;
  }

  async deleteEvent() {
    if (!this.editingEvent || !this.editingEvent.id) {
      alert('No event selected to delete.');
      return;
    }
    const confirmDelete = confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;
    try {
      const eventRef = doc(this.db, 'calendarEvents', this.editingEvent.id);
      await deleteDoc(eventRef);
      this.showEventModal = false;
      this.clearForm();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('An error occurred while deleting the event.');
    }
  }

  async saveEvent() {
    if (!this.selectedUserId) {
      alert("please select a user.");
      return;
    }
    const eventData: CalendarEvent = {
      title: this.newEventTitle,
      date: this.selectedDate,
      uid: this.selectedUserId,
      startTime: this.startTime.trim() || '',
      endTime: this.endTime.trim() || '',
      isAllDay: !this.startTime?.trim(),
    };
    try {
      if (this.editingEvent && this.editingEvent.id) {
        const eventRef = doc(this.db, 'calendarEvents', this.editingEvent.id);
        await updateDoc(eventRef, eventData as { [key: string]: any });
      } else {
        const eventsRef = collection(this.db, 'calendarEvents');
        await addDoc(eventsRef, eventData as { [key:string]: any});
      }
      console.log(eventData);
      this.showEventModal = false;
      this.clearForm();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("An error occurred while saving the event.");
    }
  }

  clearForm() {
    this.newEventTitle = '';
    this.selectedDate = '';
    this.selectedUserId = null;
    this.startTime = '';
    this.endTime = '';
    this.editingEvent = null;
  }
}

