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
    console.log("exshanbay:enter");
    if(typeof ReviewView != undefined){
        console.log("exshanbay:find review view");
        ReviewView.prototype.render_detail= function () {
                stop_spin();
                var review_detail_view = new ReviewDetailView({
                    model: this.model
                });
                //==============here we can do what we want======
                $(".note-user-box-tab").click();
                $(".ex-user-box-tab").click();
                //===============================================
                review_detail_view.bind('next', this.next, this);
                review_detail_view.bind('prev', this.prev, this);
        };
    }
    else
    {
        console.log("exshanbay:could not find review view");
    }
}
