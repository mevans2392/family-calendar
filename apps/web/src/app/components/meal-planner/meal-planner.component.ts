import { Component, inject } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';
import { RecipeModalComponent } from './recipe-modal/recipe-modal.component';
import { Recipe } from '../../shared/shared-interfaces';
import { RecipeService } from '../../services/recipe.service';
import { CdkDragDrop, DragDropModule, CdkDragMove } from '@angular/cdk/drag-drop';
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
  private scrollSpeed = 15;
  private scrollThreshold = 100;
  private scrollingInterval: any;

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

  async clearRecipesFromCell(): Promise<void> {
    const recipesToDelete = this.recipes.filter(r => r.day && r.mealType);

    const deletePromises = recipesToDelete.map(recipe =>
      this.recipeService.deleteRecipe(recipe.id)
    );

    await Promise.all(deletePromises);
    await this.loadRecipes();
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

    if(original.day === day && original.mealType === mealType) {
      return;
    }

    if(!original.day && !original.mealType) {
      const clone: Recipe = {
        ...original,
        id: '',
        day,
        mealType
      };

      this.recipeService.saveRecipe(clone).then(() => this.loadRecipes());
    } else {
      const updated = {
        ...original,
        day,
        mealType
      };

      this.recipeService.saveRecipe(updated).then(() => this.loadRecipes());
    }
  }

  handleUnassignDrop(event: CdkDragDrop<Recipe[]>) {
    const recipe = event.item.data as Recipe;

    if(recipe.day && recipe.mealType) {
      this.recipeService.deleteRecipe(recipe.id).then(() => this.loadRecipes());
    }
  }

  onDragMoved(event: CdkDragMove) {
    const pointerY = event.pointerPosition.y;
    const pointerX = event.pointerPosition.x;
    const threshold = 120;
    const speed = 15;

    const unassigned = document.querySelector('.unassigned-recipe-house') as HTMLElement;
    const scrollGrid = document.querySelector('.scroll-grid') as HTMLElement;
    const mealGridWrapper = document.querySelector('.meal-grid-wrapper') as HTMLElement;

    const unassignedRect = unassigned.getBoundingClientRect();

    // ----- 1. Scroll unassigned list vertically if inside its range -----
    if (pointerY >= unassignedRect.top && pointerY <= unassignedRect.bottom) {
      if (pointerY < unassignedRect.top + threshold) {
        this.startVerticalScroll(unassigned, -speed);
      } else if (pointerY > unassignedRect.bottom - threshold) {
        this.startVerticalScroll(unassigned, speed);
      } else {
        this.stopScrolling();
      }
      return; // avoid also scrolling the main grid
    }

    // ----- 2. Scroll main container vertically -----
    const gridRect = scrollGrid.getBoundingClientRect();
    if (pointerY < gridRect.top + threshold) {
      this.startVerticalScroll(scrollGrid, -speed);
    } else if (pointerY > gridRect.bottom - threshold) {
      this.startVerticalScroll(scrollGrid, speed);
    } else {
      this.stopScrolling();
    }

    // ----- 3. Scroll meal grid horizontally -----
    const mealGridRect = mealGridWrapper.getBoundingClientRect();
    if (pointerX < mealGridRect.left + threshold) {
      this.startHorizontalScroll(mealGridWrapper, -speed);
    } else if (pointerX > mealGridRect.right - threshold) {
      this.startHorizontalScroll(mealGridWrapper, speed);
    }
  }

  private startVerticalScroll(container: HTMLElement, speed: number) {
    if (this.scrollingInterval) return;
    this.scrollingInterval = setInterval(() => {
      container.scrollBy(0, speed);
    }, 16);
  }

  private startHorizontalScroll(container: HTMLElement, speed: number) {
    if (this.scrollingInterval) return;
    this.scrollingInterval = setInterval(() => {
      container.scrollBy(speed, 0);
    }, 16);
  }

  public stopScrolling() {
    if (this.scrollingInterval) {
      clearInterval(this.scrollingInterval);
      this.scrollingInterval = null;
    }
  }


  openEditModal(recipe: Recipe | null) {
    this.selectedRecipe = recipe;
    this.openModal = true;
  }


}
