import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { DatabaseService } from '../../../core/services/db.service';
import { passwordValidator } from '../../../core/validators/password.validator';
import { EmailAsyncValidator } from '../../../core/validators/email-async.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private dbService = inject(DatabaseService);
  private message = inject(NzMessageService);
  private destroy$ = new Subject<void>();

  isLoading = false;

  validateForm = this.fb.group({
    email: this.fb.control('',
      [Validators.email, Validators.required],
      [EmailAsyncValidator.goodEmail(this.dbService)]
    ),
    password: this.fb.control('', [Validators.required, passwordValidator()]),
    checkPassword: this.fb.control('', [Validators.required]),
    firstName: this.fb.control('', [Validators.required]),
    lastName: this.fb.control('', [Validators.required]),
    agree: this.fb.control(false)
  });

  get passwordStrength(): string {
    const password = this.validateForm.get('password')?.value || '';
    const checks = [
      password.length >= 6,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    ];

    const score = checks.filter(Boolean).length;

    if (score === 0) return '';
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  }

  ngOnInit(): void {
    this.validateForm.controls.checkPassword.addValidators([this.confirmationValidator.bind(this)]);

    this.validateForm.controls.password.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.validateForm.controls.checkPassword.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async submitForm(): Promise<void> {
    if (this.validateForm.valid) {
      this.isLoading = true;

      try {
        const { email, password, firstName, lastName } = this.validateForm.value;

        await this.authService.signUp(email!, password!, firstName!, lastName!);

        this.message.success('Registration successful! Please check your email to verify your account.');
        this.router.navigate(['/login']);

      } catch (error: any) {
        console.error('Registration error:', error);

        let errorMessage = 'Registration failed. Please try again.';

        if (error.message.toLowerCase().includes('already') ||
          error.message.toLowerCase().includes('exists') ||
          error.message.toLowerCase().includes('registered')) {
          errorMessage = 'An account with this email already exists. Please try logging in instead.';
        } else if (error.message.toLowerCase().includes('invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.toLowerCase().includes('password')) {
          errorMessage = 'Password does not meet security requirements.';
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.message.error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  confirmationValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }
}