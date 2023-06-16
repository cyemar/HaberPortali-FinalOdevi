import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { NewsModel } from '../../../models/NewsModel';
import { CategoryModel } from '../../../models/CategoryModel'; // Import the CategoryModel

@Component({
  selector: 'app-news-dialog',
  templateUrl: './news-dialog.component.html',
  styleUrls: ['./news-dialog.component.css']
})
export class NewsDialogComponent implements OnInit {
  dialogTitle!: string;
  process!: string;
  frm!: FormGroup;
  newNew!: NewsModel;
  categories: CategoryModel[] = [];

  constructor(
    public apiService: ApiService,
    public matDialog: MatDialog,
    public frmBuild: FormBuilder,
    public dialogRef: MatDialogRef<NewsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.process = data.proc;
    this.newNew = data.reg;
    if (this.process == "Register") {
      this.dialogTitle = "Adding News";
    }
    if (this.process == "Edit") {
      this.dialogTitle = "Editing News";
    }
    this.frm = this.RegForm();
    this.getCategories();
  }

  ngOnInit(): void {}

  RegForm() {
    return this.frmBuild.group({
      newsId: [this.newNew.newsId],
      newsTitle: [this.newNew.newsTitle],
      newsContent: [this.newNew.newsContent],
      newsImage: [this.newNew.newsImage],
      newsCatId: [this.newNew.newsCatId],
      newsCreatedBy: localStorage.getItem("userId")
    });
  }

  getCategories() {
    this.apiService.getCategories().subscribe(
      (response: CategoryModel[]) => {
        this.categories = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
