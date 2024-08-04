import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../auth/Services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  ApiURL: string = 'https://localhost:44331/api/CarListings';
  ApiURLBook: string = 'https://localhost:44331/api/Reservations';
  ApiURLFeedback: string = 'https://localhost:44331/api/Feedbacks';
  ApiURLCustomer: string = 'https://localhost:44331/api/Customers';
  ApiURLPayments:string='https://localhost:44331/api/PaymentDetails';



  
  constructor(private http: HttpClient) { }

  getAllCars(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.get(this.ApiURL, { headers });
  }
  getCarById(id: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.get(`${this.ApiURL}/${id}`, { headers });
  }

  getCarFeedbacks(CarId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.get(`${this.ApiURLFeedback}/GetFeedbacksForCar/${CarId}`, { headers });
  }

  postFeedback(feedbackObj: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    let userId;
    userId = StorageService.getUserId();
    feedbackObj.CustomerId=userId;
    return this.http.post(this.ApiURLFeedback,feedbackObj ,{headers});
  }


  bookCar(bookCarData: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.post(this.ApiURLBook, bookCarData, { headers });
  }

  getBookingsByUserId(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    let userId;
    userId = StorageService.getUserId();
    return this.http.get(this.ApiURLBook + "/customer/" + userId, { headers });
  }

  deleteReservation(reservationId): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.delete(`${this.ApiURLBook}/${reservationId}`, { headers });

  }

  updateReservation(reservationId, bookingObj): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.put(`${this.ApiURLBook}/${reservationId}`, bookingObj, { headers });
  }


  getProfileByUserId(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    let userId;
    userId = StorageService.getUserId();
    return this.http.get(`${this.ApiURLCustomer}/${userId}`, { headers });
  }

  updateProfileByUserId(customerObj: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.put(`${this.ApiURLCustomer}/${customerObj.CustomerId}`, customerObj, { headers });
  }

  deleteProfileByUserId(customerObj: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());

    return this.http.delete(`${this.ApiURLCustomer}/${customerObj.CustomerId}`, { headers });
  }

  payment(paymentObj:any):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    return this.http.post(this.ApiURLPayments, paymentObj,{ headers });

  }

  getMyFeedbacks():Observable<any>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
    let userId;
    userId = StorageService.getUserId();
    return this.http.get(this.ApiURLFeedback + "/GetFeedbacksByCustomerId/" + userId, { headers });

  }
  deleteFeedbackById(feedbackId):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());

    return this.http.delete(`${this.ApiURLFeedback}/${feedbackId}`, { headers });

  }

}

