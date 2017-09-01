var G_LOCAL_STORAGE={

    __my_name:"G_LOCAL_STORAGE",

    get:function(k){

        var my_name=this.__my_name;

        var p=store.get(my_name);
        if(p && p[k])
            return p[k];
        return "";
    },

    set:function(k,v){

        var my_name=this.__my_name;


        var p=store.get(my_name);

        if(!p)
        {
            p={};
        }

        p[k]=v;

        store.set(my_name, p);
    },

    getProjectImgUrl:function(project_id){
        return "http://image.thinkinggame.cn/img/project/"+project_id+".png";
    },

    setGasCrawlerInfoAndGasAppsIntoBuff:function(project_id, gas_crawler_info , gas_apps, proj_forms_date_span)
    {
        if(!(gas_crawler_info in this.user))
        {
            this.user.gas_crawler_info={};
        }

        if(!(gas_apps in this.user))
        {
            this.user.gas_apps={};
        }

        if(!(proj_forms_date_span in this.user))
        {
            this.user.proj_forms_date_span={};
        }

        this.user.gas_crawler_info[project_id]=gas_crawler_info;

        this.user.gas_apps[project_id]=gas_apps;

        this.user.proj_forms_date_span[project_id]=proj_forms_date_span;

        this.set("user", G_LOCAL_STORAGE.user);

        var gas_crawler_info_gas_apps = this.get("gas_crawler_info_gas_apps");

        var _new={
                gas_crawler_info:gas_crawler_info,
                gas_apps:gas_apps,
                proj_forms_date_span:proj_forms_date_span,
                timeout:(new Date()).getTime()+3600*1000 // 超时一小时
        };


        if(!gas_crawler_info_gas_apps)
        {
            gas_crawler_info_gas_apps = {};

            gas_crawler_info_gas_apps[project_id] = _new;
        }
        else if(project_id in gas_crawler_info_gas_apps)
        {
            gas_crawler_info_gas_apps[project_id] = _new;
        }
        else
        {
            var cur_cnt=0; // 最多保存20个游戏的缓存信息

            var max_cnt=20;

            var timeout_arr=[];

            var _gas_crawler_info_gas_apps={};

            var now=(new Date()).getTime();

            for(var k in gas_crawler_info_gas_apps)
            {
                // 清空已经超时的缓存信息
                if(now>gas_crawler_info_gas_apps[k].timeout)
                {
                    continue;
                }

                if(cur_cnt>=max_cnt)
                {
                    break;
                }

                timeout_arr.push([k, gas_crawler_info_gas_apps[k].timeout]);

                _gas_crawler_info_gas_apps[k]=gas_crawler_info_gas_apps[k];

                cur_cnt++;
            }

            timeout_arr = timeout_arr.sort(function(a,b){
                return b[1]-a[1];
            })

            while(cur_cnt>=max_cnt)
            {
                var k=timeout_arr.pop()[0];

                var _new_gas_crawler_info_gas_apps = {};

                for(var each_key in _gas_crawler_info_gas_apps)
                {
                    if(each_key==k)// 删除掉最快会超时的那个
                        continue;
                    _new_gas_crawler_info_gas_apps[each_key]=_gas_crawler_info_gas_apps[each_key];
                }

                _gas_crawler_info_gas_apps=_new_gas_crawler_info_gas_apps;

                cur_cnt--;
            }

            _gas_crawler_info_gas_apps[project_id] = _new;

            gas_crawler_info_gas_apps=_gas_crawler_info_gas_apps;
        }

        this.set("gas_crawler_info_gas_apps",gas_crawler_info_gas_apps);

    },

    testExistCasCrawlerInfoAndGasAppsFromBuff:function(project_id){
        var p = this.get("gas_crawler_info_gas_apps");

        if(p)
        {
            var _buf=null;

            if(project_id in p)
            {
                _buf=p[project_id];
            }
            else if(project_id+'' in p)
            {
                _buf=p[project_id];
            }
            else
            {
                return false;
            }


            if( _buf.timeout < (new Date()).getTime() )
            {
                return false;
            }
            else
            {
                if(!('gas_crawler_info' in this.user))
                {
                    this.user.gas_crawler_info = {};
                }

                if(!('gas_apps' in this.user))
                {
                    this.user.gas_apps = {};
                }

                this.user.gas_crawler_info[project_id]=_buf["gas_crawler_info"];
                this.user.gas_apps[project_id]=_buf["gas_apps"];

                return true;
            }
        }
        else
        {
            return false;
        }

    },

    GetProjectName:function(project_id){
        if(!this.get("user") || !this.get("user").gas_projects )
        {
            return "";
        }

        var gas_projects=this.get("user").gas_projects;

        for(var i=0; i<gas_projects.length; ++i)
        {
            if(gas_projects[i].project_id == project_id)
                return gas_projects[i].project_name;
        }

        return "";
    },
    LastChosenProjectId:function(){
        return G_LOCAL_STORAGE.get("LastChosenProjectId") || DemoProjectId();
    },
    SetLastChosenProjectId:function(project_id){
        G_LOCAL_STORAGE.set("LastChosenProjectId",project_id);
    },
    getSource:function(source_type){

        source_type = parseInt(source_type);

        if("gas_source_dim" in this.user)
        {
            for(var i=0; i<this.user.gas_source_dim.length; ++i)
            {
                if(this.user.gas_source_dim[i].source_type==source_type)
                {
                    return this.user.gas_source_dim[i];
                }
            }
        }

        return null;
    },
    user:{
        gas_crawler_info:{},
        gas_apps:{}
    },
    GasChatInfoServlet:{
        _make_post:function(){
            var _post={};
            _post.page=this.page;
            _post.limit=this.num_per_page+1;
            _post.index=(this.page-1)*_post.limit;
            return _post;
        },
        page:1,
        page_num:1,
        num_per_page:12
    },
    PopChannelQueryCommentsServlet:{
        _reset:function(){
            this.page=1;
            this.page_num=1;
            this.num_per_page=5;
            this.order_by={
                "publish_time":"desc"
            };
            this.source_type_list="";
            this.data_date_start="";
            this.data_date_end="";
            this.es_field_name="";
            this.es_field_val="";
            this.keywords="";
            this.lighttower_classify="";
            this.sentiment_keywords="";
            this.lighttower_tags="";
        },
        _make_post:function(project_id){
            var _post={};
            _post.page=this.page;
            _post.limit=this.num_per_page;
            _post.index=(this.page-1)*_post.limit;
            _post.data_date_start=this.data_date_start;
            _post.data_date_end=this.data_date_end;
            _post.project_id=project_id;
            _post.query_or_term="query";
            _post.keywords=this.keywords;
            _post.es_field_name=this.es_field_name;
            _post.es_field_val=this.es_field_val;

            var _source_type_list=this.source_type_list+"";

            _post.source_type_list=(!this.source_type_list ? "" : $.map(_source_type_list.split(","),function(e){return parseInt(e);}).join(','));
            _post.lighttower_classify=this.lighttower_classify;
            _post.classify_sentiment=this.classify_sentiment;
            _post.sentiment_keywords=this.sentiment_keywords;
            _post.lighttower_tags=this.lighttower_tags;

            for (var k in this.order_by)
            {
                if(this.order_by[k]!="")
                {
                    _post.order_by_field=k;
                    _post.order_type=this.order_by[k];
                    break;
                }
            }
            return _post;
        },
        page:1,
        page_num:1,
        num_per_page:5,
        es_field_name:"",
        es_field_val:"",
        keywords:"",
        order_by:{
            "publish_time":"desc"
        },
        source_type_list:"",
        lighttower_classify:"",
        classify_sentiment:"",
        sentiment_keywords:"",
        lighttower_tags:""
    },
    ChannelQueryCommentsServlet:{
        _make_post:function(project_id){
            var _post={};
            _post.page=this.page;
            _post.limit=this.num_per_page;
            _post.index=(this.page-1)*_post.limit;
            _post.data_date_start=$(".search-bar").find('[name=data_date_start]').val();
            _post.data_date_end=$(".search-bar").find('[name=data_date_end]').val();
            _post.project_id=project_id;
            _post.keywords=$(".search-bar").find('[name=keywords]').val();
            _post.query_or_term="query";
            _post.rating_stage_list=this.filter.rating_stage_list;
            _post.source_type_list=this.filter.source_type_list;
            _post.sentiment_keywords =this.sentiment_keywords ;
            for (var k in this.order_by)
            {
                if(this.order_by[k]!="")
                {
                    _post.order_by_field=k;
                    _post.order_type=this.order_by[k];
                    break;
                }
            }
            return _post;
        },
        page:1,
        page_num:1,
        num_per_page:12,
        order_by:{
            "publish_time":"desc",
            "reply_num":""
        },
        filter:{
            "rating_stage_list":"",
            "source_type_list":""
        },
        rating_stage_list:"",
        source_type_list:"",
        sentiment_keywords:"",
        _last_filter:null,
        _cur_filter:null,
        _equal_filter:function(f1, f2)
        {
            for(var k in f1)
            {
                if(!f2)
                {
                    return false;
                }

                if(!(k in f2))
                {
                    return false;
                }

                if(f1[k]!=f2[k])
                {
                    return false;
                }
            }


            return true;
        }
    },
    PopChatQueryPostsServlet:{
        _make_post:function(){
            var _post={};
            _post.info_id=this.info_id;
            _post.index=this.index;
            _post.limit=this.limit;
            _post.qq_id=this.qq_id;
            _post.author=this.author;
            _post.keywords=this.keywords;
            _post.source_type=this.source_type;
            return _post;
        },
        info_id:0,
        index:0,
        limit:10,
        qq_id:"",
        author:"",
        source_type:"",
        keywords:"",
        _reset:function(){
            this.index = 0;
            this.info_id = 0;
            this.qq_id = "";
            this.author = "";
            this.keywords = "";
            this.source_type = "";
        },
        _query:function(callback, onloading, ondone, onfailure)
        {
            var p=this._make_post();
            MyPost(G_CGI_URL.chat.ChatQueryPostsServlet,
                p,
                function(){if(onloading){ onloading() }else { ShowLoading();} },
                function(){if(ondone){ ondone() }else { HideLoading();} },
                function(data){
                    callback && callback(data, p.keywords);
                },
                function(){
                    if(onfailure)
                        onfailure();
                    else
                        G_PopWnd.error("加载聊天记录失败");
                });
        }
    },
    ChatQueryPostsServlet:{
        _make_post:function(){
            var _post={};
            _post.info_id=this.info_id;
            _post.index=this.index;
            _post.limit=this.limit;
            _post.qq_id=this.qq_id;
            _post.author=this.author;
            _post.source_type=this.source_type;
            return _post;
        },
        info_id:0,
        index:0,
        limit:10,
        qq_id:"",
        author:"",
        source_type:"",
        _reset:function(){
            this.index = 0;
            this.info_id = 0;
            this.qq_id = "";
            this.author = "";
            this.source_type = "";
        },
        _query:function(callback, onloading, ondone, onfailure)
        {
            var p=this._make_post();
            MyPost(G_CGI_URL.chat.ChatQueryPostsServlet,
                    p,
                    function(){if(onloading){ onloading() }else { ShowLoading();} },
                    function(){if(ondone){ ondone() }else { HideLoading();} },
                    function(data){
                        callback && callback(data);
                    },
                    function(){
                        if(onfailure)
                            onfailure();
                        else
                            G_PopWnd.error("加载聊天记录失败");
                    });
        }
    },
    ForumQueryPostsServlet:{
        _make_post:function(project_id){
            var _post={};
            _post.page=this.page;
            _post.limit=this.num_per_page;
            _post.index=(this.page-1)*_post.limit;
            _post.data_date_start=$(".search-bar").find('[name=data_date_start]').val();
            _post.data_date_end=$(".search-bar").find('[name=data_date_end]').val();
            _post.topic_word_list="";
            _post.project_id=project_id;
            _post.keywords=$(".search-bar").find('[name=keywords]').val();
            _post.info_id_list=this.filter.info_id_list;
            _post.topic_id="";
            _post.query_or_term="query";
            _post.sentiment_score="";
            for (var k in this.order_by)
            {
                if(this.order_by[k]!="")
                {
                    _post.order_by_field=k;
                    _post.order_type=this.order_by[k];
                    break;
                }
            }
            return _post;
        },
        page:1,
        page_num:1,
        num_per_page:20,
        order_by:{
            "publish_time":"desc",
            "reply_num":""
        },
        filter:{
            "info_id_list":""
        },
        _last_filter:null,
        _cur_filter:null,
        _equal_filter:function(f1, f2)
        {
          for(var k in f1)
          {
              if(!f2)
              {
                  return false;
              }

              if(!(k in f2))
              {
                  return false;
              }

              if(f1[k]!=f2[k])
              {
                  return false;
              }

              return true;
          }
        }
    },
    PopForumQueryPostsServlet:{
        _reset:function(){
            this.page=1;
            this.page_num=1;
            this.num_per_page=10;
            this.order_by={
                "publish_time":"desc",
                "reply_num":""
            };
            this.info_id_list="";
            this.keywords="";
            this.topic_id="";
            this.topic_word_list="";
            this.sentiment_score="";
            this.data_date_start="";
            this.data_date_end="";
            this.lighttower_classify="";
            this.lighttower_tags="";
            this.useless_classify="";
        },

        _make_post:function(project_id){
            var _post={};
            _post.page=this.page;
            _post.limit=this.num_per_page;
            _post.index=(this.page-1)*_post.limit;
            _post.data_date_start=this.data_date_start;
            _post.data_date_end=this.data_date_end;
            _post.topic_word_list="";
            _post.project_id=project_id;
            _post.keywords=this.keywords;
            _post.info_id_list=this.info_id_list;
            _post.topic_id=this.topic_id;
            _post.topic_word_list=this.topic_word_list;
            _post.query_or_term="query";
            _post.sentiment_score=this.sentiment_score;
            _post.lighttower_classify=this.lighttower_classify;
            _post.classify_sentiment=this.classify_sentiment;
            _post.lighttower_tags=this.lighttower_tags;
            _post.useless_classify=this.useless_classify;

            for (var k in this.order_by)
            {
                if(this.order_by[k]!="")
                {
                    _post.order_by_field=k;
                    _post.order_type=this.order_by[k];
                    break;
                }
            }
            return _post;
        },
        page:1,
        page_num:1,
        num_per_page:10,
        order_by:{
            "publish_time":"desc",
            "reply_num":""
        },
        info_id_list:"",
        keywords:"",
        topic_id:"",
        topic_word_list:"",
        sentiment_score:"",
        data_date_start:"",
        data_date_end:"",
        lighttower_classify:"",
        classify_sentiment:"",
        lighttower_tags:"",
        useless_classify:""
    },
    __ForumQueryPostsServlet:function (_post, _loading, _failure, _done, after_callback, _on_end, _on_empty)
    {
        if(_loading.is(":visible")) // 上次请求正在进行中
            return;

        MyPost(G_CGI_URL.forum.ForumQueryPostsServlet,
            _post,
            function()
            {
                _loading.show();
                _failure.hide();
                _done.hide();
            },
            function()
            {
                _done.show();
                _failure.hide();
                _loading.hide();

                _on_end && _on_end();
            },
            function(data)
            {
                data=data.data;

                _done.show();

                var tb=_done.find("[name=list]");

                tb.find(".order-by").find(".icon").removeClass("asc").removeClass("desc");
                tb.find(".order-by[name="+_post.order_by_field+"]").find(".icon").addClass(_post.order_type);

                if(data.list.length==0 && _post.page==1)
                {
                    _done.children().hide();
                    _done.find(".hint").show(); // 只显示找到0条记录的提示
                    _done.find(".hint").find(".empha").html(0);

                    _on_empty && _on_empty();
                    return;
                }

                _done.children().show();

                tb.find("tr:gt(0)").remove();

                for(var i=0; i<data.list.length; ++i)
                {
                    var im_keywords=_post.topic_word_list ? _post.topic_word_list : _post.keywords;


                    var cur=data.list[i];

                    if( !im_keywords && ('lighttower_keywords' in cur.source) && _post.lighttower_classify)
                    {
                        // 客服:A/B/C,入坑:D
                        var ar=cur.source['lighttower_keywords'].split(',');

                        for(var j=0; j<ar.length; ++j)
                        {
                            if(ar[j].split(':')[0]==_post.lighttower_classify)
                            {
                                //im_keywords=ar[j].split(':')[1].split('/').join(' ');
                                im_keywords+=ar[j].split(':')[1]+" ";
                            }
                        }
                    }

                    im_keywords = im_keywords.trim();


                    if(_post.lighttower_tags)
                    {
                        if(!im_keywords)
                        {
                            im_keywords=_post.lighttower_tags;
                        }
                        else
                        {
                            im_keywords+=" "+_post.lighttower_tags;
                        }
                    }

                    var img_url_icon="";

                    if('attach_content' in cur.source)
                    {
                        if(cur.source.attach_content.indexOf("img_url")>=0)
                        {
                            img_url_icon="<span style='float:left;background:transparent url(http://image.thinkinggame.cn/img/forum/pic.png) no-repeat center center;background-size:17px;'>&nbsp;&nbsp;&nbsp;&nbsp;</span>"
                        }
                    }

                    var useless_classify = ( "useless_classify" in cur.source ) ? cur.source["useless_classify"] : "" ;

                    var useless_cont="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";

                    if(useless_classify == "已删帖")
                    {
                        useless_classify="<span class='trash del' title='已删贴'>"+useless_cont+"</span>";
                    }
                    else if(useless_classify=="广告")
                    {
                        useless_classify="<span class='trash adv' title='广告贴'>"+useless_cont+"</span>";
                    }
                    else if(useless_classify=="水贴")
                    {
                        useless_classify="<span class='trash water' title='水贴'>"+useless_cont+"</span>";
                    }
                    else if(useless_classify=="垃圾")
                    {
                        useless_classify="<span class='trash garbige' title='无用贴'>"+useless_cont+"</span>";
                    }
                    else
                    {
                        useless_classify = "" ;
                    }

                    tb.append($('<tr></tr>')
                            .append($('<td title="'+cur.source['title']+'"><div style="float:left;max-width:370px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap">'
                                +useless_classify+EmphaSizeKeywords(im_keywords,cur.source['title'])
                                +'</div>&nbsp;'+img_url_icon+'</td>').click((function(data, im_keywords, info_id, title_id){
                                return function(){G_LOCAL_STORAGE.PopForumQueryReplyPostsServlet(true, data, im_keywords, info_id, title_id)};
                            })(JSON.stringify(cur), im_keywords, cur.source.info_id, cur.source.title_id)))
                            .append($('<td><div style="max-width: 130px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="'+cur.source["crawler_name"]+'">'+cur.source['crawler_name']+'</div>'+'</td>'))
                            .append($('<td>'+cur.source['reply_num']+'</td>'))
                            .append($('<td>'+cur.source['author']+'</td>'))
                            .append($('<td>'+cur.source['publish_time']+'</td>'))
                    );
                }

                _done.find(".hint").find(".empha").html(addCommas(data.total));

                if(after_callback)
                {
                    G_LOCAL_STORAGE.PopForumQueryPostsServlet.page_num=Math.ceil(data.total/G_LOCAL_STORAGE.PopForumQueryPostsServlet.num_per_page);

                    GenPageFooter(_done.find('.page_footer_holder'), G_LOCAL_STORAGE.PopForumQueryPostsServlet.page_num, _post.page,
                        function(newpage){

                            G_LOCAL_STORAGE.PopForumQueryPostsServlet.page=parseInt(newpage);

                            var _post=G_LOCAL_STORAGE.PopForumQueryPostsServlet._make_post(GetProjectId());

                            var _loading=$(".loading[name=PopForumQueryPostsServlet]");
                            var _failure=$(".failure[name=PopForumQueryPostsServlet]");
                            var _done=$(".done[name=PopForumQueryPostsServlet]");


                            G_LOCAL_STORAGE.__ForumQueryPostsServlet(_post, _loading, _failure, _done, after_callback);
                        });

                    after_callback(data);
                }
                else
                {
                    G_LOCAL_STORAGE.ForumQueryPostsServlet.page_num=Math.ceil(data.total/G_LOCAL_STORAGE.ForumQueryPostsServlet.num_per_page);

                    GenPageFooter(_done.find('.page_footer_holder'), G_LOCAL_STORAGE.ForumQueryPostsServlet.page_num, _post.page,
                        function(newpage){

                            G_LOCAL_STORAGE.ForumQueryPostsServlet.page=parseInt(newpage);

                            var _post=G_LOCAL_STORAGE.ForumQueryPostsServlet._make_post(GetProjectId());

                            var _loading=$(".loading[name=ForumQueryPostsServlet]");
                            var _failure=$(".failure[name=ForumQueryPostsServlet]");
                            var _done=$(".done[name=ForumQueryPostsServlet]");

                            G_LOCAL_STORAGE.__ForumQueryPostsServlet(_post, _loading, _failure, _done);
                        });
                }

            },
            function()
            {
                _done.hide();
                _loading.hide();
                _failure.show();
            }
        );
    },
    PopForumQueryReplyPostsServlet:function(start_over, data, im_keywords, info_id, title_id)
    {
        if(start_over)
        {
            G_LOCAL_STORAGE.ForumQueryReplyPostsServlet._reset();


            $("[name=ForumQueryReplyPostsServlet] .floors").find(".floor").remove();
            $("[name=ForumQueryReplyPostsServlet] .floors").find(".floor_one_req").remove();

            data=$.parseJSON(data);


            var floor=$('[name=ForumQueryReplyPostsServlet]').find(".floor-sample .floor").eq(0).clone();

            floor.find("[name=attach_content]").html("");

            for(var k in data.source)
            {
                if(k=='content' || k=='title')
                {
                    data.source[k]=EmphaSizeKeywords(im_keywords, data.source[k]);
                    $('[name=ForumQueryReplyPostsServlet]').find("[name="+k+"]").html(data.source[k]);
                }
                else if(k=="from_url")
                {
                    $('[name=ForumQueryReplyPostsServlet]').find("[name="+k+"]").attr('href', data.source[k]);
                    $('[name=ForumQueryReplyPostsServlet]').find("[name="+k+"]").html(data.source[k]);
                }
                else if(k!='attach_content')
                {
                    $('[name=ForumQueryReplyPostsServlet]').find("[name="+k+"]").html(data.source[k]);
                }


            }

            if("attach_content" in data.source)
            {
                var attach_contents=[];
                try{
                    var s=decodeURIComponents(data.source["attach_content"]);
                    eval("attach_contents="+s);
                }
                catch(e)
                {

                }

                for(var l=0; l<attach_contents.length; ++l)
                {
                    for(var attach_content_key in attach_contents[l])
                    {
                        switch(attach_content_key)
                        {
                            case "img_url":
                                var img_url=attach_contents[l][attach_content_key];

                                $("<div style='display:inline-block;cursor:pointer;margin-right:4px' img_url='"+img_url+"'></div>").appendTo(floor.find("[name=attach_content]"));

                                break;

                        }
                    }
                }
            }

            for(var k in data.source)
            {
                if(k!="attach_content")
                {
                    floor.find("[name="+k+"]").html(data.source[k]);
                }
            }

            floor.addClass("lz").appendTo($("[name=ForumQueryReplyPostsServlet] .floors"));


        }

        try
        {


            var _more=$('[name=ForumQueryReplyPostsServlet]').find(".more");
            var _done=$('[name=ForumQueryReplyPostsServlet]').find(".done");
            var _loading=$('[name=ForumQueryReplyPostsServlet]').find(".loading2");

            MyPost(G_CGI_URL.forum.ForumQueryReplyPostsServlet,
                G_LOCAL_STORAGE.ForumQueryReplyPostsServlet._make_post(GetProjectId(), info_id, title_id),
                function()
                {
                    if(start_over)
                    {
                        ShowLoading();
                    }
                    else
                    {
                        _more.hide();
                        _done.hide();
                        _loading.show();
                    }
                },
                function()
                {
                    if(start_over)
                    {
                        HideLoading();
                    }
                    else
                    {
                        _loading.hide();
                    }
                },
                function(data)
                {
                    data=data.data;

                    if(data.list.length<G_LOCAL_STORAGE.ForumQueryReplyPostsServlet.limit)
                    {
                        _more.hide();
                        _done.show();
                        _loading.hide();
                    }
                    else
                    {
                        _more.show();
                        _done.hide();
                        _loading.hide();
                    }


                    function AdjustHeight()
                    {
                        if(start_over)
                        {
                            var _wh=$(window).height();
                            var max_height=$('[name=js_ForumQueryReplyPostsServlet]').height();


                            max_height+=$('[name=ForumQueryReplyPostsServlet]').find("[img_url]").length*200;

                            if(max_height>_wh-300)
                                max_height=_wh-300;

                            G_PopWnd.dialog("帖子详情",$('[name=js_ForumQueryReplyPostsServlet]').html(), "", max_height, "", 4);
                        }

                        $('[name=ForumQueryReplyPostsServlet]:visible').find(".more").find('button').unbind('click').click(function(){
                            G_LOCAL_STORAGE.PopForumQueryReplyPostsServlet(false, data, im_keywords, info_id, title_id)
                        });

                        $('[name=ForumQueryReplyPostsServlet]:visible').find("[img_url]").each(function(){
                            if($(this).find("iframe").length==0)
                            {
                                var img_url=$(this).attr("img_url");

                                var id="iframe"+$("iframe").length;

                                $('<iframe id="'+id+'" frameborder=no border=0 src="javascript:\'<!doctype html><html><head><style>*{margin:0;padding:0}</style></head><body><div></div><img  src=\\\''+img_url+'\\\' /></body></html>\'"></iframe>')
                                    .appendTo($(this));
                            }
                        })
                    }

                    if(data.list.length>0)
                    {
                        var floor_one_req=$("<div class='floor_one_req'></div>").hide().appendTo($('[name=ForumQueryReplyPostsServlet] .floors'));

                        var floor=$('[name=ForumQueryReplyPostsServlet]').find(".floor-sample .floor").eq(0);

                        for(var i=0; i<data.list.length; ++i)
                        {
                            var cur=data.list[i];

                            var post_index=++G_LOCAL_STORAGE.ForumQueryReplyPostsServlet.index;

                            post_index+=1; // 从2楼开始

                            post_index+='楼';

                            var _floor=floor.clone();

                            _floor.find("[name=attach_content]").html('');

                            for(var k in cur.source)
                            {
                                if(k=='attach_content')
                                {
                                    var attach_contents=[];
                                    try{
                                        var s=decodeURIComponents(cur.source[k]);
                                        eval("attach_contents="+s);
                                    }
                                    catch(e)
                                    {

                                    }
                                    for(var l=0; l<attach_contents.length; ++l)
                                    {
                                        for(var attach_content_key in attach_contents[l])
                                        {
                                            switch(attach_content_key)
                                            {
                                                case "img_url":
                                                    var img_url=attach_contents[l][attach_content_key];

                                                    $("<div style='display:inline-block;cursor:pointer;margin-right:4px' img_url='"+img_url+"'></div>").appendTo(_floor.find("[name=attach_content]"));

                                                    break;

                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    if(k=='content')
                                    {
                                        cur.source[k] = EmphaSizeKeywords(im_keywords, cur.source[k]);
                                    }

                                    _floor.find("[name="+k+"]").html(cur.source[k]);
                                }
                            }

                            _floor.find("[name=post_index]").html(post_index);

                            _floor.appendTo(floor_one_req);
                        }

                        floor_one_req.slideDown(function(){

                            AdjustHeight();

                        });



                    }
                    else
                    {
                        AdjustHeight();
                    }







                },
                function(data, msg, code)
                {
                    // ??
                }
            );

        }
        catch(e)
        {
            G_PopWnd.error("系统异常！");
        }
    },
    ForumQueryReplyPostsServlet:{
        _reset:function(){
            this.index=0;
            this.limit=20;
        },
        _make_post:function(project_id, info_id, title_id){
            var _post={};
            _post.index=this.index;
            _post.limit=this.limit;
            _post.project_id=project_id;
            _post.info_id=info_id;
            _post.title_id=title_id;
            return _post;
        },
        index:0,
        limit:20
    },
    __ChannelQueryCommentsServlet:function (_post, _loading, _failure, _done, after_callback, on_end, on_empty)
    {
        if(_loading.is(":visible")) // 上次请求正在进行中
            return;

        MyPost(G_CGI_URL.channel.ChannelQueryCommentsServlet,
            _post,
            function()
            {
                _loading.show();
                _failure.hide();
                _done.hide();
            },
            function()
            {
                _done.show();
                _failure.hide();
                _loading.hide();
                on_end && on_end();
            },
            function(data)
            {
                data=data.data;

                _done.show();

                var tb=_done.find("[name=list]");


                if(data.list.length==0 && _post.page==1)
                {
                    _done.children().hide();
                    _done.find(".hint").show(); // 只显示找到0条记录的提示
                    _done.find(".hint").find(".empha").html(0);
                    on_empty && on_empty();
                    return;
                }

                _done.children().not(".hint2").show();

                tb.find("tr").remove();

                for(var i=0; i<data.list.length; ++i)
                {
                    var im_keywords=_post.keywords;

                    var cur=data.list[i];

                    if( !im_keywords && ('lighttower_keywords' in cur.source) && _post.lighttower_classify)
                    {
                        // 客服:A/B/C,入坑:D
                        var ar=cur.source['lighttower_keywords'].split(',');

                        for(var j=0; j<ar.length; ++j)
                        {
                            if(ar[j].split(':')[0]==_post.lighttower_classify)
                            {
                                im_keywords=ar[j].split(':')[1].split('/').join(' ');
                                break;
                            }
                        }
                    }

                    if(_post.lighttower_tags)
                    {
                        if(!im_keywords)
                        {
                            im_keywords=_post.lighttower_tags;
                        }
                        else
                        {
                            im_keywords+=" "+_post.lighttower_tags;
                        }
                    }

                    var _row=_done.find("[name=list_sample]").eq(0).clone().show();

                    _done.find("[name=list_sample]").eq(0).hide();

                    for(var k in cur.source)
                    {

                        var no_rating_star=false;

                        if(k=='rating_star')
                        {
                            var star=cur.source[k];

                            cur.source[k]=GenStar(cur.source[k]);

                            if(cur.source['rating_type']==1) // 喜欢、不喜欢、未评价
                            {
                                cur.source[k]=GenLike(1);
                            }
                            else if(cur.source['rating_type']==2)
                            {
                                cur.source[k]=GenLike(2);
                            }
                            else if(cur.source['rating_type']==3)
                            {
                                cur.source[k]=GenLike(3);
                            }
                            else if(cur.source['rating_type']==0)
                            {
                                if(star==0) // 表示该渠道压根没有评论的信息，例如百度助手
                                {
                                    no_rating_star=true;
                                }
                            }
                        }
                        else if(k=="source_type")
                        {
                            _row.find('.source_img').css({
                                'background-image':'url(http://image.thinkinggame.cn/img/source/'+cur.source['source_type']+'.png?)'
                            });
                        }
                        else if(k=="content" || k=="title")
                        {
                            cur.source[k]=EmphaSizeKeywords(im_keywords, cur.source[k]);
                        }

                        if(no_rating_star)
                        {
                            var e=_row.find("[name=rating_star]").html("");

                            if(cur.source["title"]=="")
                            {
                                e.parent().html("").css({
                                    height:8
                                });
                            }
                        }

                        _row.find("[name="+k+"]").html(cur.source[k]);
                    }


                    tb.append($('<tr></tr>').append($('<td></td>').append(_row)));
                }

                _done.find(".hint").find(".empha").html(addCommas(data.total));


                if(after_callback)
                {
                    G_LOCAL_STORAGE.PopChannelQueryCommentsServlet.page_num=Math.ceil(data.total/G_LOCAL_STORAGE.PopChannelQueryCommentsServlet.num_per_page);

                    GenPageFooter(_done.find('.page_footer_holder'), G_LOCAL_STORAGE.PopChannelQueryCommentsServlet.page_num, _post.page,
                        function(newpage){

                            G_LOCAL_STORAGE.PopChannelQueryCommentsServlet.page=parseInt(newpage);


                            var _post=G_LOCAL_STORAGE.PopChannelQueryCommentsServlet._make_post(GetProjectId());


                            G_LOCAL_STORAGE.__ChannelQueryCommentsServlet(_post, _loading, _failure, _done, after_callback);

                            //PopChannelQueryCommentsServlet(false);
                        });

                    after_callback(data);
                }
                else
                {
                    G_LOCAL_STORAGE.ChannelQueryCommentsServlet.page_num=Math.ceil(data.total/G_LOCAL_STORAGE.ChannelQueryCommentsServlet.num_per_page);

                    GenPageFooter(_done.find('.page_footer_holder'), G_LOCAL_STORAGE.ChannelQueryCommentsServlet.page_num, _post.page,
                        function(newpage){

                            G_LOCAL_STORAGE.ChannelQueryCommentsServlet.page=parseInt(newpage);

                            ChannelQueryCommentsServlet(false);
                        });
                }




            },
            function()
            {
                _done.hide();
                _loading.hide();
                _failure.show();
            }
        );
    },
    LayerLoadingIndex:-1,
    LayerLoadingCnt:0
};


function AdjustInCenter()
{
    $("body > div[name=adjustInCenter]").height($(window).height());
    $("body > div[name=adjustInCenter]").width($(window).width());

    setInterval(function(){
        $("body > div[name=adjustInCenter]").height($(window).height());
        $("body > div[name=adjustInCenter]").width($(window).width());
    },200)
}

function SortArrayByKey(ar, k)
{
    return ar.sort(function(a,b){
        return a[k]-b[k];
    });
}

function GetCommProjectId()
{
    var project_id=GetUrlPara("project_id");

    if(!project_id)
    {
        project_id=G_LOCAL_STORAGE.LastChosenProjectId();
    }

    if(!project_id)
    {
        for(var i=0; i<G_LOCAL_STORAGE.get("user").user_proj.length; ++i)
        {
            project_id=G_LOCAL_STORAGE.get("user").user_proj[0].project_id;
            break;
        }
    }

    if(project_id)
    {
        $(".projects").find(".main-bar").attr("project_id", project_id);

        $(".projects").find(".main-bar .project-icon").css({
            'background-image':'url('+G_LOCAL_STORAGE.getProjectImgUrl(project_id)+'),url(img/project/0.png)'
        });

        var project_name=G_LOCAL_STORAGE.GetProjectName(project_id);

        $(".projects").find(".main-bar [name=project_name]").html(project_name);
    }
}

function ReplaceEnter2Space(str)
{
    str=str.replace(/\r\n/g,' ');
    str=str.replace(/\n/g,' ');
    return str;
}

var G_CGI_DIR=(window.location.host.indexOf("127.0.0.1")>=0 || window.location.host.indexOf("192.")>=0) ? "http://"+window.location.host+"/web-server/" : "http://"+window.location.host+"/";



var G_CGI_URL= {
    asider: {
        SubmitOpinionServlet: G_CGI_DIR + 'SubmitOpinionServlet.do'
    },
    auth: {
        LoginServlet: G_CGI_DIR + 'LoginServlet',
        LogoutServlet: G_CGI_DIR + 'LogoutServlet',
        CheckLoginServlet: G_CGI_DIR + 'CheckLoginServlet.do',
        ChangePasswordServlet: G_CGI_DIR + 'ChangePasswordServlet.do',
        UpdateUserProjServlet: G_CGI_DIR + 'UpdateUserProjServlet.do',
        SendSmsCodeServlet: G_CGI_DIR + 'SendSmsCodeServlet',
        CheckMobileUsedServlet: G_CGI_DIR + 'CheckMobileUsedServlet',
        Reg1Servlet: G_CGI_DIR + 'Reg1Servlet',
        Reg2Servlet: G_CGI_DIR + 'Reg2Servlet',
        Reg3Servlet: G_CGI_DIR + 'Reg3Servlet',
        Reg4Servlet: G_CGI_DIR + 'Reg4Servlet',
        Reg5Servlet: G_CGI_DIR + 'Reg5Servlet',
        ResetPasswordServlet: G_CGI_DIR + 'ResetPasswordServlet',
        GetUserRecommendProjectsServlet:G_CGI_DIR + 'GetUserRecommendProjectsServlet',
        GetGasCrawlerInfoAndGasAppsServlet:G_CGI_DIR + 'GetGasCrawlerInfoAndGasAppsServlet',
        UpdateNicknameTip0Servlet:G_CGI_DIR + 'UpdateNicknameTip0Servlet.do',
        UpdateNicknameTip1Servlet:G_CGI_DIR + 'UpdateNicknameTip1Servlet.do',
        UpdateLtTipServlet:G_CGI_DIR + 'UpdateLtTipServlet.do',
        GetProjFormsDateSpanServlet:G_CGI_DIR + 'GetProjFormsDateSpanServlet.do'
    },
    forum: {
        ForumKeywordsDistributeServlet: G_CGI_DIR + 'ForumKeywordsDistributeServlet.do',
        ForumAttitudesDistributeServlet: G_CGI_DIR + 'ForumAttitudesDistributeServlet.do',
        ForumAttitudesGroupDistributeServlet: G_CGI_DIR + 'ForumAttitudesGroupDistributeServlet.do',
        ForumAttitudesGroupDistributeServlet2: G_CGI_DIR + 'ForumAttitudesGroupDistributeServlet2.do',
        ForumForumPostNumDistributeServlet: G_CGI_DIR + 'ForumForumPostNumDistributeServlet.do',
        ForumUselessForumPostNumDistributeServlet: G_CGI_DIR + 'ForumUselessForumPostNumDistributeServlet.do',
        ForumQueryPostsServlet: G_CGI_DIR + 'ForumQueryPostsServlet.do',
        ForumQueryReplyPostsServlet: G_CGI_DIR + 'ForumQueryReplyPostsServlet.do',
        ForumForumTopTopicsServlet: G_CGI_DIR + 'ForumForumTopTopicsServlet.do',
        ForumTermsDateHistogramAggServlet:G_CGI_DIR + 'ForumTermsDateHistogramAggServlet.do'
    },
    channel:{
        ChannelProjChannelInfoMidServlet:G_CGI_DIR+'ChannelProjChannelInfoMidServlet.do',
        ChannelProjChannelSentiTopwordsServlet:G_CGI_DIR+'ChannelProjChannelSentiTopwordsServlet.do',
        ChannelQueryCommentsServlet:G_CGI_DIR+'ChannelQueryCommentsServlet.do',
        ChannelProjChannelRatingDistriServlet:G_CGI_DIR+'ChannelProjChannelRatingDistriServlet.do',
        ChannelProjChannelRatingDistriServletNew:G_CGI_DIR+'ChannelProjChannelRatingDistriServletNew.do'
    },
    chat:{
        GasChatInfoServlet:G_CGI_DIR+'GasChatInfoServlet.do',
        AddGasChatInfoServlet:G_CGI_DIR+'AddGasChatInfoServlet.do',
        SetupGasChatInfoServlet:G_CGI_DIR+'SetupGasChatInfoServlet.do',
        ChatKeywordsDistributeServlet:G_CGI_DIR+'ChatKeywordsDistributeServlet.do',
        ChatTopTopicsServlet:G_CGI_DIR+'ChatTopTopicsServlet.do',
        ChatQueryPostsServlet:G_CGI_DIR+'ChatQueryPostsServlet.do',
        ProjChatActiveUserServlet:G_CGI_DIR+'ProjChatActiveUserServlet.do',
        DelGasChatInfoServlet:G_CGI_DIR+'DelGasChatInfoServlet.do',
        ProjChatSentiTopwordsServlet:G_CGI_DIR+'ProjChatSentiTopwordsServlet.do',
        ProjChatAttitudeDistriServlet:G_CGI_DIR+'ProjChatAttitudeDistriServlet.do',
        ProjChatTopicSessionServlet:G_CGI_DIR+'ProjChatTopicSessionServlet.do'
    },
    usercenter:{
        UserCenterAddServlet:G_CGI_DIR+'UserCenterAddServlet.do',
        UserCenterDelServlet:G_CGI_DIR+'UserCenterDelServlet.do',
        UserCenterUpdateServlet:G_CGI_DIR+'UserCenterUpdateServlet.do',
        UserCenterQueryServlet:G_CGI_DIR+'UserCenterQueryServlet.do'
    },
    oc:{
        ProjectDataSourceServlet:G_CGI_DIR+'ProjectDataSourceServlet.do',
        ProjectDataSourceAddServlet:G_CGI_DIR+'ProjectDataSourceAddServlet.do',
        ProjectDataSourceDelServlet:G_CGI_DIR+'ProjectDataSourceDelServlet.do',
        ProjectDataSourceUpdateServlet:G_CGI_DIR+'ProjectDataSourceUpdateServlet.do',
        UserFollowProjectServlet:G_CGI_DIR+'UserFollowProjectServlet.do',
        UserFollowProjectAddServlet:G_CGI_DIR+'UserFollowProjectAddServlet.do',
        GasWordsClassifysServlet:G_CGI_DIR+'GasWordsClassifysServlet.do',
        GasWordsClassifysAddServlet:G_CGI_DIR+'GasWordsClassifysAddServlet.do',
        GasWordsClassifysDelServlet:G_CGI_DIR+'GasWordsClassifysDelServlet.do',
        GasWordsServlet:G_CGI_DIR+'GasWordsServlet.do',
        GasWordsDelServlet:G_CGI_DIR+'GasWordsDelServlet.do'
    },
    custom_service:{
        FreeTrialServlet:G_CGI_DIR+'FreeTrialServlet',
        GetServiceServlet:G_CGI_DIR+'GetServiceServlet'
    },
    custom_keywords:{
        GetCustomKeywordsServlet:G_CGI_DIR+'GetCustomKeywordsServlet',
        InsertCustomKeywordsServlet:G_CGI_DIR+'InsertCustomKeywordsServlet',
        DeleteCustomKeywordsServlet:G_CGI_DIR+'DeleteCustomKeywordsServlet',
        UserCustomKeywordsUpdateServlet:G_CGI_DIR+'UserCustomKeywordsUpdateServlet'
    },
    lt:{
        LtSentiServlet:G_CGI_DIR+'LtSentiServlet.do',
        ProjForumLighttowerStatServlet:G_CGI_DIR+'ProjForumLighttowerStatServlet.do'
    },
    geetest:{
        StartCaptchaServlet:G_CGI_DIR+'StartCaptchaServlet'
    },
    pingxx:{
        CreateChargeServlet:G_CGI_DIR+'CreateChargeServlet.do'
    },
    profile:{
        ProfileGlobalServlet:G_CGI_DIR+'ProfileGlobalServlet',
        ProfileCustomServlet:G_CGI_DIR+'ProfileCustomServlet'
    }
};

function decodeURIComponents(s)
{
    return decodeURIComponent(decodeURIComponent(ReplaceAll(s,"\\","")));
}

function IsOc()
{
    var html=window.location.href.split("/").pop().split("?")[0];

    return html=="oc.html";
}

function IsLt()
{
    var html=window.location.href.split("/").pop().split("?")[0];

    return html=="lt.html";
}

function PopGuide(which)
{


    var div=$('<div style="position: absolute;left:0;top:0;width:100%;background-color:#000000;opacity:0.4;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);"><div class="major-w ma" style="margin-top:10px;height:300px;background: transparent url(http://image.thinkinggame.cn/img/guide/'+which+'.png) no-repeat right center;background-size:contain"></div></div>').height($(window).height());

    if(which=='nick_name_change_tip1')
    {
        div=$('<div style="position: absolute;left:0;top:0;width:100%;background-color:#000000;opacity:0.4;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);"><div class="major-w ma" style="margin-top:120px;height:400px;background: transparent url(http://image.thinkinggame.cn/img/guide/'+which+'.png) no-repeat 43% center;background-size:initial"></div></div>').height($(window).height());
    }


    div.click(function(){
        $(this).remove();
    });

    div.appendTo($('body'));
}



function PopNickNameChangeTip0()
{
    MyPost(G_CGI_URL.auth.UpdateNicknameTip0Servlet,{});

    PopGuide('nick_name_change_tip0');
}

function PopNickNameChangeTip1()
{
    MyPost(G_CGI_URL.auth.UpdateNicknameTip1Servlet,{});

    PopGuide('nick_name_change_tip1');
}

function PopLtTip()
{
    if(G_LOCAL_STORAGE.get("lt_tip")!=="1")
    {
        G_LOCAL_STORAGE.set("lt_tip", "1");
    }
    else
    {
        return;
    }

    MyPost(G_CGI_URL.auth.UpdateLtTipServlet,{});

    var step1=$('<div style="position: absolute;left:0;top:0;width:100%;background-color:#000000;opacity:0.4;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);"><div class="major-w ma" style="margin-top:110px;height:350px;background: transparent url(http://image.thinkinggame.cn/img/guide/lt/step1.png) no-repeat right center;background-size:contain"></div></div>').height($(window).height());

    var step2=$('<div style="position: absolute;left:0;top:0;width:100%;background-color:#000000;opacity:0.4;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);"><div class="major-w ma" style="margin-top:220px;height:300px;background: transparent url(http://image.thinkinggame.cn/img/guide/lt/step2.png) no-repeat left center;background-size:contain"></div></div>').height($(window).height());

    var step3=$('<div style="position: absolute;left:0;top:0;width:100%;background-color:#000000;opacity:0.4;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);"><div class="major-w ma" style="margin-top:430px;height:500px;background: transparent url(http://image.thinkinggame.cn/img/guide/lt/step3.png) no-repeat 30px center;background-size:contain"></div></div>').height($(window).height());

    var step4=$('<div style="position: absolute;left:0;top:0;width:100%;background-color:#000000;opacity:0.4;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);"><div class="major-w ma" style="margin-top:430px;height:300px;background: transparent url(http://image.thinkinggame.cn/img/guide/lt/step4.png) no-repeat 500px center;background-size:contain"></div></div>').height($(window).height());

    var step5=$('<div style="position: absolute;left:0;top:0;width:100%;background-color:#000000;opacity:0.4;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=40);filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);"><div class="major-w ma" style="margin-top:315px;height:500px;background: transparent url(http://image.thinkinggame.cn/img/guide/lt/step5.png) no-repeat 380px center;background-size:contain"></div></div>').height($(window).height());

    step1.appendTo($('body')).hide();
    step2.appendTo($('body')).hide();
    step3.appendTo($('body')).hide();
    step4.appendTo($('body')).hide();
    step5.appendTo($('body')).hide();

    step1.show();

    step1.click(function(){
        step2.show();
        $(this).remove();
    });


    step2.click(function(){
        step3.show();
        $(this).remove();
    });


    step3.click(function(){
        step4.show();
        $(this).remove();
    });


    step4.click(function(){
        step5.show();
        $(this).remove();
    });


    step5.click(function(){
        $(this).remove();
    });

}

function IsAbout()
{
    var html=window.location.href.split("/").pop().split('?')[0];

    var map={
        'chatresult.html':'',
        'about.html':'',
        'oc.html':'',
        'reci.html':'',
        'yuqin.html':'',
        'chat.html':'',
        'help.html':'',
        'admin.html':'',
        'wechathow.html':'',
        'qqhow.html':'',
        'portrayal.html':''
    };

    return html in map;
}

function IsIndex()
{
    var html=window.location.href.split("/").pop();
    return html=="index.html" || html=="";
}

var G_LOGIN={

    ShowOrHideByStatus: function(status)
    {
        $("[name^=status_]").hide();
        $(".login-logo").hide();

        if(status<0) // 认证失败
        {
            $("[name=status_lt_0]").show();
            $(".status_lt_0").show();
        }
        else if(status==0) // 未认证
        {
            $("[name=status_eq_0]").show();
            $(".status_eq_0").show();
        }
        else if(status==1) // 认证中
        {
            $("[name=status_eq_1]").show();
            $(".status_eq_1").show();
        }
        else if(status>1) // 认证成功
        {
            $("[name=status_gt_1]").show();
            $(".status_gt_1").show();
        }
    },

    GetGasCrawlerInfoAndGasAppsServlet:function(project_id, ondone){

        if(G_LOCAL_STORAGE.testExistCasCrawlerInfoAndGasAppsFromBuff(project_id))
        {
            ondone && ondone();

            return;
        }


        MyPost(G_CGI_URL.auth.GetGasCrawlerInfoAndGasAppsServlet,
            {project_id:project_id},
            ShowLoading,HideLoading,
            function(data)
            {
                var gas_crawler_info=[];

                for(var i=0; i<data.gas_crawler_info.length; ++i)
                {
                    if(data.gas_crawler_info[i].status==1) // 过滤状态为1的
                    {
                        gas_crawler_info.push(data.gas_crawler_info[i]);
                    }
                }

                G_LOCAL_STORAGE.setGasCrawlerInfoAndGasAppsIntoBuff(project_id, gas_crawler_info, data.gas_apps, data.proj_forms_date_span);

                ondone && ondone();
            },
            function(data, msg, code)
            {
                G_PopWnd.error("系统异常");
            }
        )
    },


    GetShownNickname:function()
    {
        var user=G_LOCAL_STORAGE.user.user;

        var nick_name=user.nick_name;

        if(nick_name.indexOf("*")==0)// 自动生成的昵称
        {
            if(user.mobile)
            {
                nick_name=JustMobileStr(user.mobile);
            }
            else if(user.email)
            {
                nick_name=JustEmailStr(user.email);
            }

        }

        return nick_name;
    },

    CheckLoginServlet:function(ondone,onfailure,hideBarSlider){
        var p={};
        var _self=this;
        !IsAbout() && G_MENU.HideMenuItems();
        MyPost(G_CGI_URL.auth.CheckLoginServlet,
            p,
            ShowLoading,HideLoading,
            function(data)
            {
                G_LOCAL_STORAGE.user=data;
                G_LOCAL_STORAGE.set("user", data);

                G_LOGIN.ShowOrHideByStatus(data.user.status);

                // 不是demo
                if(!IsDemoUser())
                {
                    $(".menu [name=login_yes]").show();

                    var nick_name=_self.GetShownNickname();

                    $(".menu [name=nick_name]").html(nick_name).attr("title", nick_name);
                    $(".menu [name=login_no]").hide();

                    /*if(IsOc())
                    {
                        if(data.user.nick_name_change_tip1==0)
                        {
                            PopNickNameChangeTip1();
                        }
                    }
                    else */if(IsLt()) // 如果是游戏灯塔页面，优先弹出步骤
                    {
                        if(data.user.lt_tip==0)
                        {


                            PopLtTip();
                        }
                        else if(data.user.nick_name_change_tip0==0)
                        {
                            PopNickNameChangeTip0();
                        }
                    }
                    else if(data.user.nick_name_change_tip0==0)
                    {
                        PopNickNameChangeTip0();
                    }

                }
                else
                {
                    if(IsLt())
                    {
                        PopLtTip();
                    }

                    if(!IsAbout())
                    {
                        $(".menu .submenu").click(function(){
                            JumpUrl($(this).attr("_data")+"?project_id="+DemoProjectId());
                        });
                    }

                }

                !IsAbout() && G_MENU.ShowMenuItems(hideBarSlider);

                ondone && ondone(data);
            },
            function(data, msg, code)
            {
                !IsAbout() && G_MENU.HideMenuItems();
                onfailure && onfailure(data,msg,code);
                //layer.alert(msg, {icon: 5}); ??
            }
        )
    },
    LogoutServlet:function(on_fail){

        MyPost(G_CGI_URL.auth.LogoutServlet,
            {
            },
            null,null,
            function()
            {
                JumpUrl("index.html");
            },
            function(data, msg, code)
            {
                on_fail && on_fail(data,msg,code);
            }
        )
    },
    LoginServlet:function(login_name, password,maxInactiveInterval, on_succ, on_fail){

        if(login_name=="")
        {
            on_fail && on_fail({},"用户名不能为空",-1);
            return;
        }

        if(password=="")
        {
            on_fail && on_fail({},"密码不能为空",-1);
            return;
        }

        G_LOCAL_STORAGE.set("login_name", login_name);

        MyPost(G_CGI_URL.auth.LoginServlet,
            {
                login_name:login_name,
                password:password,
                maxInactiveInterval:maxInactiveInterval
            },
            ShowLoading,HideLoading,
            function(data)
            {
                if (on_succ)
                {
                    on_succ(data);
                }
                else
                {
                    if(IsIndex())
                    {
                        JumpUrl("lt.html");
                    }
                    else
                    window.location.reload();
                }
            },
            function(data, msg, code)
            {
                on_fail && on_fail(data,msg,code);
            }
        )
    }
}


function JustMobileStr(mobile)
{
    if(mobile.length>=11)
    {
        mobile=mobile.substr(0,3)+"*****"+mobile.substr(8,11);
    }
    return mobile;
}


function JustEmailStr(email)
{
    var p1=email.split("@")[0];

    var p2=email.split("@")[1];

    if(p1.length>1)
    {
        var p11 = p1[0] ;

        for(var i=1; i<p1.length; ++i)
        {
            p11+="*";
        }

        p1=p11;
    }

    email=p1+"@"+p2;

    return email;
}

function IsFromEmail()
{
    return GetUrlPara("keyword") != "" ;
}

function IsMobile(s)
{
    return /^1\d{10}$/.test(s);
}

function DemoProjectId()
{
    return 60;
}

function IsDemoUser()
{
    return G_LOCAL_STORAGE.user && G_LOCAL_STORAGE.user.user && G_LOCAL_STORAGE.user.user.nick_name==='demo';
}

var G_MENU={

    HideMenuItems:function()
    {
        $(".menu .t_submenu").hide();
        return 0;
    },

    ShowMenuItems:function(hideBarSlider)
    {
        $(".menu .t_submenu").show();

        if(hideBarSlider)
        {
            $(".menu .bar-slider").hide();
        }
        else
        {
            $(".menu .bar-slider").show();
        }

        return 0;
    },

    AddMenu:function(i_chosen_submenu)
    {
        window.alert=G_PopWnd.error;

        $('body').prepend($('<div class="menu">\
        <div class="bar">\
            <table style="width:100%">\
        <tbody>\
        <tr>\
        <td class="logo cp" onclick="JumpUrl(\'index.html\')"></td>\
        <td style="width:70px"></td>\
        <td>\
            <div class="t_submenu">\
                <div class="t_besides_about">\
                    <table>\
                        <tbody>\
                            <tr>\
                                <td class="submenu" _data="lt.html"><div>游戏灯塔</div></td>\
                                <td class="submenu" _data="forum.html"><div>游戏论坛</div></td>\
                                <td class="submenu" _data="channel.html"><div>渠道评论</div></td>\
                                <!--<td class="submenu"><div>聊天分析</div></td>-->\
                            </tr>\
                            <tr></tr>\
                        </tbody>\
                    </table>\
                </div>\
                <div class="t_about" style="display:none;width:650px">\
                    <table style="margin:auto">\
                        <tbody>\
                            <tr>\
                                <td class="submenu chosen" _data="about.html"><div>关于我们</div></td>\
                            </tr>\
                            <tr></tr>\
                        </tbody>\
                    </table>\
                </div>\
                <div class="bar-slider"></div>\
                <div class="arrow-pop close_when_mouse_down user-center" style="display:none">\
                    <div class="top-arrow" style="position:absolute;left:38px"></div>\
                    <div style="border-bottom:1px solid #e2e4e8;" class="cp me" onclick="JumpUrl(\'oc.html\', true)">个人中心</div>\
                    <div class="cp logout" onclick="G_LOGIN.LogoutServlet()">退出登录</div>\
                </div>\
            </div>\
        </td>\
        <td class="login">\
        <div name="login_no" style="float:right">\
        <span class="login_no_login" onclick="PopLogin()">登录</span><span class="login_no_reg" onclick="G_PopWnd.reg()">注册</span>\
        </div>\
        <div class="login_yes" name="login_yes" style="display:none;float:right" onclick="$(\'.user-center\').show()">\
        <table style="line-height:1.5em;margin-top:4px;">\
        <tbody>\
        <tr>\
        <td><span class="login-logo status_lt_0" style="display:none" title="认证失败">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="login-logo status_eq_0" style="display:none" title="未认证">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="login-logo status_eq_1" style="display:none" title="认证中">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="login-logo status_gt_1" style="display:none" title="认证成功">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>\
        <td><span style="color:#ffffff;max-width: 100px;display: inline-block;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"><span name="nick_name"></span></td>\
        <td><span class="down-arrow" style="background:transparent url(http://image.thinkinggame.cn/img/usercenter/down-arrow.png) no-repeat center center; margin-left:4px;margin-right:10px">&nbsp;&nbsp;&nbsp;&nbsp;</span></td>\
        </tr>\
        </tbody>\
        </table>\
        </div>\
        </td>\
        </tr>\
        </tbody>\
        </table>\
        </div>'));

        $(".menu .logo").click(function(){
            // ?? JumpUrl("index3.html");
        });

        $(".menu .submenu").click(function(){
            JumpUrl($(this).attr("_data"));
        });

        var slider=$(".menu .bar-slider");


        function setSliderPos(i,ani)
        {
            slider.show();

            var left=388+i*138;

            if(!ani)
            {
                slider.css({
                    left:left+'px'
                });
            }
            else
            {
                slider.animate({
                    left:left
                },{
                    queue:false
                });
            }
        }

        if(i_chosen_submenu>=0)
        {
            setSliderPos(i_chosen_submenu);
            $(".menu .submenu").eq(i_chosen_submenu).addClass("chosen");
        }
        else
        {
            setSliderPos(0);
            $(".menu .bar-slider").hide();
        }


        $(".submenu").each(function(i){
            $(this).hover(
                function(){
                    setSliderPos(i,true);
                },
                function(){
                    setSliderPos(i_chosen_submenu,true);
                    if(! (i_chosen_submenu>=0))
                    {
                        $(".menu .bar-slider").hide();
                    }
                }
            )

        });

        if(IsAbout())
        {
            $(".t_submenu .t_about").show();
            $(".t_submenu .t_besides_about").remove();
            $(".menu .bar-slider").remove();
        }
        else
        {
            $(".t_submenu .t_about").remove();
        }

        InitArrowPop();
    },

    AddFooter:function()
    {
        $('body').append($('<div class="footer">\
            <div class="in ma major-w">\
        <div class="help tc"><span onclick="JumpUrl(\'help.html\', true)">帮助文档</span><span onclick="JumpUrl(\'about.html\', true)">关于我们</span><span onclick="JumpUrl(\'about.html#join\', true)">加入我们</span><span onclick="JumpUrl(\'about.html#contact\', true)">联系我们</span></div>\
    <div class="right tc">@THINKING GAME All Rights Reserved.&nbsp;&nbsp;数数信息科技（上海）有限公司&nbsp;&nbsp;沪ICP备15030552</div>\
    <div class="top tc" onclick="GoTop()"><div style="height:28px"></div>TOP</div>\
    </div>\
    </div>'));

    },

    AddMenuFooter:function(i_chosen_submenu)
    {
        this.AddMenu(i_chosen_submenu);
        this.AddFooter();
    }
}

function IsValidEmail(addr)
{
    var arr=addr.split(" ");
    for(var i=0; i<arr.length; ++i)
    {
        if(arr[i] && !_IsValidEmail(arr[i]))
        {
            return false;
        }
    }

    return true;
}

function _IsValidEmail(addr)
{
    var reyx = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

    return reyx.test(addr);


}

function InitRadiobox()
{
    $('.radiobox').each(function(){
        if(!$(this).hasClass("icon"))
        {
            $(this).prepend($('<span style="width:16px;display:inline-block;margin-right:5px;"><span class="icon off">&nbsp;</span></span>')).prepend($('<input type=radio style="visibility:hidden;width:0"/>'));
            var name=$(this).attr("name");
            var _attr_name=$(this).attr("_attr_name");
            var _attr_val=$(this).attr("_attr_val");
            $(this).find('input').attr(_attr_name,_attr_val).attr("name",name);

            $(this).click(function(){

                if($(this).find(".icon").hasClass('off'))
                {


                    var name=$(this).attr('name');
                    $('.radiobox[name='+name+']').find('.icon').removeClass('on').addClass('off');
                    $(this).find(".icon").removeClass('off').addClass('on');

                    $('.radiobox[name='+name+']').each(function(){
                        if($(this).find('.on').length)
                        {
                            $(this).find('input[type=radio]').prop('checked', true);
                            $(this).attr('_checked','true');
                        }
                        else
                        {
                            $(this).find('input[type=radio]').prop('checked', false);
                            $(this).attr('_checked','false');
                        }
                    })
                }

            });
        }
    });

    $('.radiobox').each(function(){

        if($(this).attr('_checked')=='true')
        {
            if($(this).find(".on").length==0)
            {
                $(this).click();
            }
        }

    });

}

var G_DATE={
    _init:(function(){
        Date.prototype.format =function(format)
        {
            var o = {
                "M+" : this.getMonth()+1, //month
                "d+" : this.getDate(),    //day
                "h+" : this.getHours(),   //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
                "S" : this.getMilliseconds() //millisecond
            };
            if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                (this.getFullYear()+"").substr(4- RegExp.$1.length));
            for(var k in o)if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length==1? o[k] :
                        ("00"+ o[k]).substr((""+ o[k]).length));
            return format;
        };
        return '';
    })(),
    GetDateByDiffDate:function(date,diff)
    {
        if(date+""===date)
        {
            date=this.Str2Date(date);
        }

        var _ret=new Date();
        _ret.setDate(date.getDate()+diff);
        _ret=_ret.format('yyyy-MM-dd');
        return _ret;
    },
    GetDate:function(diff)
    {
        var _curDate=new Date();
        var _ret=new Date();
        _ret.setDate(_curDate.getDate()+diff);
        _ret=_ret.format('yyyy-MM-dd');
        return _ret;
    },
    Str2Date:function(yyyyMMdd)
    {
        var str =yyyyMMdd;
        str = str.replace(/-/g,"/");
        var date = new Date(str);
        return date;
    },
    GetDateSpanArr:function(start, end)
    {
        var date_start=this.Str2Date(start);
        var date_end=this.Str2Date(end);

        var ret=[start];

        while(date_start.getTime()<date_end.getTime())
        {
            date_start.setDate(date_start.getDate()+1);
            ret.push(date_start.format('yyyy-MM-dd'));
        }


        return ret;
    }
}

function GenLike(pt, container)
{
    var _html='';

    pt=parseInt('0'+pt);

    if(pt==1)
    {
        _html='<span class="star like" title="喜欢">&nbsp;</span>';
    }
    else if(pt==2)
    {
        _html='<span class="star dislike" title="不喜欢">&nbsp;</span>';
    }
    else if(pt==3)
    {
        _html='<span class="star nota" title="未评价">&nbsp;</span>';
    }

    container && container.html(_html);
    return _html;
}

function GenStar(pt, container, full_pt, extra)
{
    var good=Math.floor(parseFloat(pt));
    var half_bad=(parseFloat(pt)>good) ? 1 : 0;
    var bad=5-good-half_bad;

    var _html='';

    pt=parseFloat('0'+pt);

    if(!full_pt || full_pt==5)
    {
        pt+='.0';

        for(var i=0; i<good; i++)
        {
            _html+='<span class="good star">&nbsp;</span>';
        }

        for(var i=0; i<half_bad; i++)
        {
            _html+='<span class="half-bad star">&nbsp;</span>';
        }

        for(var i=0; i<bad; i++)
        {
            _html+='<span class="bad star">&nbsp;</span>';
        }
    }
    else
    {
        _html=pt+'分/'+full_pt+'分';
    }

    if(extra)
    {
        _html+=extra;
    }

    container && container.html(_html);
    return _html;
}

function InitArrowPop()
{
    $(".arrow-pop").unbind("hover").hover(function(){
        $('body').unbind('mousedown');
    }, function() {
        $('body').bind('mousedown', function () {
            $(".arrow-pop.close_when_mouse_down").hide();
        });
    });
}


function ReplaceAll(str, find, replace)
{
    if(find=="")
        return str;
    var index=(str.toLowerCase()).indexOf(find.toLowerCase());
    if(index==-1)
    {
        return str;
    }
    else
    {
        return str.substr(0,index)+replace+ReplaceAll(str.substr(index+find.length), find, replace);
    }
}

function iFrameHeight()
{
    var arr= $("iframe");

    arr.each(function(){
        var ifm=$(this)[0];
        var id=$(this).attr('id');
        var subWeb = document.frames ? document.frames[id].document : ifm.contentDocument;
        if(ifm != null && subWeb != null) {
            ifm.height = subWeb.body.scrollHeight;
            ifm.width = subWeb.body.scrollWidth;
        }

    })


}


function GenPageFooter(container, maxpage, currentpage, pagebtn_click_callback, maybe_more)
{
    $(container).children(".pagebtn").remove();

    if(maxpage==1)
        return;

    $(container).append($('<span class="pagebtn prev">&nbsp;</span>').click(function(){
        var curpage=$(this).nextAll('.num.chosen').attr('page');
        curpage=parseInt(curpage);
        if(curpage===1)
        {
            return;
        }
        else
        {
            $(this).nextAll('.num.chosen').prev('.num').click();
        }
    }));

    // 将所有的页面按照10个分为一组，例如第1,2,3,4,5,6,...,10页属于第0组，第10,11,12,13,14,...,20属于第1组，...
    var howmany_per_group=10;

    var curgroup=Math.floor((currentpage-1)/howmany_per_group);

    // 将当前组的所有的按钮都绘制出来
    var start_page=curgroup*howmany_per_group+1;
    var end_page=(curgroup+1)*howmany_per_group;
    if (end_page>maxpage)
        end_page=maxpage;

    // 为了增加用户体验，如果当前页刚好是在当期组的首尾，则前后都增加一个按钮
    if(currentpage==end_page && currentpage!=maxpage)
        end_page++;

    if(currentpage==start_page && currentpage!=1)
        start_page--;

    // 如果不是第一组的话，要把首页绘制出来
    if(curgroup>0)
    {
        $(container).append($('<span class="pagebtn num" page=1>&nbsp;1&nbsp;</span>'));
        $(container).append($('<span class="pagebtn pos">...</span>')); // 简单的占位符
    }

    for(var i=start_page; i<=end_page; ++i)
    {
        $(container).append($('<span class="pagebtn num" page='+i+'>&nbsp;'+i+'&nbsp;</span>'));
    }

    if(curgroup<Math.floor(maxpage/howmany_per_group))
    {
        if(end_page<maxpage-1)
        {
            $(container).append($('<span class="pagebtn pos">...</span>')); // 简单的占位符
        }
        if(end_page<maxpage)
        {
            $(container).append($('<span class="pagebtn num" page='+maxpage+'>&nbsp;'+maxpage+'&nbsp;</span>'));
        }
    }

    if(maybe_more)
    {
        $(container).append($('<span class="pagebtn pos">...</span>')); // 简单的占位符
    }


    $(container).find('.num').click(function(){

        if($(this).hasClass('chosen'))
            return;

        $(this).parent().find('.num').removeClass('chosen');
        $(this).addClass('chosen');
        pagebtn_click_callback && pagebtn_click_callback($(this).attr('page'));
    });

    $(container).append($('<span class="pagebtn next">&nbsp;</span>').click(function(){
        var curpage=$(this).nextAll('.num.chosen').attr('page');
        curpage=parseInt(curpage);
        if(curpage===maxpage)
        {
            return;
        }
        else
        {
            $(this).prevAll('.num.chosen').next('.num').click();
        }
    }));

    $(container).children(".num[page="+currentpage+"]").addClass('chosen');
}

function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

var G_PopWnd={
  error:function(msg){
      var time=(msg.length/4+1)*1000;
      layer.msg('<div style="margin-bottom:0.2em;text-align:center;height:4em;background:url(http://image.thinkinggame.cn/img/pop_wnd/error.png) no-repeat;background-size:contain;background-position:center;"></div>'+msg,
          {time:time,shift:6,shadeClose:true,shade: [0.3, '#000']}, function(){
          //do something
      });
  },
    good:function(msg, callback){
        var time=(msg.length/4+1)*1000;
        layer.msg('<div style="margin-bottom:0.2em;text-align:center;height:4em;background:url(http://image.thinkinggame.cn/img/pop_wnd/good.png) no-repeat;background-size:contain;background-position:center;"></div>'+msg,
            {time:time,shift:5,shadeClose:true,shade: [0.3, '#000']}, function(){
                //do something
                callback && callback();
            });
    },
    remind:function(msg, callback){
        var time=(msg.length/4+1)*1000;
        layer.msg('<div style="margin-bottom:0.2em;text-align:center;height:4em;background:url(http://image.thinkinggame.cn/img/pop_wnd/warn.png) no-repeat;background-size:contain;background-position:center;"></div>'+msg,
            {time:time,shift:5,shadeClose:true,shade: [0.3, '#000']}, function(){
                //do something
                callback && callback();
            });
    },
  confirm:function(msg, func)
  {
      layer.open({
          type: 1,
          title: false,
          closeBtn: false,
          shadeClose: false,
          area: ['auto', 'auto'],
          content: "<div class='tc' style='padding: 20px 30px 20px 30px;'>" +
          "<div style='padding-top:10px;padding-bottom:20px;font-size:14px'>"+msg+"</div>" +
          "<div><button class='confirm' name='__pop_confirm'>确认</button><button class='cancel' style='margin-left:30px' onclick='layer.closeAll()'>取消</button></div>"+
          "</div>"
      });
      $("[name=__pop_confirm]").click( function(){ layer.closeAll(); func && func();} );
  },
  reg:function()
  {
      /*this.dialog("温馨提示", "<span style='line-height:2.5em'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;尊敬的用户您好，当前我们的平台正在内测中，申请体验请拨打电话&nbsp;&nbsp;<span class='font-theme'>18121290606</span>，或发送邮件到&nbsp;&nbsp;<span class='font-theme'>admin@thinkingdata.cn</span>。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;多谢您的支持。</span>", "login-w", null, null, 1);*/
      JumpUrl("reg.html");
  },
  dialog:function(title, content, outer_class, max_height, content_before_body, icon, no_padding)
  {
      max_height = max_height ? max_height+'px': "auto";

      content_before_body = content_before_body ? content_before_body : '<div></div>';


      var icon_url="http://image.thinkinggame.cn/img/pop_wnd/"+icon+".png";

      if(content+""===content) // 表示content的是dom的字符串
      {


          layer.closeAll();
          layer.open({
              type: 1,
              title: false,
              closeBtn: false,
              shadeClose: false,
              area: ['auto', 'auto'],
              content: '<div class="'+outer_class+'">\
                    <div class="_pop_box-header">\
                        <span style="background:transparent url('+icon_url+') no-repeat center center;background-size:contain">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;&nbsp;'+title+'\
                        <span class="fr cp close" style="font-size:20px;margin-right:18px;" onclick="layer.closeAll();">╳</span>\
                    </div>\
                    <div class="_pop_box-body" style="height:'+max_height+';overflow-y:auto">'+content+'</div></div>'
          });



          return;
      }

      var e=null;


      var style='height:'+max_height+';overflow-y:auto;'+(no_padding ? 'padding:0px;':'');

      if(!$(content).parent().hasClass("_pop_box-body"))
      {
          e=$('<div class="'+outer_class+'"></div>').append($('<div class="_pop_box-header">\
                        <span style="background:transparent url('+icon_url+') no-repeat center center;background-size:contain">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;&nbsp;<span name=title>'+title+'</span>\
                        <span class="fr cp close" style="font-size:20px;margin-right:18px;" onclick="layer.closeAll();">╳</span>\
                    </div>')).append($(content_before_body)).append($('<div class="_pop_box-body" style="'+style+'"></div>').append($(content).show())).appendTo($('body')).hide();
      }
      else
      {
          e=$(content).parent().parent();
          e.find("._pop_box-header [name=title]").html(title);
      }

      layer.closeAll();
      layer.open({
          type: 1,
          title: false,
          closeBtn: false,
          shadeClose: false,
          area: ['auto', 'auto'],
          content: e
      });
  }

};

function EmphaSizeKeywords(keywords, content)
{
    keywords=keywords.split(" ");

    var ret="";

    for(var i=0; i<content.length; ++i)
    {
        var found=false;

        for(var j=0; j<keywords.length; ++j)
        {
            if(keywords[j].length==0)
            {
                continue;
            }
            if(content.length - i < keywords[j].length)
            {
                continue;
            }
            else if(content.substr(i,keywords[j].length).toLowerCase()==keywords[j].toLowerCase())
            {
                ret+="<span class='empha'>"+content.substr(i,keywords[j].length)+"</span>";

                i+=keywords[j].length-1;

                found = true;

                break;
            }

        }

        if(!found)
        {
            ret+=content[i];
        }

    }

    return ret;
}

function EmphaSizeKeywords2(keywords, content)
{


    function _emphasize_single_keyword(keyword, content)
    {
        if(keyword=="")
            return content;

        keyword=ReplaceAll(keyword, "<", "");
        keyword=ReplaceAll(keyword, ">", "");

        var len=content.length;

        var ret="";

        var k_len=keyword.length;

        var i= 0,j=0;

        for(; i<=len-k_len; )
        {
            if(content.substr(i,k_len).toLowerCase()==keyword.toLowerCase())
            {
                ret+=content.substr(j,i-j)+'<span class="empha">'+content.substr(i,k_len)+'</span>';
                i+=k_len;
                j=i;
            }
            else
            {
                i++;
            }
        }

        ret+=content.substr(j,len-j);

        return ret;

    }

    var content_ar=content.split("<br>");

    for(var i=0 ; i<content_ar.length; ++i)
    {
        content_ar[i]=ReplaceAll(content_ar[i], "<", "");
        content_ar[i]=ReplaceAll(content_ar[i], ">", "");
    }

    content = content_ar.join("<br/>");

    keywords=keywords.split(" ");

    for(var i=0; i<keywords.length; ++i)
    {
        content=_emphasize_single_keyword(keywords[i], content);
    }

    return content;
}



function MyPost(url, postdata, req_start, req_end, onsucc, onfail)
{
    //req_start && req_start();

    function AntiXss(data)
    {
        if(typeof data === "number")
        {
            return data;
        }
        else if(typeof data === "string")
        {
            // 换行是特例
            return data.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&lt;br&gt;/ig, "<br>").replace(/&lt;br\/&gt;/ig, "<br/>");
        }
        else if(data instanceof Array)
        {
            for(var i=0; i<data.length; ++i)
            {
                data[i]=AntiXss(data[i]);
            }

            return data;
        }
        else if(data instanceof Object)
        {
            for(var k in data)
            {
                data[k] = AntiXss(data[k]);
            }

            return data;
        }
    }


    $.ajax({
       timeout:10000,
        async:true,
        type:"POST",
        url:url,
        data:postdata,
        beforeSend:function(){
            req_start && req_start();
        },
        complete:function(){

        },
        error:function(){

            req_end && req_end();

            onfail && onfail();
        },
        success:function(d){

            req_end && req_end();

            try
            {
                d['return_message'] = AntiXss(d['return_message']);

                if (d['return_code']+''=='0')
                {

                    if (typeof d['data']=='string')
                    {
                        if (d['data']!='')
                            d['data']=$.parseJSON(d['data']);
                        else
                            d['data']={};
                    }

                    d['data'] = AntiXss(d['data']) ;

                    onsucc && onsucc(d['data'],d['return_message']) ;
                }
                else
                {
                    if((d['return_code']+''==='-1001' || d['return_code']+''==='-1016') && url.indexOf("CheckLoginServlet.do")<0)
                    {
                        PopLogin();
                        return;
                    }



                    onfail && onfail(d['data'],d['return_message'],d['return_code']);
                }
            }
            catch(e)
            {
                console && console.log(e.stack);
                onfail && onfail();
            }
        }
    });

/*
    $.post(url, postdata, function(d){

        onend && onend();

        try
        {
            if (d['return_code']+''=='0')
            {

                if (typeof d['data']=='string')
                {
                    if (d['data']!='')
                        d['data']=$.parseJSON(d['data']);
                    else
                        d['data']={};
                }
                onsucc && onsucc(d['data'],d['return_message']) ;
            }
            else
            {
                if(d['return_code']+''==='-1001' && url.indexOf("CheckLoginServlet.do")<0)
                {
                    PopLogin();
                    return;
                }

                onfail && onfail(d['data'],d['return_message'],d['return_code']);
            }
        }
        catch(e)
        {
            console && console.log(e.stack);
            onfail && onfail();
        }

    })*/
}


