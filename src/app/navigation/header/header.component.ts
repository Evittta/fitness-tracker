import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AuthService } from './../../auth/auth.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  isLogIn$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.State>
  ) {}

  ngOnInit(): void {
    this.isLogIn$ = this.store.select(fromApp.getIsAuth);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }
}
