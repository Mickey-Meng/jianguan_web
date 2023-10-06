import { isJSON } from '@/utils/index.js'
/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:28
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-16 17:24:18
 */
export function download(url, name) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "arraybuffer";
  xhr.setRequestHeader('token',window.localStorage.getItem('zj_token'));
  xhr.setRequestHeader('Authorization',window.localStorage.getItem('auth_token'));
  xhr.onload = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let blob = this.response;
      let u = window.URL.createObjectURL(
        new Blob([blob], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
        })
      );
      let a = document.createElement("a");
      a.download = name || "";
      a.href = u;
      a.target = "_blank";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };
  xhr.send();
}

export const downLoadFile = str => {
  console.log(str);
  let fileId = str;
  if (isJSON(str)) {
    fileId = JSON.parse(str).fileId;
  }
  console.log("fileId:" + fileId);
  let link = document.createElement("a"); // 创建a标签
  link.style.display = "none"; //mong/preview?fileid=
  link.href = "/mong/download?fileid=" + fileId; // 设置下载地址
  link.setAttribute("download", ""); // 添加downLoad属性
  document.body.appendChild(link);
  console.log(link);
  link.click();
  link.remove();
};
export const downLoadRowFile = str => {
  let fileId,fileName
  if (isJSON(str)) {
    fileId = JSON.parse(str).fileId;
    fileName = JSON.parse(str).uploadname;
  }
  let link = document.createElement("a");
  link.style.display = "none"; //mong/preview?fileid=
  link.href = "/mong/download?fileid=" + fileId+"&fileName="+fileName // 设置下载地址
  link.setAttribute("download", ""); // 添加downLoad属性
  document.body.appendChild(link);
  link.click();
  link.remove();
};
