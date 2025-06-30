import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'linebreaks' ,standalone:false})
export class LinebreaksPipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.replace(/\r?\n/g, '<br>') : '';
    
  }
} 