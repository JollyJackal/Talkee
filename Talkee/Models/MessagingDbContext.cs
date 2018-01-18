using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Talkee.Models
{
    public class MessagingDbContext: IdentityDbContext
    {
        public MessagingDbContext(DbContextOptions<MessagingDbContext> options)
            :base(options)
        {

        }

        public DbSet<Message> Messages { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Edit> Edits { get; set; }
    }
}
