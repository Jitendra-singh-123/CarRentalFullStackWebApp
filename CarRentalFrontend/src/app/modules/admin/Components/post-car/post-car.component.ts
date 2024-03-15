import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AdminService } from '../../Services/admin.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-car',
  templateUrl: './post-car.component.html',
  styleUrls: ['./post-car.component.css']
})
export class PostCarComponent {

  selectedFile: File = null;
  addCarForm: FormGroup;
  imagePreview: string | ArrayBuffer;
  document: any;

  constructor(private fb: FormBuilder, private service: AdminService, private router: Router,private toastr: ToastrService) { }

  ngOnInit() {
    this.addCarForm = this.fb.group({
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

  addCar() {
    const formData: FormData = new FormData();
    formData.append('img', this.selectedFile);
    formData.append('make', this.addCarForm.get('make').value);
    formData.append('model', this.addCarForm.get('model').value);
    formData.append('location', this.addCarForm.get('location').value);
    formData.append('specifications', this.addCarForm.get('specifications').value);
    formData.append('dailyRate', this.addCarForm.get('dailyRate').value);
    formData.append('availableFrom', this.addCarForm.get('availableFrom').value);
    formData.append('availableTo', this.addCarForm.get('availableTo').value);
    formData.append('carPlateNumber', this.addCarForm.get('carPlateNumber').value);
    formData.append('status', this.addCarForm.get('status').value);
    formData.append('year', this.addCarForm.get('year').value);
    formData.append('color', this.addCarForm.get('color').value);
    formData.append('mileage', this.addCarForm.get('mileage').value);
    formData.append('carType', this.addCarForm.get('carType').value);
    formData.append('transmission', this.addCarForm.get('transmission').value);
    formData.append('maintenanceStatus', this.addCarForm.get('maintenanceStatus').value);

    this.service.addCar(formData).subscribe(
      (res) => {
        this.router.navigateByUrl('/admin/dashboard');
        this.toastr.success('Car Added', 'Success');
      
      },
      (error: HttpErrorResponse) => {
        if (error.status === 409) {
          if (error.error === "Car Plate Number Already exists") {
            this.toastr.info('Car Plate Number Already exists', 'Notification');
          } else {
            this.toastr.error("An error occurred during registration", 'Error');
            console.log(error);
          }
        } else {
          this.toastr.error("An error occurred during registration", 'Error');
          console.log(error);
        }
      }

    );
  }
}
