import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DateUtils } from '../../../../shared/date-utils';
import { FamilyMember, CalendarEvent } from '../../../../shared/shared-interfaces';

@Component({
  selector: 'app-week-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week-view.component.html',
  styleUrl: './week-view.component.css'
})
export class WeekViewComponent {

  @Input() selectedDate!: Date;
  @Input() events: CalendarEvent[] = [];
  @Input() familyMembers: FamilyMember[] = [];

  @Output() dateClicked = new EventEmitter<Date>();
  @Output() editClicked = new EventEmitter<CalendarEvent>();
  @Output() dateChanged = new EventEmitter<Date>();

  readonly hours = Array.from({ length: 15 }, (_, i) => i + 6);

  getWeekDates(): Date[] {
    const start = DateUtils.getStartOfWeek(this.selectedDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  get weekEndingLabel(): string {
    const weekDates = this.getWeekDates();
    const lastDay = weekDates[weekDates.length - 1];

    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    const formatted = lastDay.toLocaleDateString(undefined, options);

    return `Week of ${formatted}`;
  }

  getEventsForSlot(day: Date, hour: number): (CalendarEvent & { offset: number; total: number })[] {
    const dateStr = day.toISOString().substring(0, 10);

    // All events that span this hour
    const overlappingEvents = this.events
      .filter(e => {
        if (e.date !== dateStr || e.isAllDay || !e.startTime) return false;

        const [startH, startM] = e.startTime.split(':').map(Number);
        const start = startH * 60 + startM;
        
        let end: number;
        if(e.endTime) {
          const [endH, endM] = e.endTime.split(':').map(Number);
          end = endH * 60 + endM;
        } else {
          end = start + 60;
        }

        const target = hour * 60;
        return start < target + 60 && end > target;
      })
      .map(e => ({ ...e, offset: 0, total: 1 }));

    // Only render events that START in this hour
    const visibleEvents = overlappingEvents.filter(e => {
      const [startH] = e.startTime!.split(':').map(Number);
      return startH === hour;
    });

    // Assign overlap offsets based on the full overlappingEvents list
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
    if (!a.startTime || !b.startTime) return false;

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
        })()
      : bStart + 60;

    return aStart < bEnd && bStart < aEnd;
  }


  getEventOffset(event: CalendarEvent): number {
    if(!event.startTime) return 0;

    const [, minutes] = event.startTime.split(':').map(Number);
    return (minutes / 60) * 60;
  }



  getEventDuration(event: CalendarEvent): number {
    if(!event.startTime || !event.endTime) return 1;

    const [startH, startM] = event.startTime.split(':').map(Number);
    const [endH, endM] = event.endTime.split(':').map(Number);

    const start = startH + startM / 60;
    const end = endH + endM / 60;

    return Math.max(1, end - start);

  }

  getAllDayEventsForDay(day: Date): CalendarEvent[] {
    const dateStr = day.toISOString().substring(0, 10);
    return this.events.filter(event => event.isAllDay && event.date === dateStr);
  }

  getColorForUid(uid: string): string {
    return this.familyMembers.find(m => m.id === uid)?.color || 'gray';
  }

  isToday(date: Date): boolean {
    return DateUtils.isSameDay(date, new Date());
  }

  isSelected(date: Date): boolean {
    return DateUtils.isSameDay(date, this.selectedDate);
  }

  onDateClick(date: Date): void {
    this.dateClicked.emit(date);
  }

  onAllDayClick(date: Date): void {
    const newEvent: CalendarEvent = {
      title: '',
      uid: '',
      date: this.selectedDate.toISOString().substring(0, 10),
      startTime: '',
      endTime: '',
      isAllDay: true,
    };
    this.editClicked.emit(newEvent);
  }

  onEventClick(event: CalendarEvent, e: MouseEvent): void {
    e.stopPropagation();
    this.editClicked.emit(event);
  }


  goToPreviousWeek(): void {
    const prev = new Date(this.selectedDate);
    prev.setDate(prev.getDate() - 7);
    this.dateChanged.emit(prev);
  }

  goToNextWeek(): void {
    const next = new Date(this.selectedDate);
    next.setDate(next.getDate() + 7);
    this.dateChanged.emit(next);

  }

  goToThisWeek(): void {
    this.dateChanged.emit(new Date());
  }

  formatHour(time: number): string {
    return DateUtils.formatHour(time);
  }

  formatTime(time: string): string {
    return DateUtils.formatTime12Hour(time);
  }

}
