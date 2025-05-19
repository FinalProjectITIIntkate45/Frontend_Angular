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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
<<<<<<< HEAD
  declarations: [AppComponent],
=======
  declarations:[
    AppComponent,

  ],
>>>>>>> d9bf3feb5dddd515a28e552535b5ca98709470d7
  imports: [
    BrowserModule, // Required for running the app in the browser
    CommonModule,
    AppRoutingModule, // Handles routing
    FormsModule, // For template-driven forms
<<<<<<< HEAD
    ReactiveFormsModule,
=======
    ReactiveFormsModule ,
    BrowserAnimationsModule, // مهم جدًا
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true
    }),
>>>>>>> d9bf3feb5dddd515a28e552535b5ca98709470d7
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
