export default class SharePage {
  palette(categories,title,slug,qrCode,name,avatar) {
    var startTop = 150;
    var gapSize = 155;
    var common = {
      left: "32rpx",
      color: "white",
    };
    return {
      background: 'https://dalididilo.top/upload/2020/10/%E6%B5%B7%E6%8A%A501-f7d756c19b894c34a2f881845398f3a8.jpg',
      width: '700rpx',
      height: '1000rpx',
      views: [
        {
          id:'avatar',
          type:'image',
          url: avatar,
          css:[{
            width:'120rpx',
            height:'120rpx',
            top:'100rpx',
            left: "32rpx",
            borderRadius:'60rpx',
            borderWidth:'2rpx',
            borderColor:'white',
            borderStyle:'solid'
          }],
        },{
          id:'name',
          type: 'text',
          text: name,
          css:[{
            top: ['10rpx','avatar',1],
            left: ['50rpx','avatar',1],
            fontSize: "30rpx",
            color: "white",
          }],
        },{
          id:'description',
          type: 'text',
          text: '我已加入阅读，邀你一起。',
          css:[{
            top: ['160rpx','name',1],
            left: ['-10rpx','name',1],
            fontSize: "25rpx",
            color: "white",
          }],
        },{
          type: 'text',
          text: categories,
          css: [{
              top: startTop + gapSize + 'rpx',
              fontSize: "25rpx",
          },common],
        },
        {
          id: 'title',
          type: 'text',
          text: title,
          css:[{
            textDecoration:'underline',
            fontWeight: 'bold',
            top: startTop + gapSize + 50 + 'rpx',
            fontSize: "40rpx",
          },common],
        },{
          id: "rect",
          type:'rect',
          css:[{
            width: '10rpx',
            height: '10rpx',
            top: ['396rpx','title',1],
            color: 'white',
            borderRadius: '10rpx',
            left: "32rpx",
          }]
        },{
          id:'slug',
          type: 'text',
          text: slug,
          css:[{
            top: ['417rpx','rect',1],
            left: "32rpx",
            fontSize: "21rpx",
            color: "white",
            left:['40rpx','rect',1]
          }],
        },
        {
          type: 'image',
          url: qrCode,
          css: {
            bottom: '40rpx',
            right: '32rpx',
            width: '125rpx',
            height: '125rpx',
            borderRadius: '10rpx',
          },
        },{
          type: 'text',
          text: "大离弟弟咯。",
          css: [{
              bottom: '105rpx',
              fontSize: "25rpx",
          },common],
        },{
          type: 'text',
          text: "https://dalididilo.top/",
          css: [{
              bottom: '70rpx',
              fontSize: "20rpx",
          },common],
        },
      ]
    }
  }

}
