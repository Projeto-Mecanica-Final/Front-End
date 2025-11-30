
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrdemServico, OrdemServicoRequest, Status, FormaPagamento } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrdemServicoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ordens-servico`;
  
  
  
  criar(data: OrdemServicoRequest): Observable<OrdemServico> {
    console.log('📤 POST /ordens-servico:', data);
    return this.http.post<OrdemServico>(this.apiUrl, data);
  }
  
  buscarPorId(id: number): Observable<OrdemServico> {
    return this.http.get<OrdemServico>(`${this.apiUrl}/${id}`);
  }
  
  atualizar(id: number, data: OrdemServicoRequest): Observable<OrdemServico> {
    console.log(`PUT /ordens-servico/${id}:`, data);
    return this.http.put<OrdemServico>(`${this.apiUrl}/${id}`, data);
  }
  
  atualizarDiagnosticoEMaoObra(
    id: number, 
    diagnostico: string, 
    vlMaoObraExtra: number
  ): Observable<OrdemServico> {
    const dados = {
      diagnostico,
      vlMaoObraExtra
    };
    console.log(`PATCH /ordens-servico/${id}/diagnostico-e-mao-obra:`, dados);
    return this.http.patch<OrdemServico>(
      `${this.apiUrl}/${id}/diagnostico-e-mao-obra`, 
      dados
    );
  }
  
  deletar(id: number): Observable<void> {
    console.log(`DELETE /ordens-servico/${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
 
  
  listarTodas(): Observable<OrdemServico[]> {
    console.log('📡 GET /ordens-servico (TODAS)');
    return this.http.get<OrdemServico[]>(this.apiUrl);
  }
  
  listarPorStatus(status: Status): Observable<OrdemServico[]> {
    console.log(`GET /ordens-servico/status/${status}`);
    return this.http.get<OrdemServico[]>(`${this.apiUrl}/status/${status}`);
  }
  
  listarOrcamentosPendentes(): Observable<OrdemServico[]> {
    console.log('GET /ordens-servico/orcamentos/pendentes');
    return this.http.get<OrdemServico[]>(`${this.apiUrl}/orcamentos/pendentes`);
  }
  
  
  iniciar(id: number): Observable<OrdemServico> {
    console.log(`PATCH /ordens-servico/${id}/iniciar`);
    return this.http.patch<OrdemServico>(`${this.apiUrl}/${id}/iniciar`, {});
  }
  
  concluir(id: number, formaPagamento: FormaPagamento): Observable<OrdemServico> {
    console.log(`PATCH /ordens-servico/${id}/concluir, Pagamento:`, formaPagamento);
    return this.http.patch<OrdemServico>(`${this.apiUrl}/${id}/concluir`, { formaPagamento });
  }
  
  cancelar(id: number): Observable<void> {
    console.log(`PATCH /ordens-servico/${id}/cancelar`);
    return this.http.patch<void>(`${this.apiUrl}/${id}/cancelar`, {});
  }
  
  aprovarOrcamento(id: number, dataAgendamento: string): Observable<OrdemServico> {
    console.log(`PATCH /ordens-servico/${id}/aprovar-orcamento, Data:`, dataAgendamento);
    return this.http.patch<OrdemServico>(`${this.apiUrl}/${id}/aprovar-orcamento`, { dataAgendamento });
  }
}