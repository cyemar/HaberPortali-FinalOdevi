import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogComponent } from '../components/dialogs/alert-dialog/alert-dialog.component';
import { ResultModel } from '../models/ResultModel';

@Injectable({
  providedIn: 'root'
})
export class HotAlertService {
  alertDialogRef: MatDialogRef<AlertDialogComponent> | null = null;
  constructor(public matDialog: MatDialog) { }

  AlertDo(s: ResultModel) {
    var title = "";
    if (s.Success) {
      title = "Success";
    } else {
      title = "Fail";
    }

    this.alertDialogRef = this.matDialog.open(AlertDialogComponent, {
      width: '300px'
    });
    this.alertDialogRef.componentInstance.dialogTitle = title;
    this.alertDialogRef.componentInstance.dialogMsg = s.ResultMessage;
    this.alertDialogRef.componentInstance.dialogSuc = s.Success;

    this.alertDialogRef.afterClosed().subscribe(d => {
      this.alertDialogRef = null;
    });
  }
}
