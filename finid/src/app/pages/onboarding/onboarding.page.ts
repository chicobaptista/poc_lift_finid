import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IndyService } from 'src/app/services/indy.service';
import { CordaService } from 'src/app/services/corda.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  signupForm = new FormGroup({
    govId: new FormControl(''),
    name: new FormControl('')
  });

  constructor(
    private indySv: IndyService,
    private cordaSv: CordaService,
  ) { }

  ngOnInit() {
  }

  signup() {
    this.indySv.createBankProfile()
      .then((profile: any) => {
        const userData = {
          uid: this.signupForm.value.govId,
          name: this.signupForm.value.name,
          did: profile.did,
          balance: 1000.00
        };
        this.cordaSv.createUser(userData);
      });
  }
}
