import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/AuthInterceptor';
import { LoaderInterceptor } from './core/interceptors/loaderInterceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoaderComponent } from './core/components/loader/loader.component';
import { ProviderModule } from './modules/Providers/provider.module';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProviderModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
    }),
  ],
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor, LoaderInterceptor])
    ),
    CookieService,
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}