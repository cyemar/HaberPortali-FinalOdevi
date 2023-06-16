import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserModel } from '../../../models/UserModel';


@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {
  dialogTitle!: string;
  process!: string;
  frm!:FormGroup;
  newUser!:UserModel;

  constructor(
    public apiService: ApiService,
    public matDialog: MatDialog,
    public frmBuild: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any

  ) {
    this.process= data.proc;
    this.newUser = data.reg;
    if(this.process =="Register"){
      this.dialogTitle = "Adding User"
    }
    if(this.process =="Edit"){
      this.dialogTitle = "Editing User"
    }
    this.frm = this.RegForm();
   }

  ngOnInit(): void {
  }

  RegForm(){
    return this.frmBuild.group({
      userId: [this.newUser.userId],
      userName: [this.newUser.userName],
      userMail: [this.newUser.userMail],
      userPw: [this.newUser.userPw],
      userAdmin: [this.newUser.userAdmin === 1 ? "1" : "0"]
    })
  }


}
