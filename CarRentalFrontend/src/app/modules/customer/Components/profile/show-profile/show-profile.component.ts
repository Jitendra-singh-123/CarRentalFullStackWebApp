import { Component } from '@angular/core';
import { CustomerService } from '../../../Services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-profile',
  templateUrl: './show-profile.component.html',
  styleUrl: './show-profile.component.css'
})
export class ShowProfileComponent {
  customer:any;
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
}
