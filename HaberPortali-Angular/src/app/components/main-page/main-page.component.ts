import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsModel } from 'src/app/models/NewsModel';
import { UserModel } from 'src/app/models/UserModel';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  users: UserModel[] = [];
  news: NewsModel[] = [];
  constructor(
    private ApiService: ApiService,
    private router: Router
    ) { }

    ngOnInit(): void {
      this.ApiService.NewsList().subscribe(d => {
        this.news = d;
        this.ApiService.UserList().subscribe(u => {
          this.users = u;
        });
      });
    }

    redirectToNewsDetail(newsId: number): void {
      this.router.navigate(['newsdetail', newsId]);
    }

    getUsername(userId: number): string {
      const user = this.users.find(u => u.userId === userId);
      return user ? user.userName : '';
    }
}
