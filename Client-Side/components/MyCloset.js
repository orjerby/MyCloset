import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, BackHandler, ImageBackground } from 'react-native';
import { ThemeProvider } from 'react-native-material-ui';
import { connect } from 'react-redux';
import { getItem, getFilters } from '../actions/index';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import selectItems from '../selectors/items';
import Collapsible from 'react-native-collapsible';
import Button from 'apsl-react-native-button';

import FontAwesome, { Icons } from 'react-native-fontawesome';

class MyCloset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedColors: [],
            selectedSeasons: [],
            selectedRates: [],
            selectedCategories: [],
            colorsItems: [],
            seasonsItems: [],
            ratesItems: [],
            categoriesItems: [],
            filteredItems: [],
            collapsed: true
        }

        this.backClickCount = 0;
    }

    toItem = (item) => {
        const { categories, colors, seasons, rates } = this.props.info;

        this.resetFilters();

        new Promise((finish) => {
            finish(this.props.getItem(item));
        })
            .then(() => {
                this.props.navigation.navigate('ItemCard', { categories, colors, seasons, rates, previousRoute: this.props.navigation.state.routeName });
            });
    }

    handleBackButtonClick = () => {
        if (this.props.navigation.state.params) {
            if (this.props.navigation.state.params.previousRoute === 'ItemEdit' || this.props.navigation.state.params.previousRoute === 'AddItem') {
                this.backClickCount++;
                this.props.navigation.navigate('Home');
                if (this.backClickCount === 1) {
                    return true;
                }
                return false;
            }
        }
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress');
    }

    componentDidMount = () => {
        const { categories, colors, seasons, rates } = this.props.info;


        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        this.resetFilters();

        let newColors = [];
        let newSeasons = [];
        let newRates = [];
        let newCategories = [];
        let dupArray = [];

        newColors = colors.map(Color => {
            return { name: Color.ColorName, id: Color.ColorID };
        });

        newSeasons = seasons.map(Season => {
            return { name: Season.SeasonName, id: Season.SeasonID };
        });

        newRates = rates.map(Rate => {
            return { name: Rate.RateName, id: Rate.RateID };
        });

        for (let i = 0, j = Number.MAX_SAFE_INTEGER; i < categories.length; i++ , j--) {
            let skip = false;
            let idIndex = categories[i].CategoryID;

            dupArray.forEach(dupArrayIndex => {
                if (dupArrayIndex === idIndex) {
                    skip = true;
                }
            });

            if (skip) {
                continue;
            }

            const currentCategory = categories.filter(x => x.CategoryID === idIndex)
            newCategories.push(
                {
                    name: currentCategory[0].CategoryName, id: j, children:
                        currentCategory.map(Category => {
                            return { name: Category.Subcategory.SubcategoryName, id: Category.Subcategory.SubcategoryID }
                        })
                }
            )

            dupArray.push(idIndex);
        }

        this.setState({
            colorsItems: newColors,
            seasonsItems: newSeasons,
            categoriesItems: newCategories,
            ratesItems: newRates
        });

    }

    onSelectedColorsChange = (selectedColors) => {
        const { selectedCategories, selectedRates, selectedSeasons } = this.state;
        this.setState({ selectedColors });
        this.props.getFilters({ selectedCategories, selectedColors, selectedRates, selectedSeasons });
    }

    onSelectedSeasonsChange = (selectedSeasons) => {
        const { selectedColors, selectedCategories, selectedRates } = this.state;
        this.setState({ selectedSeasons });
        this.props.getFilters({ selectedCategories, selectedColors, selectedRates, selectedSeasons });
    }

    onSelectedRatesChange = (selectedRates) => {
        const { selectedColors, selectedCategories, selectedSeasons } = this.state;
        if (this.state.selectedRates[0] === selectedRates[0]) {
            const rates = [];
            this.props.getFilters({ selectedCategories, selectedColors, rates, selectedSeasons });
            this.setState({ selectedRates: rates });
        } else {
            this.props.getFilters({ selectedCategories, selectedColors, selectedRates, selectedSeasons });
            this.setState({ selectedRates });
        }
    }

    onSelectedCategoriesChange = (selectedCategories) => {
        const { selectedColors, selectedRates, selectedSeasons } = this.state;
        if (this.state.selectedCategories[0] === selectedCategories[0]) {
            const categories = [];
            this.props.getFilters({ categories, selectedColors, selectedRates, selectedSeasons });
            this.setState({ selectedCategories: categories });
        } else {
            this.props.getFilters({ selectedCategories, selectedColors, selectedRates, selectedSeasons });
            this.setState({ selectedCategories });
        }
    }

    renderItems = () => {
        const { filteredItems } = this.props;
        if (filteredItems.length === 0) {
            return <View style={styles.card}>
                <Text style={{ fontSize: 18, textAlign: 'center' }}>אין בגדים להצגה</Text>
            </View>
        }
        else {
            return filteredItems.map((Item, index) => {
                if (Item.ItemImg === "") {
                    return <TouchableOpacity
                        key={index}
                        style={{ width: '50%' }}
                        onPress={() => this.toItem(Item)}>
                        <Image
                            style={{ width: '100%', paddingTop: '100%' }}
                            source={{ uri: encodeURI("http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site05/images/defaultPic.jpg") }} />
                    </TouchableOpacity>
                } else {
                    return <TouchableOpacity
                        key={index}
                        style={{ width: '50%' }}
                        onPress={() => this.toItem(Item)}>
                        <Image
                            style={{ width: '100%', paddingTop: '100%' }}
                            source={{ uri: encodeURI(Item.ItemImg) }} />
                    </TouchableOpacity>
                }
            });
        }
    }

    resetFilters = () => {
        this.setState({
            selectedColors: [],
            selectedSeasons: [],
            selectedRates: [],
            selectedCategories: []
        });
        this.props.getFilters({ selectedCategorie: [], selectedColors: [], selectedRates: [], selectedSeason: [] });
    }

    toAddItem = () => {
        const { categories, colors, seasons, rates } = this.props.info;
        this.resetFilters();
        this.props.navigation.navigate('AddItem', { categories, colors, seasons, rates, previousRoute: this.props.navigation.state.routeName });
    }

    _toggleExpanded = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    render() {
        return (
            <ImageBackground
                style={{ width: '100%', height: '100%', flex: 1 }}
                source={{ uri: encodeURI("http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site05/images/wallPic4.jpg") }}>
                <ThemeProvider>
                    <ScrollView>
                        <View style={{ marginTop: 20 }}>
                            <View style={styles.container}>
                                <TouchableOpacity onPress={this._toggleExpanded}>
                                    <View style={styles.header}>
                                        <Text style={styles.headerText}>
                                            <FontAwesome>{Icons.filter}</FontAwesome>
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <Collapsible collapsed={this.state.collapsed}>
                                    <View style={styles.content}>
                                        <SectionedMultiSelect
                                            items={this.state.categoriesItems}
                                            uniqueKey='id'
                                            subKey='children'
                                            selectText='בחר קטגוריה'
                                            showDropDowns={true}
                                            readOnlyHeadings={true}
                                            alwaysShowSelectText={true}
                                            onSelectedItemsChange={this.onSelectedCategoriesChange}
                                            selectedItems={this.state.selectedCategories}
                                            noResultsComponent={<Text>אין תוצאות</Text>}
                                            confirmText='אשר'
                                            searchPlaceholderText='חפש קטגוריה...'
                                            styles={{ selectToggle: styles.selectToggle, chipText: styles.chipText }}
                                        />

                                        {this.state.selectedCategories.length === 0 ? <Text>{'\n\n'}</Text> : <View></View>}

                                        <SectionedMultiSelect
                                            items={this.state.colorsItems}
                                            uniqueKey='id'
                                            subKey='children'
                                            selectText='בחר צבעים'
                                            alwaysShowSelectText={true}
                                            onSelectedItemsChange={this.onSelectedColorsChange}
                                            selectedItems={this.state.selectedColors}
                                            noResultsComponent={<Text>אין תוצאות</Text>}
                                            confirmText='אשר'
                                            searchPlaceholderText='חפש צבע...'
                                            styles={{ selectToggle: styles.selectToggle, chipText: styles.chipText }}
                                        />

                                        {this.state.selectedColors.length === 0 ? <Text>{'\n\n'}</Text> : <View></View>}

                                        <SectionedMultiSelect
                                            items={this.state.seasonsItems}
                                            uniqueKey='id'
                                            subKey='children'
                                            selectText='בחר עונות'
                                            alwaysShowSelectText={true}
                                            onSelectedItemsChange={this.onSelectedSeasonsChange}
                                            selectedItems={this.state.selectedSeasons}
                                            noResultsComponent={<Text>אין תוצאות</Text>}
                                            confirmText='אשר'
                                            searchPlaceholderText='חפש עונה...'
                                            styles={{ selectToggle: styles.selectToggle, chipText: styles.chipText }}
                                        />

                                        {this.state.selectedSeasons.length === 0 ? <Text>{'\n\n'}</Text> : <View></View>}

                                        <SectionedMultiSelect
                                            items={this.state.ratesItems}
                                            uniqueKey='id'
                                            subKey='children'
                                            selectText='בחר דירוג'
                                            alwaysShowSelectText={true}
                                            onSelectedItemsChange={this.onSelectedRatesChange}
                                            selectedItems={this.state.selectedRates}

                                            noResultsComponent={<Text>אין תוצאות</Text>}
                                            confirmText='אשר'
                                            searchPlaceholderText='חפש דירוג...'
                                            styles={{ selectToggle: styles.selectToggle, chipText: styles.chipText }}
                                        />

                                        {this.state.selectedRates.length === 0 ? <Text>{'\n\n'}</Text> : <View></View>}

                                    </View>
                                </Collapsible>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row-reverse', flexWrap: 'wrap' }}>
                            {this.renderItems()}
                        </View>

                    </ScrollView>
                    <Text></Text>
                    <Button style={{ backgroundColor: '#DCDCDC' }} textStyle={{ fontSize: 18 }} onPress={this.toAddItem}>
                        הוסף בגד
</Button>
                </ThemeProvider >
            </ImageBackground>
        );
    }
}

function mapStateToProps({ info, items, filters }) {
    return {
        info,
        items,
        filteredItems: selectItems(items, filters)
    };
}

export default connect(mapStateToProps, { getItem, getFilters })(MyCloset);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        padding: 5
    },
    headerText: {
        margin: 5,
        fontSize: 40,
        textAlign: 'left'
    },
    content: {
        padding: 5,
    },
    selectToggle: {
        backgroundColor: 'gainsboro', padding: 5
    },
    chipText: {
        color: 'black'
    },
    card: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: '#F4A460',
        margin: 25,
        marginTop: 25,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 8
    }
});

