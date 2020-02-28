import axios from 'axios';
const base = 'http://120.78.206.233:8081';
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
