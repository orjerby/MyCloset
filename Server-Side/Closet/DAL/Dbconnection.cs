using BEL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Drawing;
using System.Drawing.Imaging;

namespace DAL
{
    public class Dbconnection
    {

        static private SqlConnection con = new SqlConnection(@"Data Source=185.60.170.14;Integrated Security=False;User ID=SITE05;Password=yourpassword;");

        static private SqlConnection getCon()
        {
            if (con.State == ConnectionState.Closed)
            {
                con.Open();
            }
            return con;
        }

        static public object LoginUser(Users user)
        {
            SqlDataReader sdr = null;
            try
            {
                SqlCommand cmd = new SqlCommand();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "LoginUser";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new SqlParameter("@UserEmail", user.UserEmail));
                cmd.Parameters.Add(new SqlParameter("@UserPass", user.UserPass));
                cmd.Connection = getCon();
                sdr = cmd.ExecuteReader();

                List<ColorOfItem> colorsOfItems = new List<ColorOfItem>();


                while (sdr.Read())
                {

                    Colors color = new Colors(int.Parse(sdr["ColorID"].ToString()), sdr["ColorName"].ToString());
                    ColorOfItem coi = new ColorOfItem(int.Parse(sdr["ItemID"].ToString()), color);
                    colorsOfItems.Add(coi);

                }

                sdr.NextResult();

                List<SeasonOfItem> seasonsOfItems = new List<SeasonOfItem>();
                while (sdr.Read())
                {

                    Seasons season = new Seasons(int.Parse(sdr["SeasonID"].ToString()), sdr["SeasonName"].ToString());
                    SeasonOfItem soi = new SeasonOfItem(int.Parse(sdr["ItemID"].ToString()), season);
                    seasonsOfItems.Add(soi);

                }

                sdr.NextResult();

                List<Items> items = new List<Items>();
                while (sdr.Read())
                {
                    int itemIDFromDB = int.Parse(sdr["ItemID"].ToString());
                    List<ColorOfItem> listOfColors = colorsOfItems.FindAll(Item => Item.ItemID == itemIDFromDB);
                    List<SeasonOfItem> listOfSeasons = seasonsOfItems.FindAll(Item => Item.ItemID == itemIDFromDB);

                    Subcategories subcategory = new Subcategories(int.Parse(sdr["SubcategoryID"].ToString()), sdr["SubcategoryName"].ToString());
                    Categories category = new Categories(int.Parse(sdr["CategoryID"].ToString()), sdr["CategoryName"].ToString(), subcategory);

                    Rates rate = new Rates(int.Parse(sdr["RateID"].ToString()), sdr["RateName"].ToString());
                    Items item = new Items(int.Parse(sdr["ItemID"].ToString()), sdr["ItemImg"].ToString(), category, listOfColors, listOfSeasons, rate, sdr["ItemMeasure"].ToString(), sdr["ItemCompany"].ToString(), sdr["ItemComment"].ToString());
                    items.Add(item);
                }

                user = null;

                sdr.NextResult();

                if (sdr.Read())
                {
                    Genders gender = new Genders(int.Parse(sdr["GenderID"].ToString()), sdr["GenderName"].ToString());
                    user = new Users(int.Parse(sdr["UserID"].ToString()), sdr["UserEmail"].ToString(), sdr["UserPass"].ToString(), sdr["UserFirstName"].ToString(), sdr["UserLastName"].ToString(), gender);
                }
                else
                {
                    return null;
                }

                List<Categories> categories = new List<Categories>();
                sdr.NextResult();
                while (sdr.Read())
                {
                    Subcategories subcategory = new Subcategories(int.Parse(sdr["SubcategoryID"].ToString()), sdr["SubcategoryName"].ToString());
                    Categories category = new Categories(int.Parse(sdr["CategoryID"].ToString()), sdr["CategoryName"].ToString(), subcategory);
                    categories.Add(category);
                }

                List<Colors> colors = new List<Colors>();
                sdr.NextResult();
                while (sdr.Read())
                {
                    Colors color = new Colors(int.Parse(sdr["ColorID"].ToString()), sdr["ColorName"].ToString());
                    colors.Add(color);
                }

