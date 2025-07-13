import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  standalone: false,

})
export class HeroComponent implements OnInit, OnDestroy {
  private scrollListener?: () => void;

  ngOnInit() {
    // Add subtle parallax effect to hero image
    this.scrollListener = () => {
      const scrolled = window.pageYOffset;
      const heroImg = document.querySelector('.hero img') as HTMLElement;
      if (heroImg) {
        heroImg.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    };
    
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }
}