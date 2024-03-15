import { Component } from '@angular/core';
import { AdminService } from '../../../Services/admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css'
})
export class UpdateProfileComponent {
  admin: any = {};

  constructor(private service: AdminService, private router: Router,private toastr: ToastrService) {
    this.getProfileByAdminId();
  }

  getProfileByAdminId() {
    this.service.getProfileByAdminId().subscribe((res) => {
      this.admin = res;
      console.log(this.admin);
    }, err => {
      alert("Error: " + err);
      console.log(err);
    });
  }
  get passwordsMismatch(): boolean {
    return this.admin.Password !== this.admin.RePassword;
  }
  updateProfile() {
  debugger;
    this.service.updateProfileByAdminId(this.admin).subscribe((res) => {
      console.log(res);
      this.router.navigateByUrl("/admin/profile/showProfile");
      this.toastr.success('Profile Updated Successfully', 'Success');
    }, err => {
      alert("Error: " + err);
      console.log(err);
    });
  }
}
