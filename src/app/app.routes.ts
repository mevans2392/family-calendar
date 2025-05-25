import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { MainScreenComponent } from "./main-screen/main-screen.component";
import { ToDoListComponent } from "./to-do-list/to-do-list.component";
import { MealPlannerComponent } from "./meal-planner/meal-planner.component";
import { YearToDoComponent } from "./year-to-do/year-to-do.component";

export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'home', component: MainScreenComponent },
    { path: 'calendar', component: CalendarComponent },
    { path: 'todos', component: ToDoListComponent },
    { path: 'meals', component: MealPlannerComponent },
    { path: 'yearly', component: YearToDoComponent },
];