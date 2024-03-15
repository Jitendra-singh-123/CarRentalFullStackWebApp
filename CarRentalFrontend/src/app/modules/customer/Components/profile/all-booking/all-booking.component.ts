import { Component } from '@angular/core';
import { CustomerService } from '../../../Services/customer.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-booking',
  templateUrl: './all-booking.component.html',
  styleUrl: './all-booking.component.css'
})
export class AllBookingComponent {
  bookings: any;
  processedImage: any;

  constructor(private service: CustomerService, private router: Router, private toastr: ToastrService) {
    this.getMyBookings();
  }

  getMyBookings() {
    this.service.getBookingsByUserId().subscribe(
      (res) => {
        for (let booking of res) {
          if (booking.ImageUrl && booking.ImageUrl.startsWith('https')) {
            // If image is an HTTPS link and ImageUrl exists, set the processed image URL directly
            booking.processedImage = booking.ImageUrl;
            res.ImageUrl=booking.processedImage;
          } else {
            // If image is not an HTTPS link or ImageUrl is undefined, handle it accordingly
            // For now, assuming ImageUrl is always base64 data
            booking.processedImage = 'data:image/jpeg;base64,' + booking.ImageUrl;
            res.ImageUrl=booking.processedImage;
          }
        }
        this.bookings=res;
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.toastr.error("You have not any reservation", 'Error');
        } else {
          this.toastr.error("An error occurred during registration", 'Error');
        }
      });

  }

  navigate(reservation: any) {
    this.router.navigate(['/customer/payments'], { state: { reservation } });
  }

}
