import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (!value) {
            return null; // Lasă required validator să se ocupe de cazul când e gol
        }

        // Verifică lungimea minimă
        if (value.length < 6) {
            return { passwordStrength: { message: 'Password must be at least 6 characters long' } };
        }

        // Verifică litera mare
        if (!/[A-Z]/.test(value)) {
            return { passwordStrength: { message: 'Password must contain at least one uppercase letter' } };
        }

        // Verifică litera mică
        if (!/[a-z]/.test(value)) {
            return { passwordStrength: { message: 'Password must contain at least one lowercase letter' } };
        }

        // Verifică cifra
        if (!/[0-9]/.test(value)) {
            return { passwordStrength: { message: 'Password must contain at least one digit' } };
        }

        // Verifică caracterul special
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
            return { passwordStrength: { message: 'Password must contain at least one special character' } };
        }

        return null; // Parola este validă
    };
}