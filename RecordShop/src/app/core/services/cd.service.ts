import { Injectable } from '@angular/core';
import { CdContainer } from '../interfaces/cd.interface';
import { CdContainers } from '../interfaces/cd-containers';

@Injectable({
  providedIn: 'root'
})
export class CdService {
  cdList: CdContainer[] = [];
  smallCdList: CdContainer[] = [];

  constructor() {
    this.cdList = CdContainers;
    this.smallCdList = this.cdList.slice(0, 4);
  }
}