function GoTop()
{
    $("body,html").animate({
        'scrollTop':0
    },500);
}

function JumpUrl(url, new_window)
{

    if(new_window)
        window.open(url);
    else
        window.location.href=url;
}

function SortArrayByKeyNum(arr, key)
{
    var key_a=[];
    var index_a={

    };
    for(var i=0; i<arr.length; ++i)
    {
        var num=parseInt(arr[i][key]);
        key_a.push(num);
        if(num in index_a)
        {
            index_a[num].push(i);
        }
        else
        {
            index_a[num]=[i];
        }
    }
    key_a.sort(function(a,b){
        return b-a;
    });

    var ret_index=[];

    for(var i=0;i<key_a.length; ++i)
    {
        ret_index=ret_index.concat(index_a[key_a[i]]);
    }

    var ret=[];

    for(var i=0;i<ret_index.length; ++i)
    {
        ret.push(arr[ret_index[i]]);
    }

    return ret;

}

function InitProjectTabClick(func0, func1)
{
    $(".block.project .tab").each(function(i){
        var bg=$(".block.project .tab-chosen-bg");
        $(this).click(function(){
            var cur=$(this);
            cur.addClass("chosen");
            cur.siblings(".tab").removeClass("chosen").addClass("before-chosen");
            bg.animate({
                left:i*170+'px'
            },function(){
                cur.siblings(".tab").removeClass("before-chosen");
            });

            i==0 && func0 && func0();
            i==1 && func1 && func1();
        })

    })
}


