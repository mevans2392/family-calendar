import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardModalComponent } from './reward-modal.component';

describe('RewardModalComponent', () => {
  let component: RewardModalComponent;
  let fixture: ComponentFixture<RewardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
