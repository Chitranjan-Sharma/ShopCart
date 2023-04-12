import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private router: Router, private api: ApiService) {}

  errorMessage = '';
  email = '';
  password = '';

  gotoRegisterPage() {
    this.api.errorMessage = '';
    this.router.navigate(['register_page']);
  }

  loginToUser() {
    this.api.userLogin(this.email, this.password);
    this.errorMessage = this.api.errorMessage;
  }
}
