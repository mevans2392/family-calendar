import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { MainScreenComponent } from "./components/main-screen/main-screen.component";


export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'home', component: MainScreenComponent },
    { 
        path: 'yearly', 
        loadComponent: () => 
            import('./components/year-to-do/year-to-do.component').then(m => m.YearToDoComponent)
    },
    {
        path: 'meals',
        loadComponent: () => 
            import('./components/meal-display/meal-display.component').then(m => m.MealDisplayComponent)
    },
    {
        path: 'shopping',
        loadComponent: () =>
            import('./components/shopping-list/shopping-list.component').then(m => m.ShoppingListComponent)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./components/register-family/register-family.component').then(m => m.RegisterFamilyComponent)
    },
    {
        path: 'meeting',
        loadComponent: () =>
            import('./components/fam-meeting/fam-meeting.component').then(m => m.FamMeetingComponent)
    }
];