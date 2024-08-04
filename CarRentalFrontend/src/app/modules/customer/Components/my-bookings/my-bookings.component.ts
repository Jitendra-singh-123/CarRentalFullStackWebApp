import { Component } from '@angular/core';
import { CustomerService } from '../../Services/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent {



  bookings: any;
  numberOfDays: number = 0;
  toDate: any;
  fromDate: any;
  NumberOfDays: any = 0;
  processedImage: any;
  constructor(private service: CustomerService, private router: Router, private activateRoute: ActivatedRoute, private toastr: ToastrService) {
    this.getMyBookings();
  }


  getMyBookings() {
    debugger;

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
          booking.PickUpTime = this.formatDate(booking.PickUpTime);
          booking.DropOffTime = this.formatDate(booking.DropOffTime);
          booking.ReservationTime=this.formatDate(booking.ReservationTime);
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

  deleteBooking(reservationId: any) {
    this.service.deleteReservation(reservationId).subscribe((res) => {
      this.bookings = this.bookings.filter(booking => booking.ReservationID !== reservationId);
      this.toastr.success('Reservation Deleted Successfully', 'Success');
    }, error => {
      this.toastr.error("Something went wrong!", 'Error');

    })
  }
  calculateNumberOfDays(reservation: any) {
    if (reservation.PickUpTime && reservation.DropOffTime) {
      const pickUpTime = new Date(reservation.PickUpTime);
      const dropOffTime = new Date(reservation.DropOffTime);
      const timeDifference = dropOffTime.getTime() - pickUpTime.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      reservation.NumberOfDays = daysDifference;
      this.numberOfDays = reservation.NumberOfDays;
      this.calculatePayment(reservation);
    }
  }

  calculatePayment(reservation: any) {
    reservation.totalPayment = reservation.NumberOfDays * reservation.DailyRate;
  }

  updateBooking(reservation: any) {
    // Check if the edited date falls within the range of available dates for the car
    if (reservation.PickUpTime <= this.bookings.AvailableFrom || reservation.DropOffTime >= reservation.AvailableTo) {
      this.toastr.error("Edited date should be within the range of available dates for the car.", 'Error');
      return;
    }

    // Check if the edited "From" date is not greater than the edited "To" date
    if (reservation.PickUpTime > reservation.DropOffTime) {
      this.toastr.error("Edited 'From' date cannot be greater than edited 'To' date.", 'Error');
      return;
    }
    // If the current status is "Accepted", change it to "Waiting"
    if (reservation.ReservationStatus === 'Accepted') {
      reservation.ReservationStatus = 'Waiting';
    }

    let bookCarData = {
      ReservationID: reservation.ReservationID,
      CustomerID: reservation.CustomerID,
      CarID: reservation.CarID,
      PickupDateTime: reservation.PickUpTime,
      DropoffDateTime: reservation.DropOffTime,
      ReservationTime: reservation.ReservationTime,
      NumberOfDays: this.numberOfDays,
      ReservationStatus: reservation.ReservationStatus,

    };

    // console.log(bookCarData.PaidAmount);
    this.service.updateReservation(reservation.ReservationID, bookCarData).subscribe((res) => {
      this.router.navigateByUrl("/customer/myBookings");
      this.toastr.success('Reservation updated Successfully', 'Success');

    }, (error: HttpErrorResponse) => {
      if (error.error === "The car is already booked by someone")
        this.toastr.info("Sorry!! Car is already booked", 'Notification');

      else {
        this.toastr.error("Error Occured while Booking: ", 'Error');
        console.log(error);

      }
      console.log(error);
    })
  }

  navigate(reservation: any) {
    this.router.navigate(['/customer/payments'], { state: { reservation } });
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}


