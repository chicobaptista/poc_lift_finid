import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CordaService } from 'src/app/services/corda.service';
import { ModalController } from '@ionic/angular';
import { NewBankComponent } from 'src/app/modals/new-bank/new-bank.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  balance$ = [];
  banks$ = [];

  constructor(
    private cordaSv: CordaService,
    private modalCtrl: ModalController
  ) {}

  ionViewDidEnter() {
    this.getBanks();
    this.getBalance();
  }

  getBalance() {
    const user = JSON.parse(localStorage.getItem('userId'));
    this.banks$.forEach(bank => {
      this.cordaSv.getUserBalance(user.uid, bank)
      .then((res) => {
        this.balance$[bank] = res;
      });
    });
  }

  getBanks() {
    const bankList = JSON.parse(localStorage.getItem('bankList'));
    if (bankList) {
      this.banks$ = bankList;
    }
    console.log(this.banks$); // DEVLOG
  }

  openPaymentModal() {
    console.log('pay modal click');
  }

  async openBankModal() {
    console.log('bank modal click');
    const bankM = await this.modalCtrl.create({
      component: NewBankComponent,
      cssClass: 'bank-modal'
    });
    bankM.present();
    bankM.onDidDismiss().then((res: any) => {
      const bank = res.data.bank;
      console.log(bank); // DEVLOG
      if (bank && !this.banks$.find(el => el === bank)) {
        this.banks$.push(bank);
        localStorage.setItem('bankList', JSON.stringify(this.banks$));
        this.createNewBankAccount(bank);
        this.getBanks();
        this.getBalance();
      }
    });
  }

  createNewBankAccount(bank) {
    const user = JSON.parse(localStorage.getItem('userId'));
    this.cordaSv.createUser(user, 1000.00, bank);
  }

}
