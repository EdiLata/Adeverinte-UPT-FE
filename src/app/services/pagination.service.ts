import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private defaultPageNumber = 1;
  private defaultPageSize = 10;

  public getDefaultPageNumber() {
    return this.defaultPageNumber;
  }

  public getDefaultPageSize() {
    return this.defaultPageSize;
  }
}
