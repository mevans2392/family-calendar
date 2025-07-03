import { Component, inject } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';
import { RecipeModalComponent } from './recipe-modal/recipe-modal.component';
import { Recipe } from '../../shared/shared-interfaces';
import { RecipeService } from '../../services/recipe.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';

@Component({
  selector: 'app-meal-planner',
  standalone: true,
  imports: [NavComponent, CommonModule, RecipeModalComponent, DragDropModule, RecipeCardComponent],
  templateUrl: './meal-planner.component.html',
  styleUrl: './meal-planner.component.css'
})
export class MealPlannerComponent {
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  private recipeService = inject(RecipeService);

  recipes: Recipe[] = [];
  openModal = false;
  selectedRecipe: Recipe | null = null;
  

  ngOnInit(): void {
    this.loadRecipes();
  }

  async loadRecipes() {
    (await this.recipeService.loadRecipes()).subscribe((recipes) => {
      this.recipes = recipes;
    });
  }

  getRecipesForCell(day: string, mealType: string): Recipe[] {
    return this.recipes.filter(r => r.day === day && r.mealType === mealType);
  }

  getUnassignedRecipes(): Recipe[] {
    return this.recipes.filter(r => !r.day || !r.mealType);
  }

  get connectedDropLists(): string[] {
    const ids: string[] = [];
    
    for(let day of this.daysOfWeek) {
      for(let meal of this.mealTypes) {
        ids.push(`${day}-${meal}`);
      }
    }

    ids.push('unassigned-recipe-list');
    return ids;
  }

  handleDrop(event: CdkDragDrop<Recipe[]>, day: string, mealType: string) {
    const original = event.item.data as Recipe;

    if(!original.day && !original.mealType) {
      const clone: Recipe = {
        ...original,
        id: '',
        day,
        mealType
      };

      this.recipeService.saveRecipe(clone).then(() => this.loadRecipes());
    }
  }

  handleUnassignDrop(event: CdkDragDrop<Recipe[]>) {
    const recipe = event.item.data as Recipe;

    if(recipe.day && recipe.mealType) {
      this.recipeService.deleteRecipe(recipe.id).then(() => this.loadRecipes());
    }
  }

  openEditModal(recipe: Recipe | null) {
    this.selectedRecipe = recipe;
    this.openModal = true;
  }


}
