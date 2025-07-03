import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Recipe } from '../../../shared/shared-interfaces';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../services/recipe.service';


@Component({
  selector: 'app-recipe-card',
  imports: [],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;

  @Output() edit = new EventEmitter<Recipe>();

  private recipeService = inject(RecipeService);
}
