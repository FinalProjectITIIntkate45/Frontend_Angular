import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinebreaksPipe } from './pipes/linebreaks.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [LinebreaksPipe],
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  exports: [LinebreaksPipe, MatIconModule, MatProgressSpinnerModule],
})
export class SharedModule {}
