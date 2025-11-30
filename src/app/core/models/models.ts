import { UserRole, AuthProvider } from './enums';

export interface Usuario {
  cdUsuario: number;
  nmUsuario: string;
  email: string;
  provider: AuthProvider;
  roles: UserRole[];
  telefone?: string;
  cpf?: string;
  ativo: boolean;
}

export interface UsuarioRequest {
  nmUsuario: string;
  email: string;
  senha?: string;
  provider?: AuthProvider;
  authProvider?: AuthProvider;
  roles: UserRole[];
  telefone?: string;
  cpf?: string;
  providerId?: string;
  ativo?: boolean;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  usuario: Usuario;
}

export interface Cliente {
  cdCliente: number;
  nmCliente: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  ativo: boolean;
}

export interface ClienteRequest {
  nmCliente: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
}

export interface Veiculo {
  cdVeiculo: number;
  cdCliente: number;
  placa: string;
  modelo: string;
  marca?: string;
  ano?: number;
  cor?: string;
  cliente?: {
    cdCliente: number;
    nmCliente: string;
  };
}

export interface VeiculoRequest {
  cdCliente: number;
  placa: string;
  modelo: string;
  marca?: string;
  ano?: number;
  cor?: string;
}
