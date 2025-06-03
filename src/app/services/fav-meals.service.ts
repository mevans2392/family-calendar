import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Recipe } from '../shared/shared-interfaces';
import { FamilyMembersService } from './family-members.service';

@Injectable({ providedIn: 'root' })
export class FavMealsService {
  private firestore = inject(Firestore);
  private familyService = inject(FamilyMembersService);

  private async getCollectionRef() {
    const familyId = await this.familyService.getFamilyId();
    return collection(this.firestore, `families/${familyId}/favMeals`);
  }

  async getFavMeals(): Promise<Observable<Recipe[]>> {
    const ref = await this.getCollectionRef();
    return collectionData(ref, { idField: 'id' }) as Observable<Recipe[]>;
  }

  async saveFavMeal(title: string, ingredients: string[]): Promise<void> {
    const ref = await this.getCollectionRef();
    const newMeal: Recipe = { title, ingredients };
    await addDoc(ref, newMeal);
  }

  async deleteFavMeal(recipeId: string): Promise<void> {
    const familyId = await this.familyService.getFamilyId();
    const ref = doc(this.firestore, `families/${familyId}/favMeals/${recipeId}`);
    await deleteDoc(ref);
  }
}
