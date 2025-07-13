import { Component } from '@angular/core';

interface Benefit {
  text: string;
}

@Component({
  selector: 'app-call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css'],
  standalone : false
})
export class CallToActionComponent {
  benefits: Benefit[] = [
    { text: 'No monthly fees or hidden charges' },
    { text: 'Instant cashback on every purchase' },
    { text: 'Support your favorite charities' },
    { text: 'Access to exclusive deals and offers' }
  ];

  onSignUpFree() {
    console.log('Sign Up for Free clicked');
  }
}