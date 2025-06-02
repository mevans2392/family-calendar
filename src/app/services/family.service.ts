import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {

  constructor(private firestore: Firestore) { }

  async registerFamily(uid: string, email: string, familyName: string, members: { name: string; color: string}[]) {
    const familyRef = await addDoc(collection(this.firestore, 'families'), {
      familyName,
      createdAt: serverTimestamp(),
      createdBy: uid
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
        color: member.color
      });
    }
  }
}
