using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Talkee.Models
{
    public class Conversation
    {
        public int Id { get; set; }

        public DateTime StartTime { get; set; }

        //public List<User> Members { get; set; }

        //public bool CoreUsersOnly { get; set; }
    }
}
