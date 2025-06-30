import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoreModalComponent } from './chore-modal.component';

describe('ChoreModalComponent', () => {
  let component: ChoreModalComponent;
  let fixture: ComponentFixture<ChoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoreModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
