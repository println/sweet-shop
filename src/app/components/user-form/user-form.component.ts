import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfile } from '../../models';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
      <div class="form-group">
        <label for="nome">Nome Completo</label>
        <input id="nome" type="text" formControlName="nome" placeholder="Seu nome">
        <div class="error" *ngIf="userForm.get('nome')?.touched && userForm.get('nome')?.invalid">
          Nome é obrigatório
        </div>
      </div>

      <div class="form-group">
        <label for="telefone">Telefone / WhatsApp</label>
        <input id="telefone" type="tel" formControlName="telefone" placeholder="(11) 99999-9999">
        <div class="error" *ngIf="userForm.get('telefone')?.touched && userForm.get('telefone')?.invalid">
          Telefone é obrigatório
        </div>
      </div>

      <div formGroupName="endereco" class="address-group">
        <h3>Endereço de Entrega</h3>
        
        <div class="form-group">
          <label for="cep">CEP</label>
          <div class="cep-input-group">
            <input id="cep" type="text" formControlName="cep" placeholder="00000-000">
            <button type="button" class="search-btn" (click)="searchCep()" [disabled]="loadingCep || !isCepValid()">
              {{ loadingCep ? '...' : 'Buscar' }}
            </button>
          </div>
          <div class="error" *ngIf="userForm.get('endereco.cep')?.touched && userForm.get('endereco.cep')?.invalid">
            CEP é obrigatório
          </div>
          <div class="error" *ngIf="cepError">
            {{ cepError }}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group flex-2">
            <label for="rua">Rua</label>
            <input id="rua" type="text" formControlName="rua" placeholder="Nome da rua">
            <div class="error" *ngIf="userForm.get('endereco.rua')?.touched && userForm.get('endereco.rua')?.invalid">
              Rua é obrigatória
            </div>
          </div>

          <div class="form-group flex-1">
            <label for="numero">Número</label>
            <input id="numero" type="text" formControlName="numero" placeholder="123">
            <div class="error" *ngIf="userForm.get('endereco.numero')?.touched && userForm.get('endereco.numero')?.invalid">
              Número é obrigatório
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="bairro">Bairro</label>
          <input id="bairro" type="text" formControlName="bairro" placeholder="Seu bairro">
          <div class="error" *ngIf="userForm.get('endereco.bairro')?.touched && userForm.get('endereco.bairro')?.invalid">
            Bairro é obrigatório
          </div>
        </div>

        <div class="form-row">
          <div class="form-group flex-1">
            <label for="cidade">Cidade</label>
            <input id="cidade" type="text" formControlName="cidade" placeholder="Cidade">
          </div>
          <div class="form-group flex-1">
            <label for="estado">Estado</label>
            <input id="estado" type="text" formControlName="estado" placeholder="UF">
          </div>
        </div>

        <div class="form-group">
          <label for="referencia">Ponto de Referência (Opcional)</label>
          <input id="referencia" type="text" formControlName="referencia" placeholder="Próximo a...">
        </div>
      </div>

      <button type="submit" [disabled]="userForm.invalid || (disableSubmitIfNoChanges && !hasUnsavedChanges)" class="submit-btn">
        {{ submitLabel }}
      </button>
    </form>
  `,
  styles: [`
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .flex-1 { flex: 1; }
    .flex-2 { flex: 2; }

    label {
      font-weight: 500;
      color: var(--text-color);
    }

    input {
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
      width: 100%;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .cep-input-group {
      display: flex;
      gap: 0.5rem;
    }

    .search-btn {
      padding: 0 1.5rem;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .search-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .error {
      color: #e74c3c;
      font-size: 0.875rem;
    }

    .address-group {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    h3 {
      margin: 0 0 0.5rem 0;
      color: var(--primary-color);
      font-size: 1.2rem;
    }

    .submit-btn {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    }

    .submit-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
      }
    }
  `]
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() initialData: UserProfile | null = null;
  @Input() submitLabel: string = 'Salvar';
  @Input() disableSubmitIfNoChanges: boolean = true;
  @Output() formSubmit = new EventEmitter<UserProfile>();

  userForm: FormGroup;
  loadingCep = false;
  cepError = '';
  private originalJson = '';

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService
  ) {
    this.userForm = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      endereco: this.fb.group({
        cep: ['', Validators.required],
        rua: ['', Validators.required],
        numero: ['', Validators.required],
        bairro: ['', Validators.required],
        cidade: [''],
        estado: [''],
        referencia: ['']
      })
    });
  }

  ngOnInit() {
    // Listen to CEP changes
    this.userForm.get('endereco.cep')?.valueChanges.subscribe(value => {
      if (value) {
        // Remove non-numeric characters
        const cleanCep = value.replace(/\D/g, '');
        if (cleanCep.length === 8) {
          this.searchCep(cleanCep);
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && this.initialData) {
      this.originalJson = JSON.stringify(this.initialData);
      // Only patch if it's the first change or if we want to force update from parent
      // For now, let's patch on first load, and if the parent updates (e.g. save complete)
      // we assume the parent sends back the saved data which matches current form, 
      // so patching is safe or redundant, but ensures consistency.
      this.userForm.patchValue(this.initialData, { emitEvent: false });
    }
  }

  get hasUnsavedChanges(): boolean {
    return JSON.stringify(this.userForm.value) !== this.originalJson;
  }

  // Helper to check if CEP is valid for button state
  isCepValid(): boolean {
    const cep = this.userForm.get('endereco.cep')?.value;
    return cep && cep.replace(/\D/g, '').length === 8;
  }

  searchCep(cepValue?: string) {
    const cep = cepValue || this.userForm.get('endereco.cep')?.value;
    if (!cep) return;

    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    this.loadingCep = true;
    this.cepError = '';

    this.addressService.getAddress(cleanCep).subscribe({
      next: (data) => {
        this.loadingCep = false;
        if (data.erro) {
          this.cepError = 'CEP não encontrado.';
        } else {
          this.userForm.patchValue({
            endereco: {
              rua: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              estado: data.uf
            }
          });
          // Focus on number field
          setTimeout(() => {
            const numeroInput = document.getElementById('numero');
            if (numeroInput) numeroInput.focus();
          }, 100);
        }
      },
      error: (err) => {
        this.loadingCep = false;
        this.cepError = 'Erro ao buscar CEP.';
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.formSubmit.emit(this.userForm.value);
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
