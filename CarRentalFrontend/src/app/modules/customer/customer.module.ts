import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerdashComponent } from './Components/customerdash/customerdash.component';
import { BookCarComponent } from './Components/book-car/book-car.component';
import { MyBookingsComponent } from './Components/my-bookings/my-bookings.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { AllBookingComponent } from './Components/profile/all-booking/all-booking.component';
import { UpdateProfileComponent } from './Components/profile/update-profile/update-profile.component';
import { SuportComponent } from './Components/profile/suport/suport.component';
import { TermAndConditionsComponent } from './Components/profile/term-and-conditions/term-and-conditions.component';
import { SettingsComponent } from './Components/profile/settings/settings.component';
import { PostFeedbackComponent } from './Components/profile/post-feedback/post-feedback.component';
import { ShowProfileComponent } from './Components/profile/show-profile/show-profile.component';
import { PaymentsComponent } from './Components/payments/payments.component';
import { MyFeedbacksComponent } from './Components/profile/my-feedbacks/my-feedbacks.component';

@NgModule({
  declarations: [
    CustomerdashComponent,
    BookCarComponent,
    MyBookingsComponent,
    ProfileComponent,
    AllBookingComponent,
    UpdateProfileComponent,
    SuportComponent,
    TermAndConditionsComponent,
    SettingsComponent,
    PostFeedbackComponent,
    ShowProfileComponent,
    PaymentsComponent,
    MyFeedbacksComponent,
  ],
  imports: [

    CustomerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    
  ],
 
 
})
export class CustomerModule { 


}
