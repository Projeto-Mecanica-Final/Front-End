// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, AuthResponse, Usuario, UsuarioRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private readonly TOKEN_KEY = 'sgm_token';
  private readonly USER_KEY = 'sgm_user';
  
  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Login normal
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap(response => this.handleAuthSuccess(response)));
  }
  
  // Registro
  register(data: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${environment.apiUrl}/auth/register`, data);
  }

  // ✅ SUPER SIMPLES - Login com Google
  loginWithGoogle(): void {
    // Redireciona direto para o backend (tira o /api da URL)
    window.location.href = 'http://localhost:8084/oauth2/authorization/google';
  }
  
  // ✅ Callback do Google
  handleGoogleCallback(token: string): void {
    this.http.get<Usuario>(`${environment.apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (usuario) => {
        const authResponse: AuthResponse = {
          accessToken: token,
          tokenType: 'Bearer',
          usuario: usuario
        };
        this.handleAuthSuccess(authResponse);
      },
      error: (error) => {
        console.error('Erro:', error);
        
        // ✅ Identifica se é usuário não cadastrado
        let errorType = 'google_auth_failed';
        let tipoMensagem = 'error';
        
        if (error.status === 404 || error.status === 401) {
          errorType = 'user_not_registered';
          tipoMensagem = 'info';
        }
        
        this.router.navigate(['/auth/login'], { 
          queryParams: { 
            error: errorType,
            tipo: tipoMensagem
          } 
        });
      }
    });
  }
  
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }
  
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role as any) || false;
  }
  
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }
  
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.usuario));
    this.currentUserSubject.next(response.usuario);
    this.router.navigate(['/dashboard']);
  }
  
  private getUserFromStorage(): Usuario | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}