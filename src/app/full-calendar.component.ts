import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-fullcalendar-demo',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  template: `<full-calendar [options]="calendarOptions"></full-calendar>`
})
export class FullcalendarDemoComponent implements OnInit {
  calendarOptions: any;

  ngOnInit(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: [
        { title: 'Test Event', date: new Date().toISOString().substring(0, 10) }
      ],
      dateClick: this.onDateClick.bind(this)
    };
  }

  onDateClick(arg: any): void {
    alert(`You clicked on ${arg.dateStr}`);
  }
}
