import { stringify } from 'qs';
import request from '@/utils/request';
import { HTML5_FMT } from 'moment';

export async function activeSystemAPI(params) {
  console.log(params);
  return request('/api/auth/system_api_active', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function querySystemAPI(params) {
  return request(`/api/auth/system_apis?${stringify(params)}`)
}
export async function addSystemAPI(params) {
  return request('/api/auth/system_api', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateSystemAPI(params) {
  return request('/api/auth/system_api', {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}