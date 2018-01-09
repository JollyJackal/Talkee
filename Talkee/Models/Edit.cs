using System;
using System.ComponentModel.DataAnnotations;

namespace Talkee.Models
{
    public class Edit
    {
        public int Id { get; set; }

        public Message Message { get; set; }

        public int MessageId { get; set; }

        public DateTime MessageTime { get; set; }

        [Required]
        [StringLength(2000)]
        public string Text { get; set; }
    }
}
