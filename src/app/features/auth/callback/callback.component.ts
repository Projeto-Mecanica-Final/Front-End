// src/app/features/auth/callback/callback.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      @if (!hasError()) {
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="mt-3">Processando autenticação Google...</p>
      <p class="text-muted small">
        Aguarde enquanto validamos suas credenciais
      </p>
      } @else {
      <div class="alert alert-danger">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <strong>Erro na autenticação</strong>
        <p class="mb-0 mt-2">{{ errorMessage() }}</p>
      </div>
      <button class="btn btn-primary mt-3" (click)="voltarLogin()">
        <i class="bi bi-arrow-left me-2"></i>
        Voltar para Login
      </button>
      }
    </div>
  `,
  styles: [
    `
      .callback-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-color: var(--content-bg);
        padding: 20px;
        text-align: center;
      }

      .alert {
        max-width: 500px;
      }

      .text-muted {
        color: #6c757d;
      }
    `,
  ],
})
export class CallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  hasError = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    console.log('🔄 CallbackComponent iniciado');

    // Captura o token da URL
    this.route.queryParams.subscribe((params) => {
      console.log('📋 Query params recebidos:', params);

      const token = params['token'];
      const error = params['error'];
      const message = params['message'];

      if (error || message) {
        console.error('❌ Erro recebido na URL:', error);
        this.hasError.set(true);

        const errorType = error || 'google_auth_failed';
        this.errorMessage.set(this.getErrorMessage(errorType));

        const tipoMensagem =
          errorType === 'user_not_registered' || errorType === 'access_denied'
            ? 'info'
            : 'error';

        setTimeout(() => {
          this.router.navigate(['/auth/login'], {
            queryParams: {
              error: errorType,
              tipo: tipoMensagem,
            },
          });
        }, 2000);
      } else if (token) {
        console.log('🔑 Token recebido, processando...');
        this.authService.handleGoogleCallback(token);
      } else {
        console.error('❌ Nenhum token ou erro recebido');
        this.hasError.set(true);
        this.errorMessage.set('Token de autenticação não foi recebido.');

        setTimeout(() => {
          this.router.navigate(['/auth/login'], {
            queryParams: { error: 'no_token', tipo: 'error' },
          });
        }, 2000);
      }
    });
  }

  voltarLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  private getErrorMessage(error: string): string {
    const messages: Record<string, string> = {
      user_not_registered:
        'Usuário não cadastrado no sistema. Entre em contato com o administrador.',
      google_auth_failed: 'Falha na autenticação com Google. Tente novamente.',
      no_token: 'Token não foi recebido do servidor.',
      invalid_token: 'Token inválido recebido do servidor.',
      access_denied: 'Você cancelou a autenticação com Google.',
    };

    return messages[error] || 'Erro desconhecido na autenticação.';
  }
}
