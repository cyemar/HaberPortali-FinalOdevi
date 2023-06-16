import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { HotAlertService } from 'src/app/services/HotAlert.service';
import { CategoryModel } from '../../models/CategoryModel';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { CategoryDialogComponent } from '../dialogs/category-dialog/category-dialog.component';
import { ResultModel } from 'src/app/models/ResultModel';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  cats!: CategoryModel[];
  displayedColumns = ['catId', 'catName', 'actions']
  dataSource:any;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dialogRef: MatDialogRef<CategoryDialogComponent> | undefined;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent> | undefined;

  constructor(
    public ApiServ: ApiService,
    public matDialog:MatDialog,
    public alert: HotAlertService
  ) {
    this.dataSource = new MatTableDataSource<CategoryModel>([]);
  }

  ngOnInit(): void {
    this.CategoryListDo();
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

  AddCat(){
    var newCat: CategoryModel = new CategoryModel();
    this.dialogRef = this.matDialog.open(CategoryDialogComponent,{
      width:"400px",
      data:{
        reg: newCat,
        proc: 'Register'
      }
    });
    this.dialogRef.afterClosed().subscribe(d => {
      if (d){
        this.ApiServ.CategoryAdd(d).subscribe((s: ResultModel) => {
          this.alert.AlertDo(s);
          if(s.Success){
           this.CategoryListDo();
          }
        })
      }
    })
  }

  CategoryListDo() {
    this.ApiServ.getCategories().subscribe((d: CategoryModel[]) => {
      this.cats = d;
      console.log(d);
      this.dataSource = new MatTableDataSource<CategoryModel>(this.cats)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  EditCat(reg:CategoryModel){
    this.dialogRef = this.matDialog.open(CategoryDialogComponent,{
      width:"400px",
      data:{
        reg: reg,
        proc: 'Edit'
      }
    })
    this.dialogRef.afterClosed().subscribe(d => {
      if (d){
        reg.catName = d.catName;
        this.ApiServ.CategoryEdit(reg).subscribe((s: ResultModel)=> {
          this.alert.AlertDo(s)
        });
      }
    })
  }

  DeleteCat(reg:CategoryModel){
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: reg
    });
    this.confirmDialogRef.componentInstance.dialogMsg = reg.catName + " this category will be deleted. Do you confirm?";
    this.confirmDialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.ApiServ.CategoryDelete(reg.catId).subscribe((s: ResultModel) => {
          this.alert.AlertDo(s)
          this.CategoryListDo()
        })
      }
    });
  }

}
