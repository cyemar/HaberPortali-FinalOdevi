using HaberPortali.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using HaberPortali.Models;
using System.Web.Cors;
using System.Security.Cryptography.X509Certificates;
using System.Web.UI.WebControls.WebParts;
using System.Diagnostics;

namespace HaberPortali.Controllers
{
    public class ServiceController : ApiController
    {
        Database1Entities1 db = new Database1Entities1();
        ResultModel result = new ResultModel();

        #region User Stuff
        [HttpGet]
        [Route("api/userList")]
        public List<userModel> getUsers()
        {
            List<userModel> userList = db.userInfo.Select(x => new userModel()
            {
                userId = x.userId,
                userMail = x.userMail,
                userName = x.userName,
                userPw = x.userPw,
                userAdmin = x.userAdmin,
                userNewsCount = db.newsInfo.Count(n => n.newsCreatedBy == x.userId)
            }).ToList();
            return userList;

        }

        [HttpGet]
        [Route("api/userListById/{userId}")]
        public userModel userListById(int userId)
        {
            userModel Reg = db.userInfo.Where(x => x.userId == userId).Select(s => new userModel()
            {
                userId = s.userId,
                userMail = s.userMail,
                userName = s.userName,
                userPw = s.userPw,
                userAdmin = s.userAdmin,
                userNewsCount = db.newsInfo.Count(n => n.newsCreatedBy == s.userId)
            }).SingleOrDefault();
            return Reg;
        }

        [HttpGet]
        [Route("api/userListByIds")]
        public List<userModel> UserListByIds(string userIds)
        {
            List<int> userIdList = userIds.Split(',').Select(int.Parse).ToList();

            List<userModel> users = db.userInfo
                .Where(x => userIdList.Contains(x.userId))
                .Select(s => new userModel()
                {
                    userId = s.userId,
                    userMail = s.userMail,
                    userName = s.userName,
                    userPw = s.userPw,
                    userAdmin = s.userAdmin,
                    userNewsCount = db.newsInfo.Count(n => n.newsCreatedBy == s.userId)
                })
                .ToList();

            return users;
        }

        [HttpPost]
        [Route("api/addUser")]
        public ResultModel addUser(userModel model)
        {
            try
            {
                if (model == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Invalid data inserted";
                    return result;
                }
                if (db.userInfo.Count(x => x.userId == model.userId) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "There is already same id in database";
                    return result;
                }
                if (db.userInfo.Count(x => x.userMail == model.userMail) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "There is already user registered with this mail";
                    return result;
                }

                userInfo user = new userInfo();

                user.userId = model.userId;
                user.userName = model.userName;
                user.userMail = model.userMail;
                user.userPw = model.userPw;
                user.userAdmin = model.userAdmin;

                db.userInfo.Add(user);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "User added succesfully.";
                return result;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.ResultMessage = ex.Message;
                return result;
            }
        }



