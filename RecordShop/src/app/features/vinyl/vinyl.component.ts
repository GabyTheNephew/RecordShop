import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VinylContainers } from '../../core/interfaces/vinyl-containers';
import { VinylContainer } from '../../core/interfaces/vinyl.interface';
import { MusicShopService } from '../../core/services/music-shop.service';

@Component({
  selector: 'app-vinyl',
  standalone: true,
  imports: [],
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

  constructor(public musicShopService: MusicShopService) { }

  ngOnInit() {
    this.vinylImage = this.vinylCard.image;
    this.vinylText = this.vinylCard.text;
    this.vinylPrice = this.vinylCard.price;
    this.vinylDiscImage = this.vinylCard.discImage;
  }

  orderNowButton() {
    this.musicShopService.setTitle(this.vinylText);
  }
}
