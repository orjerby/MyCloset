using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BEL
{
    public class Rates
    {

        public int RateID { get; set; }
        public string RateName { get; set; }

        public Rates(int id, string name)
        {
            RateID = id;
            RateName = name;
        }

        public Rates(int id)
        {
            RateID = id;
        }

    }
}
