import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule} from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';


const MatModules = [
  MatButtonModule,
  MatDialogModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatTableModule,
  MatCardModule,
  MatDividerModule,
  MatSortModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,

];

@NgModule({
  imports: [MatModules],
  exports: [MatModules]
})
export class MaterialModule { }
