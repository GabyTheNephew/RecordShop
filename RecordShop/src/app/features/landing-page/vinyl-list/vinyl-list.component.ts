import { Component, Output } from '@angular/core';
import { VinylContainer } from '../../../core/interfaces/vinyl.interface';
import { VinylContainers } from '../../../core/interfaces/vinyl-containers';
import { VinylComponent } from "../vinyl/vinyl.component";
import { VinylService } from '../../../core/services/vinyl.service';
import { MusicShopService } from '../../../core/services/music-shop.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vinyl-list',
  standalone: true,
  imports: [VinylComponent, CommonModule],
  templateUrl: './vinyl-list.component.html',
  styleUrl: './vinyl-list.component.scss'
})
export class VinylListComponent {
  smallVinylList: VinylContainer[] = [];
  currentIndex: number = 0;
  itemsPerView: number = 3; 
  
  constructor(public vinylService: VinylService, private musicShopService: MusicShopService) {
    this.smallVinylList = this.vinylService.smallVinylList;
  }

  onAlbumSelect(albumTitle: string) {
    this.musicShopService.setTitle(albumTitle);
  }

  goToPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = Math.max(0, this.smallVinylList.length - this.itemsPerView);
    }
  }

  goToNext() {
    if (this.currentIndex < this.smallVinylList.length - this.itemsPerView) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  get visibleVinyls(): VinylContainer[] {
    return this.smallVinylList.slice(this.currentIndex, this.currentIndex + this.itemsPerView);
  }

  get totalSlides(): number {
    return Math.max(1, this.smallVinylList.length - this.itemsPerView + 1);
  }

  //array pt indicatorii de navi
  get slideIndicators(): number[] {
    return Array.from({ length: this.totalSlides }, (_, i) => i);
  }

  get canGoPrevious(): boolean {
    return this.smallVinylList.length > this.itemsPerView;
  }

  get canGoNext(): boolean {
    return this.smallVinylList.length > this.itemsPerView;
  }
}