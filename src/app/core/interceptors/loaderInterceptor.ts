import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/internal/operators/finalize';
import { LoaderService } from '../services/loader.service';

export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(LoaderService);

  service.show();

  return next(req).pipe(
    finalize(() => {
      service.hide();
    })
  );
}