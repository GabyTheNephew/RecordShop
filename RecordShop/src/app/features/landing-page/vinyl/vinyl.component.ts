import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VinylContainers } from '../../../core/interfaces/vinyl-containers';
import { VinylContainer } from '../../../core/interfaces/vinyl.interface';
import { CartService } from '../../../core/services/cart.service';
import { MusicShopService } from '../../../core/services/music-shop.service';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-vinyl',
  standalone: true,
  imports: [NzButtonModule],
  templateUrl: './vinyl.component.html',
  styleUrl: './vinyl.component.scss'
})
export class VinylComponent implements OnInit {
  @Input() vinylCard!: VinylContainer
  @Output() selectedVinylName = new EventEmitter<string>();

  vinylImage: string = '';
  vinylText: string = '';
  vinylPrice: number = 0;
  vinylDiscImage: string = '';

  constructor(
    public musicShopService: MusicShopService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.vinylImage = this.vinylCard.image;
    this.vinylText = this.vinylCard.text;
    this.vinylPrice = this.vinylCard.price;
    this.vinylDiscImage = this.vinylCard.discImage;
  }

  orderNowButton() {
    // Adaugă vinilul în coș
    this.cartService.addToCart(this.vinylText, this.vinylPrice, 'vinyl');
    
    // Păstrează funcționalitatea existentă
    this.musicShopService.setTitle(this.vinylText);
    
    // Emit evenimentul pentru componenta părinte (dacă e necesar)
    this.selectedVinylName.emit(this.vinylText);
    
    // Feedback vizual (opțional)
    console.log(`Added "${this.vinylText}" to cart`);
  }
}