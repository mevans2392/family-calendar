import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, getDocs, query, where } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping.service';
import { Recipe } from '../../shared/shared-interfaces';
import { FavMealsService } from '../../services/fav-meals.service';




@Component({
  selector: 'app-fav-meals',
  imports: [CommonModule, FormsModule],
  templateUrl: './fav-meals.component.html',
  styleUrl: './fav-meals.component.css'
})
export class FavMealsComponent implements OnInit {
  recipes: Recipe[] = [];
  expandedRecipe: Recipe | null = null;
  showModal = false;
  newRecipe = {
    title: '',
    ingredientsRaw: ''
  };
  shoppingService = inject(ShoppingListService);
  favMealsService = inject(FavMealsService);
  

  async ngOnInit(): Promise<void> {
    const meals$ = await this.favMealsService.getFavMeals();
    meals$.subscribe(data => { this.recipes = data; })
  }

  async saveNewMeal(): Promise<void> {
  const title = this.newRecipe.title.trim();
  const ingredients = this.newRecipe.ingredientsRaw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (!title || ingredients.length === 0) {
    alert('Please enter a title and at least one ingredient');
    return;
  }

  await this.favMealsService.saveFavMeal(title, ingredients);

  this.newRecipe = { title: '', ingredientsRaw: '' };
  this.showModal = false;
}


  async deleteMeal(recipeId: string): Promise<void> {
  if (!recipeId) return;

  const confirmed = confirm('Are you sure you want to delete this meal?');
  if (!confirmed) return;

  await this.favMealsService.deleteFavMeal(recipeId);
}


  toggleRecipe(recipe: Recipe) {
    this.expandedRecipe = this.expandedRecipe === recipe ? null : recipe;
  }

  async addToShoppingList(ingredient: string): Promise<void> {
    const trimmed = ingredient.trim();
    if(!trimmed) return;

    const exists = await this.shoppingService.itemExists(trimmed);
    if(exists) return;

    await this.shoppingService.addItem(trimmed);
  }

}
