import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from '@angular/fire/firestore';
import { CalendarEvent } from '../shared/shared-interfaces';
import { Observable } from 'rxjs';
import { FamilyMembersService } from './family-members.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private firestore: Firestore = inject(Firestore);
  private familyService: FamilyMembersService = inject(FamilyMembersService);

  async loadEvents(): Promise<Observable<CalendarEvent[]>> {
    const familyId = await this.familyService.getFamilyId();
    const eventsRef = collection(this.firestore, `families/${familyId}/calendarEvents`);
    const q = query(eventsRef, orderBy('date'));
    return collectionData(q, { idField: 'id' }) as Observable<CalendarEvent[]>;
  }

  async saveEvent(event: CalendarEvent): Promise<void> {
    const familyId = await this.familyService.getFamilyId();

    if(event.id) {
      const ref = doc(this.firestore, `families/${familyId}/calendarEvents/${event.id}`);
      await updateDoc(ref, event as any);
    } else {
      const { id, ...eventData } = event;
      const ref = collection(this.firestore, `families/${familyId}/calendarEvents`);
      await addDoc(ref, eventData as any);
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    const familyId = await this.familyService.getFamilyId();
    const ref = doc(this.firestore, `families/${familyId}/calendarEvents/${eventId}`);
    await deleteDoc(ref);
  }
  
}
