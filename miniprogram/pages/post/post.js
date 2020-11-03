import util from '../../utils/util.js';
// miniprogram/pages/post/post.js
import SharePage from '../palette/share-page';
const app = getApp();
const request = require('../../utils/request.js');
let time = require('../../utils/util.js');
var countdown = 60;
/**
 * 云数据库初始化。
 */
const db = wx.cloud.database();
const _ = db.command;

Page({
    imagePath: '',
    /**
     * 页面的初始数据
     */
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        skin: app.globalData.skin,
        style: app.globalData.highlightStyle,
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        CommentShow: false,
        ButtonTimer: '',//  按钮定时器
        LastTime: 60,
        CommentSwitch: true,
        commentValue:'',
        isSave: false,
        existData: false,
        existVoteData:false,
        TabCur: 0,
        scrollLeft: 0,
        tabItem:[{name:'评论'},{name:'点赞'}],
        alreadyVote:false,
    },
    /**
     * tab切换。
     */
    tabSelect:function(e){
        this.setData({
            TabCur:e.currentTarget.dataset.id
        })
    },
    /**
     * 绘制分享海报
     */
    SharePage: function(e){
        var that = this;
        let currentPage = that.route;
        // console.log(currentPage);
        wx.showLoading({
            title: '绘制分享海报',
        });
        wx.cloud.callFunction({
            // 云函数名称
            name: 'wxacode_get',
            // 传给云函数的参数
            data: {
                pathParam: currentPage + "?postId=" + that.data.postId,
                /**
                 * 拼接云存储的位置。
                 */
                options: currentPage.substr(currentPage.lastIndexOf('/') + 1,currentPage.length) + that.data.postId,
                width: 430
            },
            success(res) {
                let tempUrl = res.result[0].tempFileURL;
                /**
                 * 标题
                 */
                let array = that.data.postTitle.split("-");
                let categories = array[0].substr(0,array[0].length - 1);
                let title = array[1].substr(1,array[1].length);
                that.setData({
                    paintPallette: new SharePage()
                    .palette(categories,title,that.data.postTags[0].name
                    ,tempUrl,app.globalData.userInfo.nickName,
                    app.globalData.userInfo.avatarUrl),
                });
            },
            fail: err => {
                that.hideLoading();
            },
        })
        
    },
    /** 
    *  保存海报图片弹窗。
    */
     hideSaveModal(e) {
         this.setData({
             isSave: false
         })
     },
     /** 
     * wxfile:// 临时文件的一个大坑。
     * <view>标签 background-image: url('') 支持渲染base64的图片格式
     * 'data: image/jpg;base64,' + base64
     */
    onImgErr(e){
        // console.log(e);
        this.hideLoading();
    },
    /**
     * 分享图片绘制完成。
     * @param {} e 
     */
    onImgOK(e) {
         var that = this;
         that.imagePath = e.detail.path;
        //  console.log(that.imagePath);
        //  let base64 = wx.getFileSystemManager().readFileSync(that.imagePath,"base64");
         that.setData({
            image: that.imagePath,
            isSave: true,
            },()=>{
                that.hideLoading();
            }
        )
        /**
         * background-image:url(); base64图片加载不完全的问题，暂不使用，更换方案。
         */
        //  let value = that.converImg(that.imagePath);
        //  setTimeout(()=>{
        //     that.setData({
        //         image: 'data: image/jpg;base64,' + value,
        //         isSave: true,
        //     })
        //  },300);
     },
     /**
      * 隐藏加载框
      */
     hideLoading:function(){
        setTimeout(function () {
            wx.hideLoading()
        }, 100)
     },
     /**
      * 本地文件转base64图片格式。
      */
     converImg: function(path){
        return wx.getFileSystemManager().readFileSync(path,"base64");
     },
     /**
      * 保存图片到相册
      */
     saveImage() {
         var that = this;
         if (that.imagePath && typeof this.imagePath === 'string') {
           wx.saveImageToPhotosAlbum({
             filePath: this.imagePath,
             success(res){
                 that.setData({
                     isSave:false
                 },()=>{
                     wx.showToast({
                       title: '保存成功。',
                     })
                 })
             }
           });
         }
     },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // // 在页面中定义插屏广告
        // let interstitialAd = null

        // // 在页面onLoad回调事件中创建插屏广告实例
        // if (wx.createInterstitialAd) {
        //     interstitialAd = wx.createInterstitialAd({
        //         adUnitId: 'adunit-296c920c08da636d'
        //     })
        //     interstitialAd.onLoad(() => { })
        //     interstitialAd.onError((err) => { })
        //     interstitialAd.onClose(() => { })
        // }

        // // 在适合的场景显示插屏广告
        // if (interstitialAd) {
        //     interstitialAd.show().catch((err) => {
        //         console.error(err)
        //     })
        // }


        var postId = options.postId;
        // console.log(postId);
        this.setData({
            postId: postId
        })


        var urlContent = app.globalData.url + '/api/content/posts/' + postId;
        var token = app.globalData.token;
        var params = {};
        //@todo 文章内容网络请求API数据
        request.requestGetApi(urlContent, token, params, this, this.successFunPost, this.failFunPost);

        var urlComments = urlContent + '/comments/list_view';
        wx.showLoading({
          title: '加载数据中...',
          icon: 'none',
        })
        //@todo 评论列表网络请求API数据
        // request.requestGetApi(urlComments, token, params, this, this.successComment, this.failComment);
        var urlSwitch = app.globalData.url + '/api/content/options/keys/comment_api_enabled';
        //@todo 评论开启按钮网络请求API数据
        request.requestGetApi(urlSwitch, token, params, this, this.successSwitch, this.failSwitch);
        //@todo 查询文章评论数量。
        this.queryComments();
        this.queryArticleVote();
        setTimeout(()=>{
            wx.hideLoading()
        },2000);
    },
    /**
     * 查询数据库是否存在点赞的数据
     */
    queryArticleVote:function(){
        var that = this;
        db.collection('article_vote').where({
            archives_id:that.data.postId,
            status:'ENABLE'
        }).get({
            success:function(res){
                if(res.data.length > 0){
                    let data = res.data[0];
                    /**
                     * @todo 循环数组
                     * some ,return true 跳出循环
                     * every , return false 跳出循环
                     */
                    data.array.some(v => {
                        if(v.user_name === app.globalData.userInfo.nickName){
                            that.setData({
                                alreadyVote: true
                            })
                            return true;
                        }
                    });
                    that.setData({
                        voteList: data.array,
                        voteNum: data.num,
                        existVoteData: true
                    })
                }
            }
        })
    },
    /**
     * 查询数据库是否存在评论的数据
     */
    queryComments: function(){
        var that = this;
        db.collection('comments').where({
            archives_id:that.data.postId,
            status:'ENABLE'
        }).get({
            success:function(res){
                if(res.data.length > 0){
                    let data = res.data[0];
                    that.setData({
                        commentList: data.array,
                        commentNum: data.num,
                        existData: true
                    })
                }
            }
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

        // console.warn(app.globalData.userInfo);

        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true,
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        // console.warn(this.data.postId);
        return {
            title: this.data.postTitle,
            path: '/pages/post/post?postId=' + this.data.postId,
            imageUrl: this.data.postThumbnail,
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareTimeline: function () {
        // console.warn(this.data.postId);
        return {
            title: this.data.postTitle,
            path: '/pages/post/post?postId=' + this.data.postId,
            imageUrl: this.data.postThumbnail,
        }
    },

    getUserInfo: function (e) {
        // console.log(e)
        app.globalData.userInfo = e.detail.userInfo;
        // app.globalData.nickName = e.detail.userInfo.nickName;
        // app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
    },

    /**
     * 文章详情请求--接口调用成功处理
     */
    successFunPost: function (res, selfObj) {
        var that = this;

        // console.warn(res.data);
        var createTime = res.data.createTime;
        // time.customFormatTime(createTime, 'Y-M-D h:m:s');
        // 当前时间的日期格式
        // var date = new Date();
        // console.log(time.formatTime(date+"123"));

        that.setData({
            postTitle: res.data.title,
            postVisits: res.data.visits,
            postLikes: res.data.likes,
            postContent: res.data.originalContent,
            postDate: time.customFormatTime(createTime, 'Y-M-D'),
            postTags: res.data.tags,
            postThumbnail: res.data.thumbnail,
        })
        // console.warn(postTags);

    },
    /**
     * 文章详情请求--接口调用失败处理
     */
    failFunPost: function (res, selfObj) {
        console.error('failFunPosts', res)
    },

    /**
     * 评论列表请求--接口调用成功处理
     */
    successComment: function (res, selfObj) {
        var that = this;
        // console.warn(res.data);
        var list = res.data.content;
		if(list.length != 0){
			for (let i = 0; i < list.length; ++i) {
				list[i].createTime = time.customFormatTime(list[i].createTime, 'Y-M-D  h:m:s');
				list[i].falg = true;
				if (list[i].isAdmin) {
					list[i].email = '';
					list[i].authorUrl = 'https://cn.gravatar.com/avatar/3958035fa354403fa9ca3fca36b08068?s=256&d=mm';
				}
            }
            list[list.length - 1].falg = false;
	    }
        that.setData({
            commentList: res.data.content,
        })
    },
    /**
     * 评论列表请求--接口调用失败处理
     */
    failComment: function (res, selfObj) {
        console.error('failComment', res)
    },



    /**
     * 评论模块
     */
    Comment: function (e) {
        var content = e.detail.value.replace(/\s+/g, '');
        // console.log(content);
        var that = this;
        that.setData({
            CommentContent: content,
        });
    },

    CommentSubmit: function (e) {

        // console.warn(this.userInfo);
        var that = this;

        if (!that.data.CommentContent) {
            wx.showToast({
                title: '评论内容不能为空！',
                icon: 'none',
                duration: 2000
            })
            // console.error("评论内容为空!");
        } else {
            that.setData({
                CommentShow: true,
            });
            that.data.ButtonTimer = setInterval(function () {
                if (countdown == 0) {
                    that.setData({
                        CommentShow: false,
                    })
                    countdown = 60;
                    clearInterval(that.data.ButtonTimer);
                    return;
                } else {
                    that.setData({
                        LastTime: countdown
                    });
                    // console.warn(countdown);
                    countdown--;
                }
            }, 1000)
            // console.warn(that.data.CommentContent);
            wx.cloud.callFunction({
                name: 'msg_sec_check',
                data: {
                    content: that.data.CommentContent
                }
            }).then(ckres => {
                if (ckres.result.errCode == 0) {
                    var urlPostList = app.globalData.url + '/api/content/posts/comments';
                    var token = app.globalData.token;
                    var params = {
                        author: app.globalData.userInfo.nickName,
                        authorUrl: app.globalData.userInfo.avatarUrl,
                        content: that.data.CommentContent,
                        email: "xunwu451@126.com",
                        parentId: 0,
                        postId: that.data.postId,
                    };
                    //@todo 网络请求API数据
                    request.requestPostApi(urlPostList, token, params, this, this.successSendComment, this.failSendComment);
                    //@todo 数据库存储该文的评论。
                    let comments = [{
                        content:that.data.CommentContent,
                        user_avatar:app.globalData.userInfo.avatarUrl,
                        // 随机rondom一个key
                        content_id:util.guid(),
                        user_name:app.globalData.userInfo.nickName,
                        status:'ENABLE',
                        create_time:time.formatTime(new Date(),'Y-M-D  h:m:s'),
                    }];
                    if(that.data.existData){
                        wx.cloud.callFunction({
                            name:'db_comments',
                            data:{
                                archivesId:that.data.postId,
                                comments:comments
                            },success: res=>{
                                that.queryComments();
                            },fail:err=>{
                                wx.showToast({
                                    title: '服务器繁忙，稍后重试',
                                    icon: 'none',
                                    duration: 1000
                                });
                            }
                        })
                    }else{
                        db.collection('comments').add({
                            data:{
                                _id:that.data.postId,
                                archives_id:that.data.postId,
                                num:1,
                                array:comments,
                                status:'ENABLE',
                            },success: res=>{
                                that.queryComments();
                            },fail:err=>{
                                wx.showToast({
                                    title: '服务器繁忙，稍后重试',
                                    icon: 'none',
                                    duration: 1000
                                });
                            }
                        });
                    }
                } else {
                    // wx.hideLoading();
                    // wx.showModal({
                    //     title: '提醒',
                    //     content: '请注意言论',
                    //     showCancel: false
                    // })
                    wx.showToast({
                        title: '请注意言论！',
                        icon: 'none',
                        duration: 2000
                    })
                    that.setData({
                        commentValue: "",
                        CommentContent: undefined
                    })
                }
            })
        }
    },
    /**
     * @todo 文章点赞功能,目前数据结构好似不太优雅，先解决功能问题，后续有性能问题，再改。fuck!
     * article_vote
     */
    Likes: function() {
        var that = this;
        if(that.data.alreadyVote){
            wx.showToast({
              title: '给出的赞,就收不回了。',
              icon:'none',
              duration:1000
            })
            return;
        }
        let vote = [{
            user_name:app.globalData.userInfo.nickName,
            user_avatar:app.globalData.userInfo.avatarUrl,
            create_time:time.formatTime(new Date(),'Y-M-D  h:m:s'),
            status:'ENABLE',
        }];
        if(that.data.existVoteData){
            db.collection('article_vote').where({
                archives_id: that.data.postId,
                status:'ENABLE',
            }).update({
                data:{
                    num:_.inc(1),
                    array:_.push(vote)
                  },
                success: res => {
                    that.queryArticleVote();
                    that.setData({
                        alreadyVote:true
                    })
                },
                fail: e => {
                    wx.showToast({
                        title: '服务器繁忙，稍后重试',
                        icon: 'none',
                        duration: 1000
                    });
                }
            });
        }else{
            db.collection('article_vote').add({
                data:{
                    _id:that.data.postId,
                    archives_id:that.data.postId,
                    num:1,
                    array:vote,
                    status:'ENABLE',
                },success:res => {
                    that.queryArticleVote();
                    that.setData({
                        alreadyVote:true
                    })
                },fail:e => {
                    wx.showToast({
                      title: '服务器繁忙，稍后重试',
                      icon: 'none',
                      duration: 1000
                    })
                }
            });
        }
    },
    CommentSubmitTips: function() {
        wx.showToast({
            title: this.data.LastTime + "s 后再次评论",
            icon: 'none',
            duration: 1000
        })
    },
    successSendComment: function (res, selfObj) {
        var that = this;
        // console.warn(res.data);
		that.setData({
			commentValue:"",
			CommentContent:undefined
		})
		wx.showToast({
                title: '感谢你的评论与支持！',
                icon: 'none',
                duration: 2000
            })
        var token = app.globalData.token;
        var urlContent = app.globalData.url + '/api/content/posts/' + that.data.postId;
        var urlComments = urlContent + '/comments/list_view';
        var params = {};
        //@todo 评论列表网络请求API数据
        request.requestGetApi(urlComments, token, params, this, this.successComment, this.failComment);
    },

    failSendComment: function (res, selfObj) {
        console.error('failComment', res)
    },

     /**
     * 评论开关按钮回调
     */
    successSwitch: function(res, selfObj) {
        var that = this;
        // console.warn(res.data);
        that.setData({
            CommentSwitch: !res.data,
        });
    },
    failSwitch: function (res, selfObj) {
        console.error('failSwitch', res)
    },


})