function InitDt()
{
    $(".dt-picker").click(function(e){
        e.stopPropagation();

        $(this).lqdatetimepicker({
            _self:this,
            css : 'datetime-day',
            dateType : 'D',
            date: {
                'H' : {
                    begin : '8:00', //开始时分
                    end : '23:30', //结束时分
                    step : "30" //时分步长
                },
                'D' : {
                    month : new Date(), //日期默认时间
                    selected : (new Date()).getDate()
                },
                'M' : {
                    begin : 1, //月份开始
                    end : 12, //月份结束
                    selected : (new Date()).getMonth()+1  //月份初始
                },
                'Y' : {
                    begin : 2001, //年份开始
                    end : (new Date()).getFullYear(), //年份结束
                    selected : (new Date()).getFullYear() //年份初始
                }
            },
            selectback : function(){
                var v=$(this._self).val();
                var a=v.split("-");
                a.length>=3 && a[1].length==1 ? (a[1]="0"+a[1]) : "";
                a.length>=3 && a[2].length==1 ? (a[2]="0"+a[2]) : "";
                $(this._self).val(a.join("-"));
            }, //选择时间的事件回调
            callback : function () {
                //alert($(this._self).val());
            } //初始化时间事件回调
        });
    })
}

function GetUrlPara(str)
{
    if (window.location.search.split('?').length==1)
        return '';
    var arr = window.location.search.split('?')[1].split('&');
    var hash = {};
    for (var i=0; i<arr.length; ++i)
    {
        hash[arr[i].split('=')[0]]=arr[i].split('=')[1];
    }
    if (hash[str])
        return hash[str];
    else
        return '';
}

