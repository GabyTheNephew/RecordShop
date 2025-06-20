import { Component } from '@angular/core';
import { MusicShopService } from '../../../core/services/music-shop.service';
import { VinylComponent } from "../vinyl/vinyl.component";
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [VinylComponent, NzButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public musicShopService: MusicShopService) { }
}