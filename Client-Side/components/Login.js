import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { ThemeProvider, Button as SmallButton } from 'react-native-material-ui';
import { connect } from 'react-redux';
import { getUser, getInfo, getItems, getGenders } from '../actions/index';
import { WebServiceURL, fetchData } from "../actions";
import Button from 'apsl-react-native-button';
import t from 'tcomb-form-native';

const Form = t.form.Form;

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDisabled: false,
            emailInput: t.String,
            passInput: t.String,
            formValue: {
                UserEmail: null,
                UserPass: null
            }
        };
    }

    login = () => {
        const value = this._form.getValue();
        if (value !== null) {

            const { UserEmail, UserPass } = value;

            this.setState({ isDisabled: true });
            const paramsObj =
            {
                UserEmail,
                UserPass
            };

            fetchData(`${WebServiceURL}LoginUser`, paramsObj)
                .then((userAndInfo) => {
                    const info = JSON.parse(userAndInfo);
                    if (info === null) {
                        this.setState({ isDisabled: false });
                        alert('פרטים שגויים');
                    }
                    else {
                        const { categories, colors, seasons, rates } = info;
                        this.props.getUser(info.user);
                        this.props.getItems(info.items);
                        this.props.getInfo({ categories, colors, seasons, rates });
                        this.setState({ isDisabled: false });
                        this.props.navigation.navigate('next');
                    }
                })
                .catch((e) => {
                    this.setState({ isDisabled: false });
                    alert('בעיה לא ידועה');
                });
        }
    }

    getFormOptions() {
        return {
            fields: {
                UserEmail: {
                    label: 'אימייל'
                },
                UserPass: {
                    label: 'סיסמה',
                    secureTextEntry: true
                }
            },
            stylesheet: formStyles
        };
    }

    getForm() {
        return (t.struct({
            UserEmail: this.state.emailInput,
            UserPass: this.state.passInput
        }));
    }

    toRegister = () => {
        fetchData(`${WebServiceURL}GetGenders`)
            .then((genders) => {
                const info = JSON.parse(genders);
                this.props.getGenders(info);
                this.props.navigation.navigate('Register');
            }).catch(() => {
                alert('בעיה לא ידועה');
            });
    }

    render() {
        return (

            <ThemeProvider>
                <Image
                    style={{ width: '100%', height: '100%', flex: 0.5 }}
                    source={{ uri: encodeURI("http://185.60.170.14/plesk-site-preview/ruppinmobile.ac.il/site05/images/clothesPic.jpg") }}/>
                    <Text></Text>
                    <View style={styles.container}>
                        <Form
                            ref={c => this._form = c}
                            type={this.getForm()}
                            options={this.getFormOptions()} />
                        <Button style={{ backgroundColor: '#DCDCDC' }} textStyle={{ fontSize: 18 }} onPress={this.login} isLoading={this.state.isDisabled}>
                            התחבר
</Button>

                        <SmallButton primary text="לא רשום? לחץ כאן כדי להירשם" onPress={this.toRegister} />
                    </View>
            </ThemeProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff'
    },
});

const formStyles = {
    ...Form.stylesheet,
    controlLabel: {
        normal: {
            fontSize: 15,
            marginBottom: 7,
            fontWeight: '600'
        },
        error: {
            color: 'red',
            fontSize: 15,
            marginBottom: 7,
            fontWeight: '600'
        }
    }
};

export default connect(null, { getUser, getInfo, getItems, getGenders })(Login);