function InitDoneLoadingFailure()
{
    $(".done").hide();
    $(".failure").show().each(function(){
        $(this).append($('<div class="failure-pic"><div class="pos"></div>加载失败，请稍后再试...</div>'));
        var h=$(this).outerHeight();
        var _h=$(this).find(".failure-pic").outerHeight();
        $(this).find(".failure-pic").css({
            'margin-top':(h-_h)/2+'px'
        });
    }).hide();
    $(".loading").show().each(function(){
        $(this).append($('<div class="loading-pic"><div class="pos"></div>正在加载，请耐心等待...</div>'));
        var h=$(this).outerHeight();
        var _h=$(this).find(".loading-pic").outerHeight();
        $(this).find(".loading-pic").css({
            'margin-top':(h-_h)/2+'px'
        });
    }).hide();
}

function InitCheckbox()
{
    $('.checkbox').each(function(){

        var cur=$(this);

        if(cur.find(".icon").length==0)
        {
            cur.html('&nbsp;'+cur.html());
            cur.prepend($('<span style="width:16px;display:inline-block"><span class="icon off">&nbsp;</span></span>')).prepend($('<input type=checkbox style="visibility:hidden;width:0"/>'));

            var _attr_name=cur.attr("_attr_name");
            var _attr_val=cur.attr("_attr_val");
            cur.find('input').attr(_attr_name,_attr_val);

            cur.click(function(){
                $(this).find(".icon").hasClass('off') ?
                    $(this).find(".icon").removeClass('off').addClass("on") : $(this).find(".icon").removeClass('on').addClass("off");
                $(this).find("input[type=checkbox]").prop("checked", $(this).find(".icon").hasClass("on"));
                $(this).attr('_checked',$(this).find(".icon").hasClass("on") ? 'true' : 'false');
            });


            if(cur.attr('_checked')=='true')
            {
                if(cur.find(".on").length==0)
                {
                    cur.click();
                }
            }

        }

    });

}

