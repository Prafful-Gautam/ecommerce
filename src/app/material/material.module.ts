import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatBadgeModule} from '@angular/material/badge';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatTableModule,
    MatBadgeModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule
    ],
  exports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    MatSidenavModule,
    MatTableModule,
    MatBadgeModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule
  ]
})
export class MaterialModule { }
