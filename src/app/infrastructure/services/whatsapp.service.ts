import { Injectable } from '@angular/core';
import { Cart } from '../../domain/models/cart.model';
import { User } from '../../domain/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class WhatsAppService {
    private readonly PHONE_NUMBER = '5511999999999'; // Placeholder

    generateMessage(cart: Cart, user: User): string {
        let message = `*Novo Pedido - Sweet Shop*\n\n`;
        message += `*Cliente:* ${user.name}\n`;
        message += `*Endereço:* ${user.address.street}, ${user.address.number} - ${user.address.neighborhood}, ${user.address.city}/${user.address.state}\n`;
        if (user.address.complement) {
            message += `*Complemento:* ${user.address.complement}\n`;
        }
        message += `\n*Itens:*\n`;

        cart.items.forEach(item => {
            message += `- ${item.quantity}x ${item.product.name} (R$ ${item.product.price.toFixed(2)})\n`;
        });

        message += `\n*Total:* R$ ${cart.total.toFixed(2)}`;

        return encodeURIComponent(message);
    }

    openWhatsApp(cart: Cart, user: User): void {
        const message = this.generateMessage(cart, user);
        window.open(`https://wa.me/${this.PHONE_NUMBER}?text=${message}`, '_blank');
    }
}
