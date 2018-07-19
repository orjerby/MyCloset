import { GET_GENDERS } from '../actions';

export default function (state = [], action) {
    switch (action.type) {
        case GET_GENDERS:
            return action.payload;
    }
    return state;
}