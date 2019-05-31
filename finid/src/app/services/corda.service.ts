import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import * as $ from 'jquery';


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

      const endpoint = `${environment.cordaApi}/balance/${uid}`;
      $.ajax({
        async: true,
        crossDomain: true,
        url: endpoint,
        type: 'GET',
        success: (response) => {
            return resolve(response);
        }
    }).fail((jqXHR, textStatus, err) => {
        console.log('Status: ', textStatus);
        console.log('Error: ', err);
        console.log('Message: ', jqXHR.responseText);
        return reject(jqXHR.responseText);
    });

      // const head = {
      //   'Access-Control-Request-Origin': '*'
      // };
      // this.http.get(`https://crossorigin.me/${environment.cordaApi}/balance/${uid}`, {headers: head})
      //   .subscribe(
      //     (res: any) => {
      //       console.log(res); // DEVLOG
      //       const balance = res.entity.data.account.balance;
      //       this.balance$.next(balance);
      //       resolve();
      //     },
      //     (err: any) => {
      //       console.log(err); // DEVLOG
      //       reject(err);
      //     });
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
