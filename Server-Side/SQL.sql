
CREATE TABLE Genders (
	GenderID int identity(1,1) NOT NULL PRIMARY KEY,
	GenderName nvarchar(10) NOT NULL
);

CREATE TABLE Users (
	UserID int identity(1,1) NOT NULL PRIMARY KEY,
	UserEmail varchar(100) NOT NULL,
	UserPass varchar(30) NOT NULL,
	UserFirstName nvarchar(15) NOT NULL,
	UserLastName nvarchar(15) NOT NULL,
	GenderID int NOT NULL FOREIGN KEY REFERENCES Genders(GenderID)
);

CREATE TABLE Categories (
	CategoryID int identity(1,1) NOT NULL PRIMARY KEY,
	CategoryName nvarchar(30) NOT NULL,
);

CREATE TABLE Subcategories (
	SubcategoryID int identity(1,1) NOT NULL PRIMARY KEY,
	SubcategoryName nvarchar(30) NOT NULL,
);

CREATE TABLE CategoriesByGender (
	CategoryID int NOT NULL FOREIGN KEY REFERENCES Categories(CategoryID),
	GenderID int NOT NULL FOREIGN KEY REFERENCES Genders(GenderID)
);

CREATE TABLE SubcategoriesOfCategories (
	CategoryID int NOT NULL FOREIGN KEY REFERENCES Categories(CategoryID),
	SubcategoryID int NOT NULL FOREIGN KEY REFERENCES Subcategories(SubcategoryID)
	PRIMARY KEY (CategoryID, SubcategoryID)
);

CREATE TABLE Colors (
	ColorID int identity(1,1) NOT NULL PRIMARY KEY,
	ColorName nvarchar(30) NOT NULL
);

CREATE TABLE Seasons (
	SeasonID int identity(1,1) NOT NULL PRIMARY KEY,
	SeasonName nvarchar(30) NOT NULL
);

CREATE TABLE Rates (
	RateID int identity(1,1) NOT NULL PRIMARY KEY,
	RateName nvarchar(30) NOT NULL
);

CREATE TABLE Items (
	ItemID int identity(1,1) NOT NULL PRIMARY KEY,
	ItemImg varchar(max) NOT NULL,
	SubcategoryID int NOT NULL FOREIGN KEY REFERENCES Subcategories(SubcategoryID),
	RateID int NOT NULL FOREIGN KEY REFERENCES Rates(RateID),
	ItemMeasure nvarchar(30),
	ItemCompany nvarchar(30),
	ItemComment nvarchar(max)
);

CREATE TABLE ItemsOfUsers (
	ItemID int NOT NULL FOREIGN KEY REFERENCES Items(ItemID),
	UserID int NOT NULL FOREIGN KEY REFERENCES Users(UserID)
	PRIMARY KEY (ItemID)
);

CREATE TABLE ColorsOfItems (
	ItemID int NOT NULL FOREIGN KEY REFERENCES Items(ItemID),
	ColorID int NOT NULL FOREIGN KEY REFERENCES Colors(ColorID)
	PRIMARY KEY (ItemID, ColorID)
);

CREATE TABLE SeasonsOfItems (
	ItemID int NOT NULL FOREIGN KEY REFERENCES Items(ItemID),
	SeasonID int NOT NULL FOREIGN KEY REFERENCES Seasons(SeasonID)
	PRIMARY KEY (ItemID, SeasonID)
);

GO

