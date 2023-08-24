import { Component } from '@angular/core';
import { LoaderService } from '../_services';
import { Subject, delay } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  
  isLoading: boolean = false;

  constructor(public loadingService: LoaderService) {
    this.loadingService.getLoading()
      .pipe(delay(0))
      .subscribe(isLoading => this.isLoading = isLoading);
  }
}
