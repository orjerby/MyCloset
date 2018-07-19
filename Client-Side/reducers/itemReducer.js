import { GET_ITEM } from '../actions';

export default function (state = {}, action) {
    switch (action.type) {
        case GET_ITEM:
            return action.payload;
    }
    return state;
}