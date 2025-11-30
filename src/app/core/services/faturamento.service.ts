
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Faturamento } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FaturamentoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/faturamento`;
  

  buscarPorId(id: number): Observable<Faturamento> {
    return this.http.get<Faturamento>(`${this.apiUrl}/${id}`);
  }
  

  listarPorPeriodo(dataInicio: string, dataFim: string): Observable<Faturamento[]> {
    return this.http.get<Faturamento[]>(`${this.apiUrl}/periodo`, {
      params: { dataInicio, dataFim }
    });
  }
  

  calcularTotalPeriodo(dataInicio: string, dataFim: string): Observable<{ totalFaturado: number }> {
    return this.http.get<{ totalFaturado: number }>(`${this.apiUrl}/total-periodo`, {
      params: { dataInicio, dataFim }
    });
  }
  

  listarDoDia(): Observable<Faturamento[]> {
    return this.http.get<Faturamento[]>(`${this.apiUrl}/dia`);
  }
  

  calcularTotalDia(): Observable<{ totalDia: number }> {
    return this.http.get<{ totalDia: number }>(`${this.apiUrl}/total-dia`);
  }
}