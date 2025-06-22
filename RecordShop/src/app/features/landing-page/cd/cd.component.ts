import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdContainer } from '../../../core/interfaces/cd.interface';
import { CartService } from '../../../core/services/cart.service';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-cd',
  standalone: true,
  imports: [NzButtonModule],
  templateUrl: './cd.component.html',
  styleUrl: './cd.component.scss'
})
export class CdComponent implements OnInit {
  @Input() cdCard!: CdContainer
  @Output() selectedCdName = new EventEmitter<string>();

  cdImage: string = '';
  cdText: string = '';
  cdPrice: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cdImage = this.cdCard.image;
    this.cdText = this.cdCard.text;
    this.cdPrice = this.cdCard.price;
  }

  onOrderNow() {
    // Adaugă CD-ul în coș
    this.cartService.addToCart(this.cdText, this.cdPrice, 'cd');
    
    // Emit evenimentul pentru componenta părinte (dacă e necesar)
    this.selectedCdName.emit(this.cdText);
    
    // Feedback vizual (opțional)
    console.log(`Added "${this.cdText}" to cart`);
  }
}