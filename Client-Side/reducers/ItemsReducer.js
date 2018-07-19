import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, EDIT_ITEM } from '../actions';
import update from 'immutability-helper';

export default function (state = [], action) {
    switch (action.type) {
        case GET_ITEMS:
            return action.payload;
        case ADD_ITEM:
            if (action.payload === undefined) {
                alert('בעיה לא ידועה');
                return state;
            }
            let newItems = [action.payload, ...state];
            return update(state, { $set: newItems });
        case EDIT_ITEM:
            if (action.payload === undefined) {
                alert('בעיה לא ידועה');
                return state;
            }
            let indexToEdit = state.findIndex(Item => Item.ItemID === action.payload.ItemID);
            return update(state, { [indexToEdit]: { $set: action.payload } });
        case DELETE_ITEM:
            if (action.payload.data === undefined) {
                alert('בעיה לא ידועה');
                return state;
            }
            const indexToDelete = state.findIndex(Item => Item.ItemID === action.payload.paramsObj.ItemID);
            return update(state, { $splice: [[indexToDelete, 1]] });
    }
    return state;
}