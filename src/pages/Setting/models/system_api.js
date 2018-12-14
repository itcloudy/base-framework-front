
import { querySystemAPI, addSystemAPI, updateSystemAPI } from '@/services/system_api';
export default{
  namespce:'system_api',
  state:{
    data:[],
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
        type: 'appendData',
        payload: response.data,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateSystemAPI, payload);
      yield put({
        type: 'updateData',
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
    appendData(state, action) {
      let list = Object.assign([], state.data.list);
      list.unshift(action.payload)
      let data = Object.assign({}, state.data);
      data.list = list;
      return {
        ...state,
        data:data,
      };
    },
    updateData(state, action) {
      let update = action.payload;
      let data = state.data;
      data.list.forEach((item,i) => {
        if (item.id === create.id){
          data[i]=update;
        }
      });
      return {
        ...state,
        data:data,
      };
    },
  },
}