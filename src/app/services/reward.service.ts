import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Reward } from '../shared/shared-interfaces';
import { Observable } from 'rxjs';
import { FamilyMembersService } from './family-members.service';

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  private firestore: Firestore = inject(Firestore);
  private familyService: FamilyMembersService = inject(FamilyMembersService);

  async loadRewards(): Promise<Observable<Reward[]>> {
    const familyId = await this.familyService.getFamilyId();
    const ref = collection(this.firestore, `families/${familyId}/rewards`);
    return collectionData(ref, { idField: 'id' }) as Observable<Reward[]>;
  }

  async getRewardById(rewardId: string): Promise<Observable<Reward>> {
    const familyId = await this.familyService.getFamilyId();
    const rewardDoc = doc(this.firestore, `families/${familyId}/rewards/${rewardId}`);
    return docData(rewardDoc, { idField: 'id' }) as Observable<Reward>;
  }

  async saveReward(reward: Reward): Promise<string | void> {
    const familyId = await this.familyService.getFamilyId();

    if(reward.id) {
      const ref = doc(this.firestore, `families/${familyId}/rewards/${reward.id}`);
      await updateDoc(ref, reward as any);
      return reward.id;
    } else {
      const { id, ...rewardData} = reward;
      const ref = collection(this.firestore, `families/${familyId}/rewards`);
      await addDoc(ref, rewardData as any);
      return ref.id;
    }
  }

  async deleteReward(rewardId: string): Promise<void> {
    const familyId = await this.familyService.getFamilyId();
    const ref = doc(this.firestore, `families/${familyId}/rewards/${rewardId}`);
    await deleteDoc(ref);
  }
  
}
