import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, deleteDoc, addDoc, updateDoc, query, orderBy } from '@angular/fire/firestore';
import { ToDoItem } from '../shared/shared-interfaces';
import { Observable } from 'rxjs';
import { FamilyMembersService } from './family-members.service';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {
    private firestore: Firestore = inject(Firestore);
    private familyService: FamilyMembersService = inject(FamilyMembersService);

    async loadToDos(): Promise<Observable<ToDoItem[]>> {
        const familyId = await this.familyService.getFamilyId();
        const toDoRef = collection(this.firestore, `families/${familyId}/toDoItems`);
        const q = query(toDoRef, orderBy('uid'));
        return collectionData(q, { idField: 'id' }) as Observable<ToDoItem[]>;
    }

    async saveTodo(toDo: ToDoItem): Promise<void> {
        const familyId = await this.familyService.getFamilyId();

        if(toDo.id) {
            const ref = doc(this.firestore, `famlies/${familyId}/toDoItems/${toDo.id}`);
            await updateDoc(ref, toDo as any);
        } else {
            const { id, ...toDoData } = toDo;
            const ref = collection(this.firestore, `families/${familyId}/toDoItems`);
            await addDoc(ref, toDoData as any);
        }
    }

    async deleteToDo(toDoId: string): Promise<void> {
        const familyId = await this.familyService.getFamilyId();
        const ref = doc(this.firestore, `families/${familyId}/toDoItems/${toDoId}`);
        await deleteDoc(ref);
    }
}