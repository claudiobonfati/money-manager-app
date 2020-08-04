import { Component, OnInit } from '@angular/core';
// Temp tests
  import { HttpService } from 'src/app/core/services/http.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  constructor(
    // Temp tests
      public httpService: HttpService
  ) { }

  ngOnInit(): void {
  }

}