CREATE PROC AddItem
@UserID int,
@ItemImg varchar(max),
@SubcategoryID int,
@RateID int,
@ItemMeasure nvarchar(30),
@ItemCompany nvarchar(30),
@ItemComment nvarchar(max)
AS
BEGIN
	--IF EXISTS (SELECT UserID FROM site05.Users WHERE (UserID = @UserID))
	--BEGIN


		INSERT [site05].[Items] (ItemImg, SubcategoryID, RateID, ItemMeasure, ItemCompany, ItemComment) Values (@ItemImg, @SubcategoryID, @RateID, @ItemMeasure, @ItemCompany, @ItemComment)
		declare @ID int = SCOPE_IDENTITY()
		INSERT [site05].[ItemsOfUsers] (ItemID, UserID) Values (@ID, @UserID)

		--all info on item but colors and seasons
		SELECT        site05.Items.ItemID, site05.Items.ItemImg, site05.Subcategories.SubcategoryID, site05.Subcategories.SubcategoryName, site05.Categories.CategoryID, site05.Categories.CategoryName, site05.Rates.RateID, 
                         site05.Rates.RateName, site05.Items.ItemMeasure, site05.Items.ItemCompany, site05.Items.ItemComment
		FROM            site05.Rates INNER JOIN
                         site05.Items ON site05.Rates.RateID = site05.Items.RateID INNER JOIN
                         site05.Subcategories ON site05.Items.SubcategoryID = site05.Subcategories.SubcategoryID INNER JOIN
                         site05.SubcategoriesOfCategories ON site05.Subcategories.SubcategoryID = site05.SubcategoriesOfCategories.SubcategoryID INNER JOIN
                         site05.Categories ON site05.SubcategoriesOfCategories.CategoryID = site05.Categories.CategoryID
		WHERE        (site05.Items.ItemID = @ID)


	--END
END

GO

CREATE PROC DeleteItem
@ItemID int
AS
BEGIN
	DELETE FROM [site05].[ItemsOfUsers] WHERE ItemID = @ItemID
	DELETE FROM [site05].[ColorsOfItems] WHERE ItemID = @ItemID
	DELETE FROM [site05].[SeasonsOfItems] WHERE ItemID = @ItemID
	DELETE FROM [site05].[Items] WHERE ItemID = @ItemID
END

GO

CREATE PROC EditItem
@ItemID int,
@ItemImg varchar(max),
@SubcategoryID int,
@RateID int,
@ItemMeasure nvarchar(30),
@ItemCompany nvarchar(30),
@ItemComment nvarchar(max)
AS
BEGIN
	UPDATE [site05].[Items]
	SET ItemImg=@ItemImg, SubcategoryID=@SubcategoryID, RateID=@RateID, ItemMeasure=@ItemMeasure, ItemCompany=@ItemCompany, ItemComment=@ItemComment
	WHERE ItemID=@ItemID
	
	SELECT        site05.Items.ItemID, site05.Items.ItemImg, site05.Subcategories.SubcategoryID, site05.Subcategories.SubcategoryName, site05.Categories.CategoryID, site05.Categories.CategoryName, site05.Rates.RateID, 
                         site05.Rates.RateName, site05.Items.ItemMeasure, site05.Items.ItemCompany, site05.Items.ItemComment
	FROM            site05.Rates INNER JOIN
                         site05.Items ON site05.Rates.RateID = site05.Items.RateID INNER JOIN
                         site05.Subcategories ON site05.Items.SubcategoryID = site05.Subcategories.SubcategoryID INNER JOIN
                         site05.SubcategoriesOfCategories ON site05.Subcategories.SubcategoryID = site05.SubcategoriesOfCategories.SubcategoryID INNER JOIN
                         site05.Categories ON site05.SubcategoriesOfCategories.CategoryID = site05.Categories.CategoryID
	WHERE        (site05.Items.ItemID = @ItemID)
END

GO

CREATE PROC GetAllColorsOfItem
@ItemID int
AS
BEGIN
		SELECT        site05.Items.ItemID, site05.Colors.ColorID, site05.Colors.ColorName
		FROM            site05.Colors INNER JOIN
                         site05.ColorsOfItems ON site05.Colors.ColorID = site05.ColorsOfItems.ColorID INNER JOIN
                         site05.Items ON site05.ColorsOfItems.ItemID = site05.Items.ItemID
		WHERE        (site05.Items.ItemID = @ItemID)
