import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { JournalService } from '../../services/journal.service';
import { JournalCategoryService } from '../../services/journal-category.service';
import { JournalItem, JournalCategory } from '../../shared/shared-interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, NavComponent, FormsModule],
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.css'
})
export class JournalComponent implements OnInit {
  private journalService = inject(JournalService);
  private journalCategoryService = inject(JournalCategoryService);

  journalEntries: JournalItem[] = [];
  categories: JournalCategory[] = [];

  addingCategory = false;
  newCategoryTitle = '';
  selectedCategoryId: string | null = null;

  addingEntry = false;
  newEntryText = '';
  newEntryCategoryId: string | null = null;

  ngOnInit(): void {
    this.loadJournalItems();
    this.loadCategories();
  }

  async loadJournalItems(): Promise<void> {
    const obs = await this.journalService.loadJournalItems();
    obs.subscribe(items => {
      this.journalEntries = items;
    });
  }

  async loadCategories(): Promise<void> {
    const obs = await this.journalCategoryService.loadCategories();
    obs.subscribe(cats => {
      this.categories = cats;
    })
  }

  async saveCategory(): Promise<void> {
    if(!this.newCategoryTitle.trim()) return;
    const newCat: JournalCategory = { title: this.newCategoryTitle };
    await this.journalCategoryService.saveCategory(newCat);
    this.newCategoryTitle = '';
    this.addingCategory = false;
    this.loadCategories();
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.selectedCategoryId = value || null;
    this.filterByCategoryId(value);
  }

  async deleteCategory(categoryId?: string): Promise<void> {
    if(!categoryId) return;
    await this.journalCategoryService.deleteCategory(categoryId);
    this.selectedCategoryId = null;
    this.loadCategories();
  }

  cancelAddCategory(): void {
    this.newCategoryTitle = '';
    this.addingCategory = false;
  }

  filterByCategoryId(categoryId: string): void {
    if(!categoryId) {
      this.loadJournalItems();
    } else {
      this.journalService.loadJournalItemsByCategory(categoryId)
        .then(obs => obs.subscribe(items => {
          this.journalEntries = items;
        }));
    }
  }

  addEntry(): void {
    this.addingEntry = true;
  }

  getCategoryTitle(entry: JournalItem): string {
    if(!entry.categoryIds || entry.categoryIds.length === 0) return '';
    const cat = this.categories.find(c => c.id === entry.categoryIds[0]);
    return cat ? cat.title : '';
  }

  async saveEntry(): Promise<void> {
    if(!this.newEntryText.trim()) return;

    const newEntry: JournalItem = {
      text: this.newEntryText,
      categoryIds: this.newEntryCategoryId ? [this.newEntryCategoryId] : [],
    };

    await this.journalService.saveJournalItem(newEntry);

    this.newEntryText = '';
    this.newEntryCategoryId = null;
    this.addingEntry = false;

    if(this.selectedCategoryId) {
      this.filterByCategoryId(this.selectedCategoryId);
    } else {
      this.loadJournalItems();
    }
  }

  cancelAddEntry(): void {
    this.newEntryText = '';
    this.newEntryCategoryId = null;
    this.addingEntry = false;
  }

}

