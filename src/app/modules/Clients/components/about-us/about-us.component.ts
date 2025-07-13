import { Component, AfterViewInit } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements AfterViewInit {

  ngAfterViewInit() {
    // كود الانيميشن عند التمرير
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.feature-card, .team-member');
    elements.forEach(el => observer.observe(el));
  }

}
