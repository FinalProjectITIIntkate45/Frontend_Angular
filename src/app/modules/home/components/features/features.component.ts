import { Component } from '@angular/core';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
  color: string;
}

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],
  standalone: false,
})
export class FeaturesComponent {
  features: Feature[] = [
    {
      icon: 'bi-lightning-charge',
      title: 'Smart Cashback',
      description: 'Earn up to 15% cashback on every purchase with our intelligent reward system that maximizes your savings.'
    },
    {
      icon: 'bi-heart',
      title: 'Donations Made Easy',
      description: 'Convert your points to donations for your favorite charities with just one click. Make a difference effortlessly.'
    },
    {
      icon: 'bi-eye',
      title: 'Transparent Tracking',
      description: 'Real-time visibility into all your transactions, rewards, and donations with detailed analytics and insights.'
    },
    {
      icon: 'bi-shield-check',
      title: 'Trusted Partnerships',
      description: 'Shop with confidence through our network of verified merchants and established brand partnerships.'
    }
  ];

  stats: Stat[] = [
    { value: '50K+', label: 'Active Users', color: '#EFB036' },
    { value: '$2M+', label: 'Cashback Earned', color: '#023059' },
    { value: '500+', label: 'Partner Stores', color: '#EFB036' },
    { value: '$100K+', label: 'Donated to Charity', color: '#023059' }
  ];
}