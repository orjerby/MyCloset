using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BEL
{
    public class Users
    {

        public int UserID { get; set; }
        public string UserEmail { get; set; }
        public string UserPass { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public Genders Gender { get; set; }

        public Users(int id, string email, string pass, string firstName, string lastName, Genders gender)
        {
            UserID = id;
            UserEmail = email;
            UserPass = pass;
            UserFirstName = firstName;
            UserLastName = lastName;
            Gender = gender;
        }

        public Users(int id, string email, string pass, string firstName, string lastName)
        {
            UserID = id;
            UserEmail = email;
            UserPass = pass;
            UserFirstName = firstName;
            UserLastName = lastName;
        }

        public Users(string email, string pass)
        {
            UserEmail = email;
            UserPass = pass;
        }

        public Users(string email, string pass, string firstName, string lastName, Genders gender)
        {
            UserEmail = email;
            UserPass = pass;
            UserFirstName = firstName;
            UserLastName = lastName;
            Gender = gender;
        }

        public Users(int id)
        {
            UserID = id;
        }

    }
}
