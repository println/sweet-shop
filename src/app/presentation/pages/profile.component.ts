import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserRepository } from '../../application/state/user.repository';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4 max-w-2xl bg-base-100 rounded-xl shadow-lg">
      <h2 class="text-3xl font-bold mb-8 text-soft-brown text-center">Meu Perfil</h2>

      <div *ngIf="userRepo.user$ | async as user; else noUser">
        <div class="mb-8">
          <h3 class="font-bold text-lg mb-2">Dados Pessoais</h3>
          <p><strong>Nome:</strong> {{ user.name }}</p>
          <p><strong>Endereço:</strong> {{ user.address.street }}, {{ user.address.number }}</p>
          <p>{{ user.address.neighborhood }} - {{ user.address.city }}/{{ user.address.state }}</p>
          <p><strong>CEP:</strong> {{ user.address.zipCode }}</p>
        </div>
      </div>
      <ng-template #noUser>
        <p class="text-center text-gray-500 mb-8">Nenhum dado salvo.</p>
      </ng-template>

      <div class="divider">Gerenciamento de Dados</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button class="btn btn-outline btn-primary" (click)="exportData()">Exportar Dados</button>
        <div class="form-control">
          <label class="btn btn-outline btn-secondary cursor-pointer">
            Importar Dados
            <input type="file" class="hidden" (change)="importData($event)" accept=".json" />
          </label>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  constructor(public userRepo: UserRepository) { }

  exportData() {
    const data = this.userRepo.exportState();
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sweet-shop-data.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  importData(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userRepo.importState(e.target.result);
        alert('Dados importados com sucesso!');
      };
      reader.readAsText(file);
    }
  }
}
