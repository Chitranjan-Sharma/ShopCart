import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private router: Router, private api: ApiService) {
    this.registerBtnLicked = false;
  }

  errorMessage = '';
  email = '';
  password = '';
  registerBtnLicked: boolean = false;

  gotoLoginPage() {
    this.api.errorMessage = '';
    this.router.navigate(['login_page']);
  }

  registerUser() {
    this.registerBtnLicked = true;
    this.api.postUser(this.email, this.password);
    this.errorMessage = this.api.errorMessage;
  }
}
