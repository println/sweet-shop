import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSettings } from '../../config/app.config';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-8 max-w-4xl">
      <h1 class="text-4xl font-bold text-primary mb-6">Sobre Nós</h1>
      
      <div class="prose max-w-none">
        <p class="text-lg mb-4">
          Bem-vindo à {{ appSettings.storeName }}! Somos apaixonados por trazer doçura para sua vida através de nossas receitas artesanais.
        </p>
        
        <p class="mb-4">
          Nossa jornada começou com o sonho de criar bolos e doces que não apenas parecessem incríveis, mas tivessem um sabor de "feito em casa" com um toque de sofisticação.
        </p>

        <img src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" alt="Nossa Cozinha" class="w-full h-64 object-cover rounded-xl my-8 shadow-lg">

        <h2 class="text-2xl font-bold text-primary mb-4">Nossa Missão</h2>
        <p>
          Utilizar apenas os melhores ingredientes, valorizar processos artesanais e garantir que cada mordida seja uma experiência inesquecível.
        </p>
      </div>
    </div>
  `
})
export class AboutComponent {
  appSettings = AppSettings;
}
