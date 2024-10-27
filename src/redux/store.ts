import { createStore } from 'redux';
import allReducers from './reducer';
export const store = createStore(allReducers);
