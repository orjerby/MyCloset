using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BEL
{
    public class Colors
    {

        public int ColorID { get; set; }
        public string ColorName { get; set; }

        public Colors(int id, string name)
        {
            ColorID = id;
            ColorName = name;
        }

        public Colors(int id)
        {
            ColorID = id;
        }

    }
}