function DisableCheckbox(e)
{
    $(e).attr("_checked", "false");
    $(e).find(".icon").removeClass("on").addClass("off");
    $(e).find('input').prop("checked",false);
}

function EnableCheckbox(e)
{
    $(e).attr("_checked", "true");
    $(e).find(".icon").removeClass("off").addClass("on");
    $(e).find('input').prop("checked",true);
}


function ShowLoading()
{
    G_LOCAL_STORAGE.LayerLoadingIndex=layer.load(2, {shade:[0.3,'#000']});
    G_LOCAL_STORAGE.LayerLoadingCnt++;
}

function HideLoading()
{

    if(--G_LOCAL_STORAGE.LayerLoadingCnt <=0)
    {
        layer.close(G_LOCAL_STORAGE.LayerLoadingIndex);
    }

}

function ClosePopOnEsc()
{
    document.onkeydown=function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 27) { // 按 Esc
            $("div.arrow-pop").hide();

        }
    }
}

function PopDemoAlert(str)
{
    str = str ? str : "请注册账户以查看更多游戏" ;

    G_PopWnd.dialog('提示','<div style="margin-bottom:10px;text-align: center;font-size:14px"><div style="font-size:16px;margin-top:60px;margin-bottom:60px;">'+str+'</div><div class="tc w100" style="margin-top:34px;"><button class="login-submit cp" style="width:6em;font-size:14px;" onclick="JumpUrl(\'reg.html\')">立即注册</button><br/><br/>已有账号？<a onclick="PopLogin()" class="cp hv" style="text-decoration: underline;color:#03a9f5">登录</a></div></div>', "login-w", 0, "", 2);
}

