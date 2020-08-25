import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable()
export class UIService {
  constructor(private matSnackBar: MatSnackBar) {}

  showSnackBar(
    message: string,
    action: string,
    config: MatSnackBarConfig<any>
  ) {
    this.matSnackBar.open(message, action, { ...config });
  }
}
