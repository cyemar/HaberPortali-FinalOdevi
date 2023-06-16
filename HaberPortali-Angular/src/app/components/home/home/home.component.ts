import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResultModel } from 'src/app/models/ResultModel';
import { HotAlertService } from 'src/app/services/HotAlert.service';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent> | undefined
  constructor(
    public alert: HotAlertService,
    public matDialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  AlertOn(p: boolean) {
    var s: ResultModel = new ResultModel
    s.ResultMessage = "Alert Test Is Successfull";
    s.Success = p;

    this.alert.AlertDo(s)
  }
  ConfirmOn() {
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '400px'
    });
    this.confirmDialogRef.componentInstance.dialogMsg = "Kayıt Silinecek";
    this.confirmDialogRef.afterClosed().subscribe(d => {
      console.log(d)
    })
  }

}
