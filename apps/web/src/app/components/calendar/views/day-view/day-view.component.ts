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

  readonly hours = Array.from({ length: 15}, (_, i) => 6 + i);

  getEventsForUser(uid: string, hour: number): (CalendarEvent & { offset: number; total: number })[] {
    const dateStr = this.selectedDate.toISOString().substring(0, 10);

    // Events for the user on this day that overlap with this hour
    const overlappingEvents = this.events
      .filter(e => {
        if (e.uid !== uid || e.date !== dateStr || e.isAllDay || !e.startTime) return false;

        const [startH, startM] = e.startTime.split(':').map(Number);
        const start = startH * 60 + startM;

        const end = e.endTime
          ? (() => {
              const [endH, endM] = e.endTime!.split(':').map(Number);
              return endH * 60 + endM;
            })()
          : start + 60;

        const slotStart = hour * 60;
        const slotEnd = slotStart + 60;

        return start < slotEnd && end > slotStart;
      })
      .map(e => ({ ...e, offset: 0, total: 1 }));

    // Only return events that START in this hour
    const visibleEvents = overlappingEvents.filter(e => {
      const [startH] = e.startTime!.split(':').map(Number);
      return startH === hour;
    });

    // Assign offsets
    visibleEvents.forEach((event, i) => {
      let offset = 0;
      let total = 1;

      overlappingEvents.forEach((other, j) => {
        if (event === other) return;
        if (this.doesOverlap(event, other)) {
          total++;
          if (j < i) offset++;
        }
      });

      event.offset = offset;
      event.total = total;
    });

    return visibleEvents;
  }


  doesOverlap(a: CalendarEvent, b: CalendarEvent): boolean {
    if(!a.startTime || !b.startTime) return false;

    const [aStartH, aStartM] = a.startTime.split(':').map(Number);
    const aStart = aStartH * 60 + aStartM;
    const aEnd = a.endTime
      ? (() => {
        const [h, m] = a.endTime!.split(':').map(Number);
        return h * 60 + m;
      })()
      : aStart + 60;

    const [bStartH, bStartM] = b.startTime.split(':').map(Number);
    const bStart = bStartH * 60 + bStartM;
    const bEnd = b.endTime
      ? (() => {
        const [h, m] = b.endTime!.split(':').map(Number);
        return h * 60 + m;
      }) ()
      : bStart + 60;

    return aStart < bEnd && bStart < aEnd;
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

  getColumnIndex(uid: string): string {
    const index = this.familyMembers.findIndex(m => m.id === uid);
    return index >= 0 ? `${index + 2} / ${index + 3}` : 'auto'; // +2 accounts for time column
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
  onAllDayClick(uid: string): void {
    const newEvent: CalendarEvent = {
      title: '',
      uid,
      date: this.selectedDate.toISOString().substring(0, 10),
      startTime: '',
      endTime: '',
      isAllDay: true,
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
