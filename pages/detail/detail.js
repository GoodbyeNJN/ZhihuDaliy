import Utils from '../../utils/util';
import Api from '../../utils/api';
import Data from '../../utils/data';

Page({
    data: {
        id: null, //当前日报id
        news: {}, //日报详情
        extraInfo: null,
    },

    //获取列表残过来的参数 id：日报id， theme：是否是主题日报内容（因为主题日报的内容有些需要单独解析）
    onLoad(options) {
        let id = parseInt(options.id);
        this.setData({
            id: id
        });
    },

    //加载日报数据
    onReady() {
        loadData.call(this);
    },

    // 下拉刷新
    onPullDownRefresh() {
        this.onReady()
        wx.stopPullDownRefresh()
    },

    //现在图片预览不支持调试显示，看不到效果
    //图片预览[当前是当前图片，以后会考虑整篇日报的图片预览]
    previewImgEvent(e) {
        let src = e.currentTarget.dataset.src;
        if (src && src.length > 0) {
            wx.previewImage({
                urls: [src]
            });
        }
    },
    //重新加载数据
    reloadEvent() {
        loadData.call(this);
    }
});

//加载页面相关数据
function loadData() {
    let id = this.data.id;
    wx.showLoading({
        title: '加载中'
    });
    Api.getNewsDetail(id).then(data => {
        data['image'] = Utils.fixImgPrefix(data['image']);
        data.body = Utils.parseStory(data.body, false);
        this.setData({
            news: data
        });
        wx.hideLoading();
    }).catch(() => {
        wx.hideLoading();
    });
}