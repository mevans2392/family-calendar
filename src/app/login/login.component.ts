import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CalendarComponent } from "../calendar/calendar.component";
import { ToDoListComponent } from "../to-do-list/to-do-list.component";
import { MealPlannerComponent } from "../meal-planner/meal-planner.component";

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, CalendarComponent, ToDoListComponent, MealPlannerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  auth: Auth = inject(Auth);
  user$: Observable<any> = user(this.auth);

  login() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .catch(err => this.error = err.message);
  }

  logout() {
    signOut(this.auth);
  }



}
