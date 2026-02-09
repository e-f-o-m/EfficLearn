import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'br',
  standalone: true,
})
export class BrPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\\n/g, '<br>');
  }
}