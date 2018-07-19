using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using BAL;
using BEL;

namespace Closet
{
    /// <summary>
    /// Summary description for Closet
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class Closet : System.Web.Services.WebService
    {
       

        //public Operations opr = new Operations();

        [WebMethod]
        public string LoginUser(string UserEmail, string UserPass)
        {
            Users user = new Users(UserEmail, UserPass);
            return new JavaScriptSerializer().Serialize(Operations.LoginUser(user));
        }

        [WebMethod]
        public string RegisterUser(string UserEmail, string UserPass, string UserFirstName, string UserLastName, int GenderID)
        {
            Genders gender = new Genders(GenderID);
            Users user = new Users(UserEmail, UserPass, UserFirstName, UserLastName, gender);
            return new JavaScriptSerializer().Serialize(Operations.RegisterUser(user));
        }

        [WebMethod]
        public string UpdateUser(int UserID, string UserEmail, string UserPass, string UserFirstName, string UserLastName)
        {
            Users user = new Users(UserID, UserEmail, UserPass, UserFirstName, UserLastName);
            return new JavaScriptSerializer().Serialize(Operations.UpdateUser(user));
        }

        [WebMethod]
        public string AddItem(int UserID, string Base64, string ItemImg, int[] ColorIDArray, int[] SeasonIDArray, int SubcategoryID, int RateID, string ItemMeasure, string ItemCompany, string ItemComment)
        {
            Users user = new Users(UserID);

            Subcategories subcategory = new Subcategories(SubcategoryID);

            List<ColorOfItem> colorsOfItem = new List<ColorOfItem>();
            foreach (var ColorID in ColorIDArray)
            {
                colorsOfItem.Add(new ColorOfItem(new Colors(ColorID)));
            }

            List<SeasonOfItem> seasonsOfItem = new List<SeasonOfItem>();
            foreach (var SeasonID in SeasonIDArray)
            {
                seasonsOfItem.Add(new SeasonOfItem(new Seasons(SeasonID)));
            }

            Rates rate = new Rates(RateID);
            Items item = new Items(ItemImg, colorsOfItem, seasonsOfItem, rate, ItemMeasure, ItemCompany, ItemComment);
            return new JavaScriptSerializer().Serialize(Operations.AddItem(user, item, subcategory, Base64));
        }

        [WebMethod]
        public string EditItem(int ItemID, string Base64, string ItemImg, string OldItemImg, int SubcategoryID, int[] ColorIDArray, int[] SeasonIDArray, int RateID, string ItemMeasure, string ItemCompany, string ItemComment)
        {
            Subcategories subcategory = new Subcategories(SubcategoryID);

            List<ColorOfItem> colorsOfItem = new List<ColorOfItem>();
            foreach (var ColorID in ColorIDArray)
            {
                colorsOfItem.Add(new ColorOfItem(new Colors(ColorID)));
            }

            List<SeasonOfItem> seasonsOfItem = new List<SeasonOfItem>();
            foreach (var SeasonID in SeasonIDArray)
            {
                seasonsOfItem.Add(new SeasonOfItem(new Seasons(SeasonID)));
            }

            Rates rate = new Rates(RateID);
            Items item = new Items(ItemID, ItemImg, colorsOfItem, seasonsOfItem, rate, ItemMeasure, ItemCompany, ItemComment);
            return new JavaScriptSerializer().Serialize(Operations.EditItem(item, subcategory, Base64, OldItemImg));
        }

        [WebMethod]
        public bool DeleteItem(int ItemID, string ItemImg)
        {
            Items item = new Items(ItemID, ItemImg);
            return Operations.DeleteItem(item);
        }

        [WebMethod]
        public string GetGenders()
        {
            return new JavaScriptSerializer().Serialize(Operations.GetGenders());
        }

    }
}
