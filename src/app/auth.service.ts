import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => this.router.navigate(['/home']));
  }

  logout(): Promise<any> {
    return signOut(this.auth)
      .then(() => this.router.navigate(['/login']));
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
