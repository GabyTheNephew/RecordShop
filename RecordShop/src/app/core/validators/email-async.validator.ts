import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, from } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DatabaseService } from '../services/db.service';

export class EmailAsyncValidator {
    static goodEmail(dbService: DatabaseService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            const value = control.value;

            // Dacă nu există valoare sau este goală, nu validăm
            if (!value || !value.trim()) {
                return of(null);
            }

            // Verifică dacă email-ul are format valid înainte să facă query
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return of(null); // Lasă validatorul de email normal să se ocupe
            }

            return of(value).pipe(
                debounceTime(500), // Așteaptă 500ms după ce utilizatorul s-a oprit din tastat
                distinctUntilChanged(), // Doar dacă valoarea s-a schimbat
                switchMap(email => {
                    return from(
                        dbService.getClient().rpc('check_email_exists', {
                            email_input: email
                        })
                    ).pipe(
                        map((result: any) => {
                            // Dacă funcția returnează true, email-ul există
                            if (result.data === true) {
                                return { emailExists: { message: 'An account with this email already exists' } };
                            }
                            return null; // Email-ul este disponibil
                        }),
                        catchError((error) => {
                            console.error('Email validation error:', error);
                            // În caz de eroare, nu blocăm formularul
                            return of(null);
                        })
                    );
                })
            );
        };
    }
}