import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsModel } from '../../models/NewsModel';
import { CommentModel } from '../../models/CommentModel';
import { ApiService } from '../../services/api.service';
import { CommentService } from '../../services/commentapi.service';
import { UserModel } from 'src/app/models/UserModel';
import { ResultModel } from 'src/app/models/ResultModel';

@Component({
  selector: 'app-newsdetail',
  templateUrl: './newsdetail.component.html',
  styleUrls: ['./newsdetail.component.css']
})
export class NewsdetailComponent implements OnInit {
  newsId!: number;
  users: UserModel[] = [];
  news!: NewsModel;
  ncb!: Promise<string>
  comments: CommentModel[] = [];
  newComment: string = '';

  constructor(
    private route: ActivatedRoute,
    private ApiService: ApiService,
    private CommentService: CommentService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.newsId = params['newsId'];
      this.getNewsDetail(this.newsId);
      this.getCommentsByNewsId(this.newsId);
    });
    this.ApiService.UserList().subscribe(users => {
      this.users = users;
    });
  }

    getNewsDetail(newsId: number) {
    this.ApiService.GetDetailedNews(newsId).subscribe((news: NewsModel) => {
      this.news = news;
      this.ncb = this.getUsername(this.news.newsCreatedBy);
      });
  }

  getCommentsByNewsId(newsId: number): void {
    this.CommentService.getCommentsByNewsId(newsId)
      .subscribe(comments => {
        this.comments = comments;
      });
  }

  async getUsername(userId: number): Promise<string> {
    this.ApiService.UserList().subscribe(users => {
      this.users = users;
    });
    while (this.users.length == 0) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    const user = this.users.find(u => u.userId === userId);
    console.log(user?.userName);
    return user ? user.userName : '';
  }

  addComment(): void {
    if (this.newComment.trim() === '') {
      return;
    }

    const comment: CommentModel = new CommentModel();
    const userId: string | null = this.ApiService.getUserID();
    comment.commentUserId = userId !== null ? parseInt(userId) : 0;
    comment.commentContent = this.newComment;
    comment.commentNewsId = this.newsId;

    this.CommentService.addComment(comment).subscribe(
      (newComment: CommentModel) => {
        this.comments.push(newComment);
        this.newComment = '';
        this.getCommentsByNewsId(this.newsId);
      },
      (error) => {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error('Backend returned code', error.status);
          console.error('Response body:', error.error);
          const result: ResultModel = error.error;
          console.error('Result Message:', result.ResultMessage);
        }
      }
    );

  }


}
