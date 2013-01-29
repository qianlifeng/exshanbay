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
        if(logined == null || refreshCache){
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
        setInterval(function(){
            if(hasLogin()){
                chrome.browserAction.setIcon({path: '../icon.png'})
                ajax('http://www.shanbay.com/api/v1/review/?stats',function(json,text){
                    chrome.browserAction.setBadgeText({ text: json.num_left.toString()});
                    chrome.browserAction.setTitle({title: '今日还需学习'+json.num_left+"个单词"});
                });
            }                    
            else{
                chrome.browserAction.setTitle({title: '请登录'});
                //chrome.browserAction.setBadgeBackgroundColor({color:grayColor});
                chrome.browserAction.setIcon({path: '../icon_gray.png'})
                //var canvas = document.getElementById('canvas');
                //var drawContext = canvas.getContext('2d');
                //var myImage = new Image();
                //myImage.src = '../icon_gray.png';
                //drawContext.drawImage(myImage,0,0);
                ////drawContext.globalAlpha = 0.5;
                //var imageData = drawContext.getImageData(0, 0, 19, 19);
                //chrome.browserAction.setIcon({
                  //imageData: imageData
                //});
            }
        },ms);
    }

    return { 
        init:function(){
            hasLogin(true);      
        },         
        startMonitor:function(){
            startTodayStatisticsTimer(1000*10);
        }
    }
})(); 

exshanbay.init();
exshanbay.startMonitor();
