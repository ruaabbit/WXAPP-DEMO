// pages/minedata/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo: wx.getStorageSync('user'),
        openid: wx.getStorageSync('userOpenid'),
        datalist: "",
        newtime: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
        day1: '',
        day2: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            userinfo: wx.getStorageSync('user')
        })
        this.getMyInvite();
    },
    async getMyInvite() {
        // 获取我的羁绊
        const that = this;
        const res = await app.call({
            // 云函数名称
            name: 'wishes-520',
            // 传给云函数的参数
            data: {
                type: 'getMyInvite1'
            }
        })
        // console.log('RES', res)
        let maybeList = [].concat(res.data.inviteFromParner.slice(-2), res.data.inviteFromMyself.slice(-2))
        maybeList.sort(function (x, y) {
            if (x.updateTime < y.updateTime) {
                return 1
            } else if (x.updateTime > y.updateTime) {
                return -1
            } else {
                return 0
            }
        })
        // console.log(maybeList)
        that.setData({
            datalist1: maybeList[0] ? maybeList[0] : "",
            datalist2: maybeList[1] ? maybeList[1] : "",
            day1: maybeList[0] ? that.timesize(that.data.newtime, maybeList[0].memorialDayTime) : 'xxxx',
            day2: maybeList[1] ? that.timesize(that.data.newtime, maybeList[1].memorialDayTime) : 'xxxx',
            userinfo: wx.getStorageSync('user')
        })

        wx.stopPullDownRefresh();
    },
    async updateTa() {
        this.getMyInvite();
        const that = this;
        try {
            const res = await app.call({
                // 云函数名称
                name: 'wishes-520',
                // 传给云函数的参数
                data: {
                    type: 'updateMyInvite',
                    _id: that.data.datalist._id
                }
            })
            that.offMask();
            wx.showToast({
                title: '修改成功',
                icon: 'success'
            })
            wx.removeStorageSync('recipientId');
            setTimeout(() => {
                wx.reLaunch({
                    url: '../minedata/index',
                })
            }, 1000)
        } catch (error) {
            wx.showToast({
                title: '请邀请Ta\n 以激活功能',
                icon: 'error'
            })
            that.offMask();
        }
    },
    router(e) {
        try {
            wx.navigateTo({
                url: `${e.currentTarget.dataset.url}?id=${e.currentTarget.dataset.id}&memorialDayNoticeTime=${this.data.datalist.memorialDayNoticeTime}&memorialDayTime=${this.data.datalist.memorialDayTime}&memorialDayName=${this.data.datalist.memorialDayName}`,
            })
        } catch (error) {
            wx.showToast({
                title: '请邀请Ta\n 以激活功能',
                icon: 'error'
            })
        }
    },
    timesize(beginDate, endDate) {
        if (beginDate != '' && endDate != '') {
            var aDate, oDate1, oDate2, iDays;
            if (beginDate.length == 8) {
                beginDate = beginDate.substr(0, 4) + '-' + beginDate.substr(4, 2) + '-' + beginDate.substr(6, 2);
            }
            if (endDate.length == 8) {
                endDate = endDate.substr(0, 4) + '-' + endDate.substr(4, 2) + '-' + endDate.substr(6, 2);
            }
            aDate = beginDate.split("-");
            oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]); //转换为12/13/2008格式
            aDate = endDate.split("-");
            oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]);
            var i = (oDate1 - oDate2) / 1000 / 60 / 60 / 24;

            iDays = i; //把相差的毫秒数转换为天数
            return iDays;
        } else {
            return 0;
        }
    },
    onMask() {
        if (wx.getStorageSync('recipientId')) {
            this.setData({
                maskshow: true
            })
        }
    },
    offMask() {
        this.setData({
            maskshow: false
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.getMyInvite();
    },


})