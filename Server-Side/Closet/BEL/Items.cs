using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BEL
{
    public class Items
    {

        public int ItemID { get; set; }
        public string ItemImg { get; set; }
        public Categories Category { get; set; }
        public List<ColorOfItem> ColorsOfItem { get; set; }
        public List<SeasonOfItem> SeasonsOfItem { get; set; }
        public Rates Rate { get; set; }
        public string ItemMeasure { get; set; }
        public string ItemCompany { get; set; }
        public string ItemComment { get; set; }

        public Items(int id, string img, Categories category, List<ColorOfItem> colorOfItem, List<SeasonOfItem> seasonOfItem, Rates rate, string measure, string company, string comment)
        {
            ItemID = id;
            ItemImg = img;
            Category = category;
            ColorsOfItem = colorOfItem;
            SeasonsOfItem = seasonOfItem;
            Rate = rate;
            ItemMeasure = measure;
            ItemCompany = company;
            ItemComment = comment;
        }

        public Items(string img, Categories category, List<ColorOfItem> colorOfItem, List<SeasonOfItem> seasonOfItem, Rates rate, string measure, string company, string comment)
        {
            ItemImg = img;
            Category = category;
            ColorsOfItem = colorOfItem;
            SeasonsOfItem = seasonOfItem;
            Rate = rate;
            ItemMeasure = measure;
            ItemCompany = company;
            ItemComment = comment;
        }

        public Items(string img, List<ColorOfItem> colorOfItem, List<SeasonOfItem> seasonOfItem, Rates rate, string measure, string company, string comment)
        {
            ItemImg = img;
            ColorsOfItem = colorOfItem;
            SeasonsOfItem = seasonOfItem;
            Rate = rate;
            ItemMeasure = measure;
            ItemCompany = company;
            ItemComment = comment;
        }

        public Items(int id, string img, List<ColorOfItem> colorOfItem, List<SeasonOfItem> seasonOfItem, Rates rate, string measure, string company, string comment)
        {
            ItemID = id;
            ItemImg = img;
            ColorsOfItem = colorOfItem;
            SeasonsOfItem = seasonOfItem;
            Rate = rate;
            ItemMeasure = measure;
            ItemCompany = company;
            ItemComment = comment;
        }

        public Items(int id, string img, Categories category, Rates rate, string measure, string company, string comment)
        {
            ItemID = id;
            ItemImg = img;
            Category = category;
            Rate = rate;
            ItemMeasure = measure;
            ItemCompany = company;
            ItemComment = comment;
        }

        public Items(List<ColorOfItem> colorOfItem, List<SeasonOfItem> seasonOfItem, Rates rate)
        {
            ColorsOfItem = colorOfItem;
            SeasonsOfItem = seasonOfItem;
            Rate = rate;
        }

        public Items(int id, string img)
        {
            ItemID = id;
            ItemImg = img;
        }


        //public Items(string img, Subcategories subcategory, List<Colors> colors, List<Seasons> seasons, Rates rate, string measure, string company, string comment)
        //{
        //    ItemImg = img;
        //    Subcategory = subcategory;
        //    Colors = colors;
        //    Seasons = seasons;
        //    Rate = rate;
        //    ItemMeasure = measure;
        //    ItemCompany = company;
        //    ItemComment = comment;
        //}

        public Items(int id)
        {
            ItemID = id;
        }

    }
}
