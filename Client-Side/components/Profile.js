import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { connect } from 'react-redux';
import { getUser } from '../actions/index';
import { fetchData, WebServiceURL } from "../actions";
import t from 'tcomb-form-native';
import Button from 'apsl-react-native-button';

const Form = t.form.Form;

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDisabled: false,
            emailInput: Email,
            passInput: Password,
            passAgainInput: PasswordAgain,
            firstNameInput: FirstName,
            lastNameInput: LastName,
            formValue: {
                UserEmail: null,
                UserPass: null,
                UserPassAgain: null,
                UserFirstName: null,
                UserLastName: null
            }
        };
    }

    componentDidMount() {
        const { UserEmail, UserPass, UserFirstName, UserLastName } = this.props.user

        this.setState({
            formValue: {
                UserEmail,
                UserPass,
                UserPassAgain: UserPass,
                UserFirstName,
                UserLastName
            }
        });
    }

    getForm() {
        return (t.struct({
            UserEmail: this.state.emailInput,
            UserPass: this.state.passInput,
            UserPassAgain: this.state.passAgainInput,
            UserFirstName: this.state.firstNameInput,
            UserLastName: this.state.lastNameInput
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
                }
            },
            stylesheet: formStyles
        };
    }

    update = () => {
        const { UserID, Gender } = this.props.user;
        const value = this._form.getValue();

        if (value !== null) {

            const { UserEmail, UserPass, UserPassAgain, UserFirstName, UserLastName } = value;

            if (UserPass !== UserPassAgain) {
                alert('סיסמאות לא תואמות!');
            }
            else {
                this.setState({ isDisabled: true });
                const paramsObj =
                    {
                        UserID,
                        UserEmail,
                        UserPass,
                        UserFirstName,
                        UserLastName,
                        GenderID: Gender.GenderID
                    }

                fetchData(`${WebServiceURL}UpdateUser`, paramsObj)
                    .then((info) => {
                        const user = JSON.parse(info);
                        if (user !== null) {
                            this.props.getUser(user);
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
            <View style={styles.container}>
                <Form
                    ref={c => this._form = c}
                    type={this.getForm()}
                    options={this.getFormOptions()}
                    value={this.state.formValue} />

                <Button style={{ backgroundColor: '#DCDCDC' }} textStyle={{ fontSize: 18 }} onPress={this.update} isLoading={this.state.isDisabled}>
                    עדכן
</Button>
                <Button style={{ backgroundColor: '#DCDCDC' }} textStyle={{ fontSize: 18 }} onPress={() => this.props.navigation.navigate('Login')}>
                    התנתק
</Button>
            </View>
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

const Email = t.refinement(t.String, function (value) { return value.length >= 3; });
const Password = t.refinement(t.String, function (value) { return (value.length >= 3 && value.length <= 10); });
const PasswordAgain = t.refinement(t.String, function (value) { return (value.length >= 3 && value.length <= 10); });
const FirstName = t.refinement(t.String, function (value) { return value.length >= 2; });
const LastName = t.refinement(t.String, function (value) { return value.length >= 2; });

Email.getValidationErrorMessage = function (value, path, context) {
    return <Text style={{ fontSize: 10 }}>מעל 3 תווים</Text>;
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

function mapStateToProps({ user }) {
    return {
        user
    };
}

export default connect(mapStateToProps, { getUser })(Profile);