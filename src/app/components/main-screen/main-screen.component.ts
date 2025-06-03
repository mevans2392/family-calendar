import { Component } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { ToDoListComponent } from '../to-do-list/to-do-list.component';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { GoalsComponent } from "../goals/goals.component";

@Component({
  selector: 'app-main-screen',
  imports: [CalendarComponent, ToDoListComponent, RouterModule, GoalsComponent],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css'
})
export class MainScreenComponent {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
