import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Chore } from '../shared/shared-interfaces';
import { Observable } from 'rxjs';
import { FamilyMembersService } from './family-members.service';

@Injectable({
  providedIn: 'root'
})
export class ChoreService {
  private firestore: Firestore = inject(Firestore);
  private familyService: FamilyMembersService = inject(FamilyMembersService);

  async loadChores(): Promise<Observable<Chore[]>>{
    const familyId = await this.familyService.getFamilyId();
    const choresRef = collection(this.firestore, `families/${familyId}/chores`);
    return collectionData(choresRef, { idField: 'id' }) as Observable<Chore[]>;
  }
  
  async updateChoreAssignment(choreId: string, assignedUser: string | ''): Promise<void> {
    const familyId = await this.familyService.getFamilyId();
    const choreDoc = doc(this.firestore, `families/${familyId}/chores/${choreId}`);
    return updateDoc(choreDoc, { assignedUser });
  }

  async getChoreById(choreId: string): Promise<Observable<Chore>> {
    const familyId = await this.familyService.getFamilyId();
    const choreDoc = doc(this.firestore, `families/${familyId}/chores/${choreId}`);
    return docData(choreDoc, { idField: 'id' }) as Observable<Chore>;
  }

  async saveChore(chore: Chore): Promise<string | void> {
    const familyId = await this.familyService.getFamilyId();

    if(chore.id) {
      const ref = doc(this.firestore, `families/${familyId}/chores/${chore.id}`);
      await updateDoc(ref, chore as any);
      return chore.id;
    } else {
      const { id, ...choreData} = chore;
      const ref = collection(this.firestore, `families/${familyId}/chores`);
      await addDoc(ref, choreData as any);
      return ref.id;
    }
  }

  async deleteChore(choreId: string): Promise<void> {
    const familyId = await this.familyService.getFamilyId();
    const choresRef = doc(this.firestore, `families/${familyId}/chores/${choreId}`);
    await deleteDoc(choresRef);
  }

}
