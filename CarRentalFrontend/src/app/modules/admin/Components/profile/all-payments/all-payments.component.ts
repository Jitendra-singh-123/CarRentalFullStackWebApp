import { Component } from '@angular/core';
import { AdminService } from '../../../Services/admin.service';

@Component({
  selector: 'app-all-payments',
  templateUrl: './all-payments.component.html',
  styleUrl: './all-payments.component.css'
})
export class AllPaymentsComponent {
  payments: any[];
  bookings:any;
  constructor(private service: AdminService) {
    this.getAllPayments();
  }

  getAllPayments() {
  
    this.service.getAllPayments().subscribe(
      (res) => {
        this.bookings=res;
        this.payments = this.groupPaymentsByCustomer(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // Function to group payments by CustomerId
  groupPaymentsByCustomer(payments: any[]): any[] {
    const groupedPayments = [];
    const groupedByCustomer = {};

    // Group payments by CustomerId
    payments.forEach((payment) => {
      const customerId = payment.Customer?.CustomerId; // Adjust here to access CustomerId property
      if (!groupedByCustomer[customerId]) {
        groupedByCustomer[customerId] = [];
      }
      groupedByCustomer[customerId].push(payment);
    });

    // Convert object to array
    for (const customerId in groupedByCustomer) {
      if (groupedByCustomer.hasOwnProperty(customerId)) {
        groupedPayments.push({
          customerId: customerId,
          customerName: groupedByCustomer[customerId][0].Customer?.FirstName + ' ' + groupedByCustomer[customerId][0].Customer?.LastName, // Adjust here to access FirstName and LastName properties
          payments: groupedByCustomer[customerId]
        });
      }
    }

    return groupedPayments;
  }
}
