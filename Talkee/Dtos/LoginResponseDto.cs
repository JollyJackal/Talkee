using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Talkee.Dtos
{
    public class LoginResponseDto
    {
        /*
             {
               token: <tok>,
               user: {id: <id>, name: <name>}
             }
             */
        public string Token { get; set; }
        public UserDto User { get; set; }
    }
}