function PopLogin()
{
    // 已经弹出登录了
    if($("[name=login_box]").is(":visible"))
    {
        return;
    }

    G_PopWnd.dialog('用户登录', '<div style="padding-top:20px;padding-bottom:20px" name="login_box"><div class="login-input-div" style="margin-bottom:25px">\
                        <div class="logo"></div>\
                        <input placeholder="手机号 / 邮箱" name="login_name" type="text"/>\
                        </div>\
                        <div class="login-input-div">\
                        <div class="logo password"></div>\
                        <input placeholder="密码" name="password" type="password"/>\
                        </div>\
                        <div style="margin-top:31px">\
                        <span class="checkbox" style="font-size:14px" _attr_name=maxInactiveInterval _attr_val=604800 _checked="false">七天免登录</span><span style="font-size:12px;margin-top:2px" class="fr font-theme cp" onclick="JumpUrl(\'reg.html?reg=5\')">忘记密码？</span>\
                    </div>\
                    <button class="login-submit cp" style="margin-top:31px" name="login_submit">登录</button><div class="tc" style="margin-top:25px;font-size:13px;">没有账号？&nbsp;<a href="#" class="font-theme" onclick="JumpUrl(\'reg.html\');">请注册</a></div></div>', "login-w", 0, "", 5);

    InitCheckbox();

    var login_name=G_LOCAL_STORAGE.get("login_name");

    $('[name=login_box] [name=login_name]').val(login_name);

    function _submit()
    {
        var login_name=$("[name=login_box] [name=login_name]").val().trim();

        if(login_name=="")
        {
            G_PopWnd.error("用户名不能为空");
            return;
        }

        var password=$("[name=login_box] [name=password]").val();

        var maxInactiveInterval=($("input[maxinactiveinterval]").prop('checked') ? $("input[maxinactiveinterval]").attr('maxInactiveInterval') : 0);

        G_LOGIN.LoginServlet(login_name, password, maxInactiveInterval, null, function(data,msg,code){
            alert(msg);
        });
    }

    $("[name=login_box] [name=login_submit]").unbind('click').click(_submit);

    $('[name=login_box] [name=password]').keyup(function(event){
        var key_code = (event.keyCode ? event.keyCode : event.which);

        if(key_code == '13')
        {
            _submit();
        }
    });
}

function GetProjectId(e)
{
    if(e)
        return $(e).find(".item.chosen").attr("project_id");
    else
        return $(".projects .main-bar").attr("project_id");
}

function GetProjectName(e)
{
    if(e)
        return $(e).find(".item.chosen").attr("project_name");
    else
        return $(".projects-selector .item.chosen").attr("project_name");
}

function InitDateRange(start_diff, end_diff, callback)
{
    var start=G_DATE.GetDate(start_diff);

    var end=G_DATE.GetDate(end_diff);

    for(var i=0; i<$(".date-range").length; ++i)
    {
        var id="__date_range_auto_id_"+i;

        var date_span=$("<span class='date-span'></span>");

        date_span.attr('id',id).appendTo($(".date-range").eq(i));

        var s=$("<input name='data_date_start' />");

        var e=$("<input name='data_date_end' />");

        var _start_diff=$(".date-range").eq(i).attr("start_diff");

        var _end_diff=$(".date-range").eq(i).attr("end_diff");

        var _start=start;

        var _end=end;

        if(!!_start_diff || _start_diff==='0' || _start_diff===0)
        {
            _start=G_DATE.GetDate(parseInt(_start_diff));
        }

        if(!!_end_diff || _end_diff==='0' || _end_diff===0)
        {
            _end=G_DATE.GetDate(parseInt(_end_diff));
        }


        $(".date-range").eq(i).append(s.val(_start).hide()).append(e.val(_end).hide());

        new pickerDateRange(id, {
            isTodayValid : true,
            startDate : _start,
            endDate : _end,
            theme : 'ta',
            defaultText : ' 至 ',
            success : (function(s,e,dr){return function(obj) {
                s.val(obj.startDate);
                e.val(obj.endDate);

                callback && callback(dr);
            }
            })(s,e,$(".date-range").eq(i))
        });
    }
}



function FixPopProjects(extra_callback)
{
    var all_projects=$(".projects");

    if(all_projects.length==0)
    {
        return;
    }

    for(var i=0; i<all_projects.length; ++i)
    {
        g_choose_game._attach($(all_projects[i]), (function(_projects){
            return function(project_id, project_name){
                _projects.find(".main-bar").attr("project_id", project_id);

                _projects.find(".main-bar .project-icon").css({
                    'background-image':'url('+G_LOCAL_STORAGE.getProjectImgUrl(project_id)+')'
                });

                _projects.find(".main-bar [name=project_name]").html(project_name);

                _projects.find(".projects-selector").hide();

                if(_projects.attr("extra_callback")!=="0") // 除非明确指定不要
                {
                    extra_callback && extra_callback(project_id,project_name);
                }
            }
        })($(all_projects[i])), 570);
    }

    return;

}


function GenProjectsWithAdd(chosen_project_id, choose_click_callback)
{
    GenProjects(chosen_project_id, choose_click_callback);

    var all_projects=$(".projects");

    for(var d=0; d<all_projects.length; ++d)
    {
        var projects=$(all_projects[d]);

        var item=$('<div class="item" style="margin-left:6px;"><div class="icon fl"></div>关注新游戏</div>').click(function(){g_choose_game.pop()});

        item.find(".icon").css({
            'background-image':'url(http://image.thinkinggame.cn/img/project/add.png)'
        });

        projects.find(".projects-selector").append(item);
    }
}

function GenProjects(chosen_project_id, choose_click_callback)
{
    var all_projects=$(".projects");

    for(var d=0; d<all_projects.length; ++d)
    {
        var projects=$(all_projects[d]);

        projects.find(".main-bar").unbind("click").click(function(){
            $(this).siblings('.projects-selector').show();
        })

        projects.find(".projects-selector .item").remove();
        var gas_projects=G_LOCAL_STORAGE.user.gas_projects;
        var user_proj=G_LOCAL_STORAGE.user.user_proj;
        var user=G_LOCAL_STORAGE.user.user;
        for(var i=0; i<gas_projects.length; ++i)
        {
            var has=false;

            if(user.status==10)
            {
                has=true;
            }
            else
            {
                for (var j = 0; j < user_proj.length; ++j) {
                    if (user_proj[j].project_id == gas_projects[i].project_id && user_proj[j].status > 0) {
                        has = true;
                        break;
                    }
                }
            }

            if(!has)
            {
                continue;
            }


            var item=$('<div class="item" project_id='+gas_projects[i].project_id+' project_name='+gas_projects[i].project_name+'><div class="icon fl"></div>'+gas_projects[i].project_name+'</div>');
            item.click(function(){
                $(this).siblings(".chosen").removeClass("chosen");
                $(this).addClass("chosen");

                $(this).closest(".projects-selector").hide();

                $(this).closest(".projects").find(".main-bar .project-icon").css({
                    'background-image':'url(http://image.thinkinggame.cn/img/project/'+$(this).attr("project_id")+'.png)'
                });

                $(this).closest(".projects").find(".main-bar [name=project_name]").html($(this).attr("project_name"));


                G_LOCAL_STORAGE.SetLastChosenProjectId($(this).attr("project_id"));

                choose_click_callback && choose_click_callback($(this).attr("project_id"));

            }).find(".icon").css({

                'background-image':'url(http://image.thinkinggame.cn/img/project/'+gas_projects[i].project_id+'.png),url(img/project/0.png)'

            });
            projects.find(".projects-selector .items").append(item);
        }

        if(projects.find(".projects-selector .item[project_id="+chosen_project_id+"]").length)
        {
            projects.find(".projects-selector .item[project_id="+chosen_project_id+"]").click();
        }
        else
        {
            projects.find(".projects-selector .item").eq(0).click();
        }
    }
}


var g_tiny_choose_game={

    // 数组每个元素表示当前所有的父容器以及对应的click函数
    _base_arr:[],

    parent_dom:null,
    click_icon_callback:null,

    // 选择游戏点击游戏logo的行的公共回调函数
    comm_click:function(project_id, project_name, container){
        container.find(".main-bar").attr("project_id", project_id);

        container.find(".main-bar .project-icon").css({
            'background-image':'url(http://image.thinkinggame.cn/img/project/'+project_id+'.png)'
        });

        container.find(".main-bar [name=project_name]").html(project_name);
    },

    // 绑定一个元素到指定的container里去
    attach:function(container, default_project_id, item_extra_click_callback){

        var main_bar = $('<div class="main-bar" style="width:200px;height:36px;border:1px solid #ccc;border-radius: 3px;padding:2px;" project_id=""><div class="fl project-icon" style="height:30px;margin-top:3px;background-image: url(&quot;http://image.thinkinggame.cn/img/project/0.png&quot;);"></div><span name="project_name" style="display:inline-block;margin-top:7px;">请选择游戏</span></div>');

        var tiny_projects = $('<div class="tiny-projects" style="position: relative"></div>');

        tiny_projects.append(main_bar);

        var drop_down_projects = $('<div class="drop_down_projects arrow-pop close_when_mouse_down"></div>');

        var gas_projects=G_LOCAL_STORAGE.user.gas_projects ;

        for(var i=0; i<gas_projects.length; ++i)
        {
            var item=$('<div class="item"><div class="icon fl"></div>'+gas_projects[i].project_name+'</div>').attr("project_id", gas_projects[i].project_id).attr("project_name", gas_projects[i].project_name);
            item.appendTo(drop_down_projects).find(".icon").css({

                'background-image':'url(http://image.thinkinggame.cn/img/project/'+gas_projects[i].project_id+'.png),url(img/project/0.png)'

            });

            item.click(function(){

                $(this).closest(".drop_down_projects").hide();

                var main_bar=$(this).closest(".tiny-projects").find(".main-bar").attr("project_id", $(this).attr("project_id")).attr("project_name", $(this).attr("project_name"));

                main_bar.find("[name=project_name]").html($(this).attr("project_name"));

                var background_image="url(http://image.thinkinggame.cn/img/project/"+$(this).attr("project_id")+".png)";

                item_extra_click_callback && item_extra_click_callback($(this).attr("project_id"), $(this).attr("project_name"));

                main_bar.find(".project-icon").css({
                    "background-image":background_image
                });
            });
        }


        var search_by_keyword=$("<div style='line-height:2.5em;border-bottom:1px solid #ccc; text-indent:5px;'><span style='background:transparent url(http://image.thinkinggame.cn/img/reg/4/search.png) no-repeat center center;background-size:contain;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input placeholder='输入关键词查找' style='border:none;width:12em;outline: none'/></div>");

        drop_down_projects.prepend(search_by_keyword);

        drop_down_projects.append($("<div name='not_found' style='line-height:2em;text-indent:5px;'>没有找到！</div>").hide());

        search_by_keyword.find("input").bind('keyup click', function() {

            var v = $(this).val().split(" ").join("");

            $(this).parent().parent().find(".item").each(function(){

                if($(this).attr("project_name").indexOf(v)<0)
                {
                    $(this).hide();
                }
                else
                {
                    $(this).show();
                }

            });

            if($(this).parent().parent().find(".item:visible").length==0)
            {
                $(this).parent().parent().find("[name=not_found]").show();
            }
            else
            {
                $(this).parent().parent().find("[name=not_found]").hide();
            }


        });


        main_bar.click(function () {
            drop_down_projects.show();
        });

        container.empty().append(tiny_projects.append(drop_down_projects.hide()));


        InitArrowPop();

        default_project_id && drop_down_projects.find(".item[project_id="+default_project_id+"]").click();

    }
};


