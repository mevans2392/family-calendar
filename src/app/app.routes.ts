import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { MainScreenComponent } from "./main-screen/main-screen.component";


export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'home', component: MainScreenComponent },
    { 
        path: 'yearly', 
        loadComponent: () => 
            import('./year-to-do/year-to-do.component').then(m => m.YearToDoComponent)
    },
    {
        path: 'meals',
        loadComponent: () => 
            import('./meal-planner/meal-planner.component').then(m => m.MealPlannerComponent)
    },
];