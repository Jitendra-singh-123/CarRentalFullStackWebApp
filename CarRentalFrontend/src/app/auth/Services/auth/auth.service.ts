import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly ApiUrlCust = "https://localhost:44331/api/Customers";
  readonly ApiUrlAdmin = "https://localhost:44331/api/Admins";
  readonly ApiUrlUser = "https://localhost:44331/api/Logins";
  constructor(private http: HttpClient) {
  }

  register(signupRequest): any {
    return this.http.post(this.ApiUrlCust, signupRequest);
  }

  registerAdmin(signupRequest): any {
    return this.http.post(this.ApiUrlAdmin, signupRequest);

  }
  login(loginRequest: any): Observable<any> {
    return this.http.post(this.ApiUrlUser, loginRequest);
  }
  forgetPassword(email: string, newPassword: string,rePassword:string,role:string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { Email: email, Password: newPassword,RePassword:rePassword,Role:role }; // Define the request body
    return this.http.put(this.ApiUrlUser + "/ChangePassword/" + 2, body, { headers: headers });
  }
}
