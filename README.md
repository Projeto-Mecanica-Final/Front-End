# SGM - Sistema de Gestão Mecânica

Sistema completo de gestão para oficinas mecânicas desenvolvido com Angular 20 e Spring Boot.

## 📋 Sobre o Projeto

O SGM é uma aplicação web full-stack que oferece controle completo para oficinas mecânicas, incluindo gerenciamento de clientes, veículos, estoque, ordens de serviço, vendas e faturamento.

## ✨ Funcionalidades

- **Autenticação e Autorização**
  - Login local com email/senha
  - Login com Google OAuth2
  - Controle de acesso por perfis (Admin, Atendente, Mecânico)

- **Gestão de Clientes**
  - Cadastro completo com CPF, telefone e endereço
  - Validação de CPF
  - Histórico de serviços

- **Gestão de Veículos**
  - Cadastro vinculado a clientes
  - Suporte a placas antigas e Mercosul
  - Histórico de manutenções

- **Controle de Estoque**
  - Gerenciamento de produtos/peças
  - Alertas de estoque baixo
  - Controle de preços e quantidades

- **Ordens de Serviço**
  - Criação de orçamentos
  - Aprovação e transformação em OS
  - Acompanhamento de status (Agendado, Em Andamento, Concluído)
  - Inclusão de produtos e serviços
  - Cálculo automático de valores
  - Geração automática de faturamento

- **Agendamentos**
  - Calendário de serviços
  - Alocação de mecânicos
  - Sincronização com ordens de serviço

- **Vendas**
  - Registro de vendas avulsa ou para clientes
  - Múltiplas formas de pagamento
  - Controle de estoque automático

- **Faturamento**
  - Relatórios por período
  - Consolidação de vendas e serviços
  - Visualização de receitas

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Angular 20** - Framework principal
- **TypeScript** - Linguagem
- **Bootstrap 5** - Framework CSS
- **Bootstrap Icons** - Ícones
- **RxJS** - Programação reativa
- **Signals** - Gerenciamento de estado

### Backend
- **Spring Boot 3.x** - Framework Java
- **Spring Security** - Autenticação e autorização
- **Spring Data JPA** - Persistência
- **PostgreSQL** - Banco de dados
- **OAuth2** - Autenticação Google

## 📦 Pré-requisitos

- Node.js 18+ e npm
- Angular CLI 20+
- Java 17+
- PostgreSQL 14+

## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/sgm.git
cd sgm
```

### 2. Configure o Backend
```bash
# Configure o banco de dados no application.properties
# Execute o backend (porta 8084)
```

### 3. Configure o Frontend
```bash
# Instale as dependências
npm install

# Execute em modo desenvolvimento
ng serve

# Acesse em http://localhost:4200
```

## 👥 Perfis de Usuário

### Administrador (ROLE_ADMIN)
- Acesso total ao sistema
- Gerenciamento de usuários
- Relatórios completos

### Atendente (ROLE_ATENDENTE)
- Cadastro de clientes e veículos
- Criação de ordens de serviço
- Registro de vendas
- Visualização de faturamento

### Mecânico (ROLE_MECANICO)
- Visualização de agendamentos
- Atualização de ordens de serviço
- Acesso ao estoque
- Consulta de veículos

## 🔒 Segurança

- Autenticação JWT
- Proteção de rotas por perfil
- Validação de dados no frontend e backend
- Interceptors para tratamento de erros
- Guards para controle de acesso

## 📱 Responsividade

A aplicação é totalmente responsiva, adaptando-se a diferentes tamanhos de tela (desktop, tablet e mobile).

## 🎨 Identidade Visual

- **Cores principais:**
  - Azul Escuro: `#0b3d91` (Principal)
  - Laranja: `#ff7a00` (Secundário)
  - Branco: `#ffffff`
  - Cinza Claro: `#f5f5f5` (Fundo)

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido por [Seu Nome]

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