        [HttpDelete]
        [Route("api/deleteUser/{userId}")]
        public ResultModel DeleteUser(int userId)
        {
            try
            {
                userInfo user = db.userInfo.Where(x => x.userId == userId).FirstOrDefault();

                if (user == null)
                {
                    result.Success = false;
                    result.ResultMessage = "User couldn't be found";
                    return result;
                }

                bool hasNews = db.newsInfo.Any(n => n.newsCreatedBy == user.userId);
                if (hasNews)
                {
                    result.Success = false;
                    result.ResultMessage = "User cannot be deleted because they have created news";
                    return result;
                }

                db.userInfo.Remove(user);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "User deleted successfully";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }

        [HttpPut]
        [Route("api/editUser")]
        public ResultModel EditUser(userModel model)
        {
            try
            {
                userInfo user = db.userInfo.Where(x => x.userId == model.userId).FirstOrDefault();
                if (user == null)
                {
                    result.Success = false;
                    result.ResultMessage = "User couldn't found";
                    return result;
                }

                user.userName = model.userName;
                user.userMail = model.userMail;
                user.userPw = model.userPw;
                user.userAdmin = model.userAdmin;

                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "User updated successfully";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }
        #endregion

        #region Category stuff
        [HttpGet]
        [Route("api/listCategory")]
        public List<CategoryModel> getCategories()
        {
            List<CategoryModel> userList = db.category.Select(x => new CategoryModel()
            {
                catId = x.catId,
                catName = x.catName,
            }).ToList();
            return userList;
        }
        [HttpPost]
        [Route("api/addCategory")]
        public ResultModel AddCategory(CategoryModel model)
        {
            try
            {
                if (model == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Invalid data inserted";
                    return result;
                }
                if (db.category.Count(x => x.catId == model.catId) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "There is already same id in database";
                    return result;
                }
                if (db.category.Count(x => x.catName == model.catName) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "There is already a category that uses this name";
                    return result;
                }

                category category_ = new category();

                category_.catId = model.catId;
                category_.catName = model.catName;

                db.category.Add(category_);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "Category added succesfully.";
                return result;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.ResultMessage = ex.Message;
                return result;
            }
        }


        [HttpGet]
        [Route("api/catListById/{catId}")]
        public List<CategoryModel> catListById(int catId)
        {
            List<CategoryModel> list = db.category.Where(x => x.catId == catId).Select(s => new CategoryModel()
            {
                catId = s.catId,
                catName = s.catName,

            }).ToList();
            return list;
        }

        [HttpDelete]
        [Route("api/deleteCategory/{catId}")]
        public ResultModel DeleteCategory(int catId)
        {
            try
            {
                category category = db.category.Where(x => x.catId == catId).FirstOrDefault();

                if (category == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Category couldn't found";
                    return result;
                }
                if (db.newsInfo.Count(x => x.newsCatId == catId) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "There is news in this category, clean news first";
                    return result;
                }

                db.category.Remove(category);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "Category deleted successfully";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }

        [HttpPut]
        [Route("api/editCategory")]
        public ResultModel EditCategory(CategoryModel model)
        {
            try
            {
                category Category = db.category.Where(x => x.catId == model.catId).FirstOrDefault();
                if (Category == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Category couldn't found";
                    return result;
                }
                Category.catName = model.catName;

                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "Category updated successfully";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }
        #endregion

        #region News Stuff
        [HttpGet]
        [Route("api/listNews")]
        public List<NewsModel> GetNews()
        {
            List<NewsModel> newsList = db.newsInfo
                .OrderByDescending(x => x.newsDate)
                .Select(x => new NewsModel()
                {
                    newsId = x.newsId,
                    newsTitle = x.newsTitle,
                    newsContent = x.newsContent,
                    newsCreatedBy = x.newsCreatedBy,
                    newsDateTime = x.newsDate,
                    newsCatId = x.newsCatId,
                    newsImage = x.newsImage
                })
                .ToList();

            return newsList;
        }

        [HttpPost]
        [Route("api/addNews")]
        public ResultModel AddNews(NewsModel model)
        {
            try
            {
                if (model == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Invalid data inserted";
                    return result;
                }
                if (db.newsInfo.Count(x => x.newsId == model.newsId) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "There is already same id in database";
                    return result;
                }
                if (db.userInfo.FirstOrDefault(u => u.userId == model.newsCreatedBy) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find corresponding user.";
                    return result;
                }
                newsInfo newsInfo = new newsInfo();

                newsInfo.newsId = model.newsId;
                newsInfo.newsTitle = model.newsTitle;
                newsInfo.newsContent = model.newsContent;
                newsInfo.newsCreatedBy = model.newsCreatedBy;
                newsInfo.newsCatId = model.newsCatId;
                newsInfo.newsDate = DateTime.Now;
                newsInfo.newsImage = model.newsImage;

                db.newsInfo.Add(newsInfo);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "News added succesfully.";
                return result;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.ResultMessage = ex.Message;
                return result;
            }
        }

        [HttpDelete]
        [Route("api/deleteNews/{newsId}")]
        public ResultModel DeleteNews(int newsId)
        {
            try
            {
                newsInfo news = db.newsInfo.Where(x => x.newsId == newsId).FirstOrDefault();

                if (news == null)
                {
                    result.Success = false;
                    result.ResultMessage = "News couldn't found";
                    return result;
                }
                db.newsInfo.Remove(news);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "News deleted successfully";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }

        [HttpGet]
        [Route("api/newsListById/{newsId}")]
        public List<NewsModel> newsListById(int newsId)
        {
            List<NewsModel> list = db.newsInfo.Where(x => x.newsId == newsId).Select(s => new NewsModel()
            {
                newsId = s.newsId,
                newsCatId = s.newsCatId,
                newsContent = s.newsContent,
                newsCreatedBy = s.newsCreatedBy,
                newsDateTime = s.newsDate,
                newsImage = s.newsImage,
                newsTitle = s.newsTitle
            }).ToList();
            return list;
        }

        [HttpGet]
        [Route("api/newsListByCatId/{catId}")]
        public List<NewsModel> newsListByCatId(int catId)
        {
            List<NewsModel> list = db.newsInfo.Where(x => x.newsCatId == catId).Select(s => new NewsModel()
            {
                newsId = s.newsId,
                newsCatId = s.newsCatId,
                newsContent = s.newsContent,
                newsCreatedBy = s.newsCreatedBy,
                newsDateTime = s.newsDate,
                newsImage = s.newsImage,
                newsTitle = s.newsTitle
            }).ToList();
            return list;
        }

        [HttpGet]
        [Route("api/detailedNews/{newsId}")]
        public NewsModel detailedNews(int newsId)
        {
            NewsModel news = db.newsInfo.Where(x => x.newsId == newsId).Select(s => new NewsModel()
            {
                newsId = s.newsId,
                newsCatId = s.newsCatId,
                newsContent = s.newsContent,
                newsCreatedBy = s.newsCreatedBy,
                newsDateTime = s.newsDate,
                newsImage = s.newsImage,
                newsTitle = s.newsTitle
            }).FirstOrDefault();
            return news;
        }


        [HttpGet]
        [Route("api/newsListByUser/{userId}")]
        public List<NewsModel> newsListByUser(int userId)
        {
            List<NewsModel> list = db.newsInfo.Where(x => x.newsCreatedBy == userId).Select(s => new NewsModel()
            {
                newsId = s.newsId,
                newsCatId = s.newsCatId,
                newsContent = s.newsContent,
                newsCreatedBy = s.newsCreatedBy,
                newsDateTime = s.newsDate,
                newsImage = s.newsImage,
                newsTitle = s.newsTitle
            }).ToList();


            return list;
        }

        [HttpPut]
        [Route("api/editNews")]
        public ResultModel EditNews(NewsModel model)
        {
            try
            {
                newsInfo news_ = db.newsInfo.Where(x => x.newsId == model.newsId).FirstOrDefault();
                if (news_ == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Category couldn't found";
                    return result;
                }
                if (db.userInfo.FirstOrDefault(u => u.userId == model.newsCreatedBy) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find Corresponding user.";
                    return result;
                }
                news_.newsTitle = model.newsTitle;
                news_.newsContent = model.newsContent;
                news_.newsCatId = model.newsCatId;
                news_.newsDate = model.newsDateTime;
                news_.newsCreatedBy = model.newsCreatedBy;
                news_.newsImage = model.newsImage;

                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "News updated successfully";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }
        #endregion

        #region Comment Stuff

        [HttpGet]
        [Route("api/listCommentsByNewsId/{newsId}")]
        public List<CommentModel> ListCommentsByNews(int newsId)
        {
            try
            {
                List<CommentModel> list = db.comment.Where(x => x.comNewsId == newsId).Select(y => new CommentModel()
                {
                    commentId = y.comId,
                    commentContent = y.comContent,
                    commentNewsId = y.comNewsId,
                    commentTime = y.comDate,
                    commentUserId = y.userInfo.userId,
                    userId = y.userInfo.userId,
                    userName = db.userInfo.Where(x => y.userInfo.userId == x.userId).FirstOrDefault().userName,
                    newsTitle = db.newsInfo.Where(x => y.newsInfo.newsId == x.newsId).FirstOrDefault().newsTitle,
                }).ToList();
                return list;
            }
            catch (Exception err)
            {
                Console.WriteLine(err.Message);
                return null;
            }
        }

        [HttpPost]
        [Route("api/addComment")]
        public ResultModel AddComment(CommentModel model)
        {
            try
            {
                Console.WriteLine("Request has b2een arrived as " + model.commentContent);
                if (db.userInfo.FirstOrDefault(u => u.userId == model.commentUserId) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find corresponding user.";
                    return result;
                }
                Console.WriteLine("Request has be3en arrived as " + model.commentContent);
                if (db.newsInfo.FirstOrDefault(u => u.newsId == model.commentNewsId) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find corresponding news.";
                    return result;
                }
                Console.WriteLine("Request has been6 arrived as " + model.commentContent);
                comment m_comment = new comment();
                m_comment.comId = model.commentId;
                m_comment.comContent = model.commentContent;
                m_comment.comNewsId = model.commentNewsId;
                m_comment.comUserId = model.commentUserId;
                m_comment.comDate = DateTime.Now;

                db.comment.Add(m_comment);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "Comment added.";

                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }
        [HttpPut]
        [Route("api/editComment")]
        public ResultModel EditComment(CommentModel model)
        {
            try
            {
                comment com = db.comment.FirstOrDefault(x => x.comId == model.commentId);
                if (com == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Comment couldn't found.";
                    return result;
                }
                if (db.userInfo.FirstOrDefault(u => u.userId == model.commentUserId) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find corresponding user.";
                    return result;
                }
                if (db.newsInfo.FirstOrDefault(u => u.newsId == model.commentNewsId) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find corresponding news.";
                    return result;
                }

                com.comId = model.commentId;
                com.comContent = model.commentContent;
                com.comNewsId = model.commentNewsId;
                com.comUserId = model.commentUserId;
                com.comDate = DateTime.Now;

                db.comment.Add(com);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "Comment edited.";

                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }
        [HttpDelete]
        [Route("api/removeComment/{commentId}")]
        public ResultModel DeleteComment(int commentId)
        {
            comment com = db.comment.Where(x => x.comId == commentId).SingleOrDefault();
            if (com == null)
            {
                result.Success = false;
                result.ResultMessage = "Comment couldn't found.";
                return result;
            }

            db.comment.Remove(com);
            db.SaveChanges();

            result.Success = true;
            result.ResultMessage = "Comment removed.";
            return result;
        }

        #endregion
    }
}
