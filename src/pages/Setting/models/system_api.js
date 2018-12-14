
import { querySystemAPI, addSystemAPI, updateSystemAPI } from '@/services/system_api';
export default{
  namespce:'system_api',
  state:{
    list:[],
    pagination:{},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySystemAPI, payload);
      yield put({
        type: 'save',
        payload: response.data,
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
      let list = Object.assign([], state.list);
      list.unshift(action.payload)
     
      return {
        ...state,
        list:list,
      };
    },
    updateData(state, action) {
      let update = action.payload;
      let list = state.list;
      list.forEach((item,i) => {
        if (item.id === create.id){
          list[i]=update;
        }
      });
      return {
        ...state,
        list:list,
      };
    },
  },
}