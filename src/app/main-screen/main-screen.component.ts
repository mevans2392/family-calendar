import { Component } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { ToDoListComponent } from '../to-do-list/to-do-list.component';
import { MealPlannerComponent } from '../meal-planner/meal-planner.component';
import { AuthService } from '../auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-screen',
  imports: [CalendarComponent, ToDoListComponent, MealPlannerComponent, RouterModule],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css'
})
export class MainScreenComponent {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
