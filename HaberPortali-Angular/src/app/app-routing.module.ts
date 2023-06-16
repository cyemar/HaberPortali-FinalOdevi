import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
import { UserComponent } from './components/user/user.component';
import { ShownewsComponent } from './components/shownews/shownews.component';
import { NewsdetailComponent } from './components/newsdetail/newsdetail.component';
import { NewsComponent } from './components/news/news.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './services/auth.guard';
import { MainPageComponent } from './components/main-page/main-page.component';
import { CategoryComponent } from './components/category/category.component';
import { SportComponent } from './components/sport/sport.component';
import { PoliticComponent } from './components/politic/politic.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent
  },
  {
    path:'user',
    component:UserComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'shownews/:userId',
    component:ShownewsComponent
  },
  {
    path:'newsdetail/:newsId',
    component:NewsdetailComponent
  },
  {
    path:'news',
    component:NewsComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'signup',
    component:SignupComponent
  },
  {
    path:'home',
    component:MainPageComponent
  },
  {
    path:'categories',
    component:CategoryComponent
  },
  {
    path:'sport',
    component:SportComponent
  },
  {
    path:'politic',
    component:PoliticComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
