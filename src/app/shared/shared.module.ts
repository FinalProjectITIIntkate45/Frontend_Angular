import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinebreaksPipe } from './pipes/linebreaks.pipe';

@NgModule({
  declarations: [LinebreaksPipe],
  imports: [CommonModule],
  exports: [LinebreaksPipe],
})
export class SharedModule {}
