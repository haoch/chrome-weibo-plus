//console.log($CONFIG);
(function(){
    var that={
        init:function(){
            that._style();
            that._hotkey();
        },
       _style:function(){
            $(".W_main").css({
                "background-image":"none",
                // "background-color":"#fff"
            })
            $(".B_index .W_main_l").css({
                "padding":"0 0"
            });
            // $(".W_main_c").css("width","800px");
            $(".global_footer").css({
                "background-color":"none",
                "background-image":"none",
                "color":"#808080"
            });
        },
        _event:function(){
            $('.gn_setting["node-type"="editor"]').on('click',function(){
                $("#pl_content_publisherTop").show();
            });
        },
        _hotkey:function(){
        }
    }
    return that.init();
})()
