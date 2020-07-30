import { Component, HostListener } from '@angular/core';
import { HelperService } from './core/services/helper.service';
import { environment } from '../environments/environment';
import { 
  RouterOutlet, 
  Router, 
  Event,  
  NavigationEnd,
  NavigationStart,
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  public innerWidth: any;
  public innerHeight: any;
  public orientation: string = '';
  public centralized: boolean = true;
  public env = environment;
  public show_content: boolean = false;

  constructor(
    public helperService: HelperService,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.updateOrientation();
  }

  @HostListener('window:resize', ['$event'])
  resizeScreen(event) {
    this.updateOrientation()
  }

  updateOrientation(): void {
    if (window.innerWidth > 600 && 
        window.innerWidth > window.innerHeight) {
      this.orientation = 'vertical';
      this.centralized = true;
    } else {
      this.centralized = false;
      this.orientation = 'vertical';
    }
  }

  getRouteClass(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['class'];
  }
}
