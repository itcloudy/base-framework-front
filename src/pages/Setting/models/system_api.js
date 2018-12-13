
import { querySystemAPI, addSystemAPI, updateSystemAPI } from '@/services/system_api';
export default{
  namespce:'system_api',
  state:{
    data:[],
    form:null,
    detail:null,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySystemAPI, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addSystemAPI, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateSystemAPI, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },
  reducers:{
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
}