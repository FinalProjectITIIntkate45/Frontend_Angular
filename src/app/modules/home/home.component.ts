import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HeaderComponent } from '../home/components/header/header.component';
import { HeroComponent } from '../home/components/hero/hero.component';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}

export class App {
  constructor() {
    // Add loading animation
    setTimeout(() => {
      document.body.classList.add('loading');
    }, 0);

    // Smooth scroll for navigation links
    setTimeout(() => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector((e.target as HTMLAnchorElement).getAttribute('href') as string);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }, 100);
  }
}

bootstrapApplication(App);