import { Component, ChangeDetectionStrategy, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../../shared/ui/form/form-field/form-field.component';
import { FormStoreService } from '../../../../shared/ui/form/services/form-store.service';
import { TableComponent } from '@platform/ui-platform';
import { GiriscikisTransaction } from '../../model/giriscikis-transaction.model';

@Component({
    selector: 'app-giriscikisyonetim',
    standalone: true,
    imports: [
        CommonModule,
        FormFieldComponent,
        ReactiveFormsModule,
        TableComponent
    ],
    templateUrl: './giriscikisyonetim.component.html',
    styleUrl: './giriscikisyonetim.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiriscikisyonetimComponent implements OnInit {
    private formStore = inject(FormStoreService);

    documentImage: string = 'assets/images/resimyok.jpg';
    isCamera: boolean = false;
    GIRIS_CIKIS_FORM_ID = 'giriscikis-form';

    @Input() readonly = false;

    frm!: FormGroup;
    formState = this.formStore.select(this.GIRIS_CIKIS_FORM_ID);

    // Mock transactions
    transactions = signal<GiriscikisTransaction[]>([
        {
            id: '1',
            seriNo: 'TR-A123456',
            kimlikNo: '12345678901',
            ad: 'AHMET',
            soyad: 'YILMAZ',
            ulke: 'TUR',
            islemTarihi: new Date(),
            islemTuru: 'Giris',
            cinsiyet: 'E',
            dogumTarihi: '1985-05-15'
        },
        {
            id: '2',
            seriNo: 'DE-B987654',
            kimlikNo: '98765432109',
            ad: 'HANS',
            soyad: 'MÜLLER',
            ulke: 'DEU',
            islemTarihi: new Date(Date.now() - 3600000),
            islemTuru: 'Cikis',
            cinsiyet: 'E',
            dogumTarihi: '1990-11-22'
        },
        {
            id: '3',
            seriNo: 'TR-C112233',
            kimlikNo: '11122233344',
            ad: 'AYŞE',
            soyad: 'DEMİR',
            ulke: 'TUR',
            islemTarihi: new Date(Date.now() - 7200000),
            islemTuru: 'Giris',
            cinsiyet: 'K',
            dogumTarihi: '1995-03-10'
        }
    ]);

    ngOnInit(): void {
        this.frm = new FormGroup({
            SeriNo: new FormControl('', [Validators.required, Validators.minLength(2)]),
            KimlikNo: new FormControl('', [Validators.required, Validators.minLength(11)]),
            Ad: new FormControl('', [Validators.required, Validators.minLength(2)]),
            Soyad: new FormControl('', [Validators.required, Validators.minLength(2)]),
            Ulke: new FormControl('TUR', [Validators.required]),
            Cinsiyet: new FormControl('E', [Validators.required]),
            DogumTarihi: new FormControl('', [Validators.required])
        });

        this.formStore.create(this.GIRIS_CIKIS_FORM_ID, this.frm);
    }

    async onSubmit() {
        if (this.frm.invalid) {
            this.frm.markAllAsTouched();
            return;
        }

        await this.formStore.submit(this.GIRIS_CIKIS_FORM_ID, async (value: any) => {
            console.log('Form Submitted:', value);

            // Add new record to mock table
            const newRecord: GiriscikisTransaction = {
                id: Math.random().toString(36).substr(2, 9),
                seriNo: value.SeriNo,
                kimlikNo: value.KimlikNo,
                ad: value.Ad,
                soyad: value.Soyad,
                ulke: value.Ulke,
                islemTarihi: new Date(),
                islemTuru: 'Giris',
                cinsiyet: value.Cinsiyet,
                dogumTarihi: value.DogumTarihi
            };

            this.transactions.update((list: GiriscikisTransaction[]) => [newRecord, ...list]);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
        });
    }

    deleteTransaction(id: string) {
        this.transactions.update((list: GiriscikisTransaction[]) => list.filter((t: GiriscikisTransaction) => t.id !== id));
    }

    clearForm() {
        this.frm.reset({
            Ulke: 'TUR',
            Cinsiyet: 'E'
        });
        this.frm.markAsPristine();
        this.frm.markAsUntouched();
    }
}
