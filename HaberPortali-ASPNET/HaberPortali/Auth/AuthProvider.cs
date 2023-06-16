using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HaberPortali.Auth
{
    public class AuthProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            await Task.Yield();
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            await Task.Yield();

            var userMail = context.UserName;
            var userPw = context.Password;

            // Burada kendi authentication yöntemimizi belirleyebiliriz. Veritabanı bağlantısı vb...
            var userService = new UserService();
            var user = userService.UserLogIn(userMail, userPw);
            List<string> userAuths = new List<string>();

            if (user != null)
            {
                string userAuth = "";
                if (user.userAdmin == 1)
                {
                    userAuth = "Admin";
                }
                else
                {
                    userAuth = "User";
                }
                userAuths.Add(userAuth);

                var identity = new ClaimsIdentity(context.Options.AuthenticationType);
                identity.AddClaim(new Claim(ClaimTypes.Name, user.userMail));
                identity.AddClaim(new Claim(ClaimTypes.Role, userAuth));
                identity.AddClaim(new Claim(ClaimTypes.PrimarySid, user.userId.ToString()));
                var properties = new AuthenticationProperties(new Dictionary<string, string>
                {
                    { "userId", user.userId.ToString() },
                    { "userMail", user.userMail },
                    { "userAuths", Newtonsoft.Json.JsonConvert.SerializeObject(userAuths) }
                });

                var ticket = new AuthenticationTicket(identity, properties);

                context.Validated(ticket);
            }
            else
            {
                context.SetError("Invalid Request", "Incorrect user information");
            }
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }
    }
}
