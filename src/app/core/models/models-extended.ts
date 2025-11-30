import { FormaPagamento, Status, TipoOrdemOrcamento } from './enums';


export interface Agendamento {
  cdAgendamento: number;
  

  cdCliente: number;
  nmCliente: string;
  cpfCliente: string;
  telefoneCliente: string;
  
  cdVeiculo: number;
  placaVeiculo: string;
  modeloVeiculo: string;
  marcaVeiculo: string;
  
  cdMecanico: number;
  nmMecanico: string;
  
  dataAgendamento: string;
  status: Status;
  observacoes?: string;
  
  cdOrdemServico?: number;
}

export interface AgendamentoRequest {
  cdCliente: number;
  cdVeiculo: number;
  cdMecanico: number;
  dataAgendamento: string;
  observacoes?: string;
}

export interface Produto {
  cdProduto: number;
  nmProduto: string;
  dsProduto?: string;
  categoria?: string;
  vlProduto: number;     
  qtdEstoque: number;
  qtdMinimoEstoque: number;     
  ativo: boolean;
}

export interface ProdutoRequest {
  nmProduto: string;
  dsProduto?: string;
  categoria?: string;
  vlProduto: number;     
  qtdEstoque: number;
  qtdMinimoEstoque: number;   
}


export interface Servico {
  cdServico: number;
  nmServico: string;
  dsServico?: string;
  vlServico: number;
  ativo: boolean;
}

export interface ServicoRequest {
  nmServico: string;
  dsServico?: string;
  vlServico: number;
}


export interface OrdemServico {
  cdOrdemServico: number;
  

  cdCliente: number;
  nmCliente: string;
  

  cdVeiculo: number;
  placaVeiculo: string;
  modeloVeiculo: string;
  marcaVeiculo: string;
  
  cdMecanico: number;
  nmMecanico: string;
  
  tipoOrdemOrcamento: TipoOrdemOrcamento;
  status: Status;
  dataAgendamento: string;
  dataAbertura: string;
  

  vlPecas: number;
  vlServicos: number;
  vlMaoObraExtra: number;
  vlTotal: number;
  
  diagnostico?: string;
  aprovado: boolean;
  
  itens?: ItemOrdemServico[];
}

export interface OrdemServicoRequest {
  cdCliente: number;
  cdVeiculo: number;
  cdMecanico: number;
  tipoOrdemOrcamento: TipoOrdemOrcamento;
  dataAgendamento?: string;
  vlMaoObra?: number;
  diagnostico?: string;
  itens: ItemOrdemServicoRequest[];
}

export interface ItemOrdemServico {
  cdItem: number;
  cdProduto?: number;
  nomeProduto?: string;
  cdServico?: number;
  servico?: string;
  quantidade: number;
  vlUnitario: number;
  vlTotal: number;
}

export interface ItemOrdemServicoRequest {
  cdProduto?: number;
  cdServico?: number;
  quantidade: number;
  vlUnitario?: number;
  
}

export interface Venda {
  cdVenda: number;
  dataVenda: string;          
  vlTotal: number;
  desconto?: number;
  formaPagamento: FormaPagamento;
  
 
  clienteModel?: {            
    cdCliente: number;
    nmCliente: string;
    cpf?: string;
    Telefone?: string;
    email?: string;
  };
  
  atendente?: {                
    cdUsuario: number;
    nmUsuario: string;
    email?: string;
  };
  
  itens?: ItemVenda[];
}

export interface VendaRequest {
  cdCliente: number;         
  cdAtendente: number;
  desconto?: number;
  formaPagamento: FormaPagamento;
  itens: ItemVendaRequest[];
}


export interface ItemVenda {
  cdItemVenda: number;
  cdProduto: number;
  quantidade: number;
  vlUnitario: number;
  vlTotal: number;
  

  produto?: {
    cdProduto: number;
    nmProduto: string;
    vlProduto: number;
  };
}

export interface ItemVendaRequest {
  cdProduto: number;
  quantidade: number;
 
}


export interface Faturamento {
  cdFaturamento: number;
  cdVenda?: number;
  cdOrdemServico?: number;
  dataVenda: string;
  vlTotal: number;
  formaPagamento: FormaPagamento;
  cliente?: string;
}