END

GO

CREATE PROC GetAllSeasonsOfItem
@ItemID int
AS
BEGIN
		SELECT        site05.Items.ItemID, site05.Seasons.SeasonID, site05.Seasons.SeasonName
		FROM            site05.Seasons INNER JOIN
                         site05.SeasonsOfItems ON site05.Seasons.SeasonID = site05.SeasonsOfItems.SeasonID INNER JOIN
                         site05.Items ON site05.SeasonsOfItems.ItemID = site05.Items.ItemID
		WHERE        (site05.Items.ItemID = @ItemID)
END

GO

CREATE PROC GetGenders
AS
BEGIN
	SELECT GenderID, GenderName FROM site05.Genders
END

GO

CREATE PROC InsertColorToItem
@ItemID int,
@ColorID int
AS
BEGIN
		INSERT [site05].[ColorsOfItems] (ItemID, ColorID) Values (@ItemID, @ColorID)
END

GO

CREATE PROC InsertSeasonToItem
@ItemID int,
@SeasonID int
AS
BEGIN
		INSERT [site05].[SeasonsOfItems] (ItemID, SeasonID) Values (@ItemID, @SeasonID)
END

GO

CREATE PROC LoginUser
@UserEmail varchar(30),
@UserPass VARCHAR(30)
AS
BEGIN
	IF EXISTS (SELECT UserID FROM site05.Users WHERE (UserEmail = @UserEmail) AND (UserPass = @UserPass COLLATE SQL_Latin1_General_CP1_CS_AS))
	BEGIN


	--colors of all items include ItemID
	SELECT        site05.Items.ItemID, site05.Colors.ColorID, site05.Colors.ColorName
	FROM            site05.Users INNER JOIN
                         site05.ItemsOfUsers ON site05.Users.UserID = site05.ItemsOfUsers.UserID INNER JOIN
                         site05.Items ON site05.ItemsOfUsers.ItemID = site05.Items.ItemID INNER JOIN
                         site05.ColorsOfItems ON site05.Items.ItemID = site05.ColorsOfItems.ItemID INNER JOIN
                         site05.Colors ON site05.ColorsOfItems.ColorID = site05.Colors.ColorID
	WHERE        (site05.Users.UserEmail = @UserEmail) AND (site05.Users.UserPass = @UserPass COLLATE SQL_Latin1_General_CP1_CS_AS)

	--seasons of all items include ItemID
	SELECT        site05.Items.ItemID, site05.Seasons.SeasonID, site05.Seasons.SeasonName
	FROM            site05.Users INNER JOIN
                         site05.ItemsOfUsers ON site05.Users.UserID = site05.ItemsOfUsers.UserID INNER JOIN
                         site05.Items ON site05.ItemsOfUsers.ItemID = site05.Items.ItemID INNER JOIN
                         site05.SeasonsOfItems ON site05.Items.ItemID = site05.SeasonsOfItems.ItemID INNER JOIN
                         site05.Seasons ON site05.SeasonsOfItems.SeasonID = site05.Seasons.SeasonID
	WHERE        (site05.Users.UserEmail = @UserEmail) AND (site05.Users.UserPass = @UserPass COLLATE SQL_Latin1_General_CP1_CS_AS)

	--all items of user with all but colors and seasons
SELECT        TOP (100) PERCENT site05.Rates.RateID, site05.Rates.RateName, site05.Items.ItemID, site05.Items.ItemImg, site05.Items.ItemMeasure, site05.Items.ItemCompany, site05.Items.ItemComment, 
                         site05.Subcategories.SubcategoryID, site05.Subcategories.SubcategoryName, site05.Categories.CategoryID, site05.Categories.CategoryName
