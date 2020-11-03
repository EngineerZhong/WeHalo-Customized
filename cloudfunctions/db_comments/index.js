// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
/**
 * 云数据库初始化。
 */
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let{comments,archivesId} = event;
  try{
    return await db.collection('comments').where({
      archives_id: archivesId,
      status:'ENABLE',
    }).update({
      data:{
        num:_.inc(1),
        array:_.push(comments)
      },
      success: res => {
        console.log('云函数comment成功', comment, id)

      },
      fail: e => {
        console.error(e)
      }
    });
  }catch(err){
    return err;
  }
}