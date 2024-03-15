import { Component } from '@angular/core';
import { CustomerService } from '../../../Services/customer.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/auth/Services/storage/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  customer: any;
  enteredPassword: string = '';
  confirmPassword: string = '';
  constructor(private service: CustomerService, private router: Router,private toastr: ToastrService) {
    this.getProfileByUserId();
  }
  
  confirmDelete() {
    debugger;
    if (this.enteredPassword.trim() === '') {
      this.toastr.info('Please Enter Your Password', 'Notification');
      return;
    }
    
    if (this.enteredPassword === this.confirmPassword) {
      this.service.deleteProfileByUserId(this.customer).subscribe(
        (res) => {
          this.router.navigateByUrl('/login');
          this.toastr.success('Profile deleted successfully', 'Success');

        },
        (err) => {
          console.log('Error: ' + err);
          this.toastr.error('Failed to delete profile. Please try again later.', 'Error');
        }
      );
    } else {
      this.toastr.error('Incorrect password. Please try again.', 'Error');

    }
  }

  getProfileByUserId() {
    this.service.getProfileByUserId().subscribe((res) => {
      this.customer = res;
      this.confirmPassword = this.customer.Password;
    }, err => {
      console.log(err);
    });
  }



  cancelDelete() {
    this.router.navigateByUrl('/customer/profile/updateProfile');
  }


}
