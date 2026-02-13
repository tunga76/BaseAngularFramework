import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'thousandSeparator',
    standalone: true
})
export class ThousandSeparatorPipe implements PipeTransform {
    transform(value: number): string {
        if (value == null) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
}
