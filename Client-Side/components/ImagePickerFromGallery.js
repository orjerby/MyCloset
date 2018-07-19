import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ImagePicker, ImageManipulator } from 'expo';
import FontAwesome, { Icons } from 'react-native-fontawesome';

export default class ImagePickerFromGallery extends React.Component {
    state = {
        image: null
    };

    render() {
        return (
            <View>
                <TouchableOpacity onPress={this._pickImage} disabled={this.props.isDisabled}>
                    <FontAwesome style={{ fontSize: 50 }}>{Icons.image}</FontAwesome>
                </TouchableOpacity>
            </View>
        );
    }

    _pickImage = async () => {
        let picture = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });

        this.setState({ isDisabled: true });
        if (!picture.cancelled) {
            this.setState({ image: picture.uri });
            picture = await ImageManipulator.manipulate(picture.uri, [{ resize: { width: 500, height: 500 }, compress: 0.5 }], { format: 'jpeg', base64: true });
            this.props.Snap(picture);
        }
    };
}