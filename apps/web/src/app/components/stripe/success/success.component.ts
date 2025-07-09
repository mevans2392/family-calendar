import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
  private router = inject(Router);
  countdown = 3;

  ngOnInit(): void {
    const interval = setInterval(() => {
      this.countdown--;

      if(this.countdown === 0) {
        clearInterval(interval);
        this.router.navigate(['/home']);
      }
    }, 1000);
  }
    
  

}
