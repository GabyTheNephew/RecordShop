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
  itemsPerView: number = 3; // Numărul de albume vizibile simultan
  
  constructor(public vinylService: VinylService, private musicShopService: MusicShopService) {
    this.smallVinylList = this.vinylService.smallVinylList;
  }

  onAlbumSelect(albumTitle: string) {
    this.musicShopService.setTitle(albumTitle);
  }

  // Navigare la stânga
  goToPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      // Mergi la sfârșitul listei
      this.currentIndex = Math.max(0, this.smallVinylList.length - this.itemsPerView);
    }
  }

  // Navigare la dreapta
  goToNext() {
    if (this.currentIndex < this.smallVinylList.length - this.itemsPerView) {
      this.currentIndex++;
    } else {
      // Mergi la începutul listei
      this.currentIndex = 0;
    }
  }

  // Navigare directă la un index specific
  goToSlide(index: number) {
    this.currentIndex = index;
  }

  // Obține albumele vizibile în momentul curent
  get visibleVinyls(): VinylContainer[] {
    return this.smallVinylList.slice(this.currentIndex, this.currentIndex + this.itemsPerView);
  }

  // Obține numărul total de "slide-uri" posibile
  get totalSlides(): number {
    return Math.max(1, this.smallVinylList.length - this.itemsPerView + 1);
  }

  // Generează array-ul pentru indicatorii de navigație
  get slideIndicators(): number[] {
    return Array.from({ length: this.totalSlides }, (_, i) => i);
  }

  // Verifică dacă butonul "Înapoi" poate fi folosit
  get canGoPrevious(): boolean {
    return this.smallVinylList.length > this.itemsPerView;
  }

  // Verifică dacă butonul "Înainte" poate fi folosit
  get canGoNext(): boolean {
    return this.smallVinylList.length > this.itemsPerView;
  }
}