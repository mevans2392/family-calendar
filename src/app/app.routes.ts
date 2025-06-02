import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
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
            import('./meal-display/meal-display.component').then(m => m.MealDisplayComponent)
    },
    {
        path: 'shopping',
        loadComponent: () =>
            import('./shopping-list/shopping-list.component').then(m => m.ShoppingListComponent)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./components/register-family/register-family.component').then(m => m.RegisterFamilyComponent)
    },
];