import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompressionService } from '../../services/compression.service';
import { CartService } from '../../services/cart.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [],
  templateUrl: './import.component.html',
  styleUrl: './import.component.css'
})
export class ImportComponent implements OnInit {
  message = 'Processando importação...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private compressionService: CompressionService,
    private cartService: CartService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const state = params['state'];
      if (state) {
        const appState = this.compressionService.decompressState(state);
        if (appState) {
          this.cartService.setCartState(appState.cart);
          this.profileService.saveProfile(appState.profile);
          this.message = 'Importação concluída com sucesso! Redirecionando...';
          setTimeout(() => this.router.navigate(['/home']), 2000);
        } else {
          this.message = 'Erro ao importar: Estado inválido ou corrompido.';
        }
      } else {
        this.message = 'Nenhum estado fornecido para importação.';
      }
    });
  }
}
