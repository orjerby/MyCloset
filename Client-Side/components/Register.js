import React from 'react';
import { ThemeProvider, Button as SmallButton } from 'react-native-material-ui';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import { getUser, getInfo, getItems } from '../actions/index';
import { fetchData, WebServiceURL } from "../actions";
import t from 'tcomb-form-native';

var validator = require("email-validator");

const Form = t.form.Form;

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDisabled: false,
            emailInput: Email,
            passInput: Password,
            passAgainInput: PasswordAgain,
            firstNameInput: FirstName,
            lastNameInput: LastName,
            gendersPicker: t.enums({}),
            formValue: {
                UserEmail: null,
                UserPass: null,
                UserPassAgain: null,
                UserFirstName: null,
                UserLastName: null,
                GenderID: null,
            }
        };
    }

    componentDidMount() {
        gendersOptions = {};
        this.props.genders.forEach((Gender) => {
            gendersOptions[Gender.GenderID] = Gender.GenderName;
        });
        this.setState({
            gendersPicker: t.enums(gendersOptions)
        });
    }

    getForm() {
        return (t.struct({
            UserEmail: this.state.emailInput,
            UserPass: this.state.passInput,
            UserPassAgain: this.state.passAgainInput,
            UserFirstName: this.state.firstNameInput,
            UserLastName: this.state.lastNameInput,
            GenderID: this.state.gendersPicker
        }));
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
                },
                UserPassAgain: {
                    label: 'אימות סיסמה',
                    secureTextEntry: true
                },
                UserFirstName: {
                    label: 'שם פרטי'
                },
                UserLastName: {
                    label: 'שם משפחה'
                },
                GenderID: {
                    label: 'מין'
                }
            },
            stylesheet: formStyles
        };
    }

    register = () => {

        const value = this._form.getValue();

        if (value !== null) {

            const { UserEmail, UserPass, UserPassAgain, UserFirstName, UserLastName, GenderID } = value;

            if (UserPass !== UserPassAgain) {
                alert('סיסמאות לא תואמות!');
            }

            else {
                this.setState({ isDisabled: true });
                const paramsObj =
                    {
                        UserEmail,
                        UserPass,
                        UserFirstName,
                        UserLastName,
                        GenderID
                    }

                fetchData(`${WebServiceURL}RegisterUser`, paramsObj)
                    .then((info) => {
                        const data = JSON.parse(info);
                        if (data !== null) {
                            const { categories, colors, seasons, rates } = data;
                            this.props.getUser(data.user);
                            this.props.getItems([]);
                            this.props.getInfo({ categories, colors, seasons, rates });
                            this.setState({ isDisabled: false });
                            this.props.navigation.navigate('Home');
                        } else {
                            this.setState({ isDisabled: false });
                            alert('אימייל שגוי');
                        }
                    })
                    .catch(() => {
                        this.setState({ isDisabled: false });
                        alert('בעיה לא ידועה');
                    });
            }
        }
    }

    render() {
        return (
            <ThemeProvider>
                <View style={styles.container}>
                    <Form
                        ref={c => this._form = c}
                        type={this.getForm()}
                        options={this.getFormOptions()}
                        value={this.state.formValue} />
                    <Button
                        title="הירשם"
                        onPress={this.register}
                        disabled={this.state.isDisabled}
                    />

                    <SmallButton primary text="כבר יש לך משתמש? לחץ כאן כדי להתחבר" onPress={() => this.props.navigation.navigate('Login')} />
                </View>
            </ThemeProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#ffffff'
    }
});

const formStyles = {
    ...Form.stylesheet,
    controlLabel: {
        normal: {
            fontSize: 10,
            marginBottom: 7,
            fontWeight: '600'
        },
        error: {
            color: 'red',
            fontSize: 10,
            marginBottom: 7,
            fontWeight: '600'
        }
    }
};

const Email = t.refinement(t.String, function (value) { return validator.validate(value); });
const Password = t.refinement(t.String, function (value) { return (value.length >= 3 && value.length <= 10); });
const PasswordAgain = t.refinement(t.String, function (value) { return (value.length >= 3 && value.length <= 10); });
const FirstName = t.refinement(t.String, function (value) { return value.length >= 2; });
const LastName = t.refinement(t.String, function (value) { return value.length >= 2; });

Email.getValidationErrorMessage = function (value, path, context) {
    return <Text style={{ fontSize: 10 }}>אימייל לא תקין</Text>;
};
Password.getValidationErrorMessage = function (value, path, context) {
    return <Text style={{ fontSize: 10 }}>3-10 תווים</Text>;
};
PasswordAgain.getValidationErrorMessage = function (value, path, context) {
    return <Text style={{ fontSize: 10 }}>3-10 תווים</Text>;
};
FirstName.getValidationErrorMessage = function (value, path, context) {
    return <Text style={{ fontSize: 10 }}>מעל 2 תווים</Text>;
};
LastName.getValidationErrorMessage = function (value, path, context) {
    return <Text style={{ fontSize: 10 }}>מעל 2 תווים</Text>;
};

function mapStateToProps({ genders }) {
    return {
        genders
    };
}

export default connect(mapStateToProps, { getUser, getInfo, getItems })(Register);