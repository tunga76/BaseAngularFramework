import { Directive, ElementRef, Input } from "@angular/core";

@Directive({
    selector: '[appReadonly]',
    standalone: true
})
export class ReadonlyDirective {

    @Input() appReadonly = false;

    constructor(private el: ElementRef) { }

    ngOnChanges() {
        const element = this.el.nativeElement;

        if (this.appReadonly) {
            element.style.pointerEvents = 'none';
            element.style.backgroundColor = '#eee';
        } else {
            element.style.pointerEvents = 'auto';
            element.style.backgroundColor = 'white';
        }
    }
}
