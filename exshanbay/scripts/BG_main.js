var exshanbay = (function(){
    var grayColor = "#222";
    var redColor = "#F00";
    var logined = null;
    

    /**
     * @brief 判断当前用户是否登陆扇贝
     * 因为使用的ajax请求，所以此方法并不是实时判断登陆信息
     *
     * @param refreshCache  强制刷新缓存中的登陆信息
     *
     * @return 如果用户已经登陆返回true，否则返回false
     */
    function hasLogin(refreshCache){
        if(logined == null && !refreshCache){
            ajax('http://www.shanbay.com/api/user/info/',function(json,text){
               if(json.result == 1){
                   logined = true;
               }
               else{
                   logined = false;
               }
            });
        }
        return logined;
    }

    /**
     * @brief 启动统计今天的学习情况定时器 
     *
     * @param ms 定时器的间隔时间（毫秒）
     *
     * @return 无
     */
    function startTodayStatisticsTimer(ms){
        setTimeout(function(){
            if(hasLogin()){
                //http://stackoverflow.com/questions/7730577/how-to-animate-chrome-extension-icon-in-a-callback-function 
            }                    
            else{
                chrome.browserAction.setTitle({title: '请登录'});
                chrome.browserAction.setBadgeBackgroundColor({color:grayColor});
            }
        },ms);
    }

    return { 
        init:function(){
            hasLogin(true);      
            startTodayStatisticsTimer(1000*10);
        },         
    }
})(); 

exshanbay.init();
