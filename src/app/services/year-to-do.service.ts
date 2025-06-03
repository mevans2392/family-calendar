import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { yearToDoItem } from '../shared/shared-interfaces';
import { Observable, map } from 'rxjs';
import { FamilyMembersService } from './family-members.service';

@Injectable({
  providedIn: 'root'
})
export class YearToDoService {
    private firestore: Firestore = inject(Firestore);
    private familyService: FamilyMembersService = inject(FamilyMembersService);

    async loadToDos(): Promise<Observable<Record<string, yearToDoItem>>> {
        const familyId = await this.familyService.getFamilyId();
        const ref = collection(this.firestore, `families/${familyId}/yearlyToDo`);
        
        return collectionData(ref, { idField: 'month' }).pipe(
            map((docs:any[]) => {
                const toDoMap: Record<string, yearToDoItem> = {};
                for(const doc of docs) {
                    toDoMap[doc.month] = {
                        month: doc.month,
                        items: doc.items || []
                    };
                }
                return toDoMap;
            })
        );
      }
    
    async saveToDos(month: string, items: yearToDoItem['items']): Promise<void> {
        const familyId = await this.familyService.getFamilyId();
        const ref = doc(this.firestore, `families/${familyId}/yearlyToDo/${month}`);
        await setDoc(ref, { month, items });
    }

    async deleteToDoFromMonth(month: string, index: number): Promise<void> {
        const familyId = await this.familyService.getFamilyId();
        const ref = doc(this.firestore, `families/${familyId}/yearlyToDo/${month}`);

        const snapshot = await getDoc(ref);
        if (!snapshot.exists()) return;

        const data = snapshot.data() as yearToDoItem;
        data.items.splice(index, 1); // Remove the item at the specified index

        await setDoc(ref, {
            month: data.month,
            items: data.items
        });
    }

      
}