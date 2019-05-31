import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.scss'],
})
export class NewPaymentComponent implements OnInit {

  @Input() linearId;
  @Input() bank;

  bankList = environment.cordaOrgs;

  paymentForm = new FormGroup({
    orgFrom: new FormControl(),
    amount: new FormControl(),
    orgTo: new FormControl()
  });

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.paymentForm.patchValue({
      orgFrom: this.bank
    });
  }

  startPayment() {
    const paymentData = {
      accountFromId: this.linearId,
      // to: '' // TODO: refatorar para buscar linearId do destinatário
      orgTo: this.paymentForm.value.orgTo,
      amount: this.paymentForm.value.amount,
      did: '123' // TODO: refatorar para did indy
    };
    this.modalCtrl.dismiss(paymentData);
  }

}
