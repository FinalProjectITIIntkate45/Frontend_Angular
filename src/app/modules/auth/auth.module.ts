import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from '../../core/interceptors/AuthInterceptor';
import { LoaderInterceptor } from '../../core/interceptors/loaderInterceptor';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [CommonModule, FormsModule, AuthRoutingModule],
  providers:[provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor,LoaderInterceptor])
    ),]
})
export class AuthModule {}
