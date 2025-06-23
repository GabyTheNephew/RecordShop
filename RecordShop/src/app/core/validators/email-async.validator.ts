import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, from } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DatabaseService } from '../services/db.service';

export class EmailAsyncValidator {
    static goodEmail(dbService: DatabaseService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            const value = control.value;

            if (!value || !value.trim()) {
                return of(null);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return of(null); //validatorul de email normal se ocupa
            }

            return of(value).pipe(
                debounceTime(500), 
                distinctUntilChanged(), 
                switchMap(email => {
                    return from(
                        dbService.getClient().rpc('check_email_exists', {
                            email_input: email
                        })
                    ).pipe(
                        map((result: any) => {
                            if (result.data === true) {
                                return { emailExists: { message: 'An account with this email already exists' } };
                            }
                            return null; 
                        }),
                        catchError((error) => {
                            console.error('Email validation error:', error);
                            return of(null);
                        })
                    );
                })
            );
        };
    }
}