
export function validarCPF(cpf: string): boolean {
  if (!cpf) return false;
  
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digito = 11 - (soma % 11);
  if (digito > 9) digito = 0;
  if (digito !== parseInt(cpf.charAt(9))) return false;
  

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digito = 11 - (soma % 11);
  if (digito > 9) digito = 0;
  if (digito !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}


export function formatarCPF(cpf: string): string {
  if (!cpf) return '';
  
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length <= 11) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  return cpf;
}

export function formatarTelefone(telefone: string): string {
  if (!telefone) return '';
  
  telefone = telefone.replace(/[^\d]/g, '');
  
  if (telefone.length === 11) {
  
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (telefone.length === 10) {
  
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
}

export function removerFormatacao(valor: string): string {
  return valor ? valor.replace(/[^\d]/g, '') : '';
}
