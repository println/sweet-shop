import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    template: `
    <footer class="footer footer-center p-10 bg-base-200 text-base-content rounded mt-auto">
      <div class="grid grid-flow-col gap-4">
        <a class="link link-hover">Sobre nós</a>
        <a class="link link-hover">Contato</a>
      </div>
      <div>
        <p>Copyright © 2025 - All right reserved by Sweet Shop</p>
      </div>
    </footer>
  `
})
export class FooterComponent { }
