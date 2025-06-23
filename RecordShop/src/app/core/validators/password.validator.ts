import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (!value) {
            return null; //required validator se ocupa de cazul gol
        }

        if (value.length < 6) {
            return { passwordStrength: { message: 'Password must be at least 6 characters long' } };
        }

        if (!/[A-Z]/.test(value)) {
            return { passwordStrength: { message: 'Password must contain at least one uppercase letter' } };
        }

        if (!/[a-z]/.test(value)) {
            return { passwordStrength: { message: 'Password must contain at least one lowercase letter' } };
        }

        if (!/[0-9]/.test(value)) {
            return { passwordStrength: { message: 'Password must contain at least one digit' } };
        }

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
            return { passwordStrength: { message: 'Password must contain at least one special character' } };
        }

        return null; //parola valida
    };
}