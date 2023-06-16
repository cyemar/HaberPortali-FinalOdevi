import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AlertDialogComponent } from './components/dialogs/alert-dialog/alert-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { RouterModule } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { UserDialogComponent } from './components/dialogs/user-dialog/user-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { ShownewsComponent } from './components/shownews/shownews.component';
import { NewsDialogComponent } from './components/dialogs/news-dialog/news-dialog.component';
import { CommonModule } from '@angular/common';
import { NewsdetailComponent } from './components/newsdetail/newsdetail.component';
import { NewsComponent } from './components/news/news.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { CategoryComponent } from './components/category/category.component';
import { CategoryDialogComponent } from './components/dialogs/category-dialog/category-dialog.component';
import { SportComponent } from './components/sport/sport.component';
import { PoliticComponent } from './components/politic/politic.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainNavComponent,
    UserComponent,
    ShownewsComponent,
    NewsdetailComponent,
    NewsComponent,
    LoginComponent,
    SignupComponent,
    MainPageComponent,
    CategoryComponent,
    CategoryDialogComponent,
    SportComponent,
    PoliticComponent,

    //Dialogs
    AlertDialogComponent,
    ConfirmDialogComponent,
    UserDialogComponent,
    NewsDialogComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule
  ],
  entryComponents: [AlertDialogComponent, CategoryDialogComponent, ConfirmDialogComponent, UserDialogComponent, NewsDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
