export default (items, filters) => {
    const {selectedCategories = [], selectedRates = [], selectedColors = [], selectedSeasons = []} = filters;

    let filteredItems = items.filter((item) => {
        let subcategoryMatch = true;
        if (selectedCategories.length !== 0) {
            subcategoryMatch = selectedCategories[0] === item.Category.Subcategory.SubcategoryID;
        }
        let rateMatch = true;
        if (selectedRates.length !== 0) {
            rateMatch = selectedRates[0] === item.Rate.RateID;
        }

        let colorsFound = 0;
        for (let i = 0; i < selectedColors.length; i++) {
            for (let j = 0; j < item.ColorsOfItem.length; j++) {
                if (selectedColors[i] === item.ColorsOfItem[j].Color.ColorID) {
                    colorsFound++;
                }
            }
        }
        let seasonsFound = 0;
        for (let i = 0; i < selectedSeasons.length; i++) {
            for (let j = 0; j < item.SeasonsOfItem.length; j++) {
                if (selectedSeasons[i] === item.SeasonsOfItem[j].Season.SeasonID) {
                    seasonsFound++;
                }
            }
        }

        const colorMatch = colorsFound === selectedColors.length;
        const seasonMatch = seasonsFound === selectedSeasons.length;

        return subcategoryMatch && rateMatch && colorMatch && seasonMatch;
    });

    return filteredItems;

};