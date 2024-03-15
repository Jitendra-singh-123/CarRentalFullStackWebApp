import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { PostCarComponent } from './Components/post-car/post-car.component';
import { UpdateCarComponent } from './Components/update-car/update-car.component';
import { GetCustomerBookingsComponent } from './Components/get-customer-bookings/get-customer-bookings.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { ShowProfileComponent } from './Components/profile/show-profile/show-profile.component';
import { UpdateProfileComponent } from './Components/profile/update-profile/update-profile.component';
import { SupportComponent } from './Components/profile/support/support.component';
import { SettingsComponent } from './Components/profile/settings/settings.component';
import { ListCustomerComponent } from './Components/profile/list-customer/list-customer.component';
import { SeeAllFeedbacksComponent } from './Components/profile/see-all-feedbacks/see-all-feedbacks.component';
import { AllPaymentsComponent } from './Components/profile/all-payments/all-payments.component';

const routes: Routes = [
  {path:"dashboard",component:AdminDashboardComponent},
  {path:"car",component:PostCarComponent},
  {path:"car/:id",component:UpdateCarComponent},
  {path:"customerBookings",component:GetCustomerBookingsComponent},
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { 
   path: 'profile', 
   component: ProfileComponent,
   children: [
     {path:'showProfile',component:ShowProfileComponent},
     {path:'updateProfile',component:UpdateProfileComponent},
    {path:'support',component:SupportComponent},
    {path:'deleteProfile',component:SettingsComponent},
   {path:'bookings',component:GetCustomerBookingsComponent},
   {path:'allCustomers',component:ListCustomerComponent},
   {path:'seeAllFeedbacks',component:SeeAllFeedbacksComponent},
   {path:'paymentHistory',component:AllPaymentsComponent}
   ]
 }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
