//console.log($CONFIG);
(function(){
    var DEBUG = true;
    var log = function(msg){
        if(DEBUG) console.log(msg);
    }
    var data={
        weibo:{
            add_readed:function(id){
                chrome.storage.sync.get(function(items){
                    var readed = items["weibo.readed"];
                    if(chrome.runtime.lastError){
                        log("Error:"+runtime.lastError);
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
                            log("Error:"+runtime.lastError);
                        }
                    })
                });
            },
            get_readed:function(callback){
                chrome.storage.sync.get(function(items){
                    if(chrome.runtime.lastError){
                        console.log("Error:"+runtime.lastError);
                    }
                    callback(items["weibo.readed"]);
                })
            }
        }
    };
    var that={
        init:function(){
            that._style();
            that._handler_readed();
            that._event();
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
        _handler_readed:function(){
            var _READED_INIT_HANDLED=false;
            var schd= null;
            var action=function(){
                log("handling readed");
                data.weibo.get_readed(function(ids){
                    if(!ids) return;
                    if(ids.length==0) _READED_INIT_HANDLED = true;

                    ids.forEach(function(i){
                        if($(".WB_feed_type[mid='"+i+"']").length){
                            _READED_INIT_HANDLED = true;
                        }
                        $(".WB_feed_type[mid='"+i+"']").slideUp();
                        //$(".WB_feed_type[mid='"+i+"']").css({"background-color":"red"});
                    });
                    if(_READED_INIT_HANDLED){
                        clearInterval(schd);
                        var note = $('<a node-type="feed_list_histBar" action-type="feed_list_histBar" class="notes" href="javascript:void(0);" suda-data="key=tblog_home_hist&amp;value=feed_hist_weibo">您已阅读'+ids.length+'条微博，点击查看历史</a>');
                        note.prependTo(".WB_feed");
                        setTimeout(function(){ note.remove(); },3000);
                    }
                });
            }
            action();
            schd = setInterval(action,3000);
        },
        _event:function(){
            $('.gn_setting[node-type="editor"]').on('click',function(){
                $("#pl_content_publisherTop").show();
            });
            var bind_read_event= function(){
                $(".WB_feed_type").on('dblclick',function(){
                    var mid = $(this).attr('mid');
                    data.weibo.add_readed(mid);
                    $(this).slideUp();
                });
            }
            $("#pl_content_homeFeed").on("click",function(e){
                bind_read_event();
            });
        },
        _hotkey:function(){
        }
    }
    return that.init();
})()
