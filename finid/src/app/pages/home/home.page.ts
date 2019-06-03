import { Component } from '@angular/core';
import { CordaService } from 'src/app/services/corda.service';
import { ModalController } from '@ionic/angular';
import { NewBankComponent } from 'src/app/modals/new-bank/new-bank.component';
import { NewPaymentComponent } from 'src/app/modals/new-payment/new-payment.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  state$ = [];
  banks$ = [];

  constructor(
    private cordaSv: CordaService,
    private modalCtrl: ModalController
  ) { }

  ionViewDidEnter() {
    this.getBanks();
    this.getBalance();
  }

  getBalance() {
    const user = JSON.parse(localStorage.getItem('userId'));
    this.banks$.forEach(bank => {
      this.cordaSv.getUserBalance(user.uid, bank)
        .then((res) => {
          this.state$[bank] = res;
          // console.log(this.state$);
          // console.log(this.state$[bank].account.balance);
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

  async openPaymentModal(bankName, id) {
    console.log('pay modal click'); // DEVLOG
    const paymentM = await this.modalCtrl.create({
      component: NewPaymentComponent,
      cssClass: 'bank-modal',
      componentProps: {
        bank: bankName,
        linearId: id
      }
    });
    paymentM.present();
    paymentM.onDidDismiss().then((res) => {
      const payment = res.data;
      console.log(payment); // DEVLOG
      this.getUserId(payment.to, payment.orgTo)
      .then(linearId => {
        console.log(linearId); // DEVLOG
        const paymentData = {
          accountFromId: id,
          to: linearId,
          orgTo: payment.orgTo,
          amount: payment.amount,
          did: 'payment123',
        };
        this.cordaSv.startPayment(paymentData)
        .then(transferReceipt => {
          // TODO: Adicionar aviso ao usuário do retorno da transferência no corda.
          console.log(transferReceipt); // DEVLOG
        });
      });
    });
  }

  async openBankModal() {
    console.log('bank modal click'); // DEVLOG
    const bankM = await this.modalCtrl.create({
      component: NewBankComponent,
      cssClass: 'bank-modal'
    });
    bankM.present();
    bankM.onDidDismiss().then((res: any) => {
      const bank = res.data.bank;
      console.log(bank); // DEVLOG
      this.addNewBank(bank);
    });
  }

  private addNewBank(bank) {
    if (bank && !this.banks$.find(el => el === bank)) {
      this.banks$.push(bank);
      localStorage.setItem('bankList', JSON.stringify(this.banks$));
      this.createNewBankAccount(bank);
      this.getBanks();
      this.getBalance();
    }
  }

  private createNewBankAccount(bank) {
    const user = JSON.parse(localStorage.getItem('userId'));
    this.cordaSv.createUser(user, 1000.00, bank);
  }

  private getUserId(govId, bank): Promise<string> {
    return new Promise((resolve, reject) => {
      this.cordaSv.getUserBalance(govId, bank)
      .then((res: any) => {
        resolve(res.linearId.id);
      });
    });
  }

}
