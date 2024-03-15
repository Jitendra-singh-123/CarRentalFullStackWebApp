import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './auth/components/signup/signup.component';
import { LoginComponent } from './auth/components/login/login.component';
import { HomeComponent } from './navbarComponents/home/home.component';
import { AuthGuard } from './auth/Services/auth/auth.guard';
import { AboutComponent } from './navbarComponents/about/about.component';
import { SignupAdminComponent } from './auth/components/signup/signup-admin/signup-admin.component';
import { ContactComponent } from './navbarComponents/contact/contact.component';
import { ForgetPasswordComponent } from './auth/components/login/forget-password/forget-password.component';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"home",component:HomeComponent},
{path:"register",component:SignupComponent},
{path:"forgetPassword",component:ForgetPasswordComponent},
{path:"signupAdmin",component:SignupAdminComponent},
{path:"login",component:LoginComponent},
{path:"about",component:AboutComponent},
{path:"contact",component:ContactComponent},
{path:"admin",loadChildren: () => import("./modules/admin/admin.module").then(m => m.AdminModule),canActivate:[AuthGuard]},
{path:"customer",loadChildren: () => import("./modules/customer/customer.module").then(m => m.CustomerModule),canActivate:[AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
