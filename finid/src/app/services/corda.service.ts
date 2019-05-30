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
        .subscribe(
          (res: any) => {
            console.log(res); // DEVLOG
            resolve(res);
          },
          (err: any) => {
            console.log(err); // DEVLOG
            reject(err);
          });
    });
  }

  getUserBalance(uid) {
    return new Promise((resolve, reject) => {
      const head = {
        'Access-Control-Request-Origin': '*'
      };
      this.http.get(`${environment.cordaApi}/balance/${uid}`, {headers: head})
        .subscribe(
          (res: any) => {
            console.log(res); // DEVLOG
            const balance = res.entity.data.account.balance;
            this.balance$.next(balance);
            resolve();
          },
          (err: any) => {
            console.log(err); // DEVLOG
            reject(err);
          });
    });
  }

  startPayment(paymentData: { accountFromId: string, to: string, orgTo: string, amount: number, did: string }) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.cordaApi}/make-transfer`, paymentData)
        .subscribe(
          (res: any) => {
            console.log(res); // DEVLOG
            resolve(res);
          },
          (err: any) => {
            console.log(err); // DEVLOG
            reject(err);
          });
    });
  }

}
