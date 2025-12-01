import { Routes } from '@angular/router';
import { HomeComponent } from './presentation/pages/home.component';
import { ProductsComponent } from './presentation/pages/products.component';
import { CheckoutComponent } from './presentation/pages/checkout.component';
import { ProfileComponent } from './presentation/pages/profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'products/:id', loadComponent: () => import('./presentation/pages/product-detail.component').then(m => m.ProductDetailComponent) },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '**', redirectTo: '' }
];
