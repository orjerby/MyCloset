using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BEL
{
    public class ColorOfItem
    {

        public int ItemID { get; set; }
        public Colors Color { get; set; }

        public ColorOfItem(int itemID, Colors color)
        {
            ItemID = itemID;
            Color = color;
        }

        public ColorOfItem(Colors color)
        {
            Color = color;
        }

    }
}
