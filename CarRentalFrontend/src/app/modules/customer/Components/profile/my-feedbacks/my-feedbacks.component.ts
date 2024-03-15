import { Component } from '@angular/core';
import { CustomerService } from '../../../Services/customer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-feedbacks',
  templateUrl: './my-feedbacks.component.html',
  styleUrl: './my-feedbacks.component.css'
})
export class MyFeedbacksComponent {
  myFeedbacks:any;
  constructor(private service: CustomerService,private toastr: ToastrService) {
   this.getMyFeedbacks();
  }

  getMyFeedbacks(){
    this.service.getMyFeedbacks().subscribe((res)=>{
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
      this.myFeedbacks=res;
    })
  }

  deleteFeedback(feedbackId){
    this.service.deleteFeedbackById(feedbackId).subscribe((res)=>{
      this.toastr.success('Feedback Deleted Successfully"', 'Success');

      this.myFeedbacks = this.myFeedbacks.filter(feedback => feedback.FeedbackId !== feedbackId);
    })
  }
}
