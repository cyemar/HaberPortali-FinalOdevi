using HaberPortali.Models;
using HaberPortali.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Web;

namespace HaberPortali.Auth
{
    public class UserService
    {
        Database1Entities1 db = new Database1Entities1();

        public userModel UserLogIn(string uMail, string uPw)
        {
            userModel user = db.userInfo.Where(s => s.userMail == uMail && s.userPw == uPw).Select(x => new userModel()
            {
                userId = x.userId,
                userMail = x.userMail,
                userName = x.userName,
                userPw = x.userPw,
                userAdmin = x.userAdmin
            }).SingleOrDefault();
            return user;

        }
    }
}