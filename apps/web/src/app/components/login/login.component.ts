import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";
import { browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  error: string = '';
  rememberMe = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const remember = localStorage.getItem('rememberMe') === 'true';
    if(storedEmail && remember) {
      this.email = storedEmail;
      this.rememberMe = true;
    }
  }

  async login() {
    try {
      if(this.rememberMe) {
        localStorage.setItem('rememberedEmail', this.email);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberMe');
      }

      await this.authService.login(this.email, this.password, this.rememberMe);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

}