FROM            site05.Users INNER JOIN
                         site05.ItemsOfUsers ON site05.Users.UserID = site05.ItemsOfUsers.UserID INNER JOIN
                         site05.Items ON site05.ItemsOfUsers.ItemID = site05.Items.ItemID INNER JOIN
                         site05.Rates ON site05.Items.RateID = site05.Rates.RateID INNER JOIN
                         site05.Subcategories ON site05.Items.SubcategoryID = site05.Subcategories.SubcategoryID INNER JOIN
                         site05.SubcategoriesOfCategories ON site05.Subcategories.SubcategoryID = site05.SubcategoriesOfCategories.SubcategoryID INNER JOIN
                         site05.Categories ON site05.SubcategoriesOfCategories.CategoryID = site05.Categories.CategoryID
	WHERE				(site05.Users.UserEmail = @UserEmail) AND (site05.Users.UserPass = @UserPass COLLATE SQL_Latin1_General_CP1_CS_AS)
	ORDER BY site05.Items.ItemID DESC

	--all user's info
	SELECT  	site05.Users.UserID, site05.Users.UserEmail, site05.Users.UserPass, site05.Users.UserFirstName, site05.Users.UserLastName, site05.Genders.GenderID, site05.Genders.GenderName
	FROM 		site05.Users INNER JOIN site05.Genders ON site05.Users.GenderID = site05.Genders.GenderID
	WHERE       (site05.Users.UserEmail = @UserEmail) AND (site05.Users.UserPass = @UserPass COLLATE SQL_Latin1_General_CP1_CS_AS)
	
	--all categories and subcategories of user's gender
	SELECT        site05.Subcategories.SubcategoryID, site05.Subcategories.SubcategoryName, site05.Categories.CategoryID, site05.Categories.CategoryName
	FROM            site05.Genders INNER JOIN
                         site05.Users ON site05.Genders.GenderID = site05.Users.GenderID INNER JOIN
                         site05.Subcategories INNER JOIN
                         site05.SubcategoriesOfCategories ON site05.Subcategories.SubcategoryID = site05.SubcategoriesOfCategories.SubcategoryID INNER JOIN
                         site05.Categories INNER JOIN
                         site05.CategoriesByGender ON site05.Categories.CategoryID = site05.CategoriesByGender.CategoryID ON site05.SubcategoriesOfCategories.CategoryID = site05.Categories.CategoryID ON 
                         site05.Genders.GenderID = site05.CategoriesByGender.GenderID
	WHERE			(site05.Users.UserEmail = @UserEmail) AND (site05.Users.UserPass = @UserPass COLLATE SQL_Latin1_General_CP1_CS_AS)

	--all colors
	SELECT      ColorID, ColorName
	FROM        site05.Colors

	--all seasons
	SELECT      SeasonID, SeasonName
	FROM        site05.Seasons

	--all rates
	SELECT      RateID, RateName
	FROM        site05.Rates


	END
END

GO

CREATE PROC RegisterUser
@UserEmail varchar(100),
@UserPass varchar(30),
@UserFirstName nvarchar(15),
@UserLastName nvarchar(15),
@GenderID int
AS
BEGIN
	IF NOT EXISTS (SELECT UserEmail FROM site05.Users WHERE UserEmail = @UserEmail)
	BEGIN
		INSERT [site05].[Users] (UserEmail, UserPass, UserFirstName, UserLastName, GenderID) Values (@UserEmail,@UserPass,@UserFirstName,@UserLastName,@GenderID)
		SELECT		site05.Users.UserID, site05.Users.UserEmail, site05.Users.UserPass, site05.Users.UserFirstName, site05.Users.UserLastName, site05.Genders.GenderID, site05.Genders.GenderName
		FROM        site05.Users INNER JOIN
                    site05.Genders ON site05.Users.GenderID = site05.Genders.GenderID
		WHERE       site05.Users.UserEmail = @UserEmail

		--all categories and subcategories of user's gender
		SELECT        site05.Subcategories.SubcategoryID, site05.Subcategories.SubcategoryName, site05.Categories.CategoryID, site05.Categories.CategoryName
		FROM            site05.Genders INNER JOIN
                         site05.Users ON site05.Genders.GenderID = site05.Users.GenderID INNER JOIN
                         site05.Subcategories INNER JOIN
                         site05.SubcategoriesOfCategories ON site05.Subcategories.SubcategoryID = site05.SubcategoriesOfCategories.SubcategoryID INNER JOIN
                         site05.Categories INNER JOIN
                         site05.CategoriesByGender ON site05.Categories.CategoryID = site05.CategoriesByGender.CategoryID ON site05.SubcategoriesOfCategories.CategoryID = site05.Categories.CategoryID ON 
                         site05.Genders.GenderID = site05.CategoriesByGender.GenderID
		WHERE        site05.Users.UserEmail = @UserEmail

		--all colors
		SELECT      ColorID, ColorName
		FROM        site05.Colors

		--all seasons
		SELECT      SeasonID, SeasonName
		FROM        site05.Seasons

		--all rates
		SELECT      RateID, RateName
		FROM        site05.Rates
	END
