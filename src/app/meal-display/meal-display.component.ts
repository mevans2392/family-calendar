import { Component } from '@angular/core';
import { MealPlannerComponent } from "../meal-planner/meal-planner.component";
import { RouterLink } from '@angular/router';
import { FavMealsComponent } from "../fav-meals/fav-meals.component";

@Component({
  selector: 'app-meal-display',
  imports: [MealPlannerComponent, RouterLink, FavMealsComponent],
  templateUrl: './meal-display.component.html',
  styleUrl: './meal-display.component.css'
})
export class MealDisplayComponent {

}
