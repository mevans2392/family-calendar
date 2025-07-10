import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { subscriptionGuard } from "./guards/subscription.guard";


export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    {
        path: 'register',
        loadComponent: () =>
            import('./components/register-family/register-family.component').then(m => m.RegisterFamilyComponent)
    },
    { 
        path: 'home', 
        loadComponent: () =>
            import('./components/calendar/calendar.component').then(m => m.CalendarComponent) 
    },

    //routes to chores component
    {
        path: 'chore',
        canActivate: [subscriptionGuard],
        loadComponent: () =>
            import('./components/chore/chore.component').then(m => m.ChoreComponent)
    },
    {
        path: 'annual-chore',
        canActivate: [subscriptionGuard],
        loadComponent: () =>
            import('./components/chore/annual-chores/annual-chores.component').then(m => m.AnnualChoresComponent)
    },
    {
        path: 'rewards',
        canActivate: [subscriptionGuard],
        loadComponent: () =>
            import('./components/chore/rewards/rewards.component').then(m => m.RewardsComponent)
    },

    //routes to meal planner component
    {
        path: 'meal-planner',
        canActivate: [subscriptionGuard],
        loadComponent: () =>
            import('./components/meal-planner/meal-planner.component').then(m => m.MealPlannerComponent)
    },
    {
        path: 'shopping',
        canActivate: [subscriptionGuard],
        loadComponent: () =>
            import('./components/shopping-list/shopping-list.component').then(m => m.ShoppingListComponent)
    },

    //routes for checkout session 
    {
        path: 'success',
        loadComponent: () =>
            import('./components/stripe/success/success.component').then(m => m.SuccessComponent)
    },
    {
        path: 'cancel',
        loadComponent: () =>
            import('./components/stripe/cancel/cancel.component').then(m => m.CancelComponent)
    },

    //manage family
    {
        path: 'manage',
        loadComponent: () =>
            import('./components/register-family/register-family.component').then(m => m.RegisterFamilyComponent)
    }
];