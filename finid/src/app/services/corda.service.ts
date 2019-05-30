import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CordaService {

  balance$ = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  createUser(data: { uid: string, name: string, did: string, balance: number }) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.cordaApi}/create-account`, data)
        .subscribe((res: any) => {
          console.log(res); // DEVLOG
          resolve(res);
        });
    });
  }

  getUserBalance(uid) {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.cordaApi}/balance/${uid}`)
        .subscribe((res: any) => {
          console.log(res); // DEVLOG
          this.balance$.next(res);
          resolve();
        });
    });
  }

  startPayment(paymentData: { uidFrom: string, uidTo: string, orgTo: string, amount: number }) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.cordaApi}/make-transfer`, paymentData)
        .subscribe((res: any) => {
          console.log(res); // DEVLOG
          resolve(res);
        });
    });
  }

}
