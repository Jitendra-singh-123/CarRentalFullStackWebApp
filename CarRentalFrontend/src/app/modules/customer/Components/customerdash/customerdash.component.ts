import { Component } from '@angular/core';
import { CustomerService } from '../../Services/customer.service';

@Component({
  selector: 'app-customerdash',
  templateUrl: './customerdash.component.html',
  styleUrl: './customerdash.component.css'
})
export class CustomerdashComponent {
cars: any[];

constructor(private service:CustomerService) {
  
}
ngOnInit() {
  this.getAllCars();
}
getAllCars(): void {
  this.service.getAllCars().subscribe(
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
      console.error('Error fetching cars:', error);
    }
  );
}
}
