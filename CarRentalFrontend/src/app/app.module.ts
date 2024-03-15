import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtModule } from '@auth0/angular-jwt';
import { SignupComponent } from './auth/components/signup/signup.component';
import { LoginComponent } from './auth/components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './navbarComponents/home/home.component';
import { AuthGuard } from './auth/Services/auth/auth.guard';
import { StorageService } from './auth/Services/storage/storage.service';
import { AboutComponent } from './navbarComponents/about/about.component';
import { SignupAdminComponent } from './auth/components/signup/signup-admin/signup-admin.component';
import { FooterComponent } from './footer/footer.component';
import { FooteradmincustComponent } from './modules/footeradmincust/footeradmincust.component';
import { ContactComponent } from './navbarComponents/contact/contact.component';
import { ForgetPasswordComponent } from './auth/components/login/forget-password/forget-password.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
export function tokenGetter() {
  return StorageService.getToken();
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    AboutComponent,
    SignupAdminComponent,
    FooterComponent,
    FooteradmincustComponent,
    ContactComponent,
    ForgetPasswordComponent,

  ],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["https://localhost:44331"],
        disallowedRoutes: []
      }
    }),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000, // Set the duration to 2 seconds
      positionClass: 'toast-bottom-right', // Optional: Set the position of the Toastr notification
      preventDuplicates: true, // Optional: Prevent duplicate notifications
      progressBar: true // Optional: Display a progress bar
    })
  ],

  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
