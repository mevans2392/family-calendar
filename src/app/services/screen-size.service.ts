import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private screenSize$ = new BehaviorSubject<number>(window.innerWidth);

  constructor() {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(100),
        map(() => window.innerWidth),
        startWith(window.innerWidth)
      )
      .subscribe(this.screenSize$);
   }

   isMobile(): boolean {
    return this.screenSize$.value <= 767;
   }

   isTablet(): boolean {
    return this.screenSize$.value > 767 && this.screenSize$.value <= 1024;
   }

   isDesktop(): boolean {
    return this.screenSize$.value > 1024;
   }

   isTabletOrSmaller(): boolean {
    return this.isTablet() || this.isMobile();
   }

   get screenSizeChanges() {
    return this.screenSize$.asObservable();
   }

  
}
