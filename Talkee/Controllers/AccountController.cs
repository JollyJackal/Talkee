using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Talkee.Dtos;
using Talkee.Lib;

namespace Talkee.Controllers
{
    [Route("[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;

        public AccountController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            IConfiguration configuration
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

            if (!result.Succeeded)
            {
                //TODO do I want to return result.Errors? Probably want generic since it's login.
                return StatusCode(401);
            }

            //var appUser = _userManager.Users.SingleOrDefault(r => r.Email == model.Email);

            var user = await _userManager.FindByEmailAsync(model.Email);
            //var roles = await _userManager.GetRolesAsync(user);
            var claims = await _userManager.GetClaimsAsync(user);

            var jwt = Helper.GenerateJwtToken(_configuration, user, claims);
            return Ok(jwt);
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new IdentityUser
            {
                UserName = model.Email,
                Email = model.Email
            };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                //TODO See how this works. If the format is bad, look at it again
                var errorText = "";
                foreach (var error in result.Errors)
                    errorText += ("Error: " + error.Description + "/n");
                //ModelState.AddModelError(string.Empty, error.Description);

                return StatusCode(500, errorText);
            }

            result = await _userManager.AddClaimAsync(user, new Claim(ClaimTypes.Role, "Administrator"));

            if (!result.Succeeded)
            {
                //TODO See how this works. If the format is bad, look at it again
                var errorText = "";
                foreach (var error in result.Errors)
                    errorText += ("Error: " + error.Description + "/n");
                //ModelState.AddModelError(string.Empty, error.Description);

                return StatusCode(500, errorText);
            }

            return Ok();
        }
    }
}