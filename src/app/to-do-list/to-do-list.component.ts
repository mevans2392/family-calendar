import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, query, orderBy, updateDoc } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';

interface ToDoItem {
  id?: string;
  title: string;
  uid: string;
  completed?: boolean;
  userColor?: string;
}

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css'
})
export class ToDoListComponent {

  db: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  users$ = user(this.auth);

  uid: string = ''
  toDoItems: ToDoItem[] = [];

  showEventModal = false;
  newToDoTitle = '';
  selectedUserId: string | null = null;
  editingItem: ToDoItem | null = null;


  USER_COLORS: Record<string, string> = {
    'qpRdiNU87IShdxHrFf1uZZRyLql1': 'green',
    'kc0kSHF8wSbz4vbVyJ8TjFT3Hjo2': 'purple',
    'uid-3': 'red',
    'uid-4': 'blue',
    'uid-5': 'orange',
  };

  users = [
    { uid: 'qpRdiNU87IShdxHrFf1uZZRyLql1', name: 'Dada' },
    { uid: 'kc0kSHF8wSbz4vbVyJ8TjFT3Hjo2', name: 'Mama' },
    { uid: 'uid-3', name: 'Riley' },
    { uid: 'uid-4', name: 'Mimi' },
    { uid: 'uid-5', name: 'Anyone' },
  ];

  ngOnInit(): void {
    this.users$.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        const ref = collection(this.db, 'toDoItems');
        const q = query(ref, orderBy('uid'));

        collectionData(q, { idField: 'id' }).subscribe((items: any[]) => {
          this.toDoItems = items.map((i) => ({
            id: i.id,
            title: i.title,
            uid: i.uid,
            userColor: this.USER_COLORS[i.uid] || 'grey',
            completed: false,
          }));
        })
      }
    })
  }

  async deleteCompleted() {
    const itemsToDelete = this.toDoItems.filter(item => item.completed);
    for(const item of itemsToDelete) {
      if(item.id) {
        await deleteDoc(doc(this.db, 'toDoItems', item.id));
      }
    }
  }

  async saveToDo() {
    if(!this.newToDoTitle || !this.selectedUserId) {
      alert("Please enter a title and select a user");
      return;
    }

    const newItem: Partial<ToDoItem> = {
      title: this.newToDoTitle,
      uid: this.selectedUserId
    };

    await addDoc(collection(this.db, 'toDoItems'), newItem);
    this.closeModal();
  }

  editItem(item: ToDoItem) {
    this.editingItem = item;
    this.newToDoTitle = item.title;
    this.selectedUserId = item.uid;
    this.showEventModal = true;
  }

  async updateToDo() {
    if (!this.editingItem || !this.editingItem.id || !this.newToDoTitle || !this.selectedUserId) {
      alert("Missing Information");
      return;
    }

    const updatedData = {
      title: this.newToDoTitle,
      uid: this.selectedUserId,
    };

    await updateDoc(doc(this.db, 'toDoItems', this.editingItem.id), updatedData);
    this.closeModal();
  }

  openModal() {
    this.newToDoTitle = '';
    this.selectedUserId = null;
    this.showEventModal = true;
  }

  closeModal() {
    this.showEventModal = false;
  }

}
