import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavMealsComponent } from './fav-meals.component';

describe('FavMealsComponent', () => {
  let component: FavMealsComponent;
  let fixture: ComponentFixture<FavMealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavMealsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
