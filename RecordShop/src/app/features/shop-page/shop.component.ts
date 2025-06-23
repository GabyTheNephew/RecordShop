import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';

import { VinylComponent } from '../landing-page/vinyl/vinyl.component';
import { CdComponent } from '../landing-page/cd/cd.component';
import { NavbarComponent } from '../landing-page/navbar/navbar.component'; // ADAUGĂ IMPORT
import { VinylService } from '../../core/services/vinyl.service';
import { CdService } from '../../core/services/cd.service';
import { MusicShopService } from '../../core/services/music-shop.service';
import { CartService, CartItem } from '../../core/services/cart.service';

import { VinylContainer } from '../../core/interfaces/vinyl.interface';
import { CdContainer } from '../../core/interfaces/cd.interface';

// Interface simplă pentru produsele unificate
interface ProductItem {
  id: string;
  text: string;
  type: 'vinyl' | 'cd';
  data: VinylContainer | CdContainer;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzTableModule,
    NzInputNumberModule,
    FormsModule,
    VinylComponent,
    CdComponent,
    NavbarComponent // ADAUGĂ ÎN IMPORTS
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  sortedProducts: ProductItem[] = [];
  
  // Modal state
  isCartVisible = false;
  isThankYouVisible = false;
  cartItems: CartItem[] = [];
  totalPrice = 0;

  constructor(
    private router: Router,
    private vinylService: VinylService,
    private cdService: CdService,
    private musicShopService: MusicShopService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  private loadAllProducts() {
    // Obține toate vinilurile
    const vinyls = this.vinylService.smallVinylList || [];
    const vinylProducts: ProductItem[] = vinyls.map((vinyl, index) => ({
      id: `vinyl-${index}`,
      text: vinyl.text,
      type: 'vinyl',
      data: vinyl
    }));

    // Obține toate CD-urile
    const cds = this.cdService.smallCdList || [];
    const cdProducts: ProductItem[] = cds.map((cd, index) => ({
      id: `cd-${index}`,
      text: cd.text,
      type: 'cd',
      data: cd
    }));

    // Combină toate produsele
    const allProducts = [...vinylProducts, ...cdProducts];

    // Sortează alfabetic după nume (text)
    this.sortedProducts = allProducts.sort((a, b) => 
      a.text.toLowerCase().localeCompare(b.text.toLowerCase())
    );
  }

  onProductSelect(productName: string) {
    // Setează produsul selectat în service
    this.musicShopService.setTitle(productName);
  }

  // Helper methods pentru type casting
  getVinylData(data: VinylContainer | CdContainer): VinylContainer {
    return data as VinylContainer;
  }

  getCdData(data: VinylContainer | CdContainer): CdContainer {
    return data as CdContainer;
  }

  showCart() {
    // Obține produsele din coș
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
    
    if (this.cartItems.length === 0) {
      // Dacă coșul e gol, afișează mesaj
      alert('Your cart is empty! Please add some products first.');
      return;
    }
    
    // Afișează modal-ul cu coșul
    this.isCartVisible = true;
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    this.cartService.updateQuantity(item.id, newQuantity);
    // Actualizează lista locală
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  removeItem(itemId: string) {
    this.cartService.removeFromCart(itemId);
    // Actualizează lista locală
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  continueShopping() {
    // Închide modal-ul dar păstrează conținutul coșului
    this.isCartVisible = false;
  }

  cancelOrder() {
    // Anulează comanda - golește coșul și închide modal-ul
    this.cartService.clearCart();
    this.cartItems = [];
    this.totalPrice = 0;
    this.isCartVisible = false;
  }

  placeOrder() {
    // Plasează comanda - afișează mesajul de mulțumire
    this.isCartVisible = false;
    this.isThankYouVisible = true;
    
    // Golește coșul după comandă
    this.cartService.clearCart();
    this.cartItems = [];
    this.totalPrice = 0;
  }

  closeThankYou() {
    this.isThankYouVisible = false;
  }

  goToHomePage() {
    // Navighează înapoi la pagina principală
    this.router.navigate(['/home']).then(() => {
      // Scroll la începutul paginii
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}