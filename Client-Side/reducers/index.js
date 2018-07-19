import { combineReducers } from "redux";
import userReducer from './userReducer';
import infoReducer from './infoReducer';
import itemReducer from './itemReducer';
import gendersReducer from './gendersReducer';
import itemsReducer from './ItemsReducer';
import filterReducer from './filterReducer';

const rootReducer = combineReducers({
    user: userReducer,
    info: infoReducer,
    item: itemReducer,
    genders: gendersReducer,
    items: itemsReducer,
    filters: filterReducer
});

export default rootReducer;