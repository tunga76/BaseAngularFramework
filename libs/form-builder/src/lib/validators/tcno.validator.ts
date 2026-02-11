import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function tcNoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) return null; // Required validator handles empty values

        const tcNo = String(value);
        if (!/^\d{11}$/.test(tcNo)) return { tcNo: true };

        const digits = tcNo.split('').map(d => parseInt(d, 10));

        // Custom TC No Algorithm
        const result1 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7;
        const result2 = digits[1] + digits[3] + digits[5] + digits[7];
        const result3 = result1 - result2;
        const tenthDigit = result3 % 10;

        if (tenthDigit !== digits[9]) return { tcNo: true };

        const total = digits.slice(0, 10).reduce((acc, curr) => acc + curr, 0);
        if (total % 10 !== digits[10]) return { tcNo: true };

        return null;
    };
}
