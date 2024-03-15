import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../auth/Services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  ApiURL: string = 'https://localhost:44331/api/CarListings';
  ApiURLBook: string = 'https://localhost:44331/api/Reservations';
  ApiURLAdmins: string = 'https://localhost:44331/api/Admins';
  ApiURLCustomers: string = 'https://localhost:44331/api/Customers';
  ApiURLFeedbacks: string = 'https://localhost:44331/api/Feedbacks';
  ApiURLPayments: string = 'https://localhost:44331/api/PaymentDetails';


  
  constructor(private http: HttpClient) { }

  addCar(formData: FormData): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.post(this.ApiURL, formData, { headers });
  }
  updateCar(id: number, formData: FormData): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.put(`${this.ApiURL}/${id}`, formData, { headers });
  }


  getAllCars(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());

    return this.http.get(this.ApiURL, { headers });
  }

  deleteCar(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());

    return this.http.delete(`${this.ApiURL}/${id}`, { headers });
  }

  getCarById(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());

    return this.http.get(`${this.ApiURL}/${id}`, { headers });
  }
  getCarBookings(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());

    return this.http.get(this.ApiURL, { headers });
  }

  getAllBookings(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    // let userId;
    // userId=StorageService.getUserId();
    return this.http.get(this.ApiURLBook + "/bookings", { headers });
  }

  updateReservationStatus(reservationObj): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    let ReservationID = reservationObj.ReservationID;
    return this.http.put(`${this.ApiURLBook}/${ReservationID}`, reservationObj, { headers });
  }
  deleteReservation(reservationId): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.delete(`${this.ApiURLBook}/${reservationId}`, { headers });

  }


  getProfileByAdminId() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    let userId;
    userId = StorageService.getUserId();
    return this.http.get(`${this.ApiURLAdmins}/${userId}`, { headers });
  }

  updateProfileByAdminId(adminObj): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.put(`${this.ApiURLAdmins}/${adminObj.AdminId}`, adminObj, { headers });
  }
  deleteProfileByUserId(adminObj) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());

    return this.http.delete(`${this.ApiURLAdmins}/${adminObj.AdminId}`, { headers });
  }

  getAllCustomer(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());

    return this.http.get(this.ApiURLCustomers, { headers });

  }

  deleteCustomer(custId): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.delete(`${this.ApiURLCustomers}/${custId}`, { headers });

  }


  getAllFeedbacks() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.get(this.ApiURLFeedbacks + "/GetAllFeedbacksForCars", { headers });
  }

  deleteFeedback(feedbackId:any):Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.delete(`${this.ApiURLFeedbacks}/${feedbackId}`, { headers });
  }

  getAllPayments():Observable<any>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.get(this.ApiURLPayments, { headers });

  }
}
