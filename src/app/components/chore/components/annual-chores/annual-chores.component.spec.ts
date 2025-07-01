import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualChoresComponent } from './annual-chores.component';

describe('AnnualChoresComponent', () => {
  let component: AnnualChoresComponent;
  let fixture: ComponentFixture<AnnualChoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnualChoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualChoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
