import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from '@angular/fire/firestore';
import { WeekGoal } from '../shared/shared-interfaces';
import { Observable } from 'rxjs';
import { FamilyMembersService } from './family-members.service';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  private firestore: Firestore = inject(Firestore);
  private familyService: FamilyMembersService = inject(FamilyMembersService);

  async loadGoals(): Promise<Observable<WeekGoal[]>> {
    const familyId = await this.familyService.getFamilyId();
    const goalsRef = collection(this.firestore, `families/${familyId}/weeklyGoals`);
    const q = query(goalsRef, orderBy('uid'));
    return collectionData(q, { idField: 'id' }) as Observable<WeekGoal[]>;
  }

  async saveGoal(goal: WeekGoal): Promise<void> {
    const familyId = await this.familyService.getFamilyId();

    if(goal.id) {
      const ref = doc(this.firestore, `families/${familyId}/weeklyGoals/${goal.id}`);
      await updateDoc(ref, goal as any);
    } else {
      const { id, ...goalData } = goal;
      const ref = collection(this.firestore, `families/${familyId}/weeklyGoals`);
      await addDoc(ref, goalData as any);
    }
  }

  async deleteGoal(goalId: string): Promise<void> {
    const familyId = await this.familyService.getFamilyId();
    const ref = doc(this.firestore, `families/${familyId}/weeklyGoals/${goalId}`);
    await deleteDoc(ref);
  }
  
}
