import { Component } from '@angular/core';
import { CustomerService } from '../../../Services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-feedback',
  templateUrl: './post-feedback.component.html',
  styleUrls: ['./post-feedback.component.css']
})
export class PostFeedbackComponent {

  rating: number;
  review: any;
  carId: number;
  
  constructor(private service: CustomerService, private activateRoute: ActivatedRoute,private router:Router,private toastr: ToastrService) {
    this.rating = 0;
    this.review = '';
    this.carId = this.activateRoute.snapshot.params["carId"];
  }

  rate(stars: number): void {
    if (this.rating === stars) {
      // If the same star is clicked again, deselect it
      this.rating = 0;
    } else {
      this.rating = stars;
    }
  }

  postFeedback(): void {
    const feedback = {
      CarID: this.carId,
      Rating: this.rating,
      Review: this.review,
      ReviewDateTime: new Date()
    };
    this.service.postFeedback(feedback).subscribe((res) => {
      this.router.navigateByUrl("/customer/myfeedbacks");
      this.toastr.success('Feedback Posted Successfully"', 'Success');
    },err=>{
      console.log("Error " + err);
    })
  }
}
