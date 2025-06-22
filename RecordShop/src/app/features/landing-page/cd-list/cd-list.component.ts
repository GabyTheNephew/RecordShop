import { Component } from '@angular/core';
import { CdContainer } from '../../../core/interfaces/cd.interface';
import { CdContainers } from '../../../core/interfaces/cd-containers';
import { CdComponent } from "../cd/cd.component";
import { CdService } from '../../../core/services/cd.service';
import { MusicShopService } from '../../../core/services/music-shop.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cd-list',
  standalone: true,
  imports: [CdComponent, CommonModule],
  templateUrl: './cd-list.component.html',
  styleUrl: './cd-list.component.scss'
})
export class CdListComponent {
  smallCdList: CdContainer[] = [];
  selectedCd!: string;
  currentIndex: number = 0;
  itemsPerView: number = 3; 
  
  constructor(public CdService: CdService, public MusicShopService: MusicShopService) {
    this.smallCdList = this.CdService.smallCdList;
  }

  selectCd(cd: string) {
    this.MusicShopService.setTitle(cd);
  }

  goToPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = Math.max(0, this.smallCdList.length - this.itemsPerView);
    }
  }

  goToNext() {
    if (this.currentIndex < this.smallCdList.length - this.itemsPerView) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  get visibleCds(): CdContainer[] {
    return this.smallCdList.slice(this.currentIndex, this.currentIndex + this.itemsPerView);
  }

  get totalSlides(): number {
    return Math.max(1, this.smallCdList.length - this.itemsPerView + 1);
  }

  get slideIndicators(): number[] {
    return Array.from({ length: this.totalSlides }, (_, i) => i);
  }

  get canGoPrevious(): boolean {
    return this.smallCdList.length > this.itemsPerView;
  }

  get canGoNext(): boolean {
    return this.smallCdList.length > this.itemsPerView;
  }
}