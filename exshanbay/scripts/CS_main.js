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
                review_detail_view.bind('next', this.next, this);
                review_detail_view.bind('prev', this.prev, this);
                inject(this.model.attributes["content_id"]);
        };
    }
    else
    {
        console.log("exshanbay:could not find review view");
    }

    function inject(vocabularyId){
        $(".note-user-box-tab").click();
        //添加标签
        var tabTitle = '最喜欢';
        $("#example-tab").append('<li><a class="ex-favorite-box-tab" href="#ex-favorite-box">'+tabTitle+'</a></li>');
        //添加标签下面的具体内容
        var wrapper = '<div class="tab-pane row" id="ex-favorite-box"><ol class="span9"></ol></div>';
        $(".tab-content").append(wrapper);
        $(".ex-favorite-box-tab").click();
        getMostFavorite(vocabularyId,function(list){$("#ex-favorite-box ol").append(list)});
    }
    

    /**
     * @brief 获得最喜欢的例句列表
     *
     * @return 最喜欢的例句html 
     */
    function getMostFavorite(vocabularyId,callBack){
        var list = [];
        $("#ex-defaults-box .like").each(function(){
            var patrn= /喜欢（(\d+)）/ig;
            match = patrn.exec($(this).text());
            if (match){
                list.push([match[1],$(this).parent().parent().parent().parent()]);
            }
        });

        $.ajax("http://www.shanbay.com/api/v1/example/?vocabulary_id="+vocabularyId).done(function(d){
            for(var index in d.objects) {
                var i = d.objects[index];
                var html = '<li class="row">'+
                            '<div class="span9"><div class="index pull-left"></div><div class="pull-left body">'+
                                '<div class="enex">'+i.first+'<span class="mid">'+i.mid+'</span>'+i.last+'</div>'+
                                '<div class="cnex">'+i.translation+'</div>'+
                                '<div class="edit-example-box"></div></div><div class="actions-wrap"><div class="actions hide btn-group pull-right">'+
                                    '<a class="like btn btn-mini" href="javascript:void(0)">喜欢（'+i.likes+'）</a>'+
                                    '<a class="unlike btn btn-mini" href="javascript:void(0)">不喜欢（'+i.unlikes+'）</a>'+
                                    '<a class="more hide btn btn-mini" href="javascript:void(0)">更多</a></div></div>'+
                            '</div>'+
                           '</li>';
                list.push([i.likes,$(html)]);
            }
            //排序
            list.sort(function(a,b){return b[0] - a[0];});
            
            var returnStr = "";
            var showCount = 5;
            if(list.length < showCount) {
                showCount = list.length;
            }
            for (var i = 0; i < showCount; i += 1) {
                returnStr += $('<a>').append(list[i][1].clone()).html(); 
            };

            callBack(returnStr);
        });
    }
}
