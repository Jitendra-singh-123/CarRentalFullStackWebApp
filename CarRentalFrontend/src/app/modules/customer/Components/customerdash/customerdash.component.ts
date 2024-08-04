import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../Services/customer.service';

@Component({
  selector: 'app-customerdash',
  templateUrl: './customerdash.component.html',
  styleUrls: ['./customerdash.component.css']
})
export class CustomerdashComponent implements OnInit {
  cars: any[] = [];
  sortCriteria: string = 'DailyRate';
  sortDirection: string = 'asc';

  constructor(private service: CustomerService) {}

  ngOnInit() {
    this.getAllCars();
  }

  getAllCars(): void {
    this.service.getAllCars().subscribe(
      (res: any[]) => {
        this.cars = res.map(car => {
          if (car.ImageUrl && car.ImageUrl.startsWith('https')) {
            car.processedImg = car.ImageUrl;
          } else {
            car.processedImg = 'data:image/jpeg;base64,' + car.ImageUrl;
          }
          return car;
        });
        this.sortCars(); // Ensure sorting happens after fetching data
      },
      (error: any) => {
        console.error('Error fetching cars:', error);
      }
    );
  }

  sortCars(): void {
    this.cars.sort((a, b) => {
      let comparison = 0;
      if (a[this.sortCriteria] > b[this.sortCriteria]) {
        comparison = 1;
      } else if (a[this.sortCriteria] < b[this.sortCriteria]) {
        comparison = -1;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  setSortCriteria(criteria: string): void {
    if (this.sortCriteria === criteria) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortCriteria = criteria;
      this.sortDirection = 'asc';
    }
    this.sortCars();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortCars();
  }
}
