import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnassignedChoresComponent } from './unassigned-chores.component';

describe('UnassignedChoresComponent', () => {
  let component: UnassignedChoresComponent;
  let fixture: ComponentFixture<UnassignedChoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnassignedChoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnassignedChoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
