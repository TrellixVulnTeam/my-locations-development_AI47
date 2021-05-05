import { SAVE_NEW_CATEGORY , SAVE_NEW_LOCATION , LOAD_DATA_FROM_LOCAL_STORAGE , DELETE_CATEGORY, RENAME_CATEGORY, UPDATE_ROW, DELETE_ROW } from "./actions";

export const saveDataToLocalStorageMiddleware = ({ getState }) => next => action => {
    const listActionsForSaveDataToLocalStorage = [ SAVE_NEW_CATEGORY , SAVE_NEW_LOCATION , DELETE_CATEGORY , RENAME_CATEGORY , UPDATE_ROW , DELETE_ROW ];
    const nextAction = next(action);
    if(!listActionsForSaveDataToLocalStorage.includes(action.type)) return nextAction;
    localStorage.setItem('myLocationsData',JSON.stringify(getState()));
    return nextAction;
}

export const loadDataFromLocalStorageMiddleware = store => next => action => {
    if(action.type !== LOAD_DATA_FROM_LOCAL_STORAGE) return next(action);
    action.payload = JSON.parse(localStorage.getItem('myLocationsData'));
    if(!action.payload) return;
    return next(action);
}

export const calcRealIndexToReplaceRowMiddleware = ({ getState }) => next => action => {
    if(action.type !== UPDATE_ROW && action.type !== DELETE_ROW) return next(action);
        const locationsArray =  getState().locationsReducer.locationsArray;
        let indexToStartSearch = 0;
        for(let i = 0 ; i <= action.payload.indexInSpecificCategoryList ; i++) {
            indexToStartSearch = locationsArray.findIndex((e , i )=> (i === 0 || i > indexToStartSearch) && e.category === getState().categoriesReducer.activeCategory);
        }
        action.payload.realIndexOfRow = indexToStartSearch;
        if(action.type === UPDATE_ROW)  {
            action.payload.row.category = getState().categoriesReducer.activeCategory;
        }
    return next(action);
}