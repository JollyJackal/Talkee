using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Talkee.Lib
{
    public class Helper
    {
        //TODO This is clunky. Refactor to deal with config betters (also better way to generate jwt?)
        public static string GenerateJwtToken(IConfiguration configuration, IdentityUser user, IEnumerable<Claim> userClaims)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                //new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };
            claims = claims.Concat(userClaims).ToList<Claim>();
            //var roles = new List<Claim>();
            //foreach (var claim in userClaims)
            //{
            //    if (claim.Type == ClaimTypes.Role)
            //        roles.Add(claim);
            //    else
            //        claims.Add(claim);
            //}

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(configuration["JwtExpireDays"]));

            var token = new JwtSecurityToken(
                configuration["JwtIssuer"],
                configuration["JwtIssuer"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
