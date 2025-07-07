import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, setDoc, updateDoc, serverTimestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  async registerFamily(uid: string, email: string, familyName: string, members: { name: string; color: string}[]) {
    const trialLength = 14;  //two weeks
    const trialStart = new Date().toISOString().split('T')[0]; //'YYYY-MM-DD'
    
    const familyRef = await addDoc(collection(this.firestore, 'families'), {
      familyName,
      createdAt: serverTimestamp(),
      createdBy: uid,
      subStatus: 'trial',
      trialStart,
      trialLength
    });

    const familyId = familyRef.id;

    await setDoc(doc(this.firestore, 'users', uid), {
      familyId,
      email,
      role: 'owner'
    });

    for(const member of members) {
      const userRef = doc(collection(this.firestore, `families/${familyId}/users`));
      await setDoc(userRef, {
        name: member.name,
        color: member.color,
        points: 0
      });
    }
  }

  async updateSubscriptionStatus(status: 'free' | 'trial' | 'paid' | 'expired'): Promise<void> {
    const familyId = await this.getFamilyId();
    const familyRef = doc(this.firestore, `families/${familyId}`);
    await updateDoc(familyRef, { subStatus: status });
  }

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
}
