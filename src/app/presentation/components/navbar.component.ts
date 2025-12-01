import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartRepository } from '../../application/state/cart.repository';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Navbar -->
    <div class="navbar bg-base-100 shadow-sm px-0 md:px-8 fixed top-0 left-0 right-0 z-50 w-full h-16">
      
      <!-- Navbar Start: Hamburger (Mobile) -->
      <div class="navbar-start lg:hidden h-full">
        <button class="btn btn-ghost rounded-none h-full aspect-square p-0 pl-2 ml-2 flex items-center justify-start" (click)="toggleMobileMenu()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <!-- Navbar Start: Desktop Menu (Hidden on Mobile) -->
      <div class="navbar-start hidden lg:flex">
         <a routerLink="/" class="btn btn-ghost text-xl font-bold text-soft-brown md:ml-[-1em]">Sweet Shop</a>
      </div>

      <!-- Navbar Center: Logo (Mobile) / Menu (Desktop) -->
      <div class="navbar-center lg:hidden">
        <a routerLink="/" class="btn btn-ghost text-xl font-bold text-soft-brown uppercase tracking-widest">Sweet Shop</a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 gap-6">
          <li><a routerLink="/products" class="font-medium hover:text-soft-brown uppercase tracking-wide text-sm">Produtos</a></li>
          <li><a routerLink="/" class="font-medium hover:text-soft-brown uppercase tracking-wide text-sm">Sobre</a></li>
          <li><a routerLink="/" class="font-medium hover:text-soft-brown uppercase tracking-wide text-sm">Contato</a></li>
        </ul>
      </div>

      <!-- Navbar End: Icons -->
      <div class="navbar-end flex gap-2 pr-4 md:pr-0">
        <!-- Search Icon (Mock) -->
        <button class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>

        <!-- User Profile (Desktop Only) -->
        <div class="dropdown dropdown-end hidden lg:block">
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

        <!-- Cart Icon -->
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle" (click)="toggleCart()">
            <div class="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span class="badge badge-sm indicator-item badge-primary" *ngIf="count$ | async as count">{{ count }}</span>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Full Screen Mobile Menu Overlay -->
    <div class="fixed inset-0 z-[60] bg-black text-white transition-transform duration-300 ease-in-out lg:hidden"
         [class.translate-x-0]="isMobileMenuOpen"
         [class.-translate-x-full]="!isMobileMenuOpen">
      
      <!-- Menu Header -->
      <div class="flex items-center justify-between px-4 h-16 border-b border-gray-800">
        <!-- Close Button -->
        <button class="btn btn-ghost btn-circle text-white" (click)="toggleMobileMenu()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <!-- Logo -->
        <div class="text-xl font-bold uppercase tracking-widest">Sweet Shop</div>

        <!-- Right Icons -->
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-circle text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          <button class="btn btn-ghost btn-circle text-white" (click)="toggleCart(); toggleMobileMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </button>
        </div>
      </div>

      <!-- Menu Content -->
      <div class="p-6 overflow-y-auto h-[calc(100vh-64px)]">
        
        <!-- User Greeting -->
        <a routerLink="/profile" (click)="closeMobileMenu()" class="flex items-center justify-between mb-8 pb-4 border-b border-gray-800 group cursor-pointer">
          <div>
            <div class="text-xl font-bold group-hover:text-gray-300 transition-colors">Oi, Felipe</div>
            <div class="text-sm text-gray-400">Que bom que você voltou</div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </a>

        <!-- Links -->
        <nav class="flex flex-col gap-6">
          <a routerLink="/products" (click)="closeMobileMenu()" class="text-lg font-bold uppercase tracking-wide flex justify-between items-center group">
            Produtos
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          </a>
          <a routerLink="/" (click)="closeMobileMenu()" class="text-lg font-bold uppercase tracking-wide flex justify-between items-center">
            Kits
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          </a>
          <a routerLink="/" (click)="closeMobileMenu()" class="text-lg font-bold uppercase tracking-wide flex justify-between items-center">
            Presentes
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          </a>
          <a routerLink="/" (click)="closeMobileMenu()" class="text-lg font-bold uppercase tracking-wide">
            Sobre Nós
          </a>
          <a routerLink="/" (click)="closeMobileMenu()" class="text-lg font-bold uppercase tracking-wide">
            Fale Conosco
          </a>
        </nav>

        <!-- Bottom Actions -->
        <div class="mt-12 pt-8 border-t border-gray-800 flex flex-col gap-4">
          <button class="btn btn-outline btn-block text-white border-white hover:bg-white hover:text-black uppercase">Minha Conta</button>
          <button class="btn btn-ghost btn-block text-gray-400 uppercase">Sair</button>
        </div>

      </div>
    </div>
  `
})
export class NavbarComponent {
  count$;
  isMobileMenuOpen = false;

  constructor(private cartRepo: CartRepository) {
    this.count$ = this.cartRepo.count$;
  }

  toggleCart() {
    this.cartRepo.toggleCart();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }
}
