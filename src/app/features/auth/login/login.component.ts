// src/app/features/auth/login/login.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  mensagemInfo = signal<string | null>(null);
  showPassword = signal(false);

  constructor() {
    // Verifica se já está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const error = params['error'];
      const tipo = params['tipo'] || 'error';

      if (error) {
        console.error('Erro recebido da URL:', error);

        const mensagem = this.getErrorMessage(error);

        if (tipo === 'info') {
          this.mensagemInfo.set(mensagem);
          this.errorMessage.set(null);
        } else {
          this.errorMessage.set(mensagem);
          this.mensagemInfo.set(null);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.mensagemInfo.set(null);

    const credentials = {
      email: this.loginForm.value.email,
      senha: this.loginForm.value.password,
    };

    console.log('Tentando fazer login com:', credentials.email);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido:', response);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.isLoading.set(false);
        this.errorMessage.set(
          error.message || 'Email ou senha incorretos. Tente novamente.'
        );
      },
    });
  }

  loginWithGoogle(): void {
    console.log('🔵 Botão Google clicado');
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.mensagemInfo.set(null);

    try {
      this.authService.loginWithGoogle();
    } catch (error) {
      console.error('Erro ao iniciar login Google:', error);
      this.isLoading.set(false);
      this.errorMessage.set('Erro ao conectar com Google. Tente novamente.');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Este campo é obrigatório';
    }

    if (field?.hasError('email')) {
      return 'Email inválido';
    }

    if (field?.hasError('minlength')) {
      return 'Mínimo de 3 caracteres';
    }

    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      user_not_registered:
        'Usuário não cadastrado no sistema. Entre em contato com o administrador para criar sua conta antes de fazer login com Google.',
      no_token: 'Token de autenticação não foi recebido do Google.',
      google_auth_failed: 'Falha na autenticação com Google. Tente novamente.',
      access_denied: ' Você cancelou a autenticação com Google.',
      user_inactive:
        'Seu usuário está inativo. Entre em contato com o administrador.',
      server_error: 'Erro no servidor. Tente novamente mais tarde.',
      invalid_token: 'Token de autenticação inválido.',
      no_auth: 'Autenticação não foi concluída.',
    };

    return errorMessages[error] || 'Erro na autenticação. Tente novamente.';
  }
}
