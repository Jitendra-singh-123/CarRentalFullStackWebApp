import { Component } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-car',
  templateUrl: './update-car.component.html',
  styleUrl: './update-car.component.css'
})
export class UpdateCarComponent {

  selectedFile: File = null;
  updateForm: FormGroup;
  imagePreview: string | ArrayBuffer;
  document: any;
  carId: number = this.activateRoute.snapshot.params["id"];
  carValue: any;
  constructor(private adminService: AdminService, private activateRoute: ActivatedRoute, private fb: FormBuilder, private router: Router,private toastr: ToastrService) {

  }
  make: string;
  model: string;
  location: string;
  specifications: string;
  dailyRate: number;
  availableFrom: Date;
  availableTo: Date;
  carPlateNumber: string;
  status: string;
  year: number;
  color: string;
  mileage: number;
  carType: string;
  transmission: string;
  maintenanceStatus: string;

  ngOnInit() {
    this.updateForm = this.fb.group({
      carId: [this.carId],
      make: ['', Validators.required],
      model: ['', Validators.required],
      location: ['', Validators.required],
      specifications: ['', Validators.required],
      dailyRate: ['', Validators.required],
      availableFrom: ['', Validators.required],
      availableTo: ['', Validators.required],
      carPlateNumber: ['', Validators.required],
      status: ['', Validators.required],
      img: [''], // This field is for file input
      year: ['', Validators.required],
      color: ['', Validators.required],
      mileage: ['', Validators.required],
      carType: ['', Validators.required],
      transmission: ['', Validators.required],
      maintenanceStatus: ['', Validators.required]
    }, { validator: this.dateRangeValidator });
    this.getCarById();
  }
  dateRangeValidator: ValidatorFn = (control: FormGroup): { [key: string]: any } | null => {
    const availableFrom = control.get('availableFrom');
    const availableTo = control.get('availableTo');

    // Check if both date fields have values
    if (availableFrom.value && availableTo.value) {
      const fromDate = new Date(availableFrom.value);
      const toDate = new Date(availableTo.value);

      // Check if Available From date is greater than Available To date
      if (fromDate >= toDate) {
        // Set error if the date range is invalid
        availableTo.setErrors({ 'dateRangeError': true });
        return { 'dateRangeError': true };
      } else {
        // Clear error if the date range is valid
        availableTo.setErrors(null);
        return null;
      }
    }

    return null;
  };

  getCarById(): void {
    this.adminService.getCarById(this.carId).subscribe(
      (res: any) => {
        this.carValue = res;
        this.make = this.carValue.Make;
        this.model = this.carValue.Model;
        this.location = this.carValue.Location;
        this.specifications = this.carValue.Specifications;
        this.dailyRate = this.carValue.DailyRate;
        this.availableFrom = new Date(this.carValue.AvailableFrom);
        this.availableTo = new Date(this.carValue.AvailableTo);
        this.carPlateNumber = this.carValue.CarPlateNumber;
        this.status = this.carValue.Status;
        this.year = this.carValue.Year;
        this.color = this.carValue.Color;
        this.mileage = this.carValue.Mileage;
        this.carType = this.carValue.CarType;
        this.transmission = this.carValue.Transmission;
        this.maintenanceStatus = this.carValue.MaintenanceStatus;

      },
      (error: any) => {
        console.error('Error fetching car:', error);
      }
    );
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const MAX_WIDTH = 320;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const aspectRatio = width / height;
          if (width > height) {
            width = MAX_WIDTH;
            height = width / aspectRatio;
          } else {
            height = MAX_HEIGHT;
            width = height * aspectRatio;
          }
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const resizedImage = canvas.toDataURL('image/jpeg');

        this.selectedFile = this.dataURLtoFile(resizedImage, file.name);
        this.imagePreview = resizedImage;
      };
    };

    reader.readAsDataURL(file);
  }

  dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }


  updateCar() {

    const formData: FormData = new FormData();
    formData.append('carId', this.updateForm.get('carId').value);
    formData.append('img', this.selectedFile);
    formData.append('make', this.updateForm.get('make').value);
    formData.append('model', this.updateForm.get('model').value);
    formData.append('location', this.updateForm.get('location').value);
    formData.append('specifications', this.updateForm.get('specifications').value);
    formData.append('dailyRate', this.updateForm.get('dailyRate').value);
    formData.append('availableFrom', this.updateForm.get('availableFrom').value.toString());
    formData.append('availableTo', this.updateForm.get('availableTo').value.toString());
    formData.append('carPlateNumber', this.updateForm.get('carPlateNumber').value);
    formData.append('status', this.updateForm.get('status').value);
    formData.append('year', this.updateForm.get('year').value);
    formData.append('color', this.updateForm.get('color').value);
    formData.append('mileage', this.updateForm.get('mileage').value);
    formData.append('carType', this.updateForm.get('carType').value);
    formData.append('transmission', this.updateForm.get('transmission').value);
    formData.append('maintenanceStatus', this.updateForm.get('maintenanceStatus').value);
    console.log('model:', this.updateForm.get('model').value);
    console.log('img:', this.updateForm.get('img').value);
    console.log('transmission:', this.updateForm.get('transmission').value);
    console.log(formData);
    console.log(this.carId);
    this.adminService.updateCar(this.carId, formData).subscribe(
      (res) => {
        this.router.navigateByUrl('/admin/dashboard');
        this.toastr.success('Car Updated', 'Success');
      },
      (error) => {
        this.toastr.error('Error While Updating Car', 'Error');
        console.log(error);
      }

    );
  }





}