END

GO

CREATE PROC RemoveColorsAndSeasonsFromItem
@ItemID int
AS
BEGIN
	DELETE FROM [site05].[ColorsOfItems] WHERE ItemID=@ItemID
	DELETE FROM [site05].[SeasonsOfItems] WHERE ItemID=@ItemID
END

GO

CREATE PROC RemoveColorsFromItem
@ItemID int
AS
BEGIN
	DELETE FROM [site05].[ColorsOfItems] WHERE ItemID=@ItemID
END

GO

CREATE PROC RemoveSeasonsFromItem
@ItemID int
AS
BEGIN
	DELETE FROM [site05].[SeasonsOfItems] WHERE ItemID=@ItemID
END

GO

CREATE PROC UpdateUser
@UserID int,
@UserEmail varchar(100),
@UserPass varchar(30),
@UserFirstName nvarchar(15),
@UserLastName nvarchar(15)
AS
BEGIN
	IF NOT EXISTS (SELECT UserEmail FROM site05.Users WHERE UserEmail = @UserEmail)
	BEGIN
		UPDATE [site05].[Users] SET UserEmail = @UserEmail, UserPass = @UserPass, UserFirstName = @UserFirstName, UserLastName = @UserLastName WHERE UserID = @UserID
		SELECT		site05.Users.UserID, site05.Users.UserEmail, site05.Users.UserPass, site05.Users.UserFirstName, site05.Users.UserLastName, site05.Genders.GenderID, site05.Genders.GenderName
		FROM        site05.Users INNER JOIN
					site05.Genders ON site05.Users.GenderID = site05.Genders.GenderID
		WHERE       site05.Users.UserEmail = @UserEmail
	END
	ELSE
	BEGIN
		IF ((SELECT UserEmail FROM site05.Users WHERE UserID = @UserID) = @UserEmail)
			BEGIN
				UPDATE [site05].[Users] SET UserEmail = @UserEmail, UserPass = @UserPass, UserFirstName = @UserFirstName, UserLastName = @UserLastName WHERE UserID = @UserID
				SELECT		site05.Users.UserID, site05.Users.UserEmail, site05.Users.UserPass, site05.Users.UserFirstName, site05.Users.UserLastName, site05.Genders.GenderID, site05.Genders.GenderName
				FROM        site05.Users INNER JOIN
							site05.Genders ON site05.Users.GenderID = site05.Genders.GenderID
				WHERE       site05.Users.UserEmail = @UserEmail
		END
	END
END

GO

INSERT [site05].[Genders] (GenderName) Values ('זכר')
INSERT [site05].[Genders] (GenderName) Values ('נקבה')

INSERT [site05].[Users] (UserEmail, UserPass, UserFirstName, UserLastName, GenderID) VALUES ('orjerby@gmail.com','or2402','Or','Jerby',1)

