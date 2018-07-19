using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BEL
{
    public class SeasonOfItem
    {

        public int ItemID { get; set; }
        public Seasons Season { get; set; }

        public SeasonOfItem(int itemID, Seasons season)
        {
            ItemID = itemID;
            Season = season;
        }

        public SeasonOfItem(Seasons season)
        {
            Season = season;
        }

    }
}
