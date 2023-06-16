import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/UserModel';
import { Observable } from 'rxjs';
import { ResultModel } from '../models/ResultModel';
import { NewsModel } from '../models/NewsModel';
import { CategoryModel } from '../models/CategoryModel';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  apiUrl = "https://localhost:44354/api/";
  constructor(
    public http: HttpClient
  ) { }

  AuthControl(){
    if(localStorage.getItem("token")){
      return true;
    }
    else
      return false;
  }

  checkIfUserIsAuthenticated(): boolean {
    if(localStorage.getItem("userAdmin") == '["Admin"]')
    {

      return true;
    }

    else{
      return false;
    }

  }
  ifAdminCheck(){
    if(localStorage.getItem("userAdmin") == '["Admin"]'){
      return true;
    }
    else{
      return false;
    }
  }

  ifAdmin(): boolean {
    const userAuths = JSON.parse(localStorage.getItem("userAuths") || "[]");
    return userAuths.includes("Admin");
  }

  logOut(){
    localStorage.clear();
    location.href = "/";
  }

  getToken(uMail:string, uPw:string){
    var data = "username=" + uMail +"&password="+uPw+"&grant_type=password";
    var reqHeader = new HttpHeaders({"Content-Type":"application/x-www-form-urlencoded"});
    return this.http.post(this.apiUrl +"/token", data, {headers:reqHeader})
  }

  getUserID(): string | null {
    return localStorage.getItem("userId");
  }

  UserList(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl+"userList")
  }

  UserAdd(user: UserModel) {
    return this.http.post<ResultModel>(this.apiUrl + "addUser", user);
  }

  UserEdit(user: UserModel) {
    return this.http.put<ResultModel>(this.apiUrl+"editUser", user)
  }

  UserListById(userId: number) {
    return this.http.get<UserModel>(this.apiUrl + "userListById/" + userId);
  }

  UserListByIds(userIds: number[]): Observable<UserModel[]> {
    const params = new HttpParams().set('userIds', userIds.join(','));
    return this.http.get<UserModel[]>(this.apiUrl + "userListByIds/");
  }

  UserDelete(userId: number) {
    return this.http.delete<ResultModel>(this.apiUrl+"deleteUser/" + userId)
  }

  NewsListByUser(userId: number) {
    return this.http.get<NewsModel[]>(this.apiUrl + "newsListByUser/" +userId);
  }

  NewsListByCatId(catId: number): Observable<NewsModel[]> {
    return this.http.get<NewsModel[]>(this.apiUrl + "newsListByCatId/" + catId);
  }

  NewsEdit(news: NewsModel) {
    return this.http.put<ResultModel>(this.apiUrl + "editNews", news);
  }
  NewsDelete(newsId: number) {
    return this.http.delete<ResultModel>(this.apiUrl+"deleteNews/" + newsId)
  }

  GetDetailedNews(newsId: number) {
    return this.http.get<NewsModel>(this.apiUrl +"detailedNews/"+ newsId);
  }

  NewsList(): Observable<NewsModel[]> {
    return this.http.get<NewsModel[]>(this.apiUrl+"listNews")
  }


  NewsAdd(news: NewsModel) {
    return this.http.post<ResultModel>(this.apiUrl + "addNews", news);
  }

  getCategories(): Observable<CategoryModel[]> {
    const url = `${this.apiUrl}/listCategory`;
    return this.http.get<CategoryModel[]>(url);
  }

  CategoryEdit(cat: CategoryModel) {
    return this.http.put<ResultModel>(this.apiUrl + "editCategory", cat);
  }

  CategoryAdd(cat: NewsModel) {
    return this.http.post<ResultModel>(this.apiUrl + "addCategory", cat);
  }

  CategoryDelete(catId: number) {
    return this.http.delete<ResultModel>(this.apiUrl+"deleteCategory/" + catId)
  }
}
