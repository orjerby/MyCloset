import { GET_FILTERS } from '../actions';

export default function (state = {}, action) {
    switch (action.type) {
        case GET_FILTERS:
            return action.payload;
    }
    return state;
}