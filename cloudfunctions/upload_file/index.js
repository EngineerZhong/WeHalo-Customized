// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let { fileName,source } = event;
  const upload = await cloud.uploadFile({
    cloudPath: fileName + '.jpg',
    fileContent: source,
  })
  var fileId = upload.fileID;
  const fileList = [fileId];
  const imgList = await cloud.getTempFileURL({
    fileList: fileList,
  })
  return imgList.fileList
}