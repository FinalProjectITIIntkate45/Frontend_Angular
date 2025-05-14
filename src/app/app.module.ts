import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule, // Required for running the app in the browser
    AppRoutingModule, // Handles routing
    FormsModule, // For template-driven forms
    HttpClientModule, // For making HTTP requests
    AppComponent, // Import your standalone root component here
  ],

  providers: [],
  // Removed bootstrap array as AppComponent is a standalone component
})
export class AppModule {}
