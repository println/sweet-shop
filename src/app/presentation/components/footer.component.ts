import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppSettings } from '../../config/app.config';
import { ROUTES } from '../../config/routes.config';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-neutral text-neutral-content">
      <footer class="footer max-w-7xl mx-auto p-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside class="max-w-xs">
          <header class="footer-title opacity-100 text-lg mb-2">NOSSA MISSÃO</header>
          <p class="text-sm leading-relaxed">
            A {{ appSettings.storeName }} nasceu para transformar momentos simples em memórias inesquecíveis através da doçura.
            <br/><br/>
            Buscamos a excelência em cada detalhe, inovando nos sabores e mantendo a tradição do carinho artesanal.
          </p>
        </aside> 
        <nav>
          <header class="footer-title opacity-100 text-lg mb-2">INSTITUCIONAL</header> 
          <a [routerLink]="routes.home.path" class="link link-hover">Início</a>
          <a [routerLink]="routes.products.path" class="link link-hover">Produtos</a>
          <a [routerLink]="routes.about.path" class="link link-hover">Sobre nós</a>
          <a [routerLink]="routes.contact.path" class="link link-hover">Contato</a>
        </nav> 
        <nav>
          <header class="footer-title opacity-100 text-lg mb-2">FALE CONOSCO</header> 
          <div class="flex flex-col gap-3">
             <a *ngIf="appSettings.contact.whatsapp" [href]="'https://wa.me/' + appSettings.contact.whatsapp" target="_blank" class="link link-hover flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
               WhatsApp
             </a>
             <a *ngIf="appSettings.contact.email" [href]="'mailto:' + appSettings.contact.email" class="link link-hover flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
               {{ appSettings.contact.email }}
             </a>
          </div>
        </nav>
        <nav>
          <header class="footer-title opacity-100 text-lg mb-2">REDES SOCIAIS</header> 
          <div class="grid grid-flow-col gap-4">
            <!-- Instagram -->
            <a *ngIf="appSettings.social.instagram" [href]="appSettings.social.instagram" target="_blank" class="link link-hover">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <!-- Threads -->
            <a *ngIf="appSettings.social.threads" [href]="appSettings.social.threads" target="_blank" class="link link-hover">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12a7 7 0 1 1-7-7c1.33 0 2.55.37 3.61 1"/><path d="M16 12a4 4 0 1 1-4-4c.93 0 1.8.31 2.5.83"/><path d="M19 8v8a4 4 0 0 1-4 4"/></svg>
            </a>
            <!-- Facebook -->
            <a *ngIf="appSettings.social.facebook" [href]="appSettings.social.facebook" target="_blank" class="link link-hover">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <!-- YouTube -->
            <a *ngIf="appSettings.social.youtube" [href]="appSettings.social.youtube" target="_blank" class="link link-hover">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
            <!-- Telegram -->
             <a *ngIf="appSettings.social.telegram" [href]="appSettings.social.telegram" target="_blank" class="link link-hover">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </a>
          </div>
        </nav>
      </footer>
    </div>
    <div class="bg-neutral text-neutral-content">
      <footer class="footer footer-center p-4 max-w-7xl mx-auto">
        <aside>
          <p>{{ appSettings.layout.footer.copyrightText }} {{ appSettings.storeName }} - {{ currentYear }}</p>
        </aside>
      </footer>
    </div>
  `
})
export class FooterComponent {
  appSettings = AppSettings;
  routes = ROUTES;
  currentYear = new Date().getFullYear();
}
