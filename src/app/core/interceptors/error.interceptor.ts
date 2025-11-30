import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro desconhecido';
      
      if (error.error instanceof ErrorEvent) {
      
        errorMessage = `Erro de conexão: ${error.error.message}`;
      } else {
     
        switch (error.status) {
          case 0:
         
            errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
            break;
            
          case 401:
           
            authService.logout();
            errorMessage = 'Sessão expirada. Faça login novamente.';
            break;
            
          case 403:
           
            errorMessage = 'Você não tem permissão para acessar este recurso.';
            router.navigate(['/dashboard']);
            break;
            
          case 404:
            errorMessage = 'Recurso não encontrado.';
            break;
            
          case 400:
           
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.error?.errors) {
         
              const errors = error.error.errors;
              const firstError = Object.values(errors)[0];
              errorMessage = `Erro de validação: ${firstError}`;
            } else {
              errorMessage = 'Dados inválidos. Verifique os campos.';
            }
            break;
            
          case 500:
            errorMessage = error.error?.message || 'Erro interno do servidor. Tente novamente mais tarde.';
            break;
            
          default:
         
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.message) {
              errorMessage = error.message;
            }
        }
      }
      
      console.error('Erro HTTP:', {
        status: error.status,
        message: errorMessage,
        error: error
      });
      
     
      return throwError(() => ({ message: errorMessage, error }));
    })
  );
};