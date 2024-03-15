import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/auth/Services/storage/storage.service';
import { CustomerService } from '../../Services/customer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  customer: any = {};
  constructor(private service:CustomerService,private router: Router) {
    this.getProfile();

  }

  getProfile() {
    this.service.getProfileByUserId().subscribe((res)=>{
      this.customer = res; 
    },err=>{
      console.log(err);
    });
  }
  logout(){
    StorageService.logout();
    this.router.navigateByUrl("/login");
  }
}
