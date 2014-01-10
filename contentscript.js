//console.log($CONFIG);
(function(){

    var DEBUG = true, LOCK =false;
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
		  ".B_index .W_main_c":{
			  "padding-top":"0px"
		  },
        ".B_index .group_read":{
            "margin":"0 0 11px"
        },
        "#Box_right":{
            "width":"215px",
            "margin-right":"-10px",
            "position":"relative"
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
        ".W_tabarrow_big":{"display":"none"},
        ".WB_feed a.notes":{
            "background-color":"#f5f5f5",
            "border-bottom":"1px solid #e8e8e8",
            "border-top":"1px solid #e8e8e8",
            "margin":"0 0"
        },
		".B_index .send_weibo":{
		    "padding": "0 10px 11px"
		},
		".send_weibo .input":{
			"height":"35px"
		},
		".send_weibo .input .input_detail":{
			"height":"30px"
		}
    };
	 
    var $EVENT={
        ".WB_feed_type":{
				"click":function(){
                var mid = $(this).attr('mid');
                $DATA.weibo.add_readed(mid);
					 $(this).removeClass("WB_feed_new");
            },
            "dblclick":function(){
                var mid = $(this).attr('mid');
                $DATA.weibo.add_readed(mid);
                $(this).slideUp();
            }
        },
		 ".send_weibo .input":{
			 "focusin":function(){
				 LOCK=true;
				 $(this).css("height","");
				 $("#pl_content_publisherTop .func_area").fadeIn();
				 $(".send_weibo .input .input_detail").css("height","");
			 },
			 "focusout":function(){
				if($(this).find("textarea").val().length > 0) {
					LOCK =true;
					$(this).addClass("clicked");
					return;
				}
				LOCK=false;
				$(this).css("height","35px");
	  			$(".send_weibo .input .input_detail").css("height","30px");
				$("#pl_content_publisherTop .func_area").hide();
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

    var $DATA={
        weibo:{
			  cache:{
				  readed:null,
				  new_added_cnt:0
			  },
			  storage_sync:{
				  schd:null
			  },
            add_readed:function(id){
					if(!id) return;
					
					var _add_readed=function(readed){
                  if(!readed){
                      readed = [];
                  }
						log(readed.indexOf(id))
                  if(readed.indexOf(id) >-1){
                      log("Already added:"+id)
                      return;
                  }
                  readed.push(id);
						log("Add "+id+" at index of:"+$DATA.weibo.cache.readed.indexOf(id));
						
						$DATA.weibo.cache.readed = readed
						$DATA.weibo.cache.new_added_cnt ++;
						
                  log("Readed: "+id);
						log("New: "+$DATA.weibo.cache.new_added_cnt)
						
						if(!$DATA.weibo.storage_sync.schd){
							log("sync to storage ...")
							var sync_func = function(){
								if($DATA.weibo.cache.new_added_cnt = 0) return
								log("Storage synchronizing, new added: "+$DATA.weibo.cache.new_added_cnt);
		                  chrome.storage.sync.set({"weibo.readed":readed},function(){
		                      if(chrome.runtime.lastError){
		                          log("Error:"+chrome.runtime.lastError.message);
										  return
		                      }
									 $DATA.weibo.cache.new_added_cnt = 0;
		               	})
							}
							sync_func();
							$DATA.weibo.storage_sync.schd = setInterval(sync_func,6000);
						}else{
							log("Nothing for sync");
						}
					}

					if($DATA.weibo.cache.readed){
						_add_readed($DATA.weibo.cache.readed);
					}else{
                  chrome.storage.sync.get(function(items){
						 	if(chrome.runtime.lastError){
                     	log("Error:"+chrome.runtime.lastError);
                     	return
							}
							 var readed = items["weibo.readed"] || [];
                      $DATA.weibo.cache.readed = readed;
                      _add_readed($DATA.weibo.cache.readed);
                  });
					}
            },
            get_readed:function(callback){
					if($DATA.weibo.cache.readed){
						 callback($DATA.weibo.cache.readed);
					}else{
	                chrome.storage.sync.get(function(items){
	                    if(chrome.runtime.lastError){
	                       log("Error:",runtime.lastError);
	                    	  return
							  }
							  $DATA.weibo.cache.readed = items["weibo.readed"] || []
	                    callback($DATA.weibo.cache.readed );
	                })
				 	}
            }
        }
    };

    var that={
        init:function(){
            that._html();
            that._style();
            that._event();
            that._hotkey();
            that._job();
            return that;
        },
       _html:function(){
            log("rm #Box_right");
            log("loading content");
       },
       _style:function(){
            for(var sel in $CSS) $(sel).css($CSS[sel]);
				$(".send_weibo .input .input_detail").attr("placeholder","分享微博新鲜事")
        },
        _job:function(handler){
            var action = function(){
                log("backgroud job running ...")
					 if(LOCK) return;
                that._style();
                that._event();
					 // deal with readed weibo
					 $DATA.weibo.get_readed(function(data){
						 if(!this) return
						 log("Loaded data")
						 log(data)
						 $(".WB_feed_type").each(function(index){
							 log(data.indexOf($(this).attr('mid'))+" -> "+$(this).attr('mid'))
							 if(data.indexOf($(this).attr('mid')) < 0 ){
								 log($(this).attr('mid')+" is un-readed")
								 $(this).addClass('WB_feed_new')
							 }
						 });
					 });
            };
            setTimeout(action,1000);
            var schd = setInterval(action,4000);
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