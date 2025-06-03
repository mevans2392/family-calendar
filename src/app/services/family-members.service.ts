import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { FamilyMember } from '../shared/shared-interfaces';

@Injectable({
  providedIn: 'root'
})
export class FamilyMembersService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  async getFamilyId(): Promise<string> {
    const auth = this.auth;

    const uid = await new Promise<string>((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe(); // stop listening once auth is ready
        if (user?.uid) {
          resolve(user.uid);
        } else {
          reject('User not authenticated');
        }
      });
    });

    const userDoc = await getDoc(doc(this.firestore, 'users', uid));
    const data = userDoc.data();
    if (!data?.['familyId']) throw new Error('Family ID not found');
    return data['familyId'];
  }


  async getMembers(): Promise<Observable<FamilyMember[]>> {
    const familyId = await this.getFamilyId();
    const membersRef = collection(this.firestore, `families/${familyId}/users`);
    return collectionData(membersRef, { idField: 'id' }) as Observable<FamilyMember[]>;
  }
}
