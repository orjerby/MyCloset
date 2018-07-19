export const GET_USER = 'get_user';
export const GET_ITEMS = 'get_items';
export const GET_INFO = 'get_info';
export const GET_GENDERS = 'get_genders';
export const GET_ITEM = 'get_item';
export const ADD_ITEM = 'add_item';
export const EDIT_ITEM = 'edit_item';
export const DELETE_ITEM = 'delete_item';
export const GET_FILTERS = 'get_filters';

export const WebServiceURL = "http://ruppinmobile.tempdomain.co.il/site05/Closet.asmx/";

export function getUser(user) {
    return {
        type: GET_USER,
        payload: user
    }
}

export function getItems(items) {
    return {
        type: GET_ITEMS,
        payload: items
    }
}

export function getInfo(info) {
    return {
        type: GET_INFO,
        payload: info
    }
}

export function getGenders(genders) {
    return {
        type: GET_GENDERS,
        payload: genders
    }
}

export function getItem(item) {
    return {
        type: GET_ITEM,
        payload: item
    }
}

export function addItem(paramsObj) {
    return {
        type: ADD_ITEM,
        payload: fetchData(`${WebServiceURL}AddItem`, paramsObj).then((data) => JSON.parse(data)).catch(() => undefined)
    }
}

export function editItem(paramsObj) {
    return {
        type: EDIT_ITEM,
        payload: fetchData(`${WebServiceURL}EditItem`, paramsObj).then((data) => JSON.parse(data)).catch(() => undefined)
    }
}

export function deleteItem(paramsObj) {
    return {
        type: DELETE_ITEM,
        payload: { data: fetchData(`${WebServiceURL}DeleteItem`, paramsObj).catch(() => undefined), paramsObj }
    }
}

export function getFilters(filters) {
    return {
        type: GET_FILTERS,
        payload: filters
    }
}

export function fetchData(url, paramsObj) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(paramsObj),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then(response => response.json())
        .then(response => response.d)
}