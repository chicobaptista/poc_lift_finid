import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CordaService } from 'src/app/services/corda.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  balance$;

  constructor(
    private cordaSv: CordaService
  ) {}

  ionViewDidEnter() {
    this.getBalance();
  }

  getBalance() {
    const user = JSON.parse(localStorage.getItem('userId'));
    this.cordaSv.getUserBalance(user.userGovId)
    .then((res) => {
      this.cordaSv.balance$.subscribe(balance => this.balance$ = balance);
    });
  }

}
