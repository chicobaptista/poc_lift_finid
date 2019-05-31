import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-bank',
  templateUrl: './new-bank.component.html',
  styleUrls: ['./new-bank.component.scss'],
})
export class NewBankComponent implements OnInit {

  bankForm = new FormGroup({
    bank: new FormControl()
  });

  bankList = environment.cordaOrgs;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  chooseBank() {
    this.modalCtrl.dismiss(this.bankForm.value);
  }

}
