import { Injectable } from '@angular/core';
import { VinylContainer } from '../interfaces/vinyl.interface';
import { VinylContainers } from '../interfaces/vinyl-containers';

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
