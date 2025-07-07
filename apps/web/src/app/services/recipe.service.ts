import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Recipe } from '../shared/shared-interfaces';
import { Observable } from 'rxjs';
import { FamilyMembersService } from './family-members.service';

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    private firestore: Firestore = inject(Firestore);
    private familyService: FamilyMembersService = inject(FamilyMembersService);
    
    async loadRecipes(): Promise<Observable<Recipe[]>> {
        const familyId = await this.familyService.getFamilyId();
        const ref = collection(this.firestore, `families/${familyId}/recipes`);
        return collectionData(ref, { idField: 'id' }) as Observable<Recipe[]>;
    }

    async getRecipeById(recipeId: string): Promise<Observable<Recipe>> {
        const familyId = await this.familyService.getFamilyId();
        const recipeDoc = doc(this.firestore, `families/${familyId}/recipes/${recipeId}`);
        return docData(recipeDoc, { idField: 'id' }) as Observable<Recipe>;
    }

    async saveRecipe(recipe: Recipe): Promise<string | void> {
        const familyId = await this.familyService.getFamilyId();

        if(recipe.id) {
            const ref = doc(this.firestore, `families/${familyId}/recipes/${recipe.id}`);
            await updateDoc(ref, recipe as any);
            return recipe.id;
        } else {
            const { id, ...recipeData } = recipe;
            const ref = collection(this.firestore, `families/${familyId}/recipes`);
            const docRef = await addDoc(ref, recipeData as any);
            return docRef.id;
        }
    }

    async deleteRecipe(recipeId: string): Promise<void> {
        const familyId = await this.familyService.getFamilyId();
        const ref = doc(this.firestore, `families/${familyId}/recipes/${recipeId}`);
        await deleteDoc(ref);
    }
}