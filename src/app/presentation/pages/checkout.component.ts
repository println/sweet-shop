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
import { AppSettings } from '../../config/app.config';
import { ROUTES } from '../../config/routes.config';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flex flex-col lg:flex-row min-h-screen max-w-7xl mx-auto">
      <!-- Left Column: Main Content -->
      <div class="flex-1 flex flex-col p-4 md:p-6 lg:px-20 lg:py-12 bg-base-100 items-center lg:items-end">
        <div class="w-full max-w-xl">
          <h1 class="mb-5 text-3xl font-bold text-primary">{{ appSettings.storeName }}</h1>          
          <!-- Header / Breadcrumbs -->
          <div class="flex items-center gap-2 text-sm text-base-content/60 mb-8">
            <a [routerLink]="routes.home.path" [queryParams]="{openCart: 'true'}" class="hover:text-primary transition-colors">Carrinho</a>
            <span class="text-xs">></span>
            <span
              [class.font-bold]="step === 1"
              [class.text-base-content]="step === 1"
              [class.cursor-pointer]="step > 1"
              [class.hover:text-primary]="step > 1"
              (click)="step > 1 ? step = 1 : null">
              Informações
            </span>
            <span class="text-xs">></span>
            <span [class.font-bold]="step === 2" [class.text-base-content]="step === 2">Confirmação</span>
          </div>

          <!-- Content Area -->
          <div class="flex-grow">
            <!-- Step 1: Address Form -->
            <div *ngIf="step === 1">
              <div class="mb-8">
                <h2 class="text-xl font-bold text-primary mb-4">Contato</h2>
                <div class="flex justify-between items-center text-sm mb-4">
                  <span class="text-base-content/70">{{ (userRepo.user$ | async)?.name || 'Visitante' }}</span>
                  <a [routerLink]="routes.profile.path" class="link link-hover text-primary">Sair</a>
                </div>
              </div>

              <div class="mb-8">
                <h2 class="text-xl font-bold text-primary mb-6">Endereço de entrega</h2>

                <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                  <!-- Saved Addresses -->
                  <div class="form-control w-full">
                    <label class="label"><span class="label-text">Endereços salvos</span></label>
                    <select class="select select-bordered w-full bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary" (change)="onAddressSelected($event)">
                      <option *ngIf="savedAddress" [value]="'saved'">{{ formatAddress(savedAddress) }}</option>
                      <option [value]="'new'" [selected]="!savedAddress">Usar um novo endereço</option>
                    </select>
                  </div>

                  <!-- Name & Surname -->
                  <div class="flex gap-4">
                    <div class="form-control w-full">
                      <input type="text" formControlName="name" placeholder="Nome" class="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div class="form-control w-full">
                      <input type="text" formControlName="surname" placeholder="Sobrenome" class="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>

                  <!-- CEP -->
                  <div class="form-control w-full relative">
                    <input type="text" formControlName="zipCode" placeholder="CEP" class="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary" (blur)="onCepBlur()" />
                    <div class="absolute right-3 top-3" *ngIf="loadingCep">
                      <span class="loading loading-spinner loading-xs text-primary"></span>
                    </div>
                    <div class="absolute right-3 top-3 cursor-pointer" *ngIf="!loadingCep" (click)="onCepBlur()">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  <!-- Address & Number -->
                  <div class="flex gap-4">
                    <div class="form-control flex-grow">
                      <input type="text" formControlName="street" placeholder="Endereço" class="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div class="form-control w-24">
                      <input type="text" formControlName="number" placeholder="Número" class="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>

                  <!-- Complement & Neighborhood -->
                  <div class="flex gap-4">
                    <div class="form-control w-full">
                      <input type="text" formControlName="complement" placeholder="Apartamento, bloco etc. (opcional)" class="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div class="form-control w-full">
                      <input type="text" formControlName="neighborhood" placeholder="Bairro" class="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>

                  <!-- City & State -->
                  <div class="flex gap-4">
                    <div class="form-control w-full">
                      <input type="text" formControlName="city" placeholder="Cidade" class="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div class="form-control w-full">
                      <select formControlName="state" class="select select-bordered w-full bg-base-100 focus:border-primary focus:ring-1 focus:ring-primary">
                        <option value="" disabled selected>Estado</option>
                        <option *ngFor="let uf of ufs" [value]="uf">{{ uf }}</option>
                      </select>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex justify-between items-center mt-6">
                    <a [routerLink]="routes.home.path" [queryParams]="{openCart: 'true'}" class="flex items-center gap-2 text-sm text-primary hover:underline">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Voltar ao carrinho
                    </a>
                    <button type="submit" class="btn btn-primary text-primary-content border-none px-8 h-12 rounded-md" [disabled]="checkoutForm.invalid || (cartRepo.count$ | async) === 0">
                      Confirmar endereço e continuar
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Step 2: Summary & Shipping / Payment -->
            <div *ngIf="step === 2" class="mb-8">
              <div class="border border-base-300 rounded-lg p-4 bg-base-100">
                <!-- Contact Summary -->
                <div class="flex justify-between items-start py-2 border-b border-base-200">
                  <div class="flex gap-8">
                    <span class="text-base-content/60 w-24">Contato</span>
                    <span class="text-base-content/80">{{ (userRepo.user$ | async)?.name || 'Visitante' }}</span>
                  </div>
                  <button class="btn btn-link btn-xs text-primary no-underline hover:underline" (click)="step = 1">Alterar</button>
                </div>

                <!-- Address Summary -->
                <div class="flex justify-between items-start py-2 border-b border-base-200">
                  <div class="flex gap-8">
                    <span class="text-base-content/60 w-24">Enviar para</span>
                    <span class="text-base-content/80 flex-1">{{ formatAddress(checkoutForm.value) }}</span>
                  </div>
                  <button class="btn btn-link btn-xs text-primary no-underline hover:underline" (click)="step = 1">Alterar</button>
                </div>

                <!-- Shipping Summary (Placeholder/Mock) -->
                <div class="flex justify-between items-start py-2">
                  <div class="flex gap-8">
                    <span class="text-base-content/60 w-24">Forma de frete</span>
                    <span class="text-base-content/80">À combinar via WhatsApp</span>
                  </div>
                </div>
              </div>

              <div class="mt-8">
                <h3 class="text-xl font-bold text-primary mb-4">Pagamento</h3>
                <div class="bg-base-200 p-4 rounded-lg text-center text-base-content/60">
                  O pagamento será combinado via WhatsApp após a confirmação do pedido.
                </div>
              </div>

              <div class="flex justify-between items-center mt-6">
                <button class="btn btn-ghost btn-sm gap-2 text-primary hover:underline normal-case font-normal" (click)="step = 1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar para as informações
                </button>
                <button class="btn btn-primary text-primary-content border-none px-8 h-12 rounded-md" (click)="finalizeOrder()">
                  Finalizar a compra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Order Summary -->
      <div class="w-full lg:w-[450px] bg-base-200/50 p-4 md:p-6 lg:px-8 lg:py-12 border-l border-base-300">
        <div class="sticky top-6">
          <!-- Items List -->
          <div class="flex flex-col gap-4 mb-6 max-h-96 overflow-y-auto p-4">
            <div *ngFor="let item of cartRepo.items$ | async" class="flex gap-4 items-center">
              <div class="relative">
                <div class="w-16 h-16 rounded-md overflow-hidden border border-base-300 bg-base-100">
                  <img [src]="item.product.image" [alt]="item.product.name" class="w-full h-full object-cover">
                </div>
                <span class="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full z-10 shadow-sm">{{ item.quantity }}</span>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-medium text-base-content">{{ item.product.name }}</h4>
                <p class="text-xs text-base-content/60">{{ item.product.category }}</p>
              </div>
              <span class="text-sm font-medium text-base-content/80">R$ {{ (item.product.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="divider my-4"></div>

          <!-- Totals -->
          <div class="flex flex-col gap-2 text-sm text-base-content/70">
            <div class="flex justify-between">
              <span>Subtotal • {{ cartRepo.count$ | async }} itens</span>
              <span class="font-medium text-base-content">R$ {{ (cartRepo.total$ | async)?.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Frete</span>
              <span class="text-xs text-base-content/60">Calculado na próxima etapa</span>
            </div>
          </div>

          <div class="divider my-4"></div>

          <div class="flex justify-between items-end">
            <span class="text-xl font-bold text-base-content">Total</span>
            <div class="text-right">
              <span class="text-xs text-base-content/60 mr-2">BRL</span>
              <span class="text-2xl font-bold text-base-content">R$ {{ (cartRepo.total$ | async)?.toFixed(2) }}</span>
            </div>
          </div>

          <div class="mt-6 p-4 bg-base-100 border border-base-300 rounded-lg">
            <h4 class="font-bold text-sm mb-2">Ficou com dúvida no valor?</h4>
            <p class="text-xs text-base-content/60">O preço final da promo é confirmado após inserir o cupom de desconto e selecionar o pagamento por PIX.</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CheckoutComponent {
  appSettings = AppSettings;
  routes = ROUTES;
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
