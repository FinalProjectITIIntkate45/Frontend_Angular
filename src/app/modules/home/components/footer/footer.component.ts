import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface Link {
  name: string;
  href: string;
}

interface SocialLink {
  icon: string;
  href: string;
  name: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false,
})
export class FooterComponent {
  quickLinks: Link[] = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Contact Us', href: '#contact' },
    { name: 'FAQ', href: '#faq' }
  ];

  aboutLinks: Link[] = [
    { name: 'Our Story', href: '#story' },
    { name: 'Team', href: '#team' },
    { name: 'Careers', href: '#careers' },
    { name: 'Press', href: '#press' },
    { name: 'Blog', href: '#blog' },
    { name: 'Privacy Policy', href: '#privacy' }
  ];

  socialLinks: SocialLink[] = [
    { icon: 'bi-facebook', href: '#facebook', name: 'Facebook' },
    { icon: 'bi-twitter', href: '#twitter', name: 'Twitter' },
    { icon: 'bi-instagram', href: '#instagram', name: 'Instagram' },
    { icon: 'bi-linkedin', href: '#linkedin', name: 'LinkedIn' }
  ];

  email: string = '';

  onSubscribe() {
    if (this.email) {
      console.log('Newsletter subscription:', this.email);
      this.email = '';
    }
  }
}