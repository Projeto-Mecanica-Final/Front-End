import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProdutoService } from '../../../core/services/produto.service';
import { Produto, ProdutoRequest } from '../../../core/models';

@Component({
  selector: 'app-produtos-lista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produtos-lista.component.html',
  styleUrl: './produtos-lista.component.scss'
})
export class ProdutosListaComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private fb = inject(FormBuilder);
  
  produtos: Produto[] = [];
  produtoForm!: FormGroup;
  
  mostrarModal = false;
  modoEdicao = false;
  loading = false;
  erro = '';
  
  produtoEditando: Produto | null = null;
  
  ngOnInit(): void {
    this.inicializarForm();
    this.carregarProdutos();
  }
  
  inicializarForm(): void {
    this.produtoForm = this.fb.group({
      nmProduto: ['', [Validators.required, Validators.maxLength(150)]],
      dsProduto: ['', [Validators.maxLength(500)]],
      categoria: ['', [Validators.maxLength(100)]],
      vlProduto: [null, [Validators.required, Validators.min(0.01)]],  
      qtdEstoque: [0, [Validators.required, Validators.min(0)]],
      qtdMinimo: [5, [Validators.required, Validators.min(0)]]  
    });
  }
  
  carregarProdutos(): void {
    this.loading = true;
    this.erro = '';
    
    this.produtoService.listarAtivos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.erro = 'Erro ao carregar produtos';
        this.loading = false;
      }
    });
  }
  
  novo(): void {
    this.modoEdicao = false;
    this.produtoEditando = null;
    this.produtoForm.reset({
      qtdEstoque: 0,
      qtdMinimo: 5
    });
    this.erro = '';
    this.mostrarModal = true;
  }
  
  editar(produto: Produto): void {
    this.modoEdicao = true;
    this.produtoEditando = produto;
    
    this.produtoForm.patchValue({
      nmProduto: produto.nmProduto,
      dsProduto: produto.dsProduto,
      categoria: produto.categoria,
      vlProduto: produto.vlProduto,  
      qtdEstoque: produto.qtdEstoque,
      qtdMinimo: produto.qtdMinimoEstoque  
    });
    
    this.erro = '';
    this.mostrarModal = true;
  }
  
  salvar(): void {
    if (this.produtoForm.invalid) {
      this.erro = 'Preencha todos os campos obrigatórios corretamente';
      return;
    }
    
    this.loading = true;
    this.erro = '';
    
    const dados: ProdutoRequest = {
      nmProduto: this.produtoForm.value.nmProduto,
      dsProduto: this.produtoForm.value.dsProduto || undefined,
      categoria: this.produtoForm.value.categoria || undefined,
      vlProduto: this.produtoForm.value.vlProduto,  
      qtdEstoque: this.produtoForm.value.qtdEstoque,
      qtdMinimoEstoque: this.produtoForm.value.qtdMinimo  
    };
    
    const operacao = this.modoEdicao && this.produtoEditando
      ? this.produtoService.atualizar(this.produtoEditando.cdProduto, dados)
      : this.produtoService.criar(dados);
    
    operacao.subscribe({
      next: () => {
        this.loading = false;
        this.fecharModal();
        this.carregarProdutos();
      },
      error: (error) => {
        console.error('Erro ao salvar produto:', error);
        this.erro = error.error?.message || 'Erro ao salvar produto';
        this.loading = false;
      }
    });
  }
  
  excluir(cdProduto: number): void {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }
    
    this.loading = true;
    
    this.produtoService.deletar(cdProduto).subscribe({
      next: () => {
        this.carregarProdutos();
      },
      error: (error) => {
        console.error('Erro ao excluir produto:', error);
        this.erro = 'Erro ao excluir produto';
        this.loading = false;
      }
    });
  }
  
  fecharModal(): void {
    this.mostrarModal = false;
    this.produtoForm.reset();
    this.erro = '';
  }
  
  isInvalid(campo: string): boolean {
    const control = this.produtoForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  contarEstoqueBaixo(): number {
    return this.produtos.filter(p => p.qtdEstoque <= p.qtdMinimoEstoque).length;  
  }
}