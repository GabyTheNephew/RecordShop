import { Component, Output } from '@angular/core';
import { VinylContainer } from '../../core/interfaces/vinyl.interface';
import { VinylContainers } from '../../core/interfaces/vinyl-containers';
import { VinylComponent } from "../vinyl/vinyl.component";
import { VinylService } from '../../core/services/vinyl.service';
import { MusicShopService } from '../../core/services/music-shop.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vinyl-list',
  standalone: true,
  imports: [VinylComponent],
  templateUrl: './vinyl-list.component.html',
  styleUrl: './vinyl-list.component.scss'
})
export class VinylListComponent {
  smallVinylList: VinylContainer[] = [];

  constructor(public vinylService: VinylService, private musicShopService: MusicShopService) {
    this.smallVinylList = this.vinylService.smallVinylList;
  }

  onAlbumSelect(albumTitle: string) {
    this.musicShopService.setTitle(albumTitle);
  }
}
