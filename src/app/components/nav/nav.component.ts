import { Component } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { ToDoListComponent } from '../to-do-list/to-do-list.component';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { GoalsComponent } from "../goals/goals.component";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
