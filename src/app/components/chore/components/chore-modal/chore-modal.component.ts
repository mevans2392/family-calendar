import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chore, MonthOption, MONTHS } from '../../../../shared/shared-interfaces';
import { ChoreService } from '../../../../services/chore.service';

@Component({
  selector: 'app-chore-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chore-modal.component.html',
  styleUrl: './chore-modal.component.css'
})
export class ChoreModalComponent implements OnInit {
  @Input() chore: Partial<Chore> | null = null;
  @Output() close = new EventEmitter<void>();

  formChore: Partial<Chore> = {};
  MONTHS: (MonthOption | '')[] = ['', ...MONTHS];
  private choreService = inject(ChoreService);

  ngOnInit() {
    // Initialize local formChore so template bindings are always safe
    this.formChore = this.chore ?? {
      title: '',
      points: 0,
      assignedUser: '',
      complete: false,
      lastCompletedAt: '',
      month: ''
    };
  }

  async save() {
    const choreToSave = {
      ...this.formChore,
      complete: this.formChore.complete ?? false,
      lastCompletedAt: this.formChore.lastCompletedAt ?? ''
    } as Chore;

    await this.choreService.saveChore(choreToSave);
    this.close.emit();
  }

  async deleteChore() {
    if(!this.formChore?.id) return;

    const confirmed = confirm('Are you sure you want to delete this chore?');

    if(confirmed) {
      await this.choreService.deleteChore(this.formChore.id);
      this.close.emit();
    }
  }
}

