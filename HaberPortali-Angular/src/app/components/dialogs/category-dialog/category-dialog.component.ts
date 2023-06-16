import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent implements OnInit {

  dialogTitle!: string;
  process!: string;
  frm!:FormGroup;
  newCat!:CategoryModel;

  constructor(
    public apiService: ApiService,
    public matDialog: MatDialog,
    public frmBuild: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any

  ) {
    this.process= data.proc;
    this.newCat = data.reg;
    if(this.process =="Register"){
      this.dialogTitle = "Adding Category"
    }
    if(this.process =="Edit"){
      this.dialogTitle = "Editing Category"
    }
    this.frm = this.RegForm();
   }

   ngOnInit(): void {
  }


  RegForm(){
    return this.frmBuild.group({
      catName: [this.newCat.catName]
    })
  }
}
