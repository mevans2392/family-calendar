import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reward, FamilyMember } from '../../../shared/shared-interfaces';
import { RewardService } from '../../../services/reward.service';
import { FamilyMembersService } from '../../../services/family-members.service';
import { NavComponent } from '../../nav/nav.component';
import { RouterModule } from '@angular/router';
import { RewardModalComponent } from './reward-modal/reward-modal.component';
import { map, Observable } from 'rxjs';
import { CdkDragDrop, CdkDragEnd, CdkDragMove, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, NavComponent, RouterModule, RewardModalComponent, DragDropModule],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.css'
})
export class RewardsComponent {
  rewards: Reward[] = [];
  members: FamilyMember[] = [];
  filteredMembers: FamilyMember[] = [];
  memberDropIds: string[] = [];

  openModal = false;
  selectedReward: Reward | null = null;

  private rewardService = inject(RewardService);
  private familyService = inject(FamilyMembersService);

  private scrollingInterval: any;

  async ngOnInit() {
    await this.loadRewards();
    await this.loadMembers();
  }

  async loadRewards() {
    const reward$ = await this.rewardService.loadRewards();
    reward$.subscribe(data => this.rewards = data);
  }

  async loadMembers() {
    const members$ = await this.familyService.getMembers();
    members$.subscribe(data => {
      this.members = data;
      this.filteredMembers = data.filter(m => m.name != 'Anyone');
      this.memberDropIds = this.filteredMembers.map((_, i) => `memberDrop${i}`);
    })
  }

  async subtractPoints(reward: Reward, member: FamilyMember) {
    const newPoints = (member.points || 0) - reward.points;
    await this.familyService.updatePoints(member.id!, newPoints);
  }

  async handleDrop(event: CdkDragDrop<FamilyMember>) {
    console.log('Drop event:', event);

    const reward = event.item.data as Reward;
    const member = event.container.data as FamilyMember;

    if(reward.points > (member.points || 0)) {
      alert(`${member.name} does not have enough points for this reward`);
      return;
    }

    await this.subtractPoints(reward, member);
    await this.loadMembers();

  }

  isDragging = false;

  onDragStarted() {
    this.isDragging = true;
  }

  onDragEnded(event: CdkDragEnd) {
    setTimeout(() => {
      this.isDragging = false;
    });
  }

  onRewardDragMoved(event: CdkDragMove) {
    const pointerY = event.pointerPosition.y;
    const pointerX = event.pointerPosition.x;
    const threshold = 80;
    const speed = 15;

    const columnsWrapper = document.querySelector('.scroll-container') as HTMLElement;
    const containerRect = columnsWrapper.getBoundingClientRect();

    // ----- Vertical scroll (window) -----
    if (pointerY < containerRect.top + threshold) {
      this.startVerticalScroll(columnsWrapper, -speed);
    } else if (pointerY > containerRect.bottom - threshold) {
      this.startVerticalScroll(columnsWrapper, speed);
    }
    else {
      this.stopScrolling();
    }

    //TODO: change this to match Vertical Scroll if Horizontal scroll ends up being needed.
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
      container.scrollBy(0,speed);
    }, 16);
  }

  //TODO: change this to match Vertical Scroll if Horizontal scroll ends up being needed.
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

  openRewardModal(reward: Reward | null) {
    this.selectedReward = reward;
    this.openModal = true;
  }
}
