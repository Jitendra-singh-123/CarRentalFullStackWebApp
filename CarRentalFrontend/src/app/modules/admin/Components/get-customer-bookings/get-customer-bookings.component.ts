import { Component } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-get-customer-bookings',
  templateUrl: './get-customer-bookings.component.html',
  styleUrl: './get-customer-bookings.component.css'
})
export class GetCustomerBookingsComponent {


  bookings: any;

 
  constructor(private adminService:AdminService,private toastr: ToastrService) {  
  }
  ngOnInit(){
    this.getBookings();
  }
  getBookings(){
    this.adminService.getAllBookings().subscribe((res)=>{
      console.log(this.bookings);
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

    },error=>{
      console.log(error);
    })
  }

  rejectReservation(bookingId:any) {
    this.adminService.deleteReservation(bookingId).subscribe((res) => {
      this.bookings = this.bookings.filter(booking => booking.ReservationID !== bookingId);
      this.toastr.success('Booking Rejected and deleted', 'Success');
    },error=>{
      this.toastr.error('Server Side Issues', 'Error');
    })
  }
  
  acceptReservation(bookingObj:any):any {
    
    bookingObj.ReservationStatus="Accepted";
    console.log(bookingObj.CustomerID);
    this.adminService.updateReservationStatus(bookingObj).subscribe(
      (res) => {
        this.toastr.success('Booking Accepted', 'Success');
       // this.router.navigateByUrl('/admin/dashboard');
        console.log(res);
      },
      (error) => {
        this.toastr.error('Error While Accepting Reservation', 'Error');
        console.log(error);
      }
  
    );
    
    return true;
  }
  
  
}
