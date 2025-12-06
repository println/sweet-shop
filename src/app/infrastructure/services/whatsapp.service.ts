import { Injectable } from '@angular/core';
import { Cart } from '../../domain/models/cart.model';
import { User } from '../../domain/models/user.model';
import { AppSettings } from '../../config/app.config';

@Injectable({
    providedIn: 'root'
})
export class WhatsAppService {

    generateMessage(cart: Cart, user: User): string {
        let message = `*Novo Pedido - ${AppSettings.storeName}*\n\n`;
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
        window.open(`https://wa.me/${AppSettings.contact.whatsapp}?text=${message}`, '_blank');
    }
}
