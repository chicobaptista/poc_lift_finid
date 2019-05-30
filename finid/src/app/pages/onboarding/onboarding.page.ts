import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IndyService } from 'src/app/services/indy.service';
import { CordaService } from 'src/app/services/corda.service';
import { Router } from '@angular/router';

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
    private router: Router,
  ) { }

  ngOnInit() {
  }

  signup() {
    this.indySv.createBankProfile()
      .then((profile: any) => {
        console.log(profile); // DEVLOG
        const userData = {
          uid: this.signupForm.value.govId,
          name: this.signupForm.value.name,
          did: profile.did,
          balance: 1000.00
        };
        this.cordaSv.createUser(userData)
        .then((res: any) => {
          console.log(res); // DEVLOG
          const userId = {
            userDid: profile.did,
            userGovId: this.signupForm.value.govId,
            userName: this.signupForm.value.name
          };
          localStorage.setItem('userId', JSON.stringify(userId));
          this.router.navigate(['/home']);
        })
        .catch(err => {
          console.log(err); // DEVLOG
        });
      });
  }
}
