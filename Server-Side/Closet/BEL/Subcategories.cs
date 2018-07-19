using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BEL
{
    public class Subcategories
    {

        public int SubcategoryID { get; set; }
        public string SubcategoryName { get; set; }

        public Subcategories(int id, string name)
        {
            SubcategoryID = id;
            SubcategoryName = name;
        }

        public Subcategories(int id)
        {
            SubcategoryID = id;
        }

    }
}
