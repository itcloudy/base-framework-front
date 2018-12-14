import { stringify } from 'qs';
import request from '@/utils/request';


export async function querySystemAPI(params) {
  return request(`/api/auth/system_apis?${stringify(params)}`)
}
export async function addSystemAPI(params) {
  return request('/api/auth/system_api', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateSystemAPI(params) {
  return request('/api/auth/system_api', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}