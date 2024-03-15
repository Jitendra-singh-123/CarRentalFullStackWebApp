import { Component } from '@angular/core';
import { AdminService } from '../../../Services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrl: './list-customer.component.css'
})
export class ListCustomerComponent {

customers:any;
constructor(private service:AdminService,private toastr: ToastrService) {
  this.getAllCustomer();
}

getAllCustomer(){
  this.service.getAllCustomer().subscribe((res)=>{
    this.customers=res;
  })
}

deleteCustomer(custId: any) {
this.service.deleteCustomer(custId).subscribe(res=>{
  console.log(res);
  this.customers = this.customers.filter((customer: any) => customer.CustomerId !== custId);
  this.toastr.success('Customer Deleted Successfully', 'Success');
})
}
}
