import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { AuthService } from '../../../core/services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzInputModule, RouterLink, NzIconModule,   // ADAUGĂ AICI
    NzGridModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private message = inject(NzMessageService);

  validateForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    remember: this.fb.control(true)
  });

  isLoading = false;

  async submitForm(): Promise<void> {
    if (this.validateForm.valid) {
      this.isLoading = true;

      try {
        const { username, password, remember } = this.validateForm.value;

        await this.authService.signIn(username!, password!, remember!);

        this.message.success('Login successful!');
        this.router.navigate(['/home']);

      } catch (error: any) {
        console.error('Login error:', error);
        this.message.error(error.message || 'Login failed. Please try again.');
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
}
