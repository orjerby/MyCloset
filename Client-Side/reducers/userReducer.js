import { GET_USER } from '../actions';

export default function (state = {}, action) {
    switch (action.type) {
        case GET_USER:
            return action.payload;
    }
    return state;
}