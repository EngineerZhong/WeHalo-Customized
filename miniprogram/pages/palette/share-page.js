export default class SharePage {
  palette(categories,title,slug,qrCode) {
    var startTop = 150;
    var gapSize = 60;
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
          type: 'text',
          text: categories,
          css: [{
              top: startTop + 'rpx',
              fontSize: "30rpx",
          },common],
        },
        {
          id: 'title',
          type: 'text',
          text: title,
          css:[{
            top: startTop + gapSize + 'rpx',
            fontSize: "40rpx",
          },common],
        },{
          id: "rect",
          type:'rect',
          css:[{
            width: '15rpx',
            height: '15rpx',
            top: ['250rpx','title',1],
            color: 'white',
            borderRadius: '10rpx',
            left: "32rpx",
          }]
        },{
          id:'slug',
          type: 'text',
          text: slug,
          css:[{
            top: ['267rpx','rect',1],
            left: "32rpx",
            fontSize: "25rpx",
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
            width: '110rpx',
            height: '110rpx',
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
