import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './core/interceptors/AuthInterceptor';
import { LoaderInterceptor } from './core/interceptors/loaderInterceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, // Required for running the app in the browser
    CommonModule,
    AppRoutingModule, // Handles routing
    FormsModule, // For template-driven forms
    ReactiveFormsModule,
  ],

  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor, LoaderInterceptor])
    ),
    CookieService,
  ],
  bootstrap: [AppComponent],
  // Removed bootstrap array as AppComponent is a standalone component
})
export class AppModule {}
