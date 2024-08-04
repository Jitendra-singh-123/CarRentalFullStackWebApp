import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth/auth.service';
import { StorageService } from '../../Services/storage/storage.service';
import { Route, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  showErrorStatus: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,private toastr: ToastrService) {

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.email, Validators.required]],
      Password: ['', [Validators.required]],
      Role: ['', Validators.required]
    })
  }
  closeErrorAlert() {
    this.showErrorStatus = false;
  }

  login() {
    debugger;
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        console.log(response);
        if (response.user != null) {
          const user = {
            id: response.user.LoginId,
            role: response.user.Role
          };
          StorageService.saveUser(user);
          StorageService.saveToken(response.jwtToken);
          if (StorageService.isAdminLoggedIn()) {
            this.toastr.success("Admin Login success");
            this.router.navigateByUrl("/admin/dashboard");
          } else if (StorageService.isCustomerLoggedIn()) {
            this.toastr.success("Customer Login success");
            this.router.navigateByUrl("/customer/dashboard");
          }
          else{
            this.toastr.error('Incorrect Credentials', 'Error');
          }
        }
      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 401) {
          this.showErrorStatus = true;
        } else {
          console.error("Error occurred during login:", errorResponse.error);
        }
      }

    );
  }

}
