import { message } from 'antd';
import axios from 'axios';
import {replaceUrl} from './lib'


export const get = async (url,data) => {
  try{
    let headers = {
      'platform-token': sessionStorage.getItem('platform-token'),
    };
    const res = await axios.get(`/api${url}`,{params:data,headers},);
    console.log('res', res);
    if (res.status === 200) {
      const {data} = res || {}
      const {state,msg,results} = data||{}
      if(state === 401){
        replaceUrl('/login')
        return
      }
      if(state!==200){
        message.error(msg)
        return
      }
      return data;
    }
  }catch{
    message.error('服务不稳定，请稍后再试')
  }
};

export const postJson = async (url, data) => {
  try{
    let headers = {
      'platform-token': sessionStorage.getItem('platform-token'),
    };
    const res = await axios
      .post(`/api${url}`, data, {
        headers: {
          ...headers,
          'Content-Type': 'application/json;charset=UTF-8'
        },
      });
    if (res.status === 200) {
      const {data} = res || {}
      const {state,msg,results} = data||{}
      if(state === 401){
        replaceUrl('/login')
        return
      }
      if(state!==200){
        message.error(msg)
        return
      }
      return data;
    }
  }catch{
    message.error('服务不稳定，请稍后再试')
  }
};
export const postForm = async (url, data) => {
  try{
    let headers = {
      'platform-token': sessionStorage.getItem('platform-token'),
    };
    const res = await axios
      .post(`/api${url}`, data, {
        headers: {
          ...headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    if (res.status === 200) {
      const {data} = res || {}
      const {state,msg,results} = data||{}
      if(state === 401){
        replaceUrl('/login')
        return
      }
      if(state!==200){
        message.error(msg)
        return
      }
      return data;
    }
  }catch{
    message.error('服务不稳定，请稍后再试')
  }
};

export const post = async (url, data) => {
  try{
    let headers = {
      'platform-token': sessionStorage.getItem('platform-token'),
    };
    const res = await axios
      .post(`/api${url}`, data, {
        headers: {
          ...headers,
          'Content-Type': 'application/json;charset=UTF-8'
        },
      });
    if (res.status === 200) {
      const {data} = res || {}
      const {state,msg,results} = data||{}
      if(state === 401){
        replaceUrl('/login')
        return
      }
      if(state!==200){
        message.error(msg)
        return
      }
      return data;
    }
  }catch{
    message.error('服务不稳定，请稍后再试')
  }
};