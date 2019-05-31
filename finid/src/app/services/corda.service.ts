import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import * as $ from 'jquery';


@Injectable({
  providedIn: 'root'
})
export class CordaService {


  constructor(private http: HttpClient) { }

  createUser(data: { uid: string, name: string, did: string},  balance: number, bank: string) {
    return new Promise((resolve, reject) => {
      const newUser = {
        uid: data.uid,
        name: data.name,
        did: data.did,
        // tslint:disable-next-line:object-literal-shorthand
        balance: balance,
      };
      const bankApi = environment.cordaOrgs.find((element) => {
        return element.name === bank;
      }).cordaApi;
      this.http.post(`${bankApi}/create-account`, newUser)
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

  getUserBalance(uid, bank) {
    return new Promise((resolve, reject) => {

      const head = {
        'Access-Control-Request-Origin': '*'
      };
      const bankApi = environment.cordaOrgs.find((element) => {
        return element.name === bank;
      }).cordaApi;
      this.http.get(`${bankApi}/balance/${uid}`, { headers: head })
        .subscribe(
          (res: any) => {
            console.log(res); // DEVLOG
            const data = res.entity[0].state.data;
            resolve(data);
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
