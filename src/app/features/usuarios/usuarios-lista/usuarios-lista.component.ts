import {Component,inject,OnInit,signal,ViewChild,ElementRef,} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators,FormsModule,} from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import {Usuario,UsuarioRequest,UserRole,AuthProvider,} from '../../../core/models';
import { formatarData } from '../../../core/utils/formatters.util';
import { formatarCPF, formatarTelefone } from '../../../core/utils/validators.util';

declare var bootstrap: any;

@Component({
  selector: 'app-usuarios-lista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './usuarios-lista.component.html',
  styleUrl: './usuarios-lista.component.scss',
})
export class UsuariosListaComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  @ViewChild('usuarioModal') modalElement!: ElementRef;
  private modalInstance: any;

  usuarios = signal<Usuario[]>([]);
  usuariosFiltrados = signal<Usuario[]>([]);

  isLoading = signal(false);
  isSubmitting = signal(false);

  usuarioForm!: FormGroup;
  modoEdicao = signal(false);
  usuarioEditando = signal<Usuario | null>(null);

  searchTerm = '';

  roles = [
    { value: UserRole.ROLE_ADMIN, label: 'Administrador' },
    { value: UserRole.ROLE_ATENDENTE, label: 'Atendente' },
    { value: UserRole.ROLE_MECANICO, label: 'Mecânico' },
  ];

  providers = [
    { value: AuthProvider.LOCAL, label: 'Local (Email e Senha)' },
    { value: AuthProvider.GOOGLE, label: 'Google OAuth2' },
  ];

  ngOnInit(): void {
    this.inicializarForm();
    this.carregarUsuarios();
  }

  ngAfterViewInit(): void {
    if (this.modalElement) {
      this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
    }
  }

  inicializarForm(): void {
    this.usuarioForm = this.fb.group({
      nmUsuario: ['', [Validators.required, Validators.maxLength(120)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(150)],
      ],
      senha: ['', [Validators.minLength(3)]],
      provider: [AuthProvider.LOCAL, [Validators.required]],
      roles: [[], [Validators.required]],
      cpf: ['', [Validators.required, Validators.maxLength(14)]],
      telefone: ['', [Validators.required, Validators.maxLength(15)]],
      ativo: [true],
    });

    this.usuarioForm.get('provider')?.valueChanges.subscribe((provider) => {
      const senhaControl = this.usuarioForm.get('senha');

      if (provider === AuthProvider.LOCAL) {
        if (!this.modoEdicao()) {
          senhaControl?.setValidators([
            Validators.required,
            Validators.minLength(3),
          ]);
        } else {
          senhaControl?.setValidators([Validators.minLength(3)]);
        }
      } else {
        senhaControl?.clearValidators();
        senhaControl?.setValidators([Validators.minLength(3)]);
        senhaControl?.setValue('');
      }

      senhaControl?.updateValueAndValidity();
    });
  }

  carregarUsuarios(): void {
    this.isLoading.set(true);

    this.usuarioService.listarAtivos().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.aplicarFiltro();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.isLoading.set(false);
      },
    });
  }

  aplicarFiltro(): void {
    const termo = this.searchTerm.toLowerCase();

    if (!termo) {
      this.usuariosFiltrados.set(this.usuarios());
      return;
    }

    const filtrados = this.usuarios().filter(
      (usuario) =>
        usuario.nmUsuario.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo)
    );

    this.usuariosFiltrados.set(filtrados);
  }

  abrirModalNovo(): void {
    this.modoEdicao.set(false);
    this.usuarioEditando.set(null);
    this.usuarioForm.reset({
      provider: AuthProvider.LOCAL,
      ativo: true,
    });

    this.usuarioForm
      .get('senha')
      ?.setValidators([Validators.required, Validators.minLength(3)]);
    this.usuarioForm.get('senha')?.updateValueAndValidity();

    this.modalInstance?.show();
  }

  abrirModalEditar(usuario: Usuario): void {
    this.modoEdicao.set(true);
    this.usuarioEditando.set(usuario);

    this.usuarioForm.patchValue({
      nmUsuario: usuario.nmUsuario,
      email: usuario.email,
      senha: '',
      provider: usuario.provider || AuthProvider.LOCAL,
      roles: usuario.roles || [],
      cpf: usuario.cpf || '',
      telefone: usuario.telefone || '',
      ativo: usuario.ativo !== false,
    });

    this.usuarioForm.get('senha')?.clearValidators();
    this.usuarioForm.get('senha')?.setValidators([Validators.minLength(3)]);
    this.usuarioForm.get('senha')?.updateValueAndValidity();

    this.modalInstance?.show();
  }

  fecharModal(): void {
    this.modalInstance?.hide();
    this.usuarioForm.reset();
  }

  salvar(): void {
    if (this.usuarioForm.invalid) {
      this.marcarCamposComoTocados();
      console.log('Formulário inválido:', this.usuarioForm.errors);
      console.log('Valores:', this.usuarioForm.value);
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.usuarioForm.value;

    const dados: any = {
      nmUsuario: formValue.nmUsuario,
      email: formValue.email,
      senha: formValue.senha || undefined,
      provider: formValue.provider,
      roles: formValue.roles,
      cpf: formValue.cpf,
      telefone: formValue.telefone || undefined,
      ativo: formValue.ativo !== false,
      providerId: null,
    };

    if (this.modoEdicao() && !dados.senha) {
      delete dados.senha;
    }

    if (dados.provider === AuthProvider.GOOGLE) {
      delete dados.senha;
    }

    console.log('Enviando dados:', dados);

    const operacao = this.modoEdicao()
      ? this.usuarioService.atualizar(this.usuarioEditando()!.cdUsuario, dados)
      : this.usuarioService.criar(dados);

    operacao.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.fecharModal();
        this.carregarUsuarios();
        alert('Usuário salvo com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao salvar usuário:', error);
        this.isSubmitting.set(false);
        alert(error.message || 'Erro ao salvar usuário');
      },
    });
  }

  confirmarExclusao(usuario: Usuario): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser?.cdUsuario === usuario.cdUsuario) {
      alert('Você não pode excluir seu próprio usuário!');
      return;
    }

    if (confirm(`Deseja realmente excluir o usuário "${usuario.nmUsuario}"?`)) {
      this.usuarioService.deletar(usuario.cdUsuario).subscribe({
        next: () => {
          this.carregarUsuarios();
          alert('Usuário excluído com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao excluir usuário:', error);
          alert('Erro ao excluir usuário');
        },
      });
    }
  }

  getRoleLabel(role: UserRole): string {
    const roleObj = this.roles.find((r) => r.value === role);
    return roleObj?.label || role;
  }

  getRolesLabel(roles: UserRole[]): string {
    if (!roles || roles.length === 0) return '-';
    return roles.map((r) => this.getRoleLabel(r)).join(', ');
  }

  onRoleChange(event: any, role: UserRole): void {
    const rolesControl = this.usuarioForm.get('roles');
    const currentRoles = rolesControl?.value || [];

    if (event.target.checked) {
      rolesControl?.setValue([...currentRoles, role]);
    } else {
      rolesControl?.setValue(currentRoles.filter((r: UserRole) => r !== role));
    }
  }

  getProviderLabel(provider: AuthProvider): string {
    return provider === AuthProvider.GOOGLE ? 'Google' : 'Local';
  }

  getProviderBadgeClass(provider: AuthProvider): string {
    return provider === AuthProvider.GOOGLE ? 'bg-danger' : 'bg-primary';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.usuarioForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.usuarioForm.get(fieldName);

    if (field?.hasError('required')) return 'Campo obrigatório';
    if (field?.hasError('email')) return 'Email inválido';
    if (field?.hasError('minlength')) {
      const min = field.errors?.['minlength'].requiredLength;
      return `Mínimo de ${min} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      const max = field.errors?.['maxlength'].requiredLength;
      return `Máximo de ${max} caracteres`;
    }

    return '';
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.usuarioForm.controls).forEach((key) => {
      this.usuarioForm.get(key)?.markAsTouched();
    });
  }

  formatarData(data: string): string {
    return formatarData(data);
  }

  formatarCPFInput() {
  const cpf = this.usuarioForm.get('cpf')?.value || '';
  const formatado = formatarCPF(cpf);
  this.usuarioForm.get('cpf')?.setValue(formatado, { emitEvent: false });
}

formatarTelefoneInput() {
  const tel = this.usuarioForm.get('telefone')?.value || '';
  const formatado = formatarTelefone(tel);
  this.usuarioForm.get('telefone')?.setValue(formatado, { emitEvent: false });
}
}
