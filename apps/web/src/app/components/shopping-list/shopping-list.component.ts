import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping.service';
import { ShoppingItem } from '../../shared/shared-interfaces';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-shopping-list',
  imports: [CommonModule, FormsModule, NavComponent],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent implements OnInit {
  item: ShoppingItem[] = [];
  showModal = false;
  newItemTitle = '';
  editingItem: ShoppingItem | null = null;
  private shoppingService = inject(ShoppingListService);
  

  async ngOnInit() {
    const stream$ = await this.shoppingService.getShoppingItems();
    stream$.subscribe(data => {
      this.item = data;
    });
  }

  async saveShoppingItem() {
    const title = this.newItemTitle.trim();
    if (!title) {
      alert('Please enter an item');
      return;
    }

    const exists = await this.shoppingService.itemExists(title);
    if (exists) {
      console.log('Item already exists');
      return;
    }

    await this.shoppingService.addItem(title);
    this.newItemTitle = '';
  }

  async deleteShoppingItems() {
    const confirmed = confirm('Delete all checked items?');
    if (!confirmed) return;

    await this.shoppingService.deleteCompletedItems(this.item);
  }

  editItem(item: ShoppingItem) {
    this.editingItem = item;
    this.newItemTitle = item.title;
    this.showModal = true;
  }

  async updateItem() {
    if (!this.editingItem || !this.editingItem.id || !this.newItemTitle) {
      alert('Missing Information');
      return;
    }

    await this.shoppingService.updateItem(this.editingItem.id, this.newItemTitle);
    this.closeModal();
  }

  openModal() {
    this.newItemTitle = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingItem = null;
  }
}

