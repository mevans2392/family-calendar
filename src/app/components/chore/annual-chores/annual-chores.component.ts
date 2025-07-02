import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../nav/nav.component';
import { Chore, MONTHS, MonthOption } from '../../../shared/shared-interfaces';
import { ChoreService } from '../../../services/chore.service'; 
import { ChoreCardComponent } from '../components/chore-card/chore-card.component';
import { ChoreModalComponent } from '../components/chore-modal/chore-modal.component';

@Component({
  selector: 'app-annual-chores',
  standalone: true,
  imports: [CommonModule, RouterModule, NavComponent, ChoreCardComponent, ChoreModalComponent],
  templateUrl: './annual-chores.component.html',
  styleUrl: './annual-chores.component.css'
})
export class AnnualChoresComponent {
  @Input() chores: Chore[] = [];

  @Output() choreUpdated = new EventEmitter<void>();
  @Output() editChoreRequested = new EventEmitter<Chore>();

  private choreService = inject(ChoreService);
  months = MONTHS;
  selectedChore: Chore | null = null;
  openModal = false;

  async ngOnInit() {
    const chores$ = await this.choreService.loadChores();
    chores$.subscribe(data => {
      this.chores = data;
    })
  }

  editChore(chore: Chore | null) {
    this.selectedChore = chore;
    this.openModal = true;
  }

  getChoresForMonth(month: string): Chore[] {
    return this.chores.filter(chore => chore.month?.toLowerCase() === month.toLowerCase());
  }
  


}
