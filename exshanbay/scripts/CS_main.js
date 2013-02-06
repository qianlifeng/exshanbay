window.onload = function(){
    exec(injectScript);
}

function exec(fn) {
   var script = document.createElement('script');
   script.setAttribute("type", "application/javascript");
   script.textContent = '(' + fn + ')();';
   document.documentElement.appendChild(script); // run the script
   document.documentElement.removeChild(script); // clean up
}


injectScript = function() {
    if(typeof ReviewView != undefined){
        ReviewView.prototype.render_detail= function () {
                stop_spin();
                var review_detail_view = new ReviewDetailView({
                    model: this.model
                });
                inject();
                review_detail_view.bind('next', this.next, this);
                review_detail_view.bind('prev', this.prev, this);
        };
    }
    else
    {
        console.log("exshanbay:could not find review view");
    }

    function inject(){
        $(".note-user-box-tab").click();
        //添加标签
        var tabTitle = '最喜欢';
        $("#example-tab").append('<li><a class="ex-favorite-box-tab" href="#ex-favorite-box">'+tabTitle+'</a></li>');
        //添加标签下面的具体内容
        var wrapper = '<div class="tab-pane row" id="ex-favorite-box"><ol class="span9"></ol></div>';
        $(".tab-content").append(wrapper);
        $(".ex-favorite-box-tab").click();
        $("#ex-favorite-box ol").append(getMostFavorite());
    }
    

    /**
     * @brief 获得最喜欢的例句列表
     *
     * @return 最喜欢的例句html 
     */
    function getMostFavorite(){
        var list = [];
        $("#ex-defaults-box .like").each(function(){
            var patrn= /喜欢（(\d+)）/ig;
            match = patrn.exec($(this).text());
            if (match){
                list.push([match[1],$(this).parent().parent().parent().parent()]);
            }
        });

        //排序
        list.sort(function(a,b){return b[0] - a[0];});
        
        var returnStr = "";
        for (var i = 0; i < list.length; i += 1) {
            returnStr += $('<a>').append(list[i][1].clone()).html(); 
        };
        return returnStr;
    }
}
