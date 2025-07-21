import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent, FamilyMember } from '../../shared/shared-interfaces';
import { CalendarService } from '../../services/calendar.service';
import { FamilyMembersService } from '../../services/family-members.service';
import { MonthViewComponent } from "./views/month-view/month-view.component";
import { CalendarEventModalComponent } from './calendar-event-modal/calendar-event-modal.component';
import { WeekViewComponent } from './views/week-view/week-view.component';
import { NavComponent } from "../nav/nav.component";
import { DayViewComponent } from "./views/day-view/day-view.component";
import { SubscriptionService } from '../../services/subscription.service';
import { Observable, map } from 'rxjs';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { ToDoComponent } from '../to-do/to-do.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MonthViewComponent,
    WeekViewComponent,
    DayViewComponent,
    CalendarEventModalComponent,
    NavComponent,
    DayViewComponent,
    ToDoComponent
],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  private calendarService = inject(CalendarService);
  private familyService = inject(FamilyMembersService);
  private subscriptionService = inject(SubscriptionService);
  private firestore = inject(Firestore);

  calendarEvents = signal<CalendarEvent[]>([]);
  familyMembers = signal<FamilyMember[]>([]);
  selectedDate = signal(new Date());
  currentView = signal<'month' | 'week' | 'day'>('month');

  showEventModal = signal(false);
  editingEvent = signal<CalendarEvent | null>(null);
  newEventTitle = signal('');
  selectedUserId = signal<string | null>(null);
  startTime = signal('');
  endTime = signal('');
  monthLabel = computed(() =>
    this.selectedDate().toLocaleString('default', {month: 'long', year: 'numeric'})
  );
  showTrialMessage = false;
  trialDaysLeft: number = 0;
  subStatus$!: Observable<'free' | 'trial' | 'paid' | 'expired' | undefined>;
  

  ngOnInit(): void {
    this.showTrialAlert();
    this.loadSubStatus();
    this.loadData();
  }

  showTrialAlert() {
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');

    if(!justLoggedIn) return;

    this.subscriptionService.getFamilyData().subscribe(family => {
      if (
        family &&
        family.subStatus === 'trial'
      ) {

        this.trialDaysLeft = this.subscriptionService.getTrialDaysLeft(family.trialStart);
        
        // setTimeout(() => {
        //   alert(`You have ${this.trialDaysLeft} day(s) left until you trial is over`);
        // }, 0);

        this.showTrialMessage = true;
      }
    });

    sessionStorage.removeItem('justLoggedIn');
  }

  async loadSubStatus() {
    const familyId = await this.familyService.getFamilyId();
    const familyRef = doc(this.firestore, `families/${familyId}`);

    this.subStatus$ = docData(familyRef).pipe(
      map((data: any) => data?.subStatus ?? 'free')
    );
  }

  async loadData() {
    const members$ = await this.familyService.getMembers();
    members$.subscribe(members => this.familyMembers.set(members));

    const events$ = await this.calendarService.loadEvents();
    events$.subscribe(events => this.calendarEvents.set(events));
  }

  handleDateClick(date: Date, view: string): void {
    this.selectedDate.set(date);
    this.editingEvent.set(null);

    if(window.innerWidth <= 768 && this.currentView() === 'month') {
      this.switchView('day');
    } else {
      this.showEventModal.set(true);
    }
    
  }

  handleEventEdit(event: CalendarEvent): void {
    this.editingEvent.set({...event});
    this.showEventModal.set(true);
  }

  switchView(view: 'month' | 'week' | 'day') {
    this.currentView.set(view);
  }

  saveEvent(events: CalendarEvent | CalendarEvent[]) {
    if (Array.isArray(events)) {
      events.forEach(e => this.calendarService.saveEvent(e));
    } else {
      this.calendarService.saveEvent(events);
    }
    this.showEventModal.set(false);
  }


  deleteEvent(eventId: string) {
    this.calendarService.deleteEvent(eventId);
    this.showEventModal.set(false);
  }

  onClose() {
    this.showTrialMessage = false;
  }


}

