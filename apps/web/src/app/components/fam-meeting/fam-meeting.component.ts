import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { DateUtils } from '../../shared/date-utils';
import { CalendarEvent, FamilyMember } from '../../shared/shared-interfaces';
import { FamilyMembersService } from '../../services/family-members.service';
import { RouterModule } from '@angular/router';
import { FavMealsComponent } from '../fav-meals/fav-meals.component';
import { MealPlannerComponent } from '../meal-planner/meal-planner.component';


@Component({
  selector: 'app-fam-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FavMealsComponent, MealPlannerComponent],
  templateUrl: './fam-meeting.component.html',
  styleUrl: './fam-meeting.component.css'
})
export class FamMeetingComponent implements OnInit {
  private calendarService = inject(CalendarService);
  private familyService = inject(FamilyMembersService);
  memberColors: Record<string, string> = {};

  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  dateStrings: string[] = [];
  weekEvents: Record<string, CalendarEvent[]> = {};

  familyMembers: FamilyMember[] = [];
  showCalendarModal = false;
  editingEvent: boolean = false;
  newEventTitle: string = '';
  selectedUserId: string | null = null;
  selectedDate: string = '';
  startTime: string = '';
  endTime: string = '';
  currentEventId: string | null = null;

  async ngOnInit(): Promise<void> {
    // const { start } = DateUtils.getStartOfWeek(Date.getDate());
    // this.dateStrings = this.generateWeekDates(start);

    const members$ = await this.familyService.getMembers();
    members$.subscribe(members => {
      this.familyMembers = members;
      this.memberColors = {};
      for(const m of members) {
        this.memberColors[m.id] = m.color;
      }
    });

    const allEvents$ = await this.calendarService.loadEvents();
    allEvents$.subscribe(events => {
      this.weekEvents = {};
      for(const date of this.dateStrings) {
        this.weekEvents[date] = events.filter(e => {
          const eventDate = e.date?.split('T')[0];
          return eventDate === date;
        });
      }
    });
  }

  generateWeekDates(startString: string): string[] {
    const startDate = new Date(startString);
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day.toISOString().split('T')[0]);
    }
    return days;
  }

  formatDateForDisplay(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}`;
  }

  get weekDates(): Record<string, string> {
    const map: Record<string, string> = {};
    this.daysOfWeek.forEach((day, index) => {
      map[day] = this.dateStrings[index];
    });
    return map;
  }

  formatTimeTo12Hour(time: string): string {
    if (!time) return '';
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12 || 12; // Convert 0 → 12
    return `${hour}:${minute}${ampm}`;
  }


  openNewEventModal(date: string): void {
    this.resetModal();
    this.selectedDate = date;
    this.showCalendarModal = true;
    this.editingEvent = false;
  }

  openEditEventModal(event: CalendarEvent): void {
    this.newEventTitle = event.title;
    this.selectedUserId = event.uid;
    this.selectedDate = event.date;
    this.startTime = event.startTime || '';
    this.endTime = event.endTime || '';
    this.currentEventId = event.id || null;
    this.showCalendarModal = true;
    this.editingEvent = true;
  }

  resetModal(): void {
    this.newEventTitle = '';
    this.selectedUserId = null;
    this.startTime = '';
    this.endTime = '';
    this.currentEventId = null;
    this.editingEvent = false;
  }

  async saveEvent() {
    if (!this.selectedUserId) {
      alert('Please select a user.');
      return;
    }
    const event: CalendarEvent = {
      id: this.currentEventId || undefined,
      title: this.newEventTitle,
      date: this.selectedDate,
      uid: this.selectedUserId,
      startTime: this.startTime.trim(),
      endTime: this.endTime.trim(),
      isAllDay: !this.startTime.trim(),
    };
    await this.calendarService.saveEvent(event);
    this.showCalendarModal = false;
    this.resetModal();
  }

  async deleteEvent(): Promise<void> {
    if (this.currentEventId) {
      await this.calendarService.deleteEvent(this.currentEventId);
      this.showCalendarModal = false;
    }
  }



}
