import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../../shared/shared-interfaces';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../../services/recipe.service';

@Component({
  standalone: true,
  selector: 'app-recipe-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-modal.component.html',
  styleUrl: './recipe-modal.component.css'
})
export class RecipeModalComponent {
  @Input() recipe: Partial<Recipe> | null = null;

  @Output() close = new EventEmitter<void>();

  formRecipe: Recipe = {
    id: '',
    title: '',
    ingredients: [],
    directions: '',
  };
  private recipeService = inject(RecipeService);

  ngOnInit() {
    this.formRecipe = {
      id: this.recipe?.id ?? '',
      title: this.recipe?.title ?? '',
      ingredients: this.recipe?.ingredients ?? [],
      directions: this.recipe?.directions ?? ''
    }
  }

  async save() {
    const recipeToSave = {
      ...this.formRecipe,
    } as Recipe;

    try {
      const id = await this.recipeService.saveRecipe(recipeToSave);
      if(!recipeToSave.id && id) {
        this.formRecipe.id = id;
      }
      this.close.emit();
    } catch (err) {
      console.error('Failed to save recipe:', err);
    }
  }

  async deleteChore() {
    if(!this.formRecipe?.id) return;

    const confirmed = confirm("Are you sure you want to delete this recipe?");

    if(confirmed) {
      await this.recipeService.deleteRecipe(this.formRecipe.id);
      this.close.emit();
    }
  }

  addIngredient() {
    this.formRecipe.ingredients.push('');
  }

  removeIngredient(index: number) {
    this.formRecipe.ingredients.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  onClose() {
    this.close.emit();
  }
}
