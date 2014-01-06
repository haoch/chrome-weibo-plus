//console.log($CONFIG);
(function(){

    var DEBUG = true;
    var log = function(msg){
        if(DEBUG) console.log(msg);
    }

    // ========================================
    // Additional TOP priority css stylesheets
    // ========================================
    var $CSS={
        ".WB_feed .WB_feed_type":{
            "margin":"0",
            "padding":"20px 10px",
            "border-bottom":"1px solid #e8e8e8"
        },
        ".WB_feed .WB_detail":{
            
        },
        ".W_main":{
            "background-image":"none",
            // "background-color":"#fff"
        },
        ".B_index .W_main_l":{
            "padding":"0 0"
        },
        ".B_index .group_read":{
            "margin":"0 0 11px"
        },
        ".global_footer":{
            "background-color":"none",
            "background-image":"none",
            "color":"#808080"
        },
        ".WB_feed .WB_feed_datail":{
            "border-bottom":"none",
            "padding": 0
        },
        ".W_tabarrow_big":{"display":"none"}
    };

    var $EVENT={
        ".WB_feed_type":{
            /*
            "mousedown":function(e){
                $(this).find('[action-type=feed_list_comment]').click();
                // $(this).clearQueue();
            },*/
            "dblclick":function(){
                var mid = $(this).attr('mid');
                //data.weibo.add_readed(mid);
                $(this).slideUp();
                // $(this).find("[action-type='feed_list_shield']").click();
                // log($(this).find("[action-type='feed_list_shield']"));

                // $(this).find("[action-type='feed_list_shield']").click();
                // $(this).find("[action-type='feed_list_shield_by_mid']").click();
                // log($(this).find("[action-type='feed_list_shield_by_mid']"));
                // $(this).find("[action-type='feed_list_shield_by_mid']").click();
            }
        },
        /*
        "#pl_content_homeFeed":{
            "click":function(){
                $(".WB_feed_type").on('dblclick',$EVENT[".WB_feed .WB_feed_type"]['dblclick']);
            }
        },
        */
        ".gn_setting[node-type=editor]":{
            "click":function(){
                $("#pl_content_publisherTop").show();
            }
        }
    }

    var data={
        weibo:{
            add_readed:function(id){
                chrome.storage.sync.get(function(items){
                    var readed = items["weibo.readed"];
                    if(chrome.runtime.lastError){
                        log("Error:"+chrome.runtime.lastError);
                    }
                    if(!readed){
                        readed = [];
                    }
                    if(readed.indexOf(id) >-1){
                        log("Already added:"+id)
                        return;
                    }
                    log("Readed:"+id);
                    readed.push(id);
                    chrome.storage.sync.set({"weibo.readed":readed},function(){
                        if(chrome.runtime.lastError){
                            log("Error:",chrome.runtime.lastError);
                        }
                    })
                });
            },
            get_readed:function(callback){
                chrome.storage.sync.get(function(items){
                    if(chrome.runtime.lastError){
                        console.log("Error:",runtime.lastError);
                    }
                    callback(items["weibo.readed"]);
                })
            }
        }
    };

    var that={
        init:function(){
            that._style();
            that._event();
            that._hotkey();

            that._job();
            return that;
        },
       _style:function(){
            for(var sel in $CSS){
                $(sel).css($CSS[sel]);
            }
        },
        _job:function(handler){
            var action = function(){
                log("backgroud job running ...");
                that._style();
                that._event();
                /*
                var current_feeds = $(".WB_feed_type[mid]")
                log("current feeds num: "+current_feeds.length);
                var unreaded_num = 0;
                if(current_feeds.length>0){
                    data.weibo.get_readed(function(ids){
                        current_feeds.each(function(i){
                            var ele = $(this).next();
                            if(!ele || ele.hasClass("data-readed-handled")) return;
                            ele.addClass("data-readed-handled");
                            var mid = ele.attr('mid');
                            if(mid && ids.indexOf(mid)>0){
                                if(handler && typeof handler == 'function')
                                    handler($(".WB_feed_type[mid='"+mid+"']"));
                                else
                                    $(".WB_feed_type[mid='"+mid+"']").hide();
                            }else{
                                unreaded_num++;
                            }
                        });
                        log("unreaded feeds num: "+unreaded_num+"/"+current_feeds.length);
                    });
                }*/
            };
            setTimeout(action,500);
            var schd = setInterval(action,3000);
        },
        _event:function(){
            for(var i in $EVENT){
                log("Initializing events: "+i);
                for(var j in $EVENT[i]){
                    $(i).on(j,$EVENT[i][j])
                }
            }
        },
        _hotkey:function(){
        }
    }
    return that.init();
})()