var g_choose_game={

    parent_dom:null,

    click_icon_callback:null,

    _calc_pos:function(){
        if(!this.parent_dom)
        {
            return {left:'0px',top:'0px'};
        }
        else
        {
            var top = this.parent_dom.offset().top+this.parent_dom.outerHeight()+10;
            var left= this.parent_dom.offset().left-($("[name=reg4]").outerWidth()-15-this.parent_dom.width());
            return {left:left+'px',top:top+'px'};
        }
    },

    _hide_history:function(){
        $(".choose_game_tab").eq(0).css({
            'visibility':'hidden',
            'width':0
        });
        $(".choose_game_tab").eq(1).click();
    },

    _attach:function(click_elem, extra_callback, left_delta){
        var _h=$("[name=choose_game_div]");

        if(_h.length==0)
        {
            _h=this._popDom().appendTo($('body')).hide();

            _h.hover(function(){
                $('body').unbind('mousedown');
            }, function(){
                $('body').bind('mousedown', function () {
                    _h.hide();
                });
            });

            _h.find("[name=tiny_top_arrow]").show();
        }



        this._init(function(project_id,project_name){

            var _slf=g_choose_game;

            G_LOCAL_STORAGE.SetLastChosenProjectId(project_id);

            _h.hide();

            extra_callback && extra_callback(project_id,project_name);

        });

        g_choose_game.loadHistory();

        g_choose_game.loadRecommend();


        _h.hide();

        left_delta= left_delta || 50;

        $(click_elem).click(function(){

            var left=$(this).offset().left-left_delta;
            var top=$(this).offset().top+$(this).outerHeight()+20;

            _h.show();

            _h.css({
                position:'absolute',
                left:left+'px',
                top:top+'px',
                border:"1px solid #c6ccd2",
                "box-shadow":"0 0 5px 5px #f0f0f0",
                width:"800px"
            });

            var dis=$(this).offset().left-left+$(this).outerWidth()/2-12;

            _h.find("[name=tiny_top_arrow]").css({
                left:dis+"px"
            });

        });
    },

    _popDom:function(){
        var _h=
            '<div name="choose_game_div" style="line-height: 1.2em"><div name="tiny_top_arrow" style="display: none;width:20px;height:20px;border-top:none;border-right:none;border-left:1px solid #c6ccd2;border-bottom:1px solid #c6ccd2;position: absolute;left:50px;top:-10px;background: #ffffff;transform:rotate(135deg)"></div>' +
            '<div style="background-color:#ffffff;height:53px;font-size:14px;position:relative;border-radius: 3px 3px 0 0">'+
            '<div class="fl tc cp choose_game_tab chosen" style="width:9em;line-height:50px"><table class="w100"><tbody><tr><td style="font-size:1.5em;line-height:1em;padding-top:12px;width:40px;vertical-align: top;"><span>&nbsp;&nbsp;◕</span></td><td style="text-align: left">浏览历史</td></tr></tbody></table></div>'+
            '<div class="fl tc cp choose_game_tab" style="width:9em;line-height:50px">❤&nbsp;&nbsp;猜您喜欢</div>'+
            '<div class="fl tc cp choose_game_tab" style="width:9em;line-height:50px">A-Z&nbsp;&nbsp;按拼音查找</div><span class="fr" style="border:1px solid #cccccc; border-radius:3px;line-height: 32px;margin-right:9px;margin-top:9px;"><span style="background:transparent url(http://image.thinkinggame.cn/img/reg/4/search.png) no-repeat center center;background-size:contain;border-right:1px solid #e1e4e8;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><input style="margin-left:1px;border:none;outline: none;text-indent: 5px" placeholder="输入关键字查找" name="search_game_name_input"/></span>'
            +'<div name="chosen_games_by_keywords" style="display:none;max-height:200px;width:180px;line-height:3em;right:9px;text-indent:10px;font-size:12px;top:50px;position:absolute;background-color: #ffffff;border:1px solid #cccccc;border-radius: 3px;overflow-y:scroll;z-index: 99;box-shadow: 0 0 10px #bbb"></div>'
            +'</div>'
            +'<div name="choose_game_tab" style="padding:9px;background-color:#f5f5f5;min-height:240px;">'
            +'<div name="my_projects_history" style="background-color:#ffffff;min-height:240px;"></div>'
            +'</div>'
            +'<div name="choose_game_tab" style="padding:9px;background-color:#f5f5f5;min-height:240px;display:none">'
            +'<div name="my_favorites" style="background-color:#ffffff;min-height:240px;"></div>'
            +'</div>'
            +'<div name="choose_game_tab" style="padding:9px;background-color:#f5f5f5;min-height:240px;display: none">'
            +'<div style="background-color:#ffffff;font-size:14px;">'
            +'<div name="chosen_games_search_by_pinyin" style="height:240px">'
            +'<table class="w100 bc">'
            +'<tbody>'
            +'<tr>'
            +'<td style="width:116px;"></td>'
            +'<td>'
            +'<div style="line-height:3em;border-bottom:1px solid #e1e4e8;"><span class="choose_game_pinyin cp chosen">ABC</span><span class="choose_game_pinyin cp">DEF</span><span class="choose_game_pinyin cp">GHI</span><span class="choose_game_pinyin cp">JKL</span><span class="choose_game_pinyin cp">MNO</span><span class="choose_game_pinyin cp">PQR</span><span class="choose_game_pinyin cp">STU</span><span class="choose_game_pinyin cp">VW</span><span class="choose_game_pinyin cp">XYZ</span><span class="choose_game_pinyin cp">0~9</span>'
            +'</div>'
            +'</td>'
            +'</tr>'
            +'<tr>'
            +'<td style="padding-top:15px;vertical-align: top">'
            +'<div class="choose_game_type mobile cp chosen" game_type="S" top="25">手游</div>'
            +'<div class="choose_game_type page cp" game_type="Y" top="68">页游</div>'
            +'<div class="choose_game_type pc cp" game_type="D" top="110">端游</div>'
            +'<div class="choose_game_type ps cp" game_type="W" top="153">单机&nbsp;电玩</div>'
            +'</td>'
            +'<td style="line-height: 3em;vertical-align: top;position: relative;">'
            +'<div name="chosen_games_by_pinyin" style="margin-top:6px;border-left:1px solid #e1e4e8;padding-left:2em; padding-top:1em;height:170px;overflow-y: auto"></div>'
            +'<div style="position: absolute;height:20px;width:10px;background: transparent url(http://image.thinkinggame.cn/img/reg/4/arrow1.png) no-repeat center center;background-size:contain;left:-9px" name="choose_game_arrow1"></div>'
            +'</td>'
            +'</tr>'
            +'</tbody>'
            +'</table>'
            +'</div>'
            +'</div>'
            +'</div>'
            +'</div>';

        return $(_h);
    },

    _setParentDom:function(parent_dom){


        if(!$("[name=choose_game_div]").length)
        {
            $('body').append(this._popDom().hide());
        }

        if(parent_dom)
        {
            $(parent_dom).append($("[name=choose_game_div]").show());

            this.parent_dom=parent_dom;
        }


    },

    _init:function(click_icon_callback, parent_dom){

        var _slf=this;

        _slf._setParentDom(parent_dom);

        _slf.click_icon_callback=click_icon_callback;



        $(".choose_game_tab").click(function(){

            var index=$(".choose_game_tab").index(this);

            $(".choose_game_tab").removeClass("chosen").eq(index).addClass("chosen");

            $("[name=choose_game_tab]").hide().eq(index).show();
        });

        $("[name=chosen_games_by_keywords]").hover(function(){
            $('body').unbind('mousedown');
        }, function() {
            var _slf=this;
            $('body').bind('mousedown', function () {
                $(_slf).hide();
            });
        });


        $(".choose_game_pinyin").click(function(){
            $(".choose_game_pinyin.chosen").removeClass("chosen");
            $(this).addClass("chosen");

            _slf.showChosenGames();
        });

        $(".choose_game_type").click(function(){
            $(".choose_game_type.chosen").removeClass("chosen");
            $(this).addClass("chosen");

            $("[name=choose_game_arrow1]").css({
                top:$(this).attr("top")+'px'
            });

            _slf.showChosenGames();

        });

        $(".choose_game_type").eq(0).click();


        $("[name=search_game_name_input]").bind('keyup click', function(){

            var v=$(this).val().split(" ").join("");

            if(v=="")
            {
                $("[name=chosen_games_by_keywords]").hide();
                return;
            }

            var gas_projects=G_LOCAL_STORAGE.user.gas_projects ? G_LOCAL_STORAGE.user.gas_projects : G_LOCAL_STORAGE.get("user").gas_projects

            if(!gas_projects)
            {
                G_PopWnd.error("加载游戏信息异常！");
                return;
            }

            var arr_keyword=$(this).val().split(" ");

            $("[name=chosen_games_by_keywords]").empty().show();

            var gas_projects_mirror=[];

            for(var i=0; i<gas_projects.length; ++i)
            {
                var cur={
                    project_name:gas_projects[i].project_name,
                    project_id:gas_projects[i].project_id,
                    key_words_matched:0
                };

                for(var j=0; j<arr_keyword.length; ++j) {
                    if(arr_keyword[j].length && cur.project_name.toLowerCase().indexOf(arr_keyword[j].toLowerCase())>=0)
                    {
                        cur.key_words_matched++;
                    }
                }

                if(cur.key_words_matched)
                {
                    gas_projects_mirror.push(cur);
                }
            }

            gas_projects_mirror = gas_projects_mirror.sort(function(a,b){
                return b.key_words_matched- a.key_words_matched;
            });


            for(var i=0; i<gas_projects_mirror.length; ++i)
            {
                if(gas_projects_mirror[i].key_words_matched)
                {
                    $("[name=chosen_games_by_keywords]").append($("<div class='hv2 cp' style='display:block;border-bottom:1px solid #eeeeee'></div>").html(gas_projects_mirror[i].project_name).attr("project_id", gas_projects_mirror[i].project_id).click(function(){

                        var project_id=$(this).attr("project_id");

                        _slf.addToHistory(project_id);

                        _slf.submitAllHistory(_slf.click_icon_callback);

                    }));
                }

                // 全词匹配了，就表示其他的没必要展示了
                if(gas_projects_mirror[i].key_words_matched == arr_keyword.length
                    && gas_projects_mirror[i].project_name.split(" ").join("").length == $(this).val().split(" ").join("").length
                )
                {
                    break;
                }
            }

            if($("[name=chosen_games_by_keywords]").find(".hv2").length==0)
            {
                $("[name=chosen_games_by_keywords]").append($("<span class='empha'>没有找到！</span>"));
            }

        });


    },

    getCurGameType:function(){
        return $(".choose_game_type.chosen").attr("game_type");
    },

    getCurGamePinyin:function(){
        var pinyin = $(".choose_game_pinyin.chosen").html();

        if(pinyin=="0~9")
        {
            pinyin="0123456789";
        }

        return pinyin;
    },

    showChosenGames:function()
    {
        $("[name=chosen_games_by_pinyin]").empty();

        var pinyin=this.getCurGamePinyin();
        var game_type=this.getCurGameType();

        var m={};

        if(!G_LOCAL_STORAGE.get("user"))
        {
            return;
        }

        var gas_projects=G_LOCAL_STORAGE.get("user").gas_projects;

        var found=false;

        function pinyin_in(pinyin, project_pinyin)
        {
            for(var i=0; i<project_pinyin.length; ++i)
            {
                if(project_pinyin[i]!="," && pinyin.indexOf(project_pinyin[i])>=0)
                {
                    return true;
                }
            }

            return false;
        }

        function game_type_in(game_type, project_game_type)
        {
            for(var i=0; i<project_game_type.length; ++i)
            {
                if(project_game_type[i]!="," && game_type.indexOf(project_game_type[i])>=0)
                {
                    return true;
                }
            }

            return false;
        }

        for(var i=0; i<gas_projects.length; ++i)
        {
            if(game_type_in(game_type, gas_projects[i].game_type) && pinyin_in(pinyin, gas_projects[i].pinyin))
            {
                found = true;

                for(var k=0; k<gas_projects[i].pinyin.length; ++k)
                {
                    if(gas_projects[i].pinyin[k]==",")
                    {
                        continue;
                    }
                    else if(gas_projects[i].pinyin[k] in m)
                    {
                        m[gas_projects[i].pinyin[k]].push(gas_projects[i]);
                    }
                    else
                    {
                        m[gas_projects[i].pinyin[k]] = [gas_projects[i]];
                    }
                }
            }
        }

        var _slf=this;

        if(found)
        {
            for(var i=0; i<pinyin.length; ++i)
            {
                if(pinyin[i] in m)
                {

                    var tb=$("<table class='w100'><tbody><tr><td style='width:30px;vertical-align: top' class='font-theme'></td><td style='vertical-align: top'></td></tr></tbody></table>").attr("pinyin", pinyin[i]);

                    tb.find("td").eq(0).html(pinyin[i]);

                    $("[name=chosen_games_by_pinyin]").append(tb);

                    for(var j=0; j<m[pinyin[i]].length; ++j)
                    {
                        var gas_project=m[pinyin[i]][j];

                        tb.find("td").eq(1).append($("<span class='cp hv' style='margin-right:20px'></span>").html(gas_project.project_name).attr("project_id", gas_project.project_id).attr("project_name", gas_project.project_name).click(function(){
                            var project_id = $(this).attr('project_id');
                            var project_name = $(this).attr('project_name');

                            _slf.addToHistory(project_id);

                            _slf.submitAllHistory(_slf.click_icon_callback);

                        }));
                    }


                }
            }


        }
        else
        {
            $("[name=chosen_games_by_pinyin]").html("没有找到！");
        }
    },


    _max_shown:18,

    addToHistory:function(project_id)
    {
        var parentDom=$("[name=my_projects_history]");

        var _slf=this;

        var e=parentDom.find(".favor_div[project_id="+project_id+"]");

        if(e.length>0)
        {
            parentDom.prepend(e);

            return;
        }

        var projects=G_LOCAL_STORAGE.get("user").gas_projects;

        var project_name='';

        for(var i=0; i<projects.length; ++i)
        {
            if(projects[i].project_id+''==project_id+'')
            {
                project_name = projects[i].project_name ;
                break;
            }
        }

        var max=_slf._max_shown;

        while(parentDom.find(".favor_div").length>max-1)
        {
            parentDom.find(".favor_div").eq(parentDom.find(".favor_div").length-1).remove();
        }

        var e=$("<div class='fl favor_div'><div class='favor cp'></div><div class='favor-desc tc'></div></div>");


        e.attr("project_id", project_id).find(".favor").attr("project_name", project_name).attr("project_id", project_id).click(function(){

            parentDom.prepend($(this).parent()); // 将刚点的游戏图片移动到最前面

            // 每次点击按钮后重新更新历史记录

            _slf.submitAllHistory(_slf.click_icon_callback);

        }).css({
            'background-image':'url(http://image.thinkinggame.cn/img/project/'+project_id+'.png),url(http://image.thinkinggame.cn/img/project/0.png)'
        });

        e.find(".favor-desc").html(project_name);

        parentDom.prepend(e);

    },
    loadHistory:function(){
        var projects_id=G_LOCAL_STORAGE.get("user").user.projects_id.split(",");

        var max_cnt=this._max_shown;

        var cur_banner = $("[name=my_projects_history]");

        var total_cnt=max_cnt;

        if(projects_id.length<total_cnt)
        {
            total_cnt = projects_id.length;
        }

        for(var i=total_cnt-1; i>=0; --i)
        {
            var project_id = projects_id[i];

            if(!project_id)
            {
                return;
            }

            g_choose_game.addToHistory(project_id);

        }
    },
    loadRecommend:function(){
        MyPost(G_CGI_URL.auth.GetUserRecommendProjectsServlet,
            {},
            ShowLoading,HideLoading,
            function(data)
            {
                var projects=G_LOCAL_STORAGE.get("user").gas_projects;

                var max_cnt=g_choose_game._max_shown;

                var cur_banner = $("[name=my_favorites]");

                for(var i=0; i<data.get.length && i<max_cnt; ++i)
                {
                    var project_id = data.get[i].project_id;

                    var project_name='';

                    for(var j=0; j<projects.length; ++j)
                    {
                        if(projects[j].project_id+''==project_id+'')
                        {
                            project_name = projects[j].project_name ;
                            break;
                        }
                    }

                    var e=$("<div class='fl'><div class='favor cp'></div><div class='favor-desc tc'></div></div>");

                    e.find(".favor").attr("project_name", project_name).attr("project_id", project_id).click(function(){

                        var project_id=$(this).attr('project_id');

                        g_choose_game.addToHistory(project_id);

                        g_choose_game.submitAllHistory(g_choose_game.click_icon_callback);

                    }).css({
                        'background-image':'url(http://image.thinkinggame.cn/img/project/'+project_id+'.png),url(http://image.thinkinggame.cn/img/project/0.png)'
                    });

                    e.find(".favor-desc").html(project_name);

                    cur_banner.append(e);
                }

            },
            function(data, msg, code){
                if(!msg)
                {
                    msg="操作失败！";
                }

                G_PopWnd.error(msg);
            });
    },
    submitAllHistory:function(callback){
        var projects_id = $.map($("[name=my_projects_history] .favor"), function(e){
           return $(e).attr("project_id")
        }).join(",");

        var cur_project_id=projects_id.split(',')[0];

        // 判断是否为demo登录用户，demo用户只能查看60这个业务
        if(IsDemoUser() && cur_project_id!="60")
        {
            $("[name=my_projects_history] *").remove();
            PopDemoAlert();
            return;
        }

        MyPost(G_CGI_URL.auth.Reg4Servlet,
            {
                projects_id:projects_id
            },
            ShowLoading,HideLoading,
            function(data)
            {
                var project_id=projects_id.split(',')[0];

                var project_name=G_LOCAL_STORAGE.GetProjectName(project_id);

                callback && callback(project_id, project_name);
            },
            function(data, msg, code){
                if(!msg)
                {
                    msg="操作失败！";
                }

                G_PopWnd.error(msg);
            });
    },
    submit1History:function(project_id, callback){

        MyPost(G_CGI_URL.auth.Reg4Servlet,
            {
                projects_id:project_id
            },
            ShowLoading,HideLoading,
            function(data)
            {
                callback && callback(project_id);
            },
            function(data, msg, code){
                if(!msg)
                {
                    msg="操作失败！";
                }

                G_PopWnd.error(msg);
            });
    },
    hide:function(){
        $("[name=reg4]").hide();

        this.SubmitFavor();
    }
};