insert [site05].[Categories] (CategoryName) values ('פלג גוף עליון')
INSERT [site05].[CategoriesByGender] (CategoryID, GenderID) Values (1,2)

insert [site05].[Subcategories] (SubcategoryName) values ('גופיות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,1)
insert [site05].[Subcategories] (SubcategoryName) values ('טישרטים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,2)
insert [site05].[Subcategories] (SubcategoryName) values ('חולצות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,3)
insert [site05].[Subcategories] (SubcategoryName) values ('חולצות מכופתרות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,4)
insert [site05].[Subcategories] (SubcategoryName) values ('סוודרים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,5)
insert [site05].[Subcategories] (SubcategoryName) values ('סריגים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,6)
insert [site05].[Subcategories] (SubcategoryName) values ('פוטרים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,7)
insert [site05].[Subcategories] (SubcategoryName) values ('בגדי גוף')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,8)
insert [site05].[Subcategories] (SubcategoryName) values ('אוברולים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,9)
insert [site05].[Subcategories] (SubcategoryName) values ('ג"קטים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,10)
insert [site05].[Subcategories] (SubcategoryName) values ('עליוניות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,11)
insert [site05].[Subcategories] (SubcategoryName) values ('קרדיגנים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,12)
insert [site05].[Subcategories] (SubcategoryName) values ('סווצ"רטים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,13)
insert [site05].[Subcategories] (SubcategoryName) values ('מעילים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,14)
insert [site05].[Subcategories] (SubcategoryName) values ('שמלות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,15)
insert [site05].[Subcategories] (SubcategoryName) values ('בגדי ים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (1,16)

insert [site05].[Categories] (CategoryName) values ('פלג גוף תחתון')
INSERT [site05].[CategoriesByGender] (CategoryID, GenderID) Values (2,2)

insert [site05].[Subcategories] (SubcategoryName) values ('אוברולים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (2,17)
insert [site05].[Subcategories] (SubcategoryName) values ('טייצים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (2,18)
insert [site05].[Subcategories] (SubcategoryName) values ('מכנסיים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (2,19)
insert [site05].[Subcategories] (SubcategoryName) values ('ג"ינסים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (2,20)
insert [site05].[Subcategories] (SubcategoryName) values ('שורטים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (2,21)
insert [site05].[Subcategories] (SubcategoryName) values ('חצאיות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (2,22)
insert [site05].[Subcategories] (SubcategoryName) values ('בגדי ים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (2,23)

insert [site05].[Categories] (CategoryName) values ('הלבשה תחתונה')
INSERT [site05].[CategoriesByGender] (CategoryID, GenderID) Values (3,2)

insert [site05].[Subcategories] (SubcategoryName) values ('תחתונים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (3,24)
insert [site05].[Subcategories] (SubcategoryName) values ('חזיות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (3,25)
insert [site05].[Subcategories] (SubcategoryName) values ('גרביים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (3,26)

insert [site05].[Categories] (CategoryName) values ('אביזרים')
INSERT [site05].[CategoriesByGender] (CategoryID, GenderID) Values (4,2)

insert [site05].[Subcategories] (SubcategoryName) values ('תיקים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (4,27)
insert [site05].[Subcategories] (SubcategoryName) values ('ארנקים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (4,28)
insert [site05].[Subcategories] (SubcategoryName) values ('כובעים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (4,29)
insert [site05].[Subcategories] (SubcategoryName) values ('צעיפים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (4,30)
insert [site05].[Subcategories] (SubcategoryName) values ('כפפות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (4,31)
insert [site05].[Subcategories] (SubcategoryName) values ('גרביונים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (4,32)
insert [site05].[Subcategories] (SubcategoryName) values ('חגורות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (4,33)
insert [site05].[Subcategories] (SubcategoryName) values ('משקפי שמש')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (4,34)
insert [site05].[Subcategories] (SubcategoryName) values ('שעונים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (4,35)

insert [site05].[Categories] (CategoryName) values ('נעליים')
INSERT [site05].[CategoriesByGender] (CategoryID, GenderID) Values (5,2)

insert [site05].[Subcategories] (SubcategoryName) values ('נעליים שטוחות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (5,36)
insert [site05].[Subcategories] (SubcategoryName) values ('נעלי עקב')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (5,37)
insert [site05].[Subcategories] (SubcategoryName) values ('כפכפים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (5,38)
insert [site05].[Subcategories] (SubcategoryName) values ('סנדלים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (5,39)
insert [site05].[Subcategories] (SubcategoryName) values ('נעלי ספורט')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (5,40)
insert [site05].[Subcategories] (SubcategoryName) values ('מגפיים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (5,41)

insert [site05].[Categories] (CategoryName) values ('תכשיטים')
INSERT [site05].[CategoriesByGender] (CategoryID, GenderID) Values (6,2)

insert [site05].[Subcategories] (SubcategoryName) values ('צמידים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (6,42)
insert [site05].[Subcategories] (SubcategoryName) values ('עגילים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (6,43)
insert [site05].[Subcategories] (SubcategoryName) values ('שרשראות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (6,44)
insert [site05].[Subcategories] (SubcategoryName) values ('טבעות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (6,45)

insert [site05].[Categories] (CategoryName) values ('פלג גוף עליון')
INSERT [site05].[CategoriesByGender] (CategoryID, GenderID) Values (7,1)

insert [site05].[Subcategories] (SubcategoryName) values ('גופיות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (7,46)
insert [site05].[Subcategories] (SubcategoryName) values ('טישרטים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (7,47)
insert [site05].[Subcategories] (SubcategoryName) values ('חולצות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (7,48)
insert [site05].[Subcategories] (SubcategoryName) values ('חולצות מכופתרות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (7,49)
insert [site05].[Subcategories] (SubcategoryName) values ('חולצות פולו')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (7,50)
insert [site05].[Subcategories] (SubcategoryName) values ('פוטרים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (7,51)
insert [site05].[Subcategories] (SubcategoryName) values ('סריגים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (7,52)
insert [site05].[Subcategories] (SubcategoryName) values ('ג"קטים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (7,53)
insert [site05].[Subcategories] (SubcategoryName) values ('סווצ"רטים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (7,54)
insert [site05].[Subcategories] (SubcategoryName) values ('מעילים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (7,55)

insert [site05].[Categories] (CategoryName) values ('פלג גוף תחתון')
INSERT [site05].[CategoriesByGender] (CategoryID, GenderID) Values (8,1)

insert [site05].[Subcategories] (SubcategoryName) values ('מכנסי ריצה')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (8,56)
insert [site05].[Subcategories] (SubcategoryName) values ('מכנסיים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (8,57)
insert [site05].[Subcategories] (SubcategoryName) values ('ג"ינסים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (8,58)
insert [site05].[Subcategories] (SubcategoryName) values ('מכנסיים קצרים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (8,59)
insert [site05].[Subcategories] (SubcategoryName) values ('בגדי ים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (8,60)

insert [site05].[Categories] (CategoryName) values ('הלבשה תחתונה')
INSERT [site05].[CategoriesByGender] (CategoryID, GenderID) Values (9,1)

insert [site05].[Subcategories] (SubcategoryName) values ('תחתונים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (9,61)
insert [site05].[Subcategories] (SubcategoryName) values ('גרביים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (9,62)

insert [site05].[Categories] (CategoryName) values ('אביזרים')
INSERT [site05].[CategoriesByGender] (CategoryID, GenderID) Values (10,1)

insert [site05].[Subcategories] (SubcategoryName) values ('תיקים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (10,63)
insert [site05].[Subcategories] (SubcategoryName) values ('ארנקים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (10,64)
insert [site05].[Subcategories] (SubcategoryName) values ('כובעים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (10,65)
insert [site05].[Subcategories] (SubcategoryName) values ('צעיפים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (10,66)
insert [site05].[Subcategories] (SubcategoryName) values ('כפפות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (10,67)
insert [site05].[Subcategories] (SubcategoryName) values ('חגורות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (10,68)
insert [site05].[Subcategories] (SubcategoryName) values ('עניבות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (10,69)
insert [site05].[Subcategories] (SubcategoryName) values ('משקפי שמש')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (10,70)
insert [site05].[Subcategories] (SubcategoryName) values ('שעונים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (10,71)

insert [site05].[Categories] (CategoryName) values ('נעליים')
INSERT [site05].[CategoriesByGender] (CategoryID, GenderID) Values (11,1)

insert [site05].[Subcategories] (SubcategoryName) values ('נעלי יום יום')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (11,72)
insert [site05].[Subcategories] (SubcategoryName) values ('נעלי ערב')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (11,73)
insert [site05].[Subcategories] (SubcategoryName) values ('כפכפים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (11,74)
insert [site05].[Subcategories] (SubcategoryName) values ('סנדלים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (11,75)
insert [site05].[Subcategories] (SubcategoryName) values ('נעלי ספורט')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (11,76)
insert [site05].[Subcategories] (SubcategoryName) values ('מגפיים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (11,77)

insert [site05].[Categories] (CategoryName) values ('תכשיטים')
INSERT [site05].[CategoriesByGender] (CategoryID, GenderID) Values (12,1)

insert [site05].[Subcategories] (SubcategoryName) values ('צמידים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (12,78)
insert [site05].[Subcategories] (SubcategoryName) values ('עגילים')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (12,79)
insert [site05].[Subcategories] (SubcategoryName) values ('שרשראות')
insert [site05].[SubcategoriesOfCategories] (CategoryID, SubcategoryID) values (12,80)
insert [site05].[Subcategories] (SubcategoryName) values ('טבעות')

INSERT [site05].[Colors] (ColorName) Values ('אדום')
INSERT [site05].[Colors] (ColorName) Values ('אפור')
INSERT [site05].[Colors] (ColorName) Values ('ורוד')
INSERT [site05].[Colors] (ColorName) Values ('שחור')
INSERT [site05].[Colors] (ColorName) Values ('חום')
INSERT [site05].[Colors] (ColorName) Values ('צהוב')
INSERT [site05].[Colors] (ColorName) Values ('ירוק')
INSERT [site05].[Colors] (ColorName) Values ('כחול')
INSERT [site05].[Colors] (ColorName) Values ('לבן')
INSERT [site05].[Colors] (ColorName) Values ('כתום')
INSERT [site05].[Colors] (ColorName) Values ('תכלת')
INSERT [site05].[Colors] (ColorName) Values ('נחושת')
INSERT [site05].[Colors] (ColorName) Values ('סגול')
INSERT [site05].[Colors] (ColorName) Values ('צבעוני')
INSERT [site05].[Colors] (ColorName) Values ('טורקיז')
INSERT [site05].[Colors] (ColorName) Values ('זהב')
INSERT [site05].[Colors] (ColorName) Values ('כסף')

INSERT [site05].[Seasons] (SeasonName) Values ('סתיו')
INSERT [site05].[Seasons] (SeasonName) Values ('חורף')
INSERT [site05].[Seasons] (SeasonName) Values ('אביב')
INSERT [site05].[Seasons] (SeasonName) Values ('קיץ')

INSERT [site05].[Rates] (RateName) Values ('5 כוכבים')
INSERT [site05].[Rates] (RateName) Values ('4 כוכבים')
INSERT [site05].[Rates] (RateName) Values ('3 כוכבים')
INSERT [site05].[Rates] (RateName) Values ('2 כוכבים')
INSERT [site05].[Rates] (RateName) Values ('1 כוכב')
