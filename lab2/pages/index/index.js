// index.js
// 获取应用实例


Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ["北京市", "北京市"],
    now: {
      temp: 0,
      text: '未知',
      icon: '999',
      humidity: 0,
      pressure: 0,
      vis: 0,
      windDir: 0,
      windScale: 0,
      windSpeed: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWeather();
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

  },

  regionChange: function (e) {
    this.setData({
      region: e.detail.value
    });
    this.getWeather();
  },

  getWeather: function () {
    var that = this;
    wx.request({
      url: 'https://geoapi.qweather.com/v2/city/lookup',
      data: {
        key: '8ae6f72208ab47aabd5a124315a24385',
        location: that.data.region[1],
        adm: that.data.region[0]
      },
      success: function (res) {
        wx.request({
          url: 'https://devapi.qweather.com/v7/weather/now',
          data: {
            key: '8ae6f72208ab47aabd5a124315a24385',
            location: res.data.location[0].id
          },
          success: function (res) {
            that.setData({
              now: res.data.now
            });
          }
        })
      }
    });

  }


})