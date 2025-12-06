import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="container mx-auto p-8 max-w-2xl">
      <h1 class="text-4xl font-bold text-primary mb-6">Fale Conosco</h1>
      
      <p class="text-lg mb-8 text-base-content/70">
        Tem alguma dúvida ou quer fazer uma encomenda especial? Envie uma mensagem!
      </p>

      <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Nome</span>
          </label>
          <input type="text" formControlName="name" placeholder="Seu nome" class="input input-bordered w-full" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input type="email" formControlName="email" placeholder="seu@email.com" class="input input-bordered w-full" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Mensagem</span>
          </label>
          <textarea formControlName="message" class="textarea textarea-bordered h-32" placeholder="Como podemos ajudar?"></textarea>
        </div>

        <button type="submit" class="btn btn-primary mt-4" [disabled]="contactForm.invalid || isSubmitting">
          <span *ngIf="isSubmitting" class="loading loading-spinner"></span>
          Enviar Mensagem
        </button>
      </form>
    </div>
  `
})
export class ContactComponent {
    contactForm: FormGroup;
    isSubmitting = false;

    constructor(private fb: FormBuilder) {
        this.contactForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            message: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.contactForm.valid) {
            this.isSubmitting = true;
            // Simulate API call
            setTimeout(() => {
                alert('Mensagem enviada com sucesso!');
                this.contactForm.reset();
                this.isSubmitting = false;
            }, 1000);
        }
    }
}
