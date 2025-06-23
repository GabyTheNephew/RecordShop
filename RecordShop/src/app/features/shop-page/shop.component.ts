import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';

import { VinylComponent } from '../landing-page/vinyl/vinyl.component';
import { CdComponent } from '../landing-page/cd/cd.component';
import { NavbarComponent } from '../landing-page/navbar/navbar.component';
import { VinylService } from '../../core/services/vinyl.service';
import { CdService } from '../../core/services/cd.service';
import { MusicShopService, SearchResult } from '../../core/services/music-shop.service';
import { CartService, CartItem } from '../../core/services/cart.service';

import { VinylContainer } from '../../core/interfaces/vinyl.interface';
import { CdContainer } from '../../core/interfaces/cd.interface';

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
    NavbarComponent
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit, OnDestroy {
  allProducts: ProductItem[] = [];
  filteredProducts: ProductItem[] = [];
  searchSubscription?: Subscription;
  
  isCartVisible = false;
  isThankYouVisible = false;
  cartItems: CartItem[] = [];
  totalPrice = 0;

  constructor(
    private router: Router,
    private vinylService: VinylService,
    private cdService: CdService,
    public musicShopService: MusicShopService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadAllProducts();
    this.setupSearchSubscription();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  private lastSearchTerm: string = '';

  private loadAllProducts() {
    const vinyls = this.vinylService.smallVinylList || [];
    const vinylProducts: ProductItem[] = vinyls.map((vinyl, index) => ({
      id: `vinyl-${index}`,
      text: vinyl.text,
      type: 'vinyl',
      data: vinyl
    }));

    const cds = this.cdService.smallCdList || [];
    const cdProducts: ProductItem[] = cds.map((cd, index) => ({
      id: `cd-${index}`,
      text: cd.text,
      type: 'cd',
      data: cd
    }));
    //combin produsele
    this.allProducts = [...vinylProducts, ...cdProducts];

    this.allProducts = this.allProducts.sort((a, b) => 
      a.text.toLowerCase().localeCompare(b.text.toLowerCase())
    );

    this.filteredProducts = [...this.allProducts];
  }

  private setupSearchSubscription() {
    setInterval(() => {
      this.checkForSearch();
    }, 100); 

    this.checkForSearch();
  }

  private checkForSearch() {
    const currentSearchTerm = this.musicShopService.title();
    
    if (currentSearchTerm !== this.lastSearchTerm) {
      this.lastSearchTerm = currentSearchTerm;
      
      if (currentSearchTerm && currentSearchTerm.trim() !== '') {
        this.performSearch(currentSearchTerm);
      } else {
        this.filteredProducts = [...this.allProducts];
      }
    }
  }

  private performSearch(searchTerm: string) {
    console.log('=== SHOP SEARCH ===');
    console.log('Search term:', searchTerm);

    this.filteredProducts = this.allProducts.filter(product => 
      product.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get sectionTitle(): string {
    const searchTerm = this.musicShopService.title();
    if (searchTerm && searchTerm.trim() !== '') {
      return `Search Results for "${searchTerm}"`;
    }
    return 'Our Complete Collection';
  }

  get sectionSubtitle(): string {
    const searchTerm = this.musicShopService.title();
    if (searchTerm && searchTerm.trim() !== '') {
      return `Found ${this.filteredProducts.length} product(s) matching your search`;
    }
    return 'Browse all our vinyls and CDs in alphabetical order';
  }

  onProductSelect(productName: string) {
    this.musicShopService.setTitle(productName);
  }

  clearSearch() {
    this.musicShopService.clearSearch();
    this.filteredProducts = [...this.allProducts];
  }

  getVinylData(data: VinylContainer | CdContainer): VinylContainer {
    return data as VinylContainer;
  }

  getCdData(data: VinylContainer | CdContainer): CdContainer {
    return data as CdContainer;
  }

  showCart() {
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
    
    if (this.cartItems.length === 0) {
      alert('Your cart is empty! Please add some products first.');
      return;
    }
    
    this.isCartVisible = true;
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    this.cartService.updateQuantity(item.id, newQuantity);
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  removeItem(itemId: string) {
    this.cartService.removeFromCart(itemId);
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  continueShopping() {
    this.isCartVisible = false;
  }

  cancelOrder() {
    this.cartService.clearCart();
    this.cartItems = [];
    this.totalPrice = 0;
    this.isCartVisible = false;
  }

  placeOrder() {
    this.isCartVisible = false;
    this.isThankYouVisible = true;
    
    this.cartService.clearCart();
    this.cartItems = [];
    this.totalPrice = 0;
  }

  closeThankYou() {
    this.isThankYouVisible = false;
  }

  goToHomePage() {
    this.clearSearch();
    
    this.router.navigate(['/home']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}