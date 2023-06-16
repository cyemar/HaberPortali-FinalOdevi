import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { HotAlertService } from '../../services/HotAlert.service';
import { NewsModel } from '../../models/NewsModel';
import { UserModel } from '../../models/UserModel';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { NewsDialogComponent } from '../dialogs/news-dialog/news-dialog.component';
import { ResultModel } from 'src/app/models/ResultModel';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-shownews',
  templateUrl: './shownews.component.html',
  styleUrls: ['./shownews.component.css']
})
export class ShownewsComponent implements OnInit {
  newsReg: NewsModel[] | undefined;
  selUser: UserModel | undefined;
  userId!: number;
  displayedColumns = ['newsTitle', 'newsDateTime', 'actions'];
  dataSource: any;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  dialogRef: MatDialogRef<NewsDialogComponent> | undefined;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent> | undefined;

  constructor(
    public ApiServ: ApiService,
    public alert: HotAlertService,
    public route: ActivatedRoute,
    public matDialog:MatDialog,


  ) { }

  ngOnInit() {
    this.route.params.subscribe(s => {
      if (s) {
        this.userId = s['userId'];
        this.UserGet();
        this.ListNewsBy();
      }
    });
  }

  UserGet() {
    this.ApiServ.UserListById(this.userId).subscribe((d: UserModel) => {
      this.selUser = d;
    });
  }

  ListNewsBy() {
    this.ApiServ.NewsListByUser(this.userId).subscribe((d: NewsModel[]) => {
      if(d != null){
        this.newsReg = d;
        this.dataSource = new MatTableDataSource(this.newsReg);
        console.log(this.newsReg);
      }
      else{

      }
    });
  }


  EditNews(reg: NewsModel){
    this.dialogRef = this.matDialog.open(NewsDialogComponent,{
      width:"400px",
      data:{
        reg: reg,
        proc: 'Edit'
      }
    })
    this.dialogRef.afterClosed().subscribe(d => {
      if (d){
        reg.newsId= d.newsId;
        reg.newsTitle= d.newsTitle;
        reg.newsContent= d.newsContent;
        reg.newsDateTime= d.newsDateTime;
        reg.newsImage= d.newsImage;
        reg.newsCatId= d.newsCatId;
        reg.newsCreatedBy= d.newsCreatedBy;

        this.ApiServ.NewsEdit(reg).subscribe((s: ResultModel)=> {
          this.alert.AlertDo(s)
        });
      }
    })
  }
  DeleteNews(reg: NewsModel){
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: reg
    });
    this.confirmDialogRef.componentInstance.dialogMsg = reg.newsTitle + " will be deleted. Do you confirm?";
    this.confirmDialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.ApiServ.NewsDelete(reg.newsId).subscribe((s: ResultModel) => {
          this.alert.AlertDo(s)
          this.ListNewsBy()
        })
      }
    });
  }
}
