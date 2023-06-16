import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentModel } from '../models/CommentModel';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  apiUrl = "https://localhost:44354/api/";

  constructor(public http: HttpClient) { }

  getCommentsByNewsId(newsId: number): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>(this.apiUrl + "listCommentsByNewsId/" + newsId)
  }

  addComment(comment: CommentModel): Observable<CommentModel> {
    console.log(comment)
    return this.http.post<CommentModel>(this.apiUrl + "addComment", comment);
  }


}
