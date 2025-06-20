import { Injectable } from '@angular/core';
import { VinylContainer } from '../interfaces/vinyl.interface';
import { VinylContainers } from '../interfaces/vinyl-containers';
import { VinylComponent } from '../../features/landing-page/vinyl/vinyl.component';

@Injectable({
  providedIn: 'root'
})
export class VinylService {
  vinylList: VinylContainer[] = [];
  smallVinylList: VinylContainer[] = [];

  constructor() {
    this.vinylList = VinylContainers;
    this.smallVinylList = this.vinylList;
  }

}
