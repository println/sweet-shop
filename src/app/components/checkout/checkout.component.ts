import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ProfileService } from '../../services/profile.service';
import { Observable } from 'rxjs';
import { CartItem, UserProfile } from '../../models';
import { map, take } from 'rxjs/operators';
import { UserFormComponent } from '../user-form/user-form.component';

import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  total$: Observable<number>;
  currentProfile: UserProfile | null = null;

  addressConfirmed = false;

  constructor(
    private cartService: CartService,
    private profileService: ProfileService,
    private dialogService: DialogService
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.total$ = this.cartItems$.pipe(
      map(items => items.reduce((acc, item) => acc + (item.product.preco * item.quantidade), 0))
    );
  }

  ngOnInit() {
    this.currentProfile = this.profileService.getProfile();
    if (this.currentProfile) {
      this.addressConfirmed = true;
    }
  }

  onAddressConfirmed(profile: UserProfile) {
    this.profileService.saveProfile(profile);
    this.currentProfile = profile;
    this.addressConfirmed = true;
  }

  editAddress() {
    this.addressConfirmed = false;
  }

  cancelEdit() {
    this.addressConfirmed = true;
  }

  onCheckout() {
    if (!this.currentProfile) return;

    this.dialogService.confirm({
      title: 'Confirmar Pedido',
      message: 'Deseja finalizar o pedido e enviar via WhatsApp?',
      confirmText: 'Enviar Pedido',
      cancelText: 'Voltar'
    }).subscribe(confirmed => {
      if (confirmed && this.currentProfile) {
        this.cartItems$.pipe(take(1)).subscribe(items => {
          const total = items.reduce((acc, item) => acc + (item.product.preco * item.quantidade), 0);
          const message = this.createWhatsAppMessage(items, total, this.currentProfile!);
          const phoneNumber = '5511999999999'; // Replace with store number
          const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
          window.open(url, '_blank');
        });
      }
    });
  }

  private createWhatsAppMessage(items: CartItem[], total: number, profile: UserProfile): string {
    let msg = `*Novo Pedido*\n\n`;
    items.forEach(item => {
      msg += `${item.quantidade}x ${item.product.nome} - R$ ${(item.product.preco * item.quantidade).toFixed(2)}\n`;
    });
    msg += `\n*Total: R$ ${total.toFixed(2)}*\n\n`;
    msg += `*Cliente:*\n${profile.nome}\n${profile.telefone}\n\n`;
    msg += `*Endereço:*\n${profile.endereco.rua}, ${profile.endereco.numero}\n${profile.endereco.bairro}\n${profile.endereco.cidade} - ${profile.endereco.estado}\nCEP: ${profile.endereco.cep}\n${profile.endereco.referencia}`;
    return msg;
  }
}
