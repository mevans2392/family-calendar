import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoreCardComponent } from './chore-card.component';

describe('ChoreCardComponent', () => {
  let component: ChoreCardComponent;
  let fixture: ComponentFixture<ChoreCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoreCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
