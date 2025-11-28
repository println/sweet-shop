import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ImportComponent } from './components/import/import.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'produtos', component: ProductListComponent },
    { path: 'produto/:id', component: ProductDetailComponent },
    { path: 'carrinho', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'importar', component: ImportComponent },
    { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
    { path: '**', redirectTo: 'home' }
];
