import { GET_INFO } from '../actions';

export default function (state = {}, action) {
    switch (action.type) {
        case GET_INFO:
            return action.payload;
    }
    return state;
}