import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DateUtils } from '../../../../shared/date-utils';
import { FamilyMember, CalendarEvent } from '../../../../shared/shared-interfaces';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.css'
})
export class DayViewComponent {

  @Input() selectedDate!: Date;
  @Input() events: CalendarEvent[] = [];
  @Input() familyMembers: FamilyMember[] = [];

  @Output() dateClicked = new EventEmitter<Date>();
  @Output() editClicked = new EventEmitter<CalendarEvent>();
  @Output() dateChanged = new EventEmitter<Date>();

  readonly hours = Array.from({ length: 30}, (_, i) => 6 + i);

  getEventsForUser(uid: string): CalendarEvent[] {
    const dateStr = this.selectedDate.toISOString().substring(0, 10);
    return this.events.filter(e => e.uid === uid && e.date === dateStr && !e.isAllDay && e.startTime);
  }

  getAllDayEventsForUser(uid: string): CalendarEvent[] {
    const dateStr = this.selectedDate.toISOString().substring(0, 10);
    return this.events.filter(e => e.uid === uid && e.date === dateStr && e.isAllDay);
  }

  getColorForUid(uid: string): string {
    return this.familyMembers.find(m => m.id === uid)?.color || 'gray';
  }

  getFamilyColumns(): FamilyMember[] {
    return [...this.familyMembers];
  }

  get columnCount(): string {
    const count = Math.max(1, this.familyMembers.length);
    return `60px repeat(${count}, minmax(120px, 1fr))`;
  }

  getEventDuration(event: CalendarEvent): number {
    if (!event.startTime || !event.endTime) return 1;
    const [sh, sm] = event.startTime.split(':').map(Number);
    const [eh, em] = event.endTime.split(':').map(Number);
    return (eh * 60 + em - sh * 60 - sm) / 60;
  }

  getEventOffset(event: CalendarEvent): number {
    if (!event.startTime) return 0;
    const [h, m] = event.startTime.split(':').map(Number);
    return ((h - 6) * 60) + m;
  }

  getColor(uid: string): string {
    return this.familyMembers.find(f => f.id === uid)?.color || 'gray';
  }

  onCellClick(uid: string, hour: number): void {
    const start = `${hour.toString().padStart(2, '0')}:00`;

    const newEvent: CalendarEvent = {
      title: '',
      uid,
      date: this.selectedDate.toISOString().substring(0, 10),
      startTime: start,
      endTime: '',
      isAllDay: false
    };

    this.editClicked.emit(newEvent);
  }

  onEventClick(event: CalendarEvent, e: MouseEvent) {
    e.stopPropagation();
    this.editClicked.emit(event);
  }

  goToNextDay(): void {
    const next = new Date(this.selectedDate);
    next.setDate(next.getDate() + 1);
    this.dateChanged.emit(next);
  }

  goToPreviousDay(): void {
    const prev = new Date(this.selectedDate);
    prev.setDate(prev.getDate() - 1);
    this.dateChanged.emit(prev);
  }

  goToToday() {
    this.dateChanged.emit(new Date());
  }

  formatHour(hour: number): string {
    return DateUtils.formatHour(hour);
  }

  formatTime(time: string): string {
    return DateUtils.formatTime12Hour(time);
  }

}
