import { Component } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { elementAt } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  cars: any = [];
  constructor(public adminService: AdminService,private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getAllCars();
  }
  getAllCars(): void {
    //debugger;
    this.adminService.getAllCars().subscribe(
      (res: any[]) => {
       
        this.cars = res.map(car => {
          if (car.ImageUrl && car.ImageUrl.startsWith('https')) {
            // If image is an HTTPS link and ImageUrl exists, set the processed image URL directly
            car.processedImg = car.ImageUrl;
          } else {
            // If image is not an HTTPS link or ImageUrl is undefined, handle it accordingly
            // For now, assuming ImageUrl is always base64 data
            car.processedImg = 'data:image/jpeg;base64,' + car.ImageUrl;
          }
          return car;
        });
      },
      (error: any) => {
        this.toastr.error('Error While Fetching Cars', 'Error');
      }
    );
  }

  deletCar(id: number) {
    this.adminService.deleteCar(id).subscribe((res) => {
      this.getAllCars();
      this.toastr.success('Car Deleted Successfully', 'Success');
    })
  }


}
