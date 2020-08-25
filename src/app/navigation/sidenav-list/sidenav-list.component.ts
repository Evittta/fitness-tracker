import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AuthService } from './../../auth/auth.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css'],
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClosed = new EventEmitter<void>();
  isLogIn$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.isLogIn$ = this.store.select(fromRoot.getIsAuth);
  }

  onClose() {
    this.sidenavClosed.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }
}
