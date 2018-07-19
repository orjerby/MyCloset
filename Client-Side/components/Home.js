import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { getGenders, getItem } from '../actions/index';
import { fetchData, WebServiceURL } from "../actions";
import Swiper from 'react-native-swiper';

class Home extends React.Component {

    toItem = (item) => {
        const { categories, colors, seasons, rates } = this.props.info;

        new Promise((finish) => {
            finish(this.props.getItem(item));
        })
            .then(() => {
                this.props.navigation.navigate('ItemCard', { categories, colors, seasons, rates, previousRoute: this.props.navigation.state.routeName });
            });
    }

    renderLastItems = () => {
        const { items } = this.props;
        const { categories, colors, seasons, rates } = this.props.info;

        if (items.length === 0) {
            return <View style={styles.slide}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('AddItem', { categories, colors, seasons, rates, previousRoute: this.props.navigation.state.routeName })}>
                    <View style={{borderWidth: 1, borderColor: 'grey', backgroundColor: 'gainsboro', borderRadius: 8}}><Text style={styles.text}>אין לך בגדים בארון</Text><Text style={styles.text}>לחץ כאן כדי להוסיף בגד</Text></View></TouchableOpacity></View>
        }

        return items.map((Item, index) => {
            //if (index < 5) {
                if (Item.ItemImg === "") {
                    return <View key={index} style={styles.slide}>
                        <TouchableOpacity onPress={() => this.toItem(Item)}>
                            <Image
                                style={{
                                    width: 300,
                                    height: 300
                                }}
                                source={{ uri: encodeURI("http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site05/images/defaultPic.jpg") }} />
                        </TouchableOpacity></View>
                } else {
                    return <View key={index} style={styles.slide}>
                        <TouchableOpacity onPress={() => this.toItem(Item)}>
                            <Image
                                style={{
                                    width: 300,
                                    height: 300
                                }}
                                source={{ uri: encodeURI(Item.ItemImg) }} />
                        </TouchableOpacity></View>
                }
            //}
        });
    }

    toProfile = () => {
        fetchData(`${WebServiceURL}GetGenders`)
            .then((genders) => {
                const info = JSON.parse(genders);
                this.props.getGenders(info);
                this.props.navigation.navigate('Profile');
            }).catch(() => {
                alert('בעיה לא ידועה');
            });
    }

    render() {
        return (
            <ImageBackground
                style={{ width: '100%', height: '100%', flex: 1 }}
                source={{ uri: encodeURI("http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site05/images/closetPic1.jpeg") }}>
                <Swiper style={styles.wrapper} showsButtons={true} autoplay={true} autoplayTimeout={3.5}>
                    {this.renderLastItems()}
                </Swiper>
            </ImageBackground>
        );
    }
}

function mapStateToProps({ info, user, items }) {
    return {
        info,
        user,
        items
    };
}

export default connect(mapStateToProps, { getGenders, getItem })(Home);

const styles = StyleSheet.create({
    wrapper: {
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    text: {
        color: 'brown',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4A460'
    }
})