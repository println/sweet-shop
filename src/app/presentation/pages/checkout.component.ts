import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CartRepository } from '../../application/state/cart.repository';
import { UserRepository } from '../../application/state/user.repository';
import { ViaCepService } from '../../infrastructure/services/via-cep.service';
import { WhatsAppService } from '../../infrastructure/services/whatsapp.service';
import { User } from '../../domain/models/user.model';
import { Cart } from '../../domain/models/cart.model';
import { take, combineLatest } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex flex-col lg:flex-row min-h-screen">

      <!-- Left Column: Main Content -->
      <div class="flex-1 flex flex-col p-6 lg:px-20 lg:py-12 bg-white">

        <!-- Header & Breadcrumb -->
        <div class="mb-8">
          <h1 class="text-4xl font-black text-black mb-4 tracking-tighter">SWEET SHOP</h1>
          <div class="text-sm flex gap-2 text-gray-500 items-center">
            <a [routerLink]="['/']" [queryParams]="{openCart: 'true'}" class="hover:text-soft-brown transition-colors">Carrinho</a>
            <span class="text-xs">></span>
            <span
              [class.font-bold]="step === 1"
              [class.text-black]="step === 1"
              [class.cursor-pointer]="step > 1"
              [class.hover:text-soft-brown]="step > 1"
              (click)="step > 1 ? step = 1 : null">
              Informações
            </span>
            <span class="text-xs">></span>
            <span [class.font-bold]="step === 2" [class.text-black]="step === 2">Confirmação</span>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-grow max-w-xl">

          <!-- Step 1: Address Form -->
          <div *ngIf="step === 1">
            <div class="mb-8">
              <h2 class="text-xl font-bold text-soft-brown mb-4">Contato</h2>
              <div class="flex justify-between items-center text-sm mb-4">
                <span class="text-gray-600">{{ (userRepo.user$ | async)?.name || 'Visitante' }}</span>
                <a routerLink="/login" class="link link-hover text-soft-brown">Sair</a>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-xl font-bold text-soft-brown mb-6">Endereço de entrega</h2>

              <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">

                <!-- Saved Addresses -->
                <div class="form-control w-full">
                  <label class="label"><span class="label-text">Endereços salvos</span></label>
                  <select class="select select-bordered w-full bg-base-100 focus:border-soft-brown focus:ring-1 focus:ring-soft-brown" (change)="onAddressSelected($event)">
                    <option *ngIf="savedAddress" [value]="'saved'">{{ formatAddress(savedAddress) }}</option>
                    <option [value]="'new'" [selected]="!savedAddress">Usar um novo endereço</option>
                  </select>
                </div>

                <!-- Name & Surname -->
                <div class="flex gap-4">
                  <div class="form-control w-full">
                    <input type="text" formControlName="name" placeholder="Nome" class="input input-bordered w-full focus:border-soft-brown focus:ring-1 focus:ring-soft-brown" />
                  </div>
                  <div class="form-control w-full">
                    <input type="text" formControlName="surname" placeholder="Sobrenome" class="input input-bordered w-full focus:border-soft-brown focus:ring-1 focus:ring-soft-brown" />
                  </div>
                </div>

                <!-- CEP -->
                <div class="form-control w-full relative">
                  <input type="text" formControlName="zipCode" placeholder="CEP" class="input input-bordered w-full focus:border-soft-brown focus:ring-1 focus:ring-soft-brown" (blur)="onCepBlur()" />
                  <div class="absolute right-3 top-3" *ngIf="loadingCep">
                    <span class="loading loading-spinner loading-xs text-soft-brown"></span>
                  </div>
                  <div class="absolute right-3 top-3 cursor-pointer" *ngIf="!loadingCep" (click)="onCepBlur()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>

                <!-- Address & Number -->
                <div class="flex gap-4">
                  <div class="form-control flex-grow">
                    <input type="text" formControlName="street" placeholder="Endereço" class="input input-bordered w-full focus:border-soft-brown focus:ring-1 focus:ring-soft-brown" />
                  </div>
                  <div class="form-control w-24">
                    <input type="text" formControlName="number" placeholder="Número" class="input input-bordered w-full focus:border-soft-brown focus:ring-1 focus:ring-soft-brown" />
                  </div>
                </div>

                <!-- Complement & Neighborhood -->
                <div class="flex gap-4">
                  <div class="form-control w-full">
                    <input type="text" formControlName="complement" placeholder="Apartamento, bloco etc. (opcional)" class="input input-bordered w-full focus:border-soft-brown focus:ring-1 focus:ring-soft-brown" />
                  </div>
                  <div class="form-control w-full">
                    <input type="text" formControlName="neighborhood" placeholder="Bairro" class="input input-bordered w-full focus:border-soft-brown focus:ring-1 focus:ring-soft-brown" />
                  </div>
                </div>

                <!-- City & State -->
                <div class="flex gap-4">
                  <div class="form-control w-full">
                    <input type="text" formControlName="city" placeholder="Cidade" class="input input-bordered w-full focus:border-soft-brown focus:ring-1 focus:ring-soft-brown" />
                  </div>
                  <div class="form-control w-full">
                    <select formControlName="state" class="select select-bordered w-full bg-base-100 focus:border-soft-brown focus:ring-1 focus:ring-soft-brown">
                      <option value="" disabled selected>Estado</option>
                      <option *ngFor="let uf of ufs" [value]="uf">{{ uf }}</option>
                    </select>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-between items-center mt-6">
                  <a [routerLink]="['/']" [queryParams]="{openCart: 'true'}" class="flex items-center gap-2 text-sm text-soft-brown hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                    Voltar ao carrinho
                  </a>
                  <button type="submit" class="btn btn-primary bg-gray-900 hover:bg-gray-800 text-white border-none px-8 h-12 rounded-md" [disabled]="checkoutForm.invalid || (cartRepo.count$ | async) === 0">
                    Confirmar endereço e continuar
                  </button>
                </div>

              </form>
            </div>
          </div>

          <!-- Step 2: Summary & Shipping / Payment -->
          <div *ngIf="step === 2" class="mb-8">
            <div class="border border-gray-200 rounded-lg p-4 bg-white">

              <!-- Contact Summary -->
              <div class="flex justify-between items-start py-2 border-b border-gray-100">
                <div class="flex gap-8">
                  <span class="text-gray-500 w-24">Contato</span>
                  <span class="text-gray-800">{{ (userRepo.user$ | async)?.name || 'Visitante' }}</span>
                </div>
                <button class="text-soft-brown text-sm hover:underline" (click)="step = 1">Alterar</button>
              </div>

              <!-- Address Summary -->
              <div class="flex justify-between items-start py-2 border-b border-gray-100">
                <div class="flex gap-8">
                  <span class="text-gray-500 w-24">Enviar para</span>
                  <span class="text-gray-800 flex-1">{{ formatAddress(checkoutForm.value) }}</span>
                </div>
                <button class="text-soft-brown text-sm hover:underline" (click)="step = 1">Alterar</button>
              </div>

              <!-- Shipping Summary (Placeholder/Mock) -->
              <div class="flex justify-between items-start py-2">
                <div class="flex gap-8">
                  <span class="text-gray-500 w-24">Forma de frete</span>
                  <span class="text-gray-800">À combinar via WhatsApp</span>
                </div>
              </div>

            </div>

            <div class="mt-8">
              <h3 class="text-xl font-bold text-soft-brown mb-4">Pagamento</h3>
              <div class="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                O pagamento será combinado via WhatsApp após a confirmação do pedido.
              </div>
            </div>

            <div class="flex justify-between items-center mt-6">
              <button class="flex items-center gap-2 text-sm text-soft-brown hover:underline" (click)="step = 1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                Voltar para as informações
              </button>
              <button class="btn btn-primary bg-gray-900 hover:bg-gray-800 text-white border-none px-8 h-12 rounded-md" (click)="finalizeOrder()">
                Finalizar a compra
              </button>
            </div>
          </div>

        </div>

        <!-- Footer Links -->
        <div class="mt-12 pt-6 border-t border-gray-200 text-xs text-soft-brown flex flex-wrap gap-4">
          <a href="#" class="hover:underline">Política de reembolso</a>
          <a href="#" class="hover:underline">Frete</a>
          <a href="#" class="hover:underline">Política de privacidade</a>
          <a href="#" class="hover:underline">Termos de serviço</a>
          <a href="#" class="hover:underline">Cancelamentos</a>
          <a href="#" class="hover:underline">Contato</a>
        </div>

      </div>

      <!-- Right Column: Summary -->
      <div class="w-full lg:w-[450px] bg-gray-50 p-6 lg:p-12 border-l border-gray-200">

        <!-- Items List -->
        <div class="flex flex-col gap-4 mb-6 max-h-96 overflow-y-auto pr-2">
          <div *ngFor="let item of cartRepo.items$ | async" class="flex gap-4 items-center">
            <div class="relative">
              <div class="w-16 h-16 rounded-md overflow-hidden border border-gray-200 bg-white">
                <img [src]="item.product.image" [alt]="item.product.name" class="w-full h-full object-cover">
              </div>
              <span class="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{{ item.quantity }}</span>
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-gray-800">{{ item.product.name }}</h4>
              <p class="text-xs text-gray-500">{{ item.product.category }}</p>
            </div>
            <span class="text-sm font-medium text-gray-700">R$ {{ (item.product.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <div class="divider my-4"></div>

        <!-- Totals -->
        <div class="flex flex-col gap-2 text-sm text-gray-600">
          <div class="flex justify-between">
            <span>Subtotal • {{ cartRepo.count$ | async }} itens</span>
            <span class="font-medium text-gray-800">R$ {{ (cartRepo.total$ | async)?.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Frete</span>
            <span class="text-xs text-gray-500">Calculado na próxima etapa</span>
          </div>
        </div>

        <div class="divider my-4"></div>

        <div class="flex justify-between items-end">
          <span class="text-xl font-bold text-gray-800">Total</span>
          <div class="text-right">
            <span class="text-xs text-gray-500 mr-2">BRL</span>
            <span class="text-2xl font-bold text-gray-900">R$ {{ (cartRepo.total$ | async)?.toFixed(2) }}</span>
          </div>
        </div>

        <div class="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
          <h4 class="font-bold text-sm mb-2">Ficou com dúvida no valor?</h4>
          <p class="text-xs text-gray-500">O preço final da promo é confirmado após inserir o cupom de desconto e selecionar o pagamento por PIX.</p>
        </div>

      </div>
    </div>
  `
})
export class CheckoutComponent {
  checkoutForm: FormGroup;
  loadingCep = false;
  ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
  savedAddress: any = null;
  step = 1;

  constructor(
    private fb: FormBuilder,
    public cartRepo: CartRepository,
    public userRepo: UserRepository,
    private viaCep: ViaCepService,
    private whatsapp: WhatsAppService
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.minLength(8)]],
      street: ['', Validators.required],
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      complement: ['']
    });

    // Load saved user data if available
    this.userRepo.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.savedAddress = user.address;
        this.checkoutForm.patchValue({
          name: user.name.split(' ')[0],
          surname: user.name.split(' ').slice(1).join(' '),
          ...user.address
        });
      }
    });
  }

  formatAddress(addr: any): string {
    if (!addr) return '';
    return `${addr.street}, ${addr.number}${addr.complement ? ', ' + addr.complement : ''}, ${addr.neighborhood}, ${addr.city} - ${addr.state}, ${addr.zipCode}`;
  }

  onAddressSelected(event: any) {
    const value = event.target.value;
    if (value === 'saved' && this.savedAddress) {
      this.checkoutForm.patchValue(this.savedAddress);
    } else {
      this.checkoutForm.reset({
        name: this.checkoutForm.get('name')?.value,
        surname: this.checkoutForm.get('surname')?.value
      });
    }
  }

  onCepBlur() {
    const cep = this.checkoutForm.get('zipCode')?.value;
    if (cep && cep.length >= 8) {
      this.loadingCep = true;
      this.viaCep.getAddress(cep).subscribe({
        next: (address) => {
          this.checkoutForm.patchValue({
            street: address.street,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state
          });
          this.loadingCep = false;
        },
        error: () => {
          this.loadingCep = false;
          alert('CEP não encontrado');
        }
      });
    }
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      const formValue = this.checkoutForm.value;
      const user: User = {
        name: `${formValue.name} ${formValue.surname}`,
        address: {
          zipCode: formValue.zipCode!,
          street: formValue.street!,
          number: formValue.number!,
          neighborhood: formValue.neighborhood!,
          city: formValue.city!,
          state: formValue.state!,
          complement: formValue.complement || ''
        }
      };
      // Save user data
      this.userRepo.updateUser(user);

      // Move to next step
      this.step = 2;
    }
  }

  finalizeOrder() {
    const formValue = this.checkoutForm.value;
    const user: User = {
      name: `${formValue.name} ${formValue.surname}`,
      address: {
        zipCode: formValue.zipCode!,
        street: formValue.street!,
        number: formValue.number!,
        neighborhood: formValue.neighborhood!,
        city: formValue.city!,
        state: formValue.state!,
        complement: formValue.complement || ''
      }
    };

    combineLatest([this.cartRepo.items$, this.cartRepo.total$]).pipe(take(1)).subscribe(([items, total]) => {
      const cart: Cart = { items, total: total || 0 };
      this.whatsapp.openWhatsApp(cart, user);
    });
  }
}
