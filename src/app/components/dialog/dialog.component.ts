import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'app-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dialog-overlay" *ngIf="dialogService.dialog$ | async as dialog">
      <div class="dialog-content">
        <h3>{{ dialog.title }}</h3>
        <p>{{ dialog.message }}</p>
        
        <div class="dialog-actions">
          <button *ngIf="dialog.type === 'confirm'" 
                  class="btn-cancel" 
                  (click)="onClose(false)">
            {{ dialog.cancelText }}
          </button>
          <button class="btn-confirm" 
                  (click)="onClose(true)">
            {{ dialog.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease-out;
    }

    .dialog-content {
      background: white;
      padding: 24px;
      border-radius: 16px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      animation: scaleIn 0.2s ease-out;
    }

    h3 {
      margin: 0 0 12px 0;
      color: var(--primary-color);
      font-size: 1.25rem;
    }

    p {
      color: #666;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    button {
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: transform 0.1s;
    }

    button:active {
      transform: scale(0.98);
    }

    .btn-cancel {
      background: #f5f5f5;
      color: #666;
    }

    .btn-confirm {
      background: var(--primary-color);
      color: white;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class DialogComponent {
    constructor(public dialogService: DialogService) { }

    onClose(result: boolean) {
        this.dialogService.close(result);
    }
}
