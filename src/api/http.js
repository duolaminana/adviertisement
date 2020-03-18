import axios from "axios";
const base = "http://192.168.3.181:8034";
// 广告上传地址
// export const Upload ="http://192.168.10.104:8034/advert/upload"
// 酒店管理
export const netWorkHttp = (URL, info, method = "post") => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        url: base + "/hotels" + URL,
        data: info,
        method
      })
      .then(res => {
        if (res.data.status == 200) {
          resolve(res.data);
        } else {
          reject(res.data.body);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
// 广告管理
export const netWorkAdv = (URL, info, method = "post") => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        url: base + "/advert" + URL,
        data: info,
        method
      })
      .then(res => {
        if (res.data.status == 200) {
          resolve(res.data);
        } else {
          reject(res.data.body);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
// 广告分组管理
export const netWorkAdvGroup = (URL, info, method = "post") => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        url: base + "/advertGroup" + URL,
        data: info,
        method
      })
      .then(res => {
        if (res.data.status == 200) {
          resolve(res.data);
        } else {
          reject(res.data.body);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
// 广告分组管理
export const netWorkAdvGroupDet = (URL, info, method = "post") => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        url: base + "/advGroupDetails" + URL,
        data: info,
        method
      })
      .then(res => {
        if (res.data.status == 200) {
          resolve(res.data);
        } else {
          reject(res.data.body);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
