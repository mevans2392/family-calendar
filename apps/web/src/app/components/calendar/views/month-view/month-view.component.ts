import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, HostListener } from '@angular/core';
import { DateUtils } from '../../../../shared/date-utils';
import { FamilyMember, CalendarEvent } from '../../../../shared/shared-interfaces';
import { ScreenSizeService } from '../../../../services/screen-size.service';

@Component({
  selector: 'app-month-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './month-view.component.html',
  styleUrl: './month-view.component.css'
})
export class MonthViewComponent implements OnChanges {

  @Input() selectedDate!: Date;
  @Input() events: CalendarEvent[] = [];
  @Input() familyMembers: FamilyMember[] = [];

  @Output() dateClicked = new EventEmitter<Date>();
  @Output() editClicked = new EventEmitter<CalendarEvent>();
  @Output() dateChanged = new EventEmitter<Date>();

  weeks: Date[][] = [];
  showBubbleOnly: boolean = false;
  screenSizeService = inject(ScreenSizeService);

  ngOnInit(): void {
    this.setViewMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['selectedDate']) {
      this.generateMonthGrid();
    }
  }

  generateMonthGrid(): void {
    const startOfMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
    const startGrid = DateUtils.getStartOfWeek(startOfMonth);
    this.weeks = [];

    let current = new Date(startGrid);
    for(let week = 0; week < 5; week++) { //how many rows on the calendar
      const weekRow: Date[] = [];
      for(let day = 0; day < 7; day++) { //how many columns on the calendar
        weekRow.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      this.weeks.push(weekRow);
    }
  }

  getEventsForDay(date: Date): CalendarEvent[] {
    const dateStr = date.toISOString().substring(0, 10);
    return this.events.filter(e => e.date === dateStr);
  }

  getColorForUid(uid: string): string {
    return this.familyMembers.find(m => m.id === uid)?.color || 'gray';
  }

  setViewMode(): void {
    
    this.showBubbleOnly = window.innerWidth <= 1024;
    
  }

  @HostListener('window:resize')
  onResize() {
    this.setViewMode();
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

  onEventClick(event: CalendarEvent, e: MouseEvent): void {
    e.stopPropagation();
    this.editClicked.emit(event);
  }

  get monthLabel(): string {
    return this.selectedDate.toLocaleString('default', { month: 'long', year: 'numeric'});
  }

  goToPreviousMonth(): void {
    const prev = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() - 1, 1);
    this.dateChanged.emit(prev)
  }

  goToNextMonth(): void {
    const next = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 1);
    this.dateChanged.emit(next)
  }

  goToThisMonth() {
    this.dateChanged.emit(new Date());
  }

  formatTime(time: string): string {
    return DateUtils.formatTime12Hour(time);
  }

}
