import { Component } from '@angular/core';
import { CdContainer } from '../../core/interfaces/cd.interface';
import { CdContainers } from '../../core/interfaces/cd-containers';
import { CdComponent } from "../cd/cd.component";
import { CdService } from '../../core/services/cd.service';
import { MusicShopService } from '../../core/services/music-shop.service';

@Component({
  selector: 'app-cd-list',
  standalone: true,
  imports: [CdComponent],
  templateUrl: './cd-list.component.html',
  styleUrl: './cd-list.component.scss'
})
export class CdListComponent {
  smallCdList: CdContainer[] = [];
  selectedCd!: string;
  constructor(public CdService: CdService, public MusicShopService: MusicShopService) {
    this.smallCdList = this.CdService.smallCdList;
  }

  selectCd(cd: string) {
    this.MusicShopService.setTitle(cd);
  }
}
