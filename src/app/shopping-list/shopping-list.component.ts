import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc, getDocs, query, where } from '@angular/fire/firestore';

interface ShoppingItem {
  id?: string;
  title: string;
  title_lower?: string;
  completed: boolean;
}

@Component({
  selector: 'app-shopping-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent implements OnInit{
  item: ShoppingItem[] = [];
  showModal = false;
  newShoppingItem = {
    title: '',
    completed: false
  };
  editingItem: ShoppingItem | null = null;
  newItemTitle = '';
  
  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    const ref = collection(this.firestore, 'shoppingList');
    collectionData(ref, { idField: 'id'}).subscribe(data => {
      this.item = data as ShoppingItem[];
    })
  }

  async saveShoppingItem() {
    const title = this.newItemTitle.trim();
    const completed = this.newShoppingItem.completed;

    if(!title) {
      alert('Please enter an item');
      return;
    }

    const item: ShoppingItem = {
      title,
      completed
    };

    const normalizedTitle = title.toLowerCase();
    const shoppingListRef = collection(this.firestore, 'shoppingList');

    const ref = collection(this.firestore, 'shoppingList');

    const snapshot = await getDocs(query(ref, where('title_lower', '==', normalizedTitle)));
    if(!snapshot.empty) {
      console.log('Item already in shopping list');
      return;
    }

    const newItem: ShoppingItem = {
      title,
      title_lower: normalizedTitle,
      completed: false,
    }

    await addDoc(ref, newItem);

    this.newItemTitle = '';
  }

  async deleteShoppingItems(): Promise<void> {
    const confirmed = confirm('Delete all checked items?');
    if(!confirmed) return;

    const toDelete = this.item.filter(i => i.completed && i.id);

    for(const i of toDelete) {
      await deleteDoc(doc(this.firestore, 'shoppingList', i.id!));
    }
  }

  editItem(item: ShoppingItem) {
    this.editingItem = item;
    this.newItemTitle = item.title;
    this.showModal = true;
  }

  async updateItem() {
    if(!this.editingItem || !this.editingItem.id || !this.newItemTitle) {
      alert('Missing Information');
      return;
    }

    const updatedData = {
      title: this.newItemTitle
    }

    await updateDoc(doc(this.firestore, 'shoppingList', this.editingItem.id), updatedData);
    this.closeModal();
  }

  openModal() {
    this.newItemTitle = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}
