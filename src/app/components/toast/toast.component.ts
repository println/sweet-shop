import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts$ | async" 
           class="toast" 
           [ngClass]="toast.type"
           (click)="remove(toast.id)">
        <div class="icon">
          <span *ngIf="toast.type === 'success'">✓</span>
          <span *ngIf="toast.type === 'error'">✕</span>
          <span *ngIf="toast.type === 'info'">ℹ</span>
        </div>
        <div class="message">{{ toast.message }}</div>
      </div>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none; /* Allow clicks to pass through container */
    }

    .toast {
      pointer-events: auto;
      min-width: 300px;
      max-width: 90vw;
      padding: 16px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
      border-left: 4px solid transparent;
    }

    .toast.success {
      border-left-color: #2ecc71;
    }
    .toast.success .icon {
      color: #2ecc71;
      background: rgba(46, 204, 113, 0.1);
    }

    .toast.error {
      border-left-color: #e74c3c;
    }
    .toast.error .icon {
      color: #e74c3c;
      background: rgba(231, 76, 60, 0.1);
    }

    .toast.info {
      border-left-color: #3498db;
    }
    .toast.info .icon {
      color: #3498db;
      background: rgba(52, 152, 219, 0.1);
    }

    .icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }

    .message {
      color: #333;
      font-size: 0.95rem;
      font-weight: 500;
      line-height: 1.4;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (max-width: 600px) {
      .toast-container {
        top: auto;
        bottom: 20px;
        left: 20px;
        right: 20px;
      }
      
      .toast {
        width: auto;
        min-width: 0;
      }
    }
  `]
})
export class ToastComponent {
    constructor(public toastService: ToastService) { }

    remove(id: number) {
        this.toastService.remove(id);
    }
}
