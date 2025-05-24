import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, query, orderBy, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

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

  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
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

  users = [
    { uid: 'qpRdiNU87IShdxHrFf1uZZRyLql1', name: 'Dada' },
    { uid: 'kc0kSHF8wSbz4vbVyJ8TjFT3Hjo2', name: 'Mama' },
    { uid: 'uid-3', name: 'Riley' },
    { uid: 'uid-4', name: 'Mimi' },
    { uid: 'uid-5', name: 'Anyone' },
  ];

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        const ref = collection(this.db, 'calendarEvents');
        const q = query(ref, orderBy('date'));
        
        collectionData(q, { idField: 'id' }).subscribe((events: any[]) => {
          const calendarEvents = events.map((e) => ({
            id: e.id,
            title: e.title,
            start: e.startTime ? `${e.date}T${e.startTime.trim()}` : e.date,
            end: e.endTime ? `${e.date}T${e.endTime}` : undefined,
            allDay: e.isAllDay,
            backgroundColor: USER_COLORS[e.uid] || 'grey',
            extendedProps: { uid: e.uid, startTime: e.startTime, endTime: e.endTime }
          }));

          console.log(calendarEvents[0]);
          this.setCalendarOptions(calendarEvents);
        })
      }
    })
  }

  setCalendarOptions(events: any[]) {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events,
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      editable: false,
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit',
        meridiem: 'short'
      }
    };
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
      this.clearForm;
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
      alert("An error occured while saving the event.");
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