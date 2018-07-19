using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BEL
{
    public class Seasons
    {

        public int SeasonID { get; set; }
        public string SeasonName { get; set; }

        public Seasons(int id, string name)
        {
            SeasonID = id;
            SeasonName = name;
        }

        public Seasons(int id)
        {
            SeasonID = id;
        }

    }
}
