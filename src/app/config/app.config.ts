import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from '../app.routes';

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes)]
};

export interface AppConfig {
    storeName: string;
    contact: {
        whatsapp: string;
        email: string;
    };
    social: {
        instagram?: string;
        threads?: string;
        facebook?: string;
        youtube?: string;
        telegram?: string;
    };
    layout: {
        hero: {
            title: string;
            subtitle: string;
            image: string;
        };
        footer: {
            copyrightText: string;
        };
    };
    features: {
        theme: {
            default: string;
            available: string[];
        };
    };
    products: {
        csvUrl: string;
    };
}

export const AppSettings: AppConfig = {
    storeName: 'Mariam Gourmet',
    contact: {
        whatsapp: '5521991237036',
        email: 'mariamgourmet1@gmail.com'
    },
    social: {
        instagram: 'https://www.instagram.com/mariamgourmet',
        threads: 'https://www.threads.com/@mariamgourmet',
        facebook: 'https://www.facebook.com/mariamgourmets/',
        youtube: 'https://youtu.be/js3IgYZUqpY',
        telegram: 'https://t.me/joinchat/g6ka-4_8cfpmNTRh'
    },
    layout: {
        hero: {
            title: 'Mariam Gourmet',
            subtitle: 'Delícias artesanais feitas com amor para você.',
            image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
        },
        footer: {
            copyrightText: 'Copyright © 2025 - All right reserved by'
        }
    },
    features: {
        theme: {
            default: 'chocolate',
            available: [
                'mariam-gourmet',
                'mariam-gourmet-dark',
                'chocolate',
                'abyss', 'acid', 'aqua', 'autumn', 'black', 'bumblebee', 'business', 'caramellatte', 'cmyk', 'coffee', 'corporate', 'cupcake', 'cyberpunk', 'dark', 'dim', 'dracula', 'emerald', 'fantasy', 'forest', 'garden', 'halloween', 'lemonade', 'light', 'lofi', 'luxury', 'night', 'nord', 'pastel', 'retro', 'silk', 'sunset', 'synthwave', 'valentine', 'winter', 'wireframe'
            ]
        }
    },
    products: {
        csvUrl: 'assets/products.csv'
    }
};
