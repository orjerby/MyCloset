using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BEL
{
    public class Genders
    {

        public int GenderID { get; set; }
        public string GenderName { get; set; }

        public Genders(int id, string name)
        {
            GenderID = id;
            GenderName = name;
        }

        public Genders(int id)
        {
            GenderID = id;
        }

    }
}
