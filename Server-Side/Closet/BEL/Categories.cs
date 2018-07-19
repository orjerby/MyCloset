using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BEL
{

    public class Categories
    {

        public int CategoryID { get; set; }
        public string CategoryName { get; set; }
        public Subcategories Subcategory { get; set; }

        public Categories(int id, string name, Subcategories subcategory)
        {
            CategoryID = id;
            CategoryName = name;
            Subcategory = subcategory;
        }

        public Categories(int id)
        {
            CategoryID = id;
        }

    }
}
