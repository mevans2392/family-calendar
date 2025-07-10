import { Injectable } from '@angular/core';
import { Auth, setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword, signOut, getAuth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { collection, getDocs, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private auth: Auth, private router: Router, private firestore: Firestore) {}

  async login(email: string, password: string, rememberMe: boolean): Promise<any> {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;

    await setPersistence(this.auth, persistence);
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

    sessionStorage.setItem('justLoggedIn', 'true');

    const uid = userCredential.user.uid;

    const familyQuery = query(
      collection(this.firestore, 'families'),
      where('createdBy', '==', uid)
    );

    const snapshot = await getDocs(familyQuery);

    if(snapshot.empty) {
      throw new Error("No family found for this user");
    }

    const familyDoc = snapshot.docs[0];
    const familyId = familyDoc.id;

    localStorage.setItem('familyId', familyId);
    this.router.navigate(['/home']);
  }

  logout(): Promise<any> {
    localStorage.removeItem('familyId');
    return signOut(this.auth)
      .then(() => this.router.navigate(['/login']));
  }

  getCurrentUserAsync(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe();
        resolve(user);
      })
    })
  }
}
