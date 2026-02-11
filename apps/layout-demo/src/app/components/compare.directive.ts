import { Directive, Input, ViewContainerRef, TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Directive({
    selector: '[appCompare]',
    standalone: true
})
export class CompareDirective {

    @Input() appCompare!: {
        form: FormGroup,
        control: string,
        compareTo: string
    };

    constructor(private vcr: ViewContainerRef, private tpl: TemplateRef<any>) { }

    ngDoCheck() {
        const { form, control, compareTo } = this.appCompare;

        const value1 = form.get(control)?.value;
        const value2 = form.get(compareTo)?.value;

        this.vcr.clear();

        if (value1 && value2 && value1 !== value2) {
            this.vcr.createEmbeddedView(this.tpl);
        }
    }
}
