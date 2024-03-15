import { Component } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, MaxLengthValidator, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  customerForm: FormGroup;
  registrationError: string;
  constructor(private fb: FormBuilder, public authService: AuthService, private router: Router,private toastr: ToastrService) {
  }

  ngOnInit(): void {

    this.customerForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      EmailAddress: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      RePassword: ['', [Validators.required, Validators.minLength(6)]],
      PhoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
      Address: ['', Validators.required],
      LicenseNumber: ['', Validators.required],
      Role: [''] ,
      Gender:['',Validators.required]
    },
      {
        validators: this.passwordMatchValidator 
      }
    );
  }

  roleCheckValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const role = control.value;
      if (role && role.toLowerCase() !== 'customer') {
        return { 'invalidRole': true };
      }
      return null;
    };
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





  register() {

    if (this.customerForm.valid) {
      const formData = this.customerForm.value;
      formData.Role = 'Customer';
      this.authService.register(formData).subscribe(
        (response) => {
          this.customerForm.reset();
          this.router.navigateByUrl("/login");
          this.toastr.success('Registered Successfully', 'Success');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 409) {
            if (error.error === "Customer with the same CustomerId already exists." || error.error === "Email Already Registered.") {
              this.toastr.info('You are Already Registered','Notification');
            } else if (error.error === "License Number already exists.") {
              this.toastr.info('The entered License Number Already exists','Notification');
            } else {
              this.toastr.error('An Error occured during registration','Error');
              console.log(error);
            }
          } else {
            this.toastr.error('An Error occured during registration','Error');
            console.log(error);
          }
        }
      );
    } else {
      alert("Invalid form");
    }
  }
  




}
