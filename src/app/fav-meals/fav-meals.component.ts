import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, getDocs, query, where } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';


interface Recipe {
  id?: string;
  title: string;
  ingredients: string[];
}

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

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    const mealsRef = collection(this.firestore, 'favMeals');
    collectionData(mealsRef, { idField: 'id' }).subscribe(data => {
      this.recipes = data as Recipe[];
    });
  }

  async saveNewMeal() {
    const title = this.newRecipe.title.trim();
    const ingredients = this.newRecipe.ingredientsRaw
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if(!title || ingredients.length === 0) {
      alert('Please enter a title and at least one ingredient');
      return;
    }

    const recipe: Recipe = {
      title,
      ingredients
    };

    const mealsRef = collection(this.firestore, 'favMeals');
    await addDoc(mealsRef, recipe);

    this.newRecipe = { title: '', ingredientsRaw: '' };
    this.showModal = false;
  }

  async deleteMeal(recipeId: string): Promise<void> {
    if(!recipeId) return;

    const confirmed = confirm('Are you sure you want to delete this meal?');
    if(!confirmed) return;

    const ref = doc(this.firestore, 'favMeals', recipeId);
    await deleteDoc(ref);
  }

  toggleRecipe(recipe: Recipe) {
    this.expandedRecipe = this.expandedRecipe === recipe ? null : recipe;
  }

  async addToShoppingList(ingredient: string) {
    const normalizedIngredient = ingredient.trim().toLowerCase();
    const shoppingListRef = collection(this.firestore, 'shoppingList');
    const snapshot = await getDocs(query(shoppingListRef, where('title_lower', '==', normalizedIngredient)));

    if(!snapshot.empty) {
      console.log('Item already in shopping list');
      return;
    }

    await addDoc(shoppingListRef, { title: ingredient.trim(), title_lower: normalizedIngredient, completed: false });
  }

}
