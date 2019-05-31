import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { NewBankComponent } from 'src/app/modals/new-bank/new-bank.component';
import { NewPaymentComponent } from 'src/app/modals/new-payment/new-payment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, NewBankComponent, NewPaymentComponent],
  entryComponents: [
    NewBankComponent,
    NewPaymentComponent,
  ]
})
export class HomePageModule {}
