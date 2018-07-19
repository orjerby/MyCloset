using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using BEL;
using System.Data.SqlClient;
using System.Data;
using System.Web.Script.Serialization;

namespace BAL
{
    public class Operations
    {

        static public object LoginUser(Users user)
        {
            return Dbconnection.LoginUser(user);
        }

        static public object RegisterUser(Users user)
        {
            return Dbconnection.RegisterUser(user);
        }

        static public object UpdateUser(Users user)
        {
            return Dbconnection.UpdateUser(user);
        }

        static public Items AddItem(Users user, Items item, Subcategories subcategory, string Base64)
        {
            return Dbconnection.AddItem(user, item, subcategory, Base64);
        }

        static public Items EditItem(Items item, Subcategories subcategory, string Base64, string OldItemImg)
        {
            return Dbconnection.EditItem(item, subcategory, Base64, OldItemImg);
        }

        static public bool DeleteItem(Items item)
        {
            return Dbconnection.DeleteItem(item);
        }

        static public List<Genders> GetGenders()
        {
            return Dbconnection.GetGenders();
        }

    }
}