                List<Seasons> seasons = new List<Seasons>();
                sdr.NextResult();
                while (sdr.Read())
                {
                    Seasons season = new Seasons(int.Parse(sdr["SeasonID"].ToString()), sdr["SeasonName"].ToString());
                    seasons.Add(season);
                }

                List<Rates> rates = new List<Rates>();
                sdr.NextResult();
                while (sdr.Read())
                {
                    Rates rate = new Rates(int.Parse(sdr["RateID"].ToString()), sdr["RateName"].ToString());
                    rates.Add(rate);
                }

                return new { user, items, categories, colors, seasons, rates };

            }
            catch (Exception e)
            {

            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    sdr.Close();
                    con.Close();
                }
            }
            return null;
        }

        static public object RegisterUser(Users user)
        {
            SqlDataReader sdr = null;
            try
            {
                SqlCommand cmd = new SqlCommand();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "RegisterUser";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new SqlParameter("@UserEmail", user.UserEmail));
                cmd.Parameters.Add(new SqlParameter("@UserPass", user.UserPass));
                cmd.Parameters.Add(new SqlParameter("@UserFirstName", user.UserFirstName));
                cmd.Parameters.Add(new SqlParameter("@UserLastName", user.UserLastName));
                cmd.Parameters.Add(new SqlParameter("@GenderID", user.Gender.GenderID));
                cmd.Connection = getCon();
                sdr = cmd.ExecuteReader();

                user = null;
                if (sdr.Read())
                {
                    Genders gender = new Genders(int.Parse(sdr["GenderID"].ToString()), sdr["GenderName"].ToString());
                    user = new Users(int.Parse(sdr["UserID"].ToString()), sdr["UserEmail"].ToString(), sdr["UserPass"].ToString(), sdr["UserFirstName"].ToString(), sdr["UserLastName"].ToString(), gender);
                }
                else
                {
                    return null;
                }

                List<Categories> categories = new List<Categories>();
                sdr.NextResult();
                while (sdr.Read())
                {
                    Subcategories subcategory = new Subcategories(int.Parse(sdr["SubcategoryID"].ToString()), sdr["SubcategoryName"].ToString());
                    Categories category = new Categories(int.Parse(sdr["CategoryID"].ToString()), sdr["CategoryName"].ToString(), subcategory);
                    categories.Add(category);
                }

                List<Colors> colors = new List<Colors>();
                sdr.NextResult();
                while (sdr.Read())
                {
                    Colors color = new Colors(int.Parse(sdr["ColorID"].ToString()), sdr["ColorName"].ToString());
                    colors.Add(color);
                }

                List<Seasons> seasons = new List<Seasons>();
                sdr.NextResult();
                while (sdr.Read())
                {
                    Seasons season = new Seasons(int.Parse(sdr["SeasonID"].ToString()), sdr["SeasonName"].ToString());
                    seasons.Add(season);
                }

                List<Rates> rates = new List<Rates>();
                sdr.NextResult();
                while (sdr.Read())
                {
                    Rates rate = new Rates(int.Parse(sdr["RateID"].ToString()), sdr["RateName"].ToString());
                    rates.Add(rate);
                }

                return new { user, categories, colors, seasons, rates };
            }
            catch (Exception e)
            {

            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    sdr.Close();
                    con.Close();
                }
            }
            return null;
        }

        static public Users UpdateUser(Users user)
        {
            SqlDataReader sdr = null;
            try
            {
                SqlCommand cmd = new SqlCommand();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "UpdateUser";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new SqlParameter("@UserID", user.UserID));
                cmd.Parameters.Add(new SqlParameter("@UserEmail", user.UserEmail));
                cmd.Parameters.Add(new SqlParameter("@UserPass", user.UserPass));
                cmd.Parameters.Add(new SqlParameter("@UserFirstName", user.UserFirstName));
                cmd.Parameters.Add(new SqlParameter("@UserLastName", user.UserLastName));
                cmd.Connection = getCon();
                sdr = cmd.ExecuteReader();

                user = null;
                if (sdr.Read())
                {
                    Genders gender = new Genders(int.Parse(sdr["GenderID"].ToString()), sdr["GenderName"].ToString());
                    user = new Users(int.Parse(sdr["UserID"].ToString()), sdr["UserEmail"].ToString(), sdr["UserPass"].ToString(), sdr["UserFirstName"].ToString(), sdr["UserLastName"].ToString(), gender);
                }
                else
                {
                    return null;
                }

                return user;
            }
            catch (Exception e)
            {

            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    sdr.Close();
                    con.Close();
                }
            }
            return null;
        }

        static public Items AddItem(Users user, Items itemFromWeb, Subcategories subcategory, string Base64)
        {
            string imgRef;
            if (Base64 != "")
            {
                File.WriteAllBytes(HttpContext.Current.Server.MapPath(@"~/images/" + itemFromWeb.ItemImg), Convert.FromBase64String(Base64));
                imgRef = @"http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site05/images/" + itemFromWeb.ItemImg;
            }
            else
            {
                imgRef = "";
            }


            SqlDataReader sdr = null;
            try
            {
                SqlCommand cmd = new SqlCommand();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "AddItem";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new SqlParameter("@UserID", user.UserID));
                cmd.Parameters.Add(new SqlParameter("@ItemImg", imgRef));
                cmd.Parameters.Add(new SqlParameter("@SubcategoryID", subcategory.SubcategoryID));
                cmd.Parameters.Add(new SqlParameter("@RateID", itemFromWeb.Rate.RateID));
                cmd.Parameters.Add(new SqlParameter("@ItemMeasure", itemFromWeb.ItemMeasure));
                cmd.Parameters.Add(new SqlParameter("@ItemCompany", itemFromWeb.ItemCompany));
                cmd.Parameters.Add(new SqlParameter("@ItemComment", itemFromWeb.ItemComment));
                cmd.Connection = getCon();
                sdr = cmd.ExecuteReader();

                subcategory = null;
                Rates rate = null;
                Items item = null;
                if (sdr.Read())
                {
                    subcategory = new Subcategories(int.Parse(sdr["SubcategoryID"].ToString()), sdr["SubcategoryName"].ToString());
                    Categories category = new Categories(int.Parse(sdr["CategoryID"].ToString()), sdr["CategoryName"].ToString(), subcategory);
                    rate = new Rates(int.Parse(sdr["RateID"].ToString()), sdr["RateName"].ToString());
                    item = new Items(int.Parse(sdr["ItemID"].ToString()), sdr["ItemImg"].ToString(), category, rate, sdr["ItemMeasure"].ToString(), sdr["ItemCompany"].ToString(), sdr["ItemComment"].ToString());
                }
                else
                {
                    return null;
                }

                sdr.Close();

                foreach (var ColorOfItem in itemFromWeb.ColorsOfItem)
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "InsertColorToItem";
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new SqlParameter("@ItemID", item.ItemID));
                    cmd.Parameters.Add(new SqlParameter("@ColorID", ColorOfItem.Color.ColorID));
                    cmd.ExecuteNonQuery();
                }

                sdr.Close();

                foreach (var SeasonOfItem in itemFromWeb.SeasonsOfItem)
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "InsertSeasonToItem";
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new SqlParameter("@ItemID", item.ItemID));
                    cmd.Parameters.Add(new SqlParameter("@SeasonID", SeasonOfItem.Season.SeasonID));
                    cmd.ExecuteNonQuery();
                }

                sdr.Close();

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "GetAllColorsOfItem";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new SqlParameter("@ItemID", item.ItemID));
                sdr = cmd.ExecuteReader();
                List<ColorOfItem> colorsOfItems = new List<ColorOfItem>();
                while (sdr.Read())
                {
                    Colors color = new Colors(int.Parse(sdr["ColorID"].ToString()), sdr["ColorName"].ToString());
                    ColorOfItem coi = new ColorOfItem(int.Parse(sdr["ItemID"].ToString()), color);
                    colorsOfItems.Add(coi);
                }

                sdr.Close();

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "GetAllSeasonsOfItem";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new SqlParameter("@ItemID", item.ItemID));
                sdr = cmd.ExecuteReader();
                List<SeasonOfItem> seasonsOfItems = new List<SeasonOfItem>();
                while (sdr.Read())
                {
                    Seasons season = new Seasons(int.Parse(sdr["SeasonID"].ToString()), sdr["SeasonName"].ToString());
                    SeasonOfItem soi = new SeasonOfItem(int.Parse(sdr["ItemID"].ToString()), season);
                    seasonsOfItems.Add(soi);
                }

                item.ColorsOfItem = colorsOfItems;
                item.SeasonsOfItem = seasonsOfItems;

                return item;
            }
            catch (Exception e)
            {

            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    sdr.Close();
                    con.Close();
                }
            }
            return null;
        }

        static public Items EditItem(Items itemFromWeb, Subcategories subcategory, string Base64, string OldItemImg)
        {

            string imgRef;

            if (Base64 == OldItemImg) // המשתמש לא לקח תמונה חדשה
            {
                imgRef = OldItemImg; // תשאיר את התמונה הקודמת
            }
            else
            {

                if (OldItemImg != "") // התמונה הקודמת היא תמונה אמיתית
                {

                    string nameOfImg = "~";
                    if (OldItemImg.Contains(@"/images/"))
                    {
                        for (int i = 0; i < OldItemImg.Length; i++)
                        {
                            if (OldItemImg[i] == '/' && OldItemImg[i + 1] == 'i' && OldItemImg[i + 2] == 'm' && OldItemImg[i + 3] == 'a' && OldItemImg[i + 4] == 'g' && OldItemImg[i + 5] == 'e' && OldItemImg[i + 6] == 's' && OldItemImg[i + 7] == '/')
                            {
                                nameOfImg += OldItemImg.Substring(i);
                                break;
                            }

                        }
                    }

                    File.Delete(HttpContext.Current.Server.MapPath(nameOfImg)); // תמחק אותה

                    // שים תמונה חדשה
                    File.WriteAllBytes(HttpContext.Current.Server.MapPath(@"~/images/" + itemFromWeb.ItemImg), Convert.FromBase64String(Base64));
                    imgRef = @"http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site05/images/" + itemFromWeb.ItemImg;
                }
                else // התמונה הקודמת היא דיפולט
                {
                    if (Base64 != "") // יש תמונה חדשה
                    {
                        File.WriteAllBytes(HttpContext.Current.Server.MapPath(@"~/images/" + itemFromWeb.ItemImg), Convert.FromBase64String(Base64));
                        imgRef = @"http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site05/images/" + itemFromWeb.ItemImg;
                    }
                    else // אין תמונה חדשה
                    {
                        imgRef = OldItemImg;
                    }
                }
            }


            SqlDataReader sdr = null;
            try
            {
                SqlCommand cmd = new SqlCommand();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "EditItem";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new SqlParameter("@ItemID", itemFromWeb.ItemID));
                cmd.Parameters.Add(new SqlParameter("@ItemImg", imgRef));
                cmd.Parameters.Add(new SqlParameter("@SubcategoryID", subcategory.SubcategoryID));
                cmd.Parameters.Add(new SqlParameter("@RateID", itemFromWeb.Rate.RateID));
                cmd.Parameters.Add(new SqlParameter("@ItemMeasure", itemFromWeb.ItemMeasure));
                cmd.Parameters.Add(new SqlParameter("@ItemCompany", itemFromWeb.ItemCompany));
                cmd.Parameters.Add(new SqlParameter("@ItemComment", itemFromWeb.ItemComment));
                cmd.Connection = getCon();
                sdr = cmd.ExecuteReader();

                subcategory = null;
                Rates rate = null;
                Items item = null;
                if (sdr.Read())
                {
                    subcategory = new Subcategories(int.Parse(sdr["SubcategoryID"].ToString()), sdr["SubcategoryName"].ToString());
                    Categories category = new Categories(int.Parse(sdr["CategoryID"].ToString()), sdr["CategoryName"].ToString(), subcategory);
                    rate = new Rates(int.Parse(sdr["RateID"].ToString()), sdr["RateName"].ToString());
                    item = new Items(int.Parse(sdr["ItemID"].ToString()), sdr["ItemImg"].ToString(), category, rate, sdr["ItemMeasure"].ToString(), sdr["ItemCompany"].ToString(), sdr["ItemComment"].ToString());
                }
                else
                {
                    return null;
                }

                sdr.Close();

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "RemoveColorsAndSeasonsFromItem";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new SqlParameter("@ItemID", item.ItemID));
                cmd.ExecuteNonQuery();

                sdr.Close();

                foreach (var ColorOfItem in itemFromWeb.ColorsOfItem)
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "InsertColorToItem";
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new SqlParameter("@ItemID", item.ItemID));
                    cmd.Parameters.Add(new SqlParameter("@ColorID", ColorOfItem.Color.ColorID));
                    cmd.ExecuteNonQuery();
                }

                sdr.Close();

                foreach (var SeasonOfItem in itemFromWeb.SeasonsOfItem)
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "InsertSeasonToItem";
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add(new SqlParameter("@ItemID", item.ItemID));
                    cmd.Parameters.Add(new SqlParameter("@SeasonID", SeasonOfItem.Season.SeasonID));
                    cmd.ExecuteNonQuery();
                }

                sdr.Close();

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "GetAllColorsOfItem";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new SqlParameter("@ItemID", item.ItemID));
                sdr = cmd.ExecuteReader();
                List<ColorOfItem> colorsOfItems = new List<ColorOfItem>();
                while (sdr.Read())
                {
                    Colors color = new Colors(int.Parse(sdr["ColorID"].ToString()), sdr["ColorName"].ToString());
                    ColorOfItem coi = new ColorOfItem(int.Parse(sdr["ItemID"].ToString()), color);
                    colorsOfItems.Add(coi);
                }

                sdr.Close();

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "GetAllSeasonsOfItem";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new SqlParameter("@ItemID", item.ItemID));
                sdr = cmd.ExecuteReader();
                List<SeasonOfItem> seasonsOfItems = new List<SeasonOfItem>();
                while (sdr.Read())
                {
                    Seasons season = new Seasons(int.Parse(sdr["SeasonID"].ToString()), sdr["SeasonName"].ToString());
                    SeasonOfItem soi = new SeasonOfItem(int.Parse(sdr["ItemID"].ToString()), season);
                    seasonsOfItems.Add(soi);
                }

                item.ColorsOfItem = colorsOfItems;
                item.SeasonsOfItem = seasonsOfItems;

                return item;
            }
            catch (Exception e)
            {

            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    sdr.Close();
                    con.Close();
                }
            }
            return null;
        }

        static public bool DeleteItem(Items item)
        {

            if (item.ItemImg != "")
            {
                string nameOfImg = "~";
                if (item.ItemImg.Contains(@"/images/"))
                {
                    for (int i = 0; i < item.ItemImg.Length; i++)
                    {
                        if (item.ItemImg[i] == '/' && item.ItemImg[i + 1] == 'i' && item.ItemImg[i + 2] == 'm' && item.ItemImg[i + 3] == 'a' && item.ItemImg[i + 4] == 'g' && item.ItemImg[i + 5] == 'e' && item.ItemImg[i + 6] == 's' && item.ItemImg[i + 7] == '/')
                        {
                            nameOfImg += item.ItemImg.Substring(i);
                            break;
                        }

                    }
                }

                File.Delete(HttpContext.Current.Server.MapPath(nameOfImg));
            }

            try
            {
                SqlCommand cmd = new SqlCommand();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "DeleteItem";
                cmd.Parameters.Clear();
                cmd.Parameters.Add(new SqlParameter("@ItemID", item.ItemID));
                cmd.Connection = getCon();
                int rowsAffected = cmd.ExecuteNonQuery();
                if (rowsAffected > 0)
                {
                    return true;
                }
            }
            catch (Exception e)
            {

            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    con.Close();
                }
            }
            return false;
        }

        static public List<Genders> GetGenders()
        {
            SqlDataReader sdr = null;
            try
            {
                SqlCommand cmd = new SqlCommand();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "GetGenders";
                cmd.Parameters.Clear();
                cmd.Connection = getCon();
                sdr = cmd.ExecuteReader();

                List<Genders> genders = new List<Genders>();
                while (sdr.Read())
                {
                    Genders gender = new Genders(int.Parse(sdr["GenderID"].ToString()), sdr["GenderName"].ToString());
                    genders.Add(gender);
                }
                return genders;
            }
            catch (Exception e)
            {

            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    sdr.Close();
                    con.Close();
                }
            }
            return null;
        }

    }
}
