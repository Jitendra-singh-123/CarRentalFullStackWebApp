import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
 {path:'dashboard',component:CustomerdashComponent},
 {path:'book/:id',component:BookCarComponent},
 {path:'myBookings',component:MyBookingsComponent},
 {path:'profile',component:ProfileComponent},
 {path:'bookings',component:AllBookingComponent},
 {path:'postFeedback/:carId',component:PostFeedbackComponent},
 {path:'payments',component:PaymentsComponent},
 {path:'myfeedbacks',component:MyFeedbacksComponent},
 { path: '', redirectTo: '/profile', pathMatch: 'full' },
 { 
  path: 'profile', 
  component: ProfileComponent,
  children: [
    {path:'showProfile',component:ShowProfileComponent},
    { path: 'bookings', component: AllBookingComponent } ,
    {path:'updateProfile',component:UpdateProfileComponent},
    {path:'support',component:SuportComponent},
    {path:'termsconidtion',component:TermAndConditionsComponent},
    {path:'deleteProfile',component:SettingsComponent},
    {path:'payments',component:MyBookingsComponent},
    {path:'myfeedbacks',component:MyFeedbacksComponent},
 
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
