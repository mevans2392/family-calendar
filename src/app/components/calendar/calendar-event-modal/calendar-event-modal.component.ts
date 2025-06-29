import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarEvent, FamilyMember } from '../../../shared/shared-interfaces';

@Component({
  selector: 'app-calendar-event-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-event-modal.component.html',
  styleUrl: './calendar-event-modal.component.css'
})
export class CalendarEventModalComponent {
  private _editingEvent: CalendarEvent | null = null;
  isAllDay = false;
  newEventTitle = '';
  selectedUserId: string | null = null;
  startTime = '';
  endTime = '';
  repeatOption: 'daily' | 'weekly' | 'monthly' | '' = '';
  repeatUntil: string = '';
  
  
  @Input() show = false;
  @Input() selectedDate!: Date;
  @Input() familyMembers: FamilyMember[] = [];
  
  @Input()
  set editingEvent(event: CalendarEvent | null) {
    console.log('Modal received editingEvent:', event);
    this._editingEvent = event;

    if(event) {
      this.newEventTitle = event.title;
      this.selectedUserId = event.uid;
      this.repeatOption = event.repeat || '';
      this.repeatUntil = event.repeatUntil || '';
      this.isAllDay = !!event.isAllDay;
      this.startTime = event.startTime || '';
      this.endTime = event.endTime || '';
    } else {
      this.newEventTitle = '';
      this.selectedUserId = null;
      this.repeatOption = '';
      this.repeatUntil = '';
      this.isAllDay = false;
      this.startTime = '';
      this.endTime = '';
    }
  }

  get editingEvent(): CalendarEvent | null {
    return this._editingEvent;
  }

  get isEditing(): boolean {
    return !!this.editingEvent?.id;
  }

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CalendarEvent>();
  @Output() delete = new EventEmitter<string>();

  

  onSave() {
    const seriesId = this.editingEvent?.seriesId || (this.repeatOption ? this.generateSimpleId() : '');

    if (!this.selectedUserId) {
      alert('Please select a family member');
      return;
    }

    const baseDateStr = this.editingEvent?.date || this.selectedDate.toISOString().substring(0, 10);
    const baseDate = new Date(baseDateStr);
    const repeatEndDate = this.repeatUntil ? new Date(this.repeatUntil) : null;

    const incrementMap = {
      daily: (d: Date) => d.setDate(d.getDate() + 1),
      weekly: (d: Date) => d.setDate(d.getDate() + 7),
      monthly: (d: Date) => d.setMonth(d.getMonth() + 1),
    };

    const repeat = this.repeatOption || undefined;
    const repeatUntil = this.repeatUntil || undefined;

    const createEvent = (date: Date): CalendarEvent => ({
      id: this.editingEvent?.id,
      title: this.newEventTitle,
      date: date.toISOString().substring(0, 10),
      uid: this.selectedUserId!,
      isAllDay: this.isAllDay,
      startTime: this.isAllDay ? '' : this.startTime.trim(),
      endTime: this.isAllDay ? '' : this.endTime.trim(),
      repeat,
      repeatUntil,
      seriesId: seriesId || '',
    });

    const events: CalendarEvent[] = [];

    let currentDate = new Date(baseDate);
    do {
      events.push(createEvent(new Date(currentDate)));
      if (!repeat || !repeatEndDate) break;
      incrementMap[repeat](currentDate);
    } while (currentDate <= repeatEndDate);

    for (const e of events) {
      this.save.emit(e);
    }

    this.resetForm();
  }

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  showDeleteConfirm = false;

  onDelete() {
    if (!this.editingEvent?.id) return;

    if (this.editingEvent.seriesId) {
      this.showDeleteConfirm = true;
    } else {
      this.delete.emit(this.editingEvent.id);
    }
  }

  confirmDeleteSingle() {
    if (this.editingEvent?.id) {
      this.delete.emit(this.editingEvent.id);
      this.showDeleteConfirm = false;
    }
  }

  confirmDeleteSeries() {
    if (this.editingEvent?.seriesId) {
      this.delete.emit(`series:${this.editingEvent.seriesId}`);
      this.showDeleteConfirm = false;
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }


  resetForm() {
    this.newEventTitle = '';
    this.selectedUserId = null;
    this.isAllDay = false;
    this.startTime = '';
    this.endTime = '';
    this._editingEvent = null;
  }

  generateSimpleId(): string {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  }

}
