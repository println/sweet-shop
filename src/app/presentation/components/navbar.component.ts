import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartRepository } from '../../application/state/cart.repository';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="navbar bg-base-100 shadow-sm px-4 md:px-8">
      <div class="navbar-start">
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a routerLink="/products">Produtos</a></li>
            <li><a routerLink="/">Sobre</a></li>
            <li><a routerLink="/">Contato</a></li>
          </ul>
        </div>
        <a routerLink="/" class="btn btn-ghost text-xl font-bold text-soft-brown">Sweet Shop</a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 gap-2">
          <li><a routerLink="/products" class="font-medium hover:text-soft-brown">Produtos</a></li>
          <li><a routerLink="/" class="font-medium hover:text-soft-brown">Sobre</a></li>
          <li><a routerLink="/" class="font-medium hover:text-soft-brown">Contato</a></li>
        </ul>
      </div>
      <div class="navbar-end gap-2">
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img src="https://ui-avatars.com/api/?name=User&background=E8DCCA&color=5D4037" alt="Profile" />
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a routerLink="/profile" class="justify-between">Minha Conta</a></li>
            <li><a>Sair</a></li>
          </ul>
        </div>
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle" (click)="toggleCart()">
            <div class="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="badge badge-sm indicator-item badge-primary" *ngIf="count$ | async as count">{{ count }}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  `
})
export class NavbarComponent {
  count$;

  constructor(private cartRepo: CartRepository) {
    this.count$ = this.cartRepo.count$;
  }

  toggleCart() {
    this.cartRepo.toggleCart();
  }
}
