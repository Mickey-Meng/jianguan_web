/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:32
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-08 16:16:25
 */
import request from '@/utils/request'
const headers = {
  'Content-Type': 'multipart/form-data'
}

export const uploadFile = function (data) {
  return request({
    url: "/ZhuJiRoad/mong/upload",
    method: "post",
    headers,
    data
  });
};
// type 1合同文件 2变更图纸文件 3变更文档文件 4图纸桥梁文件 5 图纸道路文件 6图纸管线文件 7模型文件 8会议纪要 9质量体系 10安全体系
// 11危险源 12政策文件 13 报批材料 14批复文件 15 流程文件 16教学文档 17安装包文件 18劳务分包合同
//19 施工分包合同 20教学视频
/**
 * @des: 上传档案，前期文件
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const uploadF = data => {
  return request({
    url: "/ZhuJiRoad/mong/fileStore",
    method: 'post',
    data
  })
}

/**
 * @des: 修改文件基本信息
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const updateFileInfo = data =>{
  return request({
    url: '/ZhuJiRoad/mong/update',
    method: 'post',
    data
  })
}
/**
 * @des: 根据type查询文件
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getFile = (id,projectId) => {
  return request({
    url: '/ZhuJiRoad/mong/getStoreFileType?type=' + id + `&projectId=${projectId}`,
    method: 'get'
  })
}

/**
 * @des: 删除文件
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const deleteFile = id => {
  return request({
    url: '/ZhuJiRoad/mong/delFile?id=' + id,
    method: 'get'
  })
}
