import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserFormComponent } from '../user-form/user-form.component';
import { ProfileService } from '../../services/profile.service';
import { CartService } from '../../services/cart.service';
import { CompressionService } from '../../services/compression.service';
import { UserProfile } from '../../models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UserFormComponent],
  template: `
    <div class="profile-container">
      <h2>Meu Perfil</h2>
      
      <div class="card">
        <app-user-form 
          [initialData]="currentProfile" 
          [submitLabel]="'Salvar Alterações'"
          (formSubmit)="onSaveProfile($event)">
        </app-user-form>
      </div>

      <div class="actions-section">
        <div class="card export-card">
          <h3>Exportar Dados</h3>
          <p>Copie seus dados para usar em outro dispositivo.</p>
          <button class="action-btn export" (click)="exportData()">
            <span class="icon">📋</span> Copiar Dados
          </button>
        </div>

        <div class="card import-card">
          <h3>Importar Dados</h3>
          <p>Cole os dados exportados de outro dispositivo.</p>
          <div class="import-area">
            <textarea 
              [(ngModel)]="importString" 
              placeholder="Cole o código aqui..."
              rows="3">
            </textarea>
            <button class="action-btn import" (click)="importData()" [disabled]="!importString">
              <span class="icon">📥</span> Importar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    h2 {
      color: var(--primary-color);
      margin-bottom: 2rem;
      text-align: center;
      font-size: 2rem;
    }

    .card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      margin-bottom: 2rem;
    }

    .actions-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    h3 {
      color: var(--text-color);
      margin: 0 0 0.5rem 0;
    }

    p {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }

    .action-btn {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .export {
      background: #e3f2fd;
      color: #1976d2;
    }

    .export:hover {
      background: #bbdefb;
    }

    .import {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .import:hover:not(:disabled) {
      background: #e1bee7;
    }

    .import:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .import-area {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    textarea {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      resize: vertical;
      font-family: monospace;
    }

    @media (max-width: 768px) {
      .actions-section {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentProfile: UserProfile | null = null;
  importString: string = '';

  constructor(
    private profileService: ProfileService,
    private cartService: CartService,
    private compressionService: CompressionService
  ) { }

  ngOnInit() {
    this.currentProfile = this.profileService.getProfile();
  }

  onSaveProfile(profile: UserProfile) {
    this.profileService.saveProfile(profile);
    this.currentProfile = profile;
    alert('Perfil salvo com sucesso!');
  }

  exportData() {
    const cart = this.cartService.getCartState();
    const profile = this.profileService.getProfile();

    if (!profile) {
      alert('Salve seu perfil antes de exportar.');
      return;
    }

    const state = { cart, profile };
    const compressed = this.compressionService.compressState(state);

    // We export just the compressed string for manual copy/paste in the profile page context
    // Or we could keep the URL format if we want to support both. 
    // The requirement says "copiar os dados para exportação", implying the data string itself might be better for the text area.
    // However, to keep compatibility with the ImportComponent (url based), let's export the full URL.
    // Wait, the user said "copiar os dados para exportação". 
    // Let's stick to the URL format as it's more versatile (can be shared), 
    // but maybe for the "paste" box we should support both raw string and URL?
    // Let's stick to the URL for now as it was working.

    const url = `${window.location.origin}/importar?state=${compressed}`;

    navigator.clipboard.writeText(url).then(() => {
      alert('Link de exportação copiado! Você pode colar no campo de importação de outro dispositivo.');
    }).catch(err => {
      console.error('Erro ao copiar', err);
      alert('Erro ao copiar dados.');
    });
  }

  importData() {
    try {
      let stateStr = this.importString.trim();

      // Extract state param if it's a URL
      if (stateStr.includes('state=')) {
        const url = new URL(stateStr);
        stateStr = url.searchParams.get('state') || '';
      }

      if (!stateStr) {
        alert('Dados inválidos.');
        return;
      }

      const appState = this.compressionService.decompressState(stateStr);

      if (appState) {
        if (confirm('Isso irá substituir seu carrinho e perfil atuais. Deseja continuar?')) {
          this.cartService.setCartState(appState.cart);
          this.profileService.saveProfile(appState.profile);
          this.currentProfile = appState.profile;
          this.importString = '';
          alert('Dados importados com sucesso!');
          // Force reload to update form if needed, or just reassign currentProfile which triggers change detection
          window.location.reload();
        }
      } else {
        alert('Dados corrompidos ou inválidos.');
      }
    } catch (e) {
      alert('Erro ao processar dados.');
      console.error(e);
    }
  }
}
