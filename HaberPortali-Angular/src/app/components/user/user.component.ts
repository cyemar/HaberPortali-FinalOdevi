import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserModel } from '../../models/UserModel';
import { ApiService } from '../../services/api.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserDialogComponent } from '../dialogs/user-dialog/user-dialog.component';
import { HotAlertService } from '../../services/HotAlert.service';
import { ResultModel } from '../../models/ResultModel';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users!: UserModel[];
  displayedColumns = ['userId', 'userName', 'userMail','userPw', 'userNewsCount', 'userAdmin','actions']
  dataSource:any;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  dialogRef: MatDialogRef<UserDialogComponent> | undefined;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent> | undefined;

  constructor(
    public ApiServ: ApiService,
    public matDialog:MatDialog,
    public alert: HotAlertService
  ) {
    this.dataSource = new MatTableDataSource<UserModel>();
  }

  ngOnInit(): void {
    this.UserListDo();
  }

  UserListDo() {
    this.ApiServ.UserList().subscribe((d: UserModel[]) => {
      this.users = d;
      console.log(d);
      this.dataSource = new MatTableDataSource<UserModel>(this.users)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  DoFilter(e: KeyboardEvent): void {
    const target = e.target as HTMLInputElement;
    if (target) {
      const iValue = target.value;
      this.dataSource.filter = iValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  AddUser(){
    var newUser: UserModel = new UserModel();
    this.dialogRef = this.matDialog.open(UserDialogComponent,{
      width:"400px",
      data:{
        reg: newUser,
        proc: 'Register'
      }
    });
    this.dialogRef.afterClosed().subscribe(d => {
      if (d){
        this.ApiServ.UserAdd(d).subscribe((s: ResultModel) => {
          this.alert.AlertDo(s);
          if(s.Success){
           this.UserListDo();
          }
        })
      }
    })
  }
  EditUser(reg:UserModel){
    this.dialogRef = this.matDialog.open(UserDialogComponent,{
      width:"400px",
      data:{
        reg: reg,
        proc: 'Edit'
      }
    })
    this.dialogRef.afterClosed().subscribe(d => {
      if (d){
        reg.userName = d.userName;
        reg.userMail = d.userMail;
        reg.userPw = d.userPw;
        reg.userAdmin = d.userAdmin;

        this.ApiServ.UserEdit(reg).subscribe((s: ResultModel)=> {
          this.alert.AlertDo(s)
          this.UserListDo();
        });
      }
    })

  }

  DeleteUser(reg: UserModel) {
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: reg
    });
    this.confirmDialogRef.componentInstance.dialogMsg = reg.userName + " this user will be deleted. Do you confirm?";
    this.confirmDialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.ApiServ.UserDelete(reg.userId).subscribe((s: ResultModel) => {
          this.alert.AlertDo(s)
          this.UserListDo()
        })
      }
    });
  }


}
