import axios from 'axios';

let headers = {
  'opinion-token': '5570e57fc108416e8d54d3dc43bcfd98',
};

export const get = (url) => {
  axios
    .get(url, {
      headers,
    })
    .then(function (res) {
      console.log('res', res);
      if (res.status === 200) {
        return res.data;
      } else {
      }
    });
};

export const post = (url, data, config) => {
  axios
    .post(url, data, {
      headers: {
        ...headers,
        'Content-Type': 'application/json;charset=utf-8',
      },
      ...config,
    })
    .then(function (res) {
      console.log('res', res);
      if (res.status === 200) {
        return res.data;
      } else {
      }
    });
};
