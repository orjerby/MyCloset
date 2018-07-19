import React from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { deleteItem, editItem } from '../actions/index';

class ItemCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { item } = this.props;
        const { categories, colors, seasons, rates } = this.props.navigation.state.params;
    }

    renderCategory = () => {
        const { item } = this.props;

        return <Text style={{ fontSize: 15 }}><Text style={{ fontWeight: 'bold' }}>קטגוריה:</Text> {item.Category.Subcategory.SubcategoryName}</Text>
    }

    renderColors = () => {
        const { item } = this.props;

        let colorsString = '';
        for (let i = 0; i < item.ColorsOfItem.length; i++) {
            colorsString += item.ColorsOfItem[i].Color.ColorName;
            if (i + 1 === item.ColorsOfItem.length - 1) {
                colorsString += ' ו';
            } else if (i !== item.ColorsOfItem.length - 1) {
                colorsString += ', ';
            }
        }

        return <Text style={{ fontSize: 15 }}><Text style={{ fontWeight: 'bold' }}>צבעים:</Text> {colorsString}</Text>
    }

    renderSeasons = () => {
        const { item } = this.props;

        let seasonsString = '';
        for (let i = 0; i < item.SeasonsOfItem.length; i++) {
            seasonsString += item.SeasonsOfItem[i].Season.SeasonName;
            if (i + 1 === item.SeasonsOfItem.length - 1) {
                seasonsString += ' ו';
            } else if (i !== item.SeasonsOfItem.length - 1) {
                seasonsString += ', ';
            }
        }

        return <Text style={{ fontSize: 15 }}><Text style={{ fontWeight: 'bold' }}>עונות:</Text> {seasonsString}</Text>
    }

    renderRate = () => {
        const { item } = this.props;

        return <Text style={{ fontSize: 15 }}><Text style={{ fontWeight: 'bold' }}>דירוג:</Text> {item.Rate.RateName}</Text>
    }

    renderCompany = () => {
        const { item } = this.props;

        return <Text style={{ fontSize: 15 }}><Text style={{ fontWeight: 'bold' }}>חברה:</Text> {item.ItemCompany}</Text>
    }

    renderMeasure = () => {
        const { item } = this.props;

        return <Text style={{ fontSize: 15 }}><Text style={{ fontWeight: 'bold' }}>מידה:</Text> {item.ItemMeasure}</Text>
    }

    renderComment = () => {
        const { item } = this.props;

        return <Text style={{ fontSize: 15 }}><Text style={{ fontWeight: 'bold' }}>תיאור:</Text> {item.ItemComment}</Text>
    }

    toItemEdit = () => {
        const { categories, colors, seasons, rates } = this.props.info;

        this.props.navigation.navigate('ItemEdit', { categories, colors, seasons, rates, previousRoute: this.props.navigation.state.routeName });
    }

    render() {
        const { item } = this.props;
        return (
            <ImageBackground
                style={{ width: '100%', height: '100%', flex: 1 }}
                source={{ uri: encodeURI("http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site05/images/wallPic.jpg") }}>
                <View style={styles.card}>
                    <Image
                        style={{ width: '100%', paddingTop: '100%' }}
                        source={{ uri: item.ItemImg ? item.ItemImg : encodeURI("http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site05/images/defaultPic.jpg") }} />
                    <View style={{ margin: 10 }}>
                        {this.renderCategory()}
                        {this.renderColors()}
                        {this.renderSeasons()}
                        {this.renderRate()}
                        {this.renderCompany()}
                        {this.renderMeasure()}
                        {this.renderComment()}
                    </View>
                    <View style={{ position: 'absolute', bottom: 0 }}>
                        <Button
                            onPress={this.toItemEdit}
                            title='ערוך בגד'
                            color="#841584"
                        />
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

function mapStateToProps({ item, user, info }) {
    return {
        item,
        user,
        info
    };
}

export default connect(mapStateToProps, { deleteItem, editItem })(ItemCard);

const styles = StyleSheet.create({
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