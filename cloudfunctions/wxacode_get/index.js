// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let { pathParam,options } = event
  try {
    const result = await cloud.openapi.wxacode.get({
        path: pathParam,
        width: 430
    })
    // if(pathParam.indexOf('?') !== -1)pathParam = pathParam.substr(0,pathParam.indexOf('?'));
    const upload = await cloud.uploadFile({
      cloudPath: options + '.jpg',
      fileContent: result.buffer,
    })
    var fileId = upload.fileID;
    // console.log(fileId);
    var fileList = [fileId];
    const imgList = await cloud.getTempFileURL({
      fileList: fileList,
    })
    // console.log(imgList);
    return imgList.fileList;
  } catch (err) {
    return err
  }
}