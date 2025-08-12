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

    // **family plan routes **
    //routes to chores component
    {
        path: 'chore',
        canActivate: [subscriptionGuard('family')],
        loadComponent: () =>
            import('./components/chore/chore.component').then(m => m.ChoreComponent)
    },
    {
        path: 'annual-chore',
        canActivate: [subscriptionGuard('family')],
        loadComponent: () =>
            import('./components/chore/annual-chores/annual-chores.component').then(m => m.AnnualChoresComponent)
    },
    {
        path: 'rewards',
        canActivate: [subscriptionGuard('family')],
        loadComponent: () =>
            import('./components/chore/rewards/rewards.component').then(m => m.RewardsComponent)
    },

    //routes to meal planner component
    {
        path: 'meal-planner',
        canActivate: [subscriptionGuard('family')],
        loadComponent: () =>
            import('./components/meal-planner/meal-planner.component').then(m => m.MealPlannerComponent)
    },
    {
        path: 'shopping',
        canActivate: [subscriptionGuard('family')],
        loadComponent: () =>
            import('./components/shopping-list/shopping-list.component').then(m => m.ShoppingListComponent)
    },

    // ** individual plan routes **
    //journal route
    {
        path: 'journal',
        canActivate: [subscriptionGuard('individual')],
        loadComponent: () =>
            import('./components/journal/journal.component').then(m => m.JournalComponent)
    },
    //to-do list route
    {
        path: 'to-do',
        canActivate: [subscriptionGuard('individual')],
        loadComponent: () =>
            import('./components/to-do/to-do.component').then(m => m.ToDoComponent)
    },

    //routes for both (no route guards)
    //calendar route
    { 
        path: 'home', 
        loadComponent: () =>
            import('./components/calendar/calendar.component').then(m => m.CalendarComponent) 
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