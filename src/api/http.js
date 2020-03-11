import axios from 'axios';
const base = 'http://192.168.10.104:8034';
export const netWorkHttp = (URL, info, method = 'post') => {
  return new Promise((resolve, reject) => {
    axios.request({
        url: base+'/hotels' + URL,
        data: info,
        method
      }).then(res => {
        if(res.data.status==200){
          resolve(res.data)
        }else{
          reject(res.data.body)
        }
      }).catch(err=>{
        reject(err)
      })
  })
}