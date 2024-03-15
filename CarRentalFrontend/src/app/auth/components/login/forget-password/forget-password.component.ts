import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/Services/auth/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'

  
})
export class ForgetPasswordComponent {
  showErrorStatus: boolean = false;
  passwordForm: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,private toastr: ToastrService) {

  }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      Email: ['', [Validators.required]],
      Password: ['', [Validators.required]],
      RePassword: ['', [Validators.required]],
      Role: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    })
  }
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('Password');
    const confirmPassword = control.get('RePassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    } else {
      confirmPassword.setErrors(null);
      return null;
    }
  }

  forget() {
 
    if (this.passwordForm.invalid) {
      return;
    }
    
    const Email = this.passwordForm.get('Email').value;  // Assuming you have an 'Email' field in your form
    const Password = this.passwordForm.get('Password').value; // Assuming you have a 'Password' field in your form
    const RePassword = this.passwordForm.get('RePassword').value; // Assuming you have a 'Password' field in your form
    const Role=this.passwordForm.get('Role').value;
    this.authService.forgetPassword(Email,Password,RePassword,Role).subscribe(res => {
  
      this.toastr.success('Password reset successful', 'Success');
      this.router.navigateByUrl("/login");
    }, (error: HttpErrorResponse) => {
      if (error.error === "Email mismatch") {
        this.toastr.error('Please enter the correct email', 'Error');
      } 
      else if(error.error === "User not found")
        {
          this.toastr.error('Please enter the correct email', 'Error');
        }
      else {
        this.toastr.error('Something wrong at server side', 'Error');
        console.error(error);
      }
    });

  }
}