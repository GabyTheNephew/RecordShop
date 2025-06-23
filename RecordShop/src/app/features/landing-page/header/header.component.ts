import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
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
  constructor(
    public musicShopService: MusicShopService,
    private router: Router // <- Adaugă aceasta
  ) { }

  goToShop() {
    this.router.navigate(['/shop']);
  }
}