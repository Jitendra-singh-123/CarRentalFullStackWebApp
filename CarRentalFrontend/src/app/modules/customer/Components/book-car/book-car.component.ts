import { Component } from '@angular/core';
import { CustomerService } from '../../Services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { StorageService } from '../../../../auth/Services/storage/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-car',
  templateUrl: './book-car.component.html',
  styleUrl: './book-car.component.css'
})
export class BookCarComponent {

  carId: number = this.activatedRoute.snapshot.params["id"];
  car: any;
  processedImage: any;
  totalPayment: number = 0;
  numberOfDays: number = 0;
  dateFormat: "DD-MM-YYYY";
  ValidateForm!: FormGroup;
  paymentId = 0;
  feedbacks: any;
  showSpecifications = false;
  showMaintenanceStatus = false;
  //reservationStatus="Waiting";
  constructor(private service: CustomerService, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private router: Router, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.ValidateForm = this.fb.group({
      PickupDateTime: ['', Validators.required],
      DropoffDateTime: ['', Validators.required],
      NumberOfDays: [0],
    }, { validator: this.dateRangeValidator });
    this.getCarById();
    this.getCarFeedbacks();

  }
  getCarById() {
    this.service.getCarById(this.carId).subscribe((res: any) => {
      if (res.ImageUrl && res.ImageUrl.startsWith('https')) {
        // If image is an HTTPS link and ImageUrl exists, set the processed image URL directly
        this.processedImage = res.ImageUrl; // Update this line
      } else {
        // If image is not an HTTPS link or ImageUrl is undefined, handle it accordingly
        // For now, assuming ImageUrl is always base64 data
        this.processedImage = 'data:image/jpeg;base64,' + res.ImageUrl;
      }
      this.car = res;
    });
  }

  dateRangeValidator: ValidatorFn = (control: FormGroup): { [key: string]: any } | null => {
    const PickupDateTime = control.get('PickupDateTime');
    const DropoffDateTime = control.get('DropoffDateTime');

    if (PickupDateTime.value && DropoffDateTime.value) {
      const fromDate = new Date(PickupDateTime.value);
      const toDate = new Date(DropoffDateTime.value);
      const availableFromDate = new Date(this.car.AvailableFrom);
      const availableToDate = new Date(this.car.AvailableTo);

      if (fromDate > toDate) {
        return { 'dateRangeError': true };
      }

      if (fromDate < availableFromDate || toDate > availableToDate) {
        return { 'bookDateRangeError': true };
      }

      this.calculateTotalPayment(fromDate, toDate);
    }

    return null;
  };

  calculateTotalPayment(fromDate: Date, toDate: Date) {
    const timeDifference = toDate.getTime() - fromDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    this.totalPayment = this.car.DailyRate * daysDifference;
    this.numberOfDays = daysDifference;
  }


  bookCar(data: any) {

    if (this.ValidateForm.valid) {
      if (this.car && this.car.Status === 'Not Available') {
        this.toastr.error("Sorry!!, Car is not currently available", 'Error');
        return;
      }


      let bookCarData = {
        CustomerID: Number(StorageService.getUserId()),
        CarID: Number(this.carId),
        PickupDateTime: data.PickupDateTime,
        DropoffDateTime: data.DropoffDateTime,
        //  PaidAmount: Number(this.totalPayment),
        NumberOfDays: Number(this.numberOfDays),
        // ReservationStatus:this.reservationStatus
      };

      // console.log(bookCarData.PaidAmount);
      this.service.bookCar(bookCarData).subscribe((res) => {
        this.router.navigateByUrl("/customer/profile/bookings");
        this.toastr.success('Car booked Successfully', 'Success');

      }, (error: HttpErrorResponse) => {
        if (error.error === "The car is already booked by someone")
          this.toastr.info("Sorry!! Car is already booked", 'Notification');
        else {
          this.toastr.error("Error Occured while Booking:", 'Error');
          console.log(error);;
        }
        console.log(error);
      })
    }

  }


  getCarFeedbacks() {
    this.service.getCarFeedbacks(this.carId).subscribe((res) => {
      console.log(res);
      this.feedbacks = res.map(feedback => ({
        ...feedback,
        expanded: false
      }));
    }, (error: HttpErrorResponse) => {
      if (error.error === "No reviews available for this car")
        this.toastr.info('No feedback for this car.', 'Notification');
      else {
        alert("Error Occured Showing Reviews " + error);
      }
      console.log(error);
    })
  }
}


