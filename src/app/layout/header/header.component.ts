import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models';
import {
  AppTheme,
  ThemeService,
} from 'src/app/core/services/themeService.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  themeAtual: AppTheme = 'light';
  constructor(private themeService: ThemeService) {}

  currentUser = signal<Usuario | null>(null);

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
    });
    this.themeAtual = this.themeService.getTheme();
  }

  logout(): void {
    if (confirm('Deseja realmente sair do sistema?')) {
      this.authService.logout();
    }
  }

  getRoleLabel(roles: string[]): string {
    if (roles.includes('ROLE_ADMIN')) return 'Administrador';
    if (roles.includes('ROLE_ATENDENTE')) return 'Atendente';
    if (roles.includes('ROLE_MECANICO')) return 'Mecânico';
    return 'Usuário';
  }

  trocarTema(event: Event): void {
    const theme = (event.target as HTMLSelectElement).value as AppTheme;
    this.themeAtual = theme;
    this.themeService.setTheme(theme);
  }
}
