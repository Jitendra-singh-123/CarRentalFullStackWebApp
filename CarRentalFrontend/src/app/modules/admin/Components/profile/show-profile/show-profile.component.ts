import { Component } from '@angular/core';
import { AdminService } from '../../../Services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-profile',
  templateUrl: './show-profile.component.html',
  styleUrl: './show-profile.component.css'
})
export class ShowProfileComponent {
  admin:any;
  constructor(private service:AdminService,private router: Router) {
    this.getProfile();

  }

  getProfile() {

    this.service.getProfileByAdminId().subscribe((res)=>{
      this.admin = res; 
    },err=>{
      console.log(err);
    });
  }
}
