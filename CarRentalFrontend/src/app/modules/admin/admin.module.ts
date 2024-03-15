import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { PostCarComponent } from './Components/post-car/post-car.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateCarComponent } from './Components/update-car/update-car.component';
import { GetCustomerBookingsComponent } from './Components/get-customer-bookings/get-customer-bookings.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { ShowProfileComponent } from './Components/profile/show-profile/show-profile.component';
import { UpdateProfileComponent } from './Components/profile/update-profile/update-profile.component';
import { SupportComponent } from './Components/profile/support/support.component';
import { SettingsComponent } from './Components/profile/settings/settings.component';
import { ListCustomerComponent } from './Components/profile/list-customer/list-customer.component';
import { SeeAllFeedbacksComponent } from './Components/profile/see-all-feedbacks/see-all-feedbacks.component';
import { FooterComponent } from 'src/app/footer/footer.component';
import { AllPaymentsComponent } from './Components/profile/all-payments/all-payments.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    PostCarComponent,
    UpdateCarComponent,
    GetCustomerBookingsComponent,
    ProfileComponent,
    ShowProfileComponent,
    UpdateProfileComponent,
    SupportComponent,
    SettingsComponent,
    ListCustomerComponent,
    SeeAllFeedbacksComponent,
    AllPaymentsComponent,
   
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,

  ]
})
export class AdminModule { }
