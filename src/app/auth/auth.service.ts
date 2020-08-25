import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthData } from './auth-data.model';
import { UIService } from './../shared/ui.service';
import { TrainingService } from './../training/training.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.authSuccessfully();
      } else {
        this.logoutSuccessfully();
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() => this.store.dispatch(new UI.StopLoading()))
      .catch((error) => {
        this.uiService.showSnackBar(error.message, 'Error', { duration: 3000 });
        this.store.dispatch(new UI.StopLoading());
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => this.store.dispatch(new UI.StopLoading()))
      .catch((error) => {
        this.uiService.showSnackBar(error.message, 'Error', { duration: 3000 });
        this.store.dispatch(new UI.StopLoading());
      });
  }

  private authSuccessfully() {
    this.store.dispatch(new Auth.SetAuthenticated());
    this.router.navigate(['/training']);
  }

  private logoutSuccessfully() {
    this.trainingService.cancelSubscription();
    this.store.dispatch(new Auth.SetUnauthenticated());
    this.router.navigate(['/login']);
  }

  logout() {
    this.afAuth.signOut();
  }
}
