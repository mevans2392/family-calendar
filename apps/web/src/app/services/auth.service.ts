import { Injectable } from '@angular/core';
import { Auth, setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword, signOut, getAuth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  async login(email: string, password: string, rememberMe: boolean): Promise<any> {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;

    await setPersistence(this.auth, persistence);
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/home']);
  }

  logout(): Promise<any> {
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
