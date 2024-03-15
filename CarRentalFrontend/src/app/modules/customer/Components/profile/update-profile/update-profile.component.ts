import { Component } from '@angular/core';
import { CustomerService } from '../../../Services/customer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css'
})
export class UpdateProfileComponent {
  customer: any = {};
  
  constructor(private service: CustomerService, private router: Router,private toastr: ToastrService) {
    this.getProfileByUserId();
  }

  getProfileByUserId() {
    this.service.getProfileByUserId().subscribe((res)=>{
      this.customer = res; 
    },err=>{
      console.log(err);
    });
  }
  get passwordsMismatch(): boolean {
    return this.customer.Password !== this.customer.RePassword;
}
  updateProfile() {
    this.service.updateProfileByUserId(this.customer).subscribe((res) => {

      this.toastr.success('Profile Updated successfully', 'Success')
      this.router.navigateByUrl('customer/profile/showProfile');
    },err=>{
      console.log(err);
    });
  }
}
