import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberColumnComponent } from './components/member-column/member-column.component';
import { Chore, FamilyMember, MONTHS, MonthOption } from '../../shared/shared-interfaces';
import { ChoreService } from '../../services/chore.service';
import { FamilyMembersService } from '../../services/family-members.service';
import { map, Observable } from 'rxjs';
import { NavComponent } from '../nav/nav.component';
import { UnassignedChoresComponent } from './components/unassigned-chores/unassigned-chores.component';
import { ChoreModalComponent } from './components/chore-modal/chore-modal.component';
import { RouterModule } from '@angular/router';
import { CdkDragMove } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-chore',
  imports: [CommonModule, RouterModule, NavComponent, MemberColumnComponent, UnassignedChoresComponent, ChoreModalComponent],
  templateUrl: './chore.component.html',
  styleUrl: './chore.component.css'
})
export class ChoreComponent {
  private choreService = inject(ChoreService);
  private familyService = inject(FamilyMembersService);
  
  members$!: Observable<FamilyMember[]>;
  chores$!: Observable<Chore[]>;
  openModal = false;
  selectedChore: Chore | null = null;
  filteredMembers$!: Observable<FamilyMember[]>;
  private scrollingInterval: any;

  async ngOnInit() {
    this.members$ = await this.familyService.getMembers();
    await this.loadChores();

    this.filteredMembers$ = this.members$.pipe(
      map(members => members.filter(m => m.name !== 'Anyone'))
    )
  }

  async loadChores() {
    this.chores$ = await this.choreService.loadChores();
  }

  getChoresForMember(memberId: string, chores: Chore[]): Chore[] {
    return chores.filter(c => c.assignedUser === memberId);
  }

  getUnassignedChores(chores: Chore[]): Chore[] {
    const currentMonth = this.getCurrentMonthName();

    return chores.filter(c => 
      !c.assignedUser &&
      (c.month === '' || c.month === currentMonth)
    );
  }

  getCurrentMonthName(): MonthOption {
    const monthIndex = new Date().getMonth();
    return MONTHS[monthIndex];
  }

  getDropListIds(members: FamilyMember[]): string[] {
    return members.map(m => 'dropList-' + m.id).concat('unassigned-chore-list');
  }

  onChoreDragMoved(event: CdkDragMove) {
    const pointerY = event.pointerPosition.y;
    const pointerX = event.pointerPosition.x;
    const threshold = 80;
    const speed = 15;

    const columnsWrapper = document.querySelector('.columns-scroll-wrapper') as HTMLElement;

    // ----- Vertical scroll (window) -----
    const viewportHeight = window.innerHeight;
    if (pointerY < threshold) {
      this.startVerticalScroll(window, -speed);
    } else if (pointerY > viewportHeight - threshold) {
      this.startVerticalScroll(window, speed);
    }

    // ----- Horizontal scroll (columns wrapper) -----
    const columnsRect = columnsWrapper.getBoundingClientRect();
    if (pointerX < columnsRect.left + threshold) {
      this.startHorizontalScroll(columnsWrapper, -speed);
    } else if (pointerX > columnsRect.right - threshold) {
      this.startHorizontalScroll(columnsWrapper, speed);
    }
  }

  private currentScrollDirection: 'up' | 'down' | 'left' | 'right' | null = null;

  private startVerticalScroll(container: HTMLElement | Window, speed: number) {
    const dir = speed > 0 ? 'down' : 'up';
    if (this.currentScrollDirection !== dir) {
      this.stopScrolling();
      this.currentScrollDirection = dir;
    }
    if(this.scrollingInterval) return;
    this.scrollingInterval = setInterval(() => {
      if (container instanceof Window) {
        window.scrollBy(0, speed);
      } else {
        container.scrollBy(0, speed);
      }
    }, 16);
  }

  private startHorizontalScroll(container: HTMLElement, speed: number) {
    const dir = speed > 0 ? 'right' : 'left';
    if(this.currentScrollDirection !== dir) {
      this.stopScrolling();
      this.currentScrollDirection = dir;
    }
    if (this.scrollingInterval) return;
    this.scrollingInterval = setInterval(() => {
      container.scrollBy(speed, 0);
    }, 16);
  }

  public stopScrolling() {
    if (this.scrollingInterval) {
      clearInterval(this.scrollingInterval);
      this.scrollingInterval = null;
    }
    this.currentScrollDirection = null;
  }

  openEditModal(chore: Chore) {
    this.selectedChore = chore;
    this.openModal = true;
  }

}
