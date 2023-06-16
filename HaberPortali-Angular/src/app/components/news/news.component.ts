import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { ResultModel } from 'src/app/models/ResultModel';
import { UserModel } from 'src/app/models/UserModel';
import { ApiService } from 'src/app/services/api.service';
import { HotAlertService } from 'src/app/services/HotAlert.service';
import { NewsModel } from '../../models/NewsModel';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { NewsDialogComponent } from '../dialogs/news-dialog/news-dialog.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  news!: NewsModel[];
  categories: CategoryModel[] = [];
  users: UserModel[] = [];
  displayedColumns= ['newsId', 'newsTitle', 'newsContent', 'newsImage', 'newsDateTime', 'newsCreatedBy', 'newsCatId', 'actions'];
  dataSource: MatTableDataSource<NewsModel>;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dialogRef: MatDialogRef<NewsDialogComponent> | undefined;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent> | undefined;

  constructor(
    public ApiServ: ApiService,
    public matDialog: MatDialog,
    public alert: HotAlertService
  ) {
    this.dataSource = new MatTableDataSource<NewsModel>([]);
  }

  ngOnInit(): void {
    this.NewsListDo();
    this.fetchCategories();
    this.GetUsers();
  }

GetUsers()
{
  this.ApiServ.UserList().subscribe((x: UserModel[]) => {
    this.users = x;
  })
}

  NewsListDo() {
    this.ApiServ.NewsList().subscribe((d: NewsModel[]) => {
      this.news = d;
      console.log(d);
      this.dataSource.data = this.news;
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

  AddNews() {
    var newNews: NewsModel = new NewsModel();
    this.dialogRef = this.matDialog.open(NewsDialogComponent, {
      width: "400px",
      data: {
        reg: newNews,
        proc: 'Register'
      }
    });
    this.dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.ApiServ.NewsAdd(d).subscribe((s: ResultModel) => {
          this.alert.AlertDo(s);
          if (s.Success) {
            this.NewsListDo();
          }
        })
      }
    })
  }

  EditNews(reg: NewsModel) {
    this.dialogRef = this.matDialog.open(NewsDialogComponent, {
      width: "400px",
      data: {
        reg: reg,
        proc: 'Edit'
      }
    });

    this.dialogRef.afterClosed().subscribe(d => {
      if (d) {
        reg.newsId = d.newsId;
        reg.newsTitle = d.newsTitle;
        reg.newsContent = d.newsContent;
        reg.newsImage = d.newsImage;
        reg.newsCatId = d.newsCatId;
        reg.newsCreatedBy = d.newsCreatedBy;

        this.ApiServ.NewsEdit(reg).subscribe((s: ResultModel) => {
          this.alert.AlertDo(s);
          if (s.Success) {
            this.NewsListDo();
          }
        });
      }
    });
  }

  getCategoryName(newsCatId: number): string {
    const category = this.categories.find(cat => cat.catId === newsCatId);
    return category ? category.catName : '';
  }
  getUsername(userId: number): string {
    const user = this.users.find(u => u.userId === userId);
    return user ? user.userName : '';
  }

  fetchCategories() {
    this.ApiServ.getCategories().subscribe((categories: CategoryModel[]) => {
      this.categories = categories;
    });
  }

  DeleteNews(reg: NewsModel) {
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: reg
    });
    this.confirmDialogRef.componentInstance.dialogMsg = reg.newsTitle + " this news will be deleted. Do you confirm?";
    this.confirmDialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.ApiServ.NewsDelete(reg.newsId).subscribe((s: ResultModel) => {
          this.alert.AlertDo(s)
          this.NewsListDo()
        })
      }
    });
  }
}
