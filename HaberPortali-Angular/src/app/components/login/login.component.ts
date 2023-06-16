import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HotAlertService } from '../../services/HotAlert.service';
import { ResultModel } from '../../models/ResultModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public apiService: ApiService,
    public alert: HotAlertService
  ) { }

  ngOnInit(): void {
  }

  UserLogIn(uMail:string, uPw:string){
    this.apiService.getToken(uMail,uPw).subscribe((d:any ) =>{
      localStorage.setItem("token", d.access_token);
      localStorage.setItem("userId", d.userId);
      localStorage.setItem("userMail", d.userMail);
      localStorage.setItem("userAdmin", d.userAuths);
      location.href = "/";
    },err =>{
      var s:ResultModel= new ResultModel();
      s.Success = false;
      s.ResultMessage = "User Mail or Password is incorrect"
      this.alert.AlertDo(s)
    });
  }

}
