using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Talkee.Models
{
    public class Message
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        public IdentityUser User { get; set; }

        public int ConversationId { get; set; }

        public Conversation Conversation { get; set; }

        public DateTime TimeAdded { get; set; }
        
        [Required]
        [StringLength(2000)]
        public string Text { get; set; }
    }
}
