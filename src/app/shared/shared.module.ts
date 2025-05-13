import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';

@NgModule({
  declarations: [SidebarComponent, TopNavigationComponent],
  imports: [CommonModule],
  exports: [SidebarComponent, TopNavigationComponent],
})
export class SharedModule {}
