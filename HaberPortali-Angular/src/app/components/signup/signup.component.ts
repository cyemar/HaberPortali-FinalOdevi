import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HotAlertService } from '../../services/HotAlert.service';
import { UserModel } from '../../models/UserModel';
import { ResultModel } from 'src/app/models/ResultModel';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(public ApiService:ApiService, public alert:HotAlertService) { }

  ngOnInit(): void {
  }
  UserSignUp(username: string,mail: string, password: string) {
    var user = new UserModel();
    user.userName = username;
    user.userMail = mail;
    user.userPw = password;
    this.ApiService.UserAdd(user).subscribe(
      (response: ResultModel) => {
        console.log(response);
      },
      (error: any) => {
        console.error(error);
      }
    );
      location.href = "/login";
  }
}
