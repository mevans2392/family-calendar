import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ShoppingItem } from '../shared/shared-interfaces';
import { FamilyMembersService } from './family-members.service';

@Injectable({ providedIn: 'root'})

export class ShoppingListService {
    private firestore: Firestore = inject(Firestore);
    private familyService: FamilyMembersService = inject(FamilyMembersService);

    private async getCollectionRef() {
        const familyId = await this.familyService.getFamilyId();
        return collection(this.firestore, `families/${familyId}/shoppingList`)
    }

    async getShoppingItems(): Promise<Observable<ShoppingItem[]>> {
        const ref = await this.getCollectionRef();
        return collectionData(ref, { idField: 'id' }) as Observable<ShoppingItem[]>;
    }

    async itemExists(title: string): Promise<boolean> {
        const ref = await this.getCollectionRef();
        const normalizedTitle = title.toLowerCase();
        const q = query(ref, where('title_lower', '==', normalizedTitle));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    }

    async addItem(title: string): Promise<void> {
        const ref = await this.getCollectionRef();
        const normalizedTitle = title.toLowerCase();
        const newItem: ShoppingItem = {
            title,
            title_lower: normalizedTitle,
            completed: false
        };
        await addDoc(ref, newItem);
    }

    async updateItem(id: string, changes: Partial<ShoppingItem>): Promise<void> {
        const familyId = await this.familyService.getFamilyId();

        const ref = doc(this.firestore, `families/${familyId}/shoppingList/${id}`);
        await updateDoc(ref, changes);
    }

    async deleteCompletedItems(items: ShoppingItem[]): Promise<void> {
        const familyId = await this.familyService.getFamilyId();
        const toDelete = items.filter(i => i.completed && i.id);
        for(const i of toDelete) {
            const ref = doc(this.firestore, `families/${familyId}/shoppingList/${i.id}`);
            await deleteDoc(ref);
        }
    }
}