// 常见问题
function floatPopQuestion()
{
    G_PopWnd.dialog("常见问题","<div><table class='aside-questions' style='width:600px;font-size:14px'>\
    <tr><td><div class='aside-question'>1、我想看的游戏为什么找不到？</div>\
    <div class='aside-question-answer'>目前我们添加了500多款游戏，如果您没有搜索到关注的游戏，可能是暂时没有添加到平台上，欢迎您使用申请添加游戏功能将游戏提交到平台，我们会尽快进行处理。</div></td></tr>\
    <tr><td><div class='aside-question'>2、我看的游戏为什么论坛或渠道很少？</div>\
    <div class='aside-question-answer'>游戏论坛帖子及评论数据来源于百度贴吧、兴趣部落、腾讯官方论坛、4399论坛、多玩论坛、17173游戏论坛、9游手机游戏论坛、18183手游论坛、手游宝、16163手游论坛、360游戏大厅、51wan、口袋巴士、bilibili游戏论坛、NGA论坛、网易官方论坛等。网站论坛报表仅展示有相关数据的论坛。<br/>游戏渠道评论数据来源于应用宝、appstore、豌豆荚、360手机助手、小米应用商店、百度手机助手、oppo软件商店、华为应用市场、vivo应用商店、魅族应用商店、安卓市场等。网站渠道评论报表仅展示有相关数据的渠道。</div></td></tr>\
    <tr><td><div class='aside-question'>3、游戏灯塔如何查看和使用？</div>\
    <div class='aside-question-answer'>游戏灯塔是依据玩家反馈的真实数据对游戏产品进行多维度、全方位的画像。<br/>\
    每个游戏默认分析近两周的数据，从正面、负面、其他反馈三个方面进行统计分析，得出用户反馈的核心价值点。比如BUG、更新后产生的问题、登录问题、游戏玩法及设计等。<br/>\
    用户可通过细化标签查看到，每个核心价值点具体的论坛或渠道的用户反馈。</div></td></tr>\
    <tr><td><div class='aside-question'>4、论坛或渠道报表不能查看当天的数据？</div>\
    <div class='aside-question-answer'>由于数据统计分析的特殊性，目前论坛报表只能查看截止到前一天的数据。若想查看当天数据，可以使用搜索功能。</div></td></tr>\
    </table></div>", "", 400, "", 6);

    $(".aside-question").each(function(v,d){
       $(d).click(function(){
           $(this).toggleClass("chosen").siblings(".aside-question-answer").slideToggle();
       });
    });
}

// 意见反馈
function floatPopMyOpinion()
{
    G_PopWnd.dialog("意见反馈","<div style='font-size:14px;padding-top:20px;padding-bottom:20px;'>" +
        "<div>" +
        "<span style='margin-right:50px' class='radiobox' _attr_name=opinion_type _attr_val=0 name='opinion_type' _checked='true'>用户体验</span>"+
        "<span style='margin-right:50px' class='radiobox' _attr_name=opinion_type _attr_val=1 name='opinion_type'>功能使用</span>"+
        "<span style='margin-right:50px' class='radiobox' _attr_name=opinion_type _attr_val=2 name='opinion_type'>bug反馈</span>" +
        "</div>" +
        "<div>" +
        "<textarea class='oc-input' name='opinion_msg' style='margin-top:20px;width:46em;height:20em' placeholder='您的反馈对我们很重要！我们将竭诚为您解决(不超过1000字)'></textarea>" +
        "</div>" +
        "<div style='text-align: center'>" +
        "<button style='margin-top:20px;padding:5px 10px;' onclick='SubmitOpinion()'>确认提交</button>" +
        "</div>" +
        "</div>",
        "",
        0,
        "",
        8);

    InitRadiobox();
}

function EvoAddMoreDataSource(e, placeholder1, placeholder2)
{
    var placeholder1 = placeholder1 || "如：百度贴吧";
    var placeholder2 = placeholder2 || "如：http://tieba.baidu.com/f?kw=刀塔传奇";

    var tbody=$(e).closest("tbody");
    tbody.prepend($("<tr name='new_data_source'><td style='padding:0px;padding-bottom:1em;width:10.5em'><input name='forum_name' class='aside-input' style='width:10em' placeholder='"+placeholder1+"'/></td><td style='padding:0px;padding-bottom:1em;'><input name='forum_url' class='aside-input' style='width:25em;' placeholder='"+placeholder2+"'/></td></tr>"));
}

function EvoChoose(e, which)
{
    var tables=$(e).closest(".evolution").find(">table");

    tables.hide().eq(which).show();

    tables.eq(0).show();

    $(e).parent().find(".chosen").removeClass("chosen");

    $(e).addClass("chosen");

    $(e).closest("table").find(".triangle").hide();

    $(e).find(".triangle").show();
}


function ProjectDataSourceAddServlet()
{
    var key="ProjectDataSourceAddServlet";

    if(IsDemoUser())
    {
        G_PopWnd.error("您尚未登录！");
        return;
    }

    var p = {};
    p.project_id = $("[name="+key+"]").find(".main-bar").attr("project_id");

    var new_data_sources = $("[name="+key+"]").find("[name=new_data_source]");

    var empty=true;

    for(var i=0; i<new_data_sources.length; ++i)
    {
        var forum_name=$(new_data_sources[i]).find("[name=forum_name]").val();
        var forum_url=$(new_data_sources[i]).find("[name=forum_url]").val();

        if(i==0)
        {
            p.forum_name_0=forum_name;
            p.forum_url_0=forum_url;

            if(forum_name)
            {
                empty=false;
            }
            if(forum_url)
            {
                empty=false;
            }
        }
        else if(i==1)
        {
            p.forum_name_1=forum_name;
            p.forum_url_1=forum_url;


            if(forum_name)
            {
                empty=false;
            }
            if(forum_url)
            {
                empty=false;
            }
        }
    }

    if(empty)
    {
        G_PopWnd.error("请至少填写一个数据源！");
        return;
    }

    MyPost(G_CGI_URL.oc[key],
        p,ShowLoading,HideLoading,
        function()
        {
            layer.closeAll();
            G_PopWnd.good("添加成功");
        },
        function(data, msg, code)
        {
            G_PopWnd.error("操作失败！"+msg);
        }
    );
}

// 改进计划
function floatPopEvolution()
{
    G_PopWnd.dialog("改进计划","<div class='evolution' style='width:625px'>" +
        "<table class='header'><tbody><tr><td class='chosen' onclick='EvoChoose(this, 1)'>申请添加新游戏<span class='triangle neutral'></span></td><td onclick='EvoChoose(this, 2)'>添加游戏词汇<span class='triangle neutral' style='display: none'></span></td><td onclick='EvoChoose(this, 3)'>添加参考数据源<span class='triangle neutral' style='display: none'></span></td></tr></tbody></table><table name='UserFollowProjectAddServlet'><caption><div>* 添加新游戏后，我们需要进行游戏相关信息核对，并进行数据抓取、分析工作，需要2~3天时间，   请耐心等待或联系客服。</div></caption><tbody><tr><td style='width:6em'>游戏类型：</td><td><span style='margin-right:25px' class='radiobox' _attr_name=project_type _attr_val=0 name='project_type' _checked='true'>手游</span><span style='margin-right:25px' class='radiobox' _attr_name=project_type _attr_val=1 name='project_type'>页游</span><span style='margin-right:25px' class='radiobox' _attr_name=project_type _attr_val=2 name='project_type'>端游</span></td></tr><tr><td style='width:6em'>游戏名称：</td><td><input name='project_name' placeholder='请填写游戏名称' class='aside-input' style='width:18em'/></td></tr><tr><td style='width:6em;vertical-align: top;padding-top:10px;'>游戏简介：</td><td><textarea class='oc-input' name='project_desc' placeholder='例如：游戏开发商，官网链接等介绍信息（不超过100字）' class='oc-input' style='width:100%;height:12em'/></td></tr><tr><td colspan=2 class='tc'><button style='padding:10px 20px;font-size:14px;' onclick='UserFollowProjectAddServlet()'>确认提交</button></td></tr></tbody></table>\
        <table  style='display: none' name='GasWordsClassifysAddServlet'><caption><div>*添加游戏的专有词汇，可以帮助系统更准确，更全面地理解玩家反馈的信息，为您提供更优质的数据分析服务。</div></caption><tbody><tr><td style='width:6em'>选择游戏：</td><td name='projects'></td></tr><tr><td>词汇分类：</td><td><input name='classify_name' style='width:22em' placeholder='请输入游戏词汇类别（如任务、技能、进阶等）' class='aside-input' style='width:18em'/></td></tr><tr><td style='vertical-align: top;padding-top: 20px;'>添加词汇：</td><td><textarea name='keywords' style='width:100%;height:12em;line-height: 3em' class='oc-input' placeholder='请输入词汇，以空格分隔'></textarea></td></tr><tr><td colspan=2 class='tc'><button style='padding:10px 20px;font-size:14px;' onclick='GasWordsClassifysAddServlet()'>确认提交</button></td></tr></tbody></table>\
        <table name='ProjectDataSourceAddServlet' style='display: none'><caption><div>*添加新数据源，我们可以为您关注的游戏产品接入更多论坛分析采样数据源，以提供更精准的分析结果。</div></caption><tbody><tr><td style='width:7em'>选择游戏：</td><td name='projects' ></td></tr><tr><td style='vertical-align: top;padding-top: 20px;'>已有数据源：</td><td name='current_data_sources'></td></tr><tr><td style='vertical-align: top;padding-top: 20px;'>申请新数据源：</td><td><table><tbody><tr style='display: none'><td colspan=2 style='padding-top:3px'><div name='add_click' style='cursor:pointer;border:1px dotted #ccc;text-align: center;line-height: 2.5em;background-color:#f7f7f7;width:479px;' onclick='EvoAddMoreDataSource(this)'>+&nbsp;增加数据源</div></td></tr></tbody></table></td></tr><tr><td colspan=2 class='tc'><button style='padding:10px 20px;font-size:14px;' onclick='ProjectDataSourceAddServlet()'>确认提交</button></td></tr></tbody></table></div>",
        "",
        500,
        "",
        7);

    InitRadiobox();

    EvoAddMoreDataSource($("[name=ProjectDataSourceAddServlet] [name=add_click]"), "如：18183论坛", "如：http://bbs.18183.com/forum-daotachuanqi-1.html");

    EvoAddMoreDataSource($("[name=ProjectDataSourceAddServlet] [name=add_click]"));

    var cur_project_id=GetProjectId();

    g_tiny_choose_game.attach($("[name=GasWordsClassifysAddServlet] [name=projects]"), cur_project_id, function(project_id, project_name){

    });

    g_tiny_choose_game.attach($("[name=ProjectDataSourceAddServlet] [name=projects]"), cur_project_id, function(project_id, project_name){
        G_LOGIN.GetGasCrawlerInfoAndGasAppsServlet(project_id, function(data){
            var container=$("[name=ProjectDataSourceAddServlet] [name=current_data_sources]").empty();

            var _ar = G_LOCAL_STORAGE.user.gas_crawler_info[project_id] ;

            for(var i=0; i<_ar.length; ++i)
            {
                container.append($("<a class='hv3' target=_blank style='text-decoration:none; display: inline-block;margin-right:20px;margin-bottom:10px;font-size:13px;'></a>").html(_ar[i].crawler_name).attr("href", (_ar[i].host+_ar[i].addr).replace("*","1")));
            }

        });
    });

}

function UserFollowProjectAddServlet()
{
    if(IsDemoUser())
    {
        G_PopWnd.error("您尚未登录！");
        return;
    }

    var key="UserFollowProjectAddServlet";

    var project_name=$("[name="+key+"]").find("[name=project_name]").val();

    if(project_name=="")
    {
        G_PopWnd.error("请填写游戏名称");
        return;
    }

    var project_type=$("[name="+key+"]").find("[name=project_type]:checked").attr('project_type');
    var project_desc=$("[name="+key+"]").find("[name=project_desc]").val();

    if(project_desc.length>100)
    {
        G_PopWnd.error("游戏描述不能超过100字");
        return;
    }

    MyPost(G_CGI_URL.oc[key],
        {
            project_name:project_name,
            project_type:project_type,
            project_desc:project_desc
        },ShowLoading,HideLoading,
        function()
        {
            layer.closeAll();
            G_PopWnd.good("您的反馈已收到，感谢您的反馈");
        },
        function(data, msg, code)
        {
            G_PopWnd.error("操作失败！"+msg);
        }
    );

}

function GasWordsClassifysAddServlet()
{
    if(IsDemoUser())
    {
        G_PopWnd.error("您尚未登录！");
        return;
    }

    var _e=$("[name=GasWordsClassifysAddServlet]");
    var classify_name=_e.find("[name=classify_name]").val().trim();
    var keywords=_e.find("[name=keywords]").val().trim().replace(/\s/g, ' ').replace(/\s+/g, ' ');

    var key="GasWordsClassifysAddServlet";

    var ar=keywords.split(" ");
    var word_number=0;
    if(ar[0]!="")
        word_number=keywords.split(" ").length;

    if(word_number==0)
    {
        G_PopWnd.error("请输入词汇");
        return;
    }

    if(classify_name=="")
    {
        G_PopWnd.error("请填写所属分类");
        return;
    }

    var project_id=$("[name=GasWordsClassifysAddServlet]").find(".main-bar").attr("project_id");


    var p={
        word_number:word_number,
        classify_name:classify_name,
        words:keywords,
        project_id:project_id
    };


    MyPost(G_CGI_URL.oc[key],
        p,ShowLoading,HideLoading,
        function()
        {
            layer.closeAll();
            G_PopWnd.good("添加成功");
        },
        function(data, msg)
        {
            G_PopWnd.error("操作失败！"+msg);
        }
    );
}

// 提交观点
function SubmitOpinion()
{
    var opinion_type=$("[name=opinion_type]:checked").attr('opinion_type');

    var opinion_msg=$("[name=opinion_msg]").val();

    if(opinion_msg=="")
    {
        G_PopWnd.error("请填写反馈内容");
        return;
    }


    if(opinion_msg.length>1000)
    {
        G_PopWnd.error("反馈的内容不能超过1000字");
        return;
    }

    MyPost(G_CGI_URL.asider.SubmitOpinionServlet,
        {
            opinion_type : opinion_type,
            opinion_msg  : opinion_msg
        },
        ShowLoading,
        HideLoading,
        function(data){
            layer.closeAll();
            G_PopWnd.good("您的反馈已收到，感谢您的反馈！");
        },
        function(){
            G_PopWnd.error("操作失败！");
        });
}

function floatSide()
{
    /*var f=function(){
     var top = $("#sider-container").offset().top;

     var s_height = $("body").scrollTop();

     var w_height = $(window).height();

     var offset = top-s_height-w_height;

     var c_height = $("#sider-container").find("[name=container]").height();

     var cur_top = -offset-c_height-30;

     var max_top = -c_height-30;

     if(cur_top>max_top)
     cur_top=max_top;

     $("#sider-container").find("[name=container]").animate({
     top:cur_top
     },100);
     };

     $(window).scroll(function(){
     var top = $("#sider-container").offset().top;

     var s_height = $("body").scrollTop();

     var w_height = $(window).height();

     var offset = top-s_height-w_height;

     var c_height = $("#sider-container").find("[name=container]").height();

     var cur_top = -offset-c_height-30;

     var max_top = -c_height-30;

     if(cur_top>max_top)
     cur_top=max_top;

     $("#sider-container").find("[name=container]").animate({
     top:cur_top
     },100);
     });
     */


    if($(".aside-container").length==0)
    {
        $("body").append($('<table name="container" class="aside-container" style="position:fixed;right:20px;bottom:160px">\
            <tr><td class="aside aside-1" onclick="floatPopQuestion()">常见<br/>问题</td></tr>\
            <tr><td class="aside aside-2" onclick="floatPopEvolution()">改进<br/>计划</td></tr>\
            <tr><td class="aside aside-3" onclick="floatPopMyOpinion()">意见<br/>反馈</td></tr>\
            </table>'));
    }

    function f()
    {
        var w = $(window).width()-1170-160;

        $(".aside-container").css({
            right:w/2+"px"
        });
    }

    $(window).resize(f);

    f();
}

function FitMenuTextCenter(text)
{
    $(".t_about .chosen>div").html(text).css("margin-left",-205).parent().unbind("click");
}

function ShowForumChannelTip(elem, content)
{
    $('[name=ForumChannelTip]').remove();

    var div=$("<div name='ForumChannelTip' style='position: absolute;z-index:19999999;opacity:0.7;background: #000000; color:#ffffff;width:290px;border-radius:5px;line-height:2em;padding:10px 20px;font-size:14px;'><div>"+content+"</div><div style='width:10px;height:10px;line-height:10px;text-align:center;cursor:pointer;position:absolute;right:10px;top:6px;font-size:20px;' onclick='$(this).parent().remove();'>×</div></div>").appendTo($('body'));



    div.css({
        "left":$(elem).offset().left-30,
        "top":$(elem).offset().top+30
    });

}