var G_Pre = {
    _loading:function(useClass){
        if(useClass){
            return '<div class="c_loading '+useClass+'"><img src="elements/img/loading.gif"></div>';
        }else{
            return '<div class="c_loading"><img src="elements/img/loading.gif"></div>';
        }
    },
    _empty:function(msg,useClass){
        if(useClass){
            return '<div class="c_empty '+useClass+'">'+msg+'</div>';
        }else{
            return '<div class="c_empty">'+msg+'</div>';
        }
    }
}
var G_Pop = {
    _init:function(type,data,callback){
        switch(type){
            case 'open':
                if(!data.color)data.color = '#000';
                if(!data.shift)data.shift = 1;
                if(!data.shade)data.shade = '0.4';

                layer.open({
                    type: data.type, //page层
                    area: [data.width, data.height],
                    title: data.title,
                    scrollbar: data.scroll,
                    shade: [data.shade, data.color], //遮罩透明度
                    moveType: 1, //拖拽风格，0是默认，1是传统拖动
                    shift: data.shift, //0-6的动画形式，-1不开启
                    content: data.content
                });
                break;
            case 'msg':
                if(data.icon){
                    layer.msg(data.content, {icon: data.icon});
                }else{
                    layer.msg(data.content);
                }
                break;
            case 'alert':
                if(data.icon){
                    layer.alert(data.content, {icon: data.icon});
                }else{
                    layer.alert(data.content);
                }
                break;
            case 'confirm':
                layer.confirm(data.content, function(index){
                    callback
                });
                break;
            case 'load':
                layer.load(data.type, {time: data.time*1000});
                break;
            case 'close':
                layer.closeAll();
                break;
            case 'checkAlert':
                G_Pop._init('close');
                G_Pop._init('alert',data);
                break;
        }
    }
}
var G_Storage = {
    _name:'G_LOCAL_STORAGE',
    _init:function(type){
        switch(type){
            case 'last':
                return 'LastChosenProjectId';
                break;
            case 'user':
                return 'user';
                break;
            case 'collect':
                return 'collect';
                break;
            case 'game':
                return 'gas_crawler_info_gas_apps';
                break;
            case 'login':
                return 'login_name';
                break;
            case 'crawler':
                return 'gas_crawler_info';
                break;
            case 'app':
                return 'gas_apps';
                break;
            case 'source':
                return 'gas_source_dim';
                break;
            case 'status':
                return 'status';
                break;
            case 'type':
                return 'project_detail_type_dim';
                break;
        }
    },
    _get:function(type){
        var result = store.get(this._name);
        var key = this._init(type);
        return (result && result[key]) ? result[key] : '';
    },
    _set:function(type,value){
        var result = store.get(this._name);
        if(!result)result = {};
        var key = this._init(type);
        result[key] = value;
        store.set(this._name,result);
    }
}
var G_Jump = {
    _init:function(id){
        var gameDemoId = demoProjectId();
        var demoUser = isDemoUser();
        if(demoUser && gameDemoId != id){
            openLogin();
            return false;
        }
        G_Game._setLast(id);
        return true;
    },
    _url:function(type,id){
        switch(type){
            case 'light':
                if(this._init(id))G_Jump._go(type);
                break;
            case 'atlas':
                if(this._init(id))G_Jump._go(type);
                break;
            case 'reg':
                G_Jump._go(type);
                break;
        }
    },
    _go:function(type,url){
        switch(type){
            case 'index':
                top.window.location.href = G_Jump._getUrl(type);
            case 'light':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            case 'atlas':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            case 'login':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            case 'find':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            case 'reg':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            case 'service':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            case 'portrayal':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            case 'yuqin':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            case 'chat':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            case 'reci':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            case 'user':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            case 'identity':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            case 'password':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            default:
                top.window.location.href = url;
                break;
        }
    },
    _getUrl:function(type){
        switch(type){
            case 'index':
                return 'index.html';
                break;
            case 'atlas':
                return 'atlas.html';
                break;
            case 'light':
                return 'light.html';
                break;
            case 'data':
                return 'data.html';
                break;
            case 'atlas':
                return'atlas.html';
                break;
            case 'login':
                return'login.html';
                break;
            case 'find':
                return'reg.html?reg=5';
                break;
            case 'reg':
                return'reg.html';
                break;
            case 'article':
                return'article.html';
                break;
            case 'detail':
                return'detail.html';
                break;
            case 'search':
                return'search.html';
                break;
            case 'service':
                return'service.html';
                break;
            case 'portrayal':
                return'portrayal.html';
                break;
            case 'yuqin':
                return'yuqin.html';
                break;
            case 'chat':
                return'chat.html';
                break;
            case 'reci':
                return'reci.html';
                break;
            case 'user':
                return'user.html';
            case 'identity':
                return'identity.html';
                break;
            case 'password':
                return'password.html';
                break;
        }
    }
}
var G_User = {
    _getData:function(){
        var user = G_Login._user;
        if(!(user && user.user)){
            return '';
        }else{
            return user.user;
        }
    },
    _setData:function(data){
        var user = G_Login._user;
        if(!(user && user.user)){
            return '';
        }else{
            var isStorage = false;
            $.each(user.user,function(key,value){
                var index = $.inArray(key,data.key);
                if(index > -1){
                    isStorage = true;
                    user.user[key] = data.val[index];
                }
            });
            if(isStorage){
                G_Storage._set('user',user);
            }
        }
    }
}
var G_Game = {
    _id:function(){
        var gameId = this._getLast();
        return gameId;
    },
    _imgUrl:function(id,type){
        switch(type){
            case 'medium':
                return "http://image.thinkinggame.cn/img/project_medium/"+id+".png";
                break;
            default:
                return "http://image.thinkinggame.cn/img/project/"+id+".png";
                break;
        }


    },
    _imgSourceUrl:function(id){
        return "http://image.thinkinggame.cn/img/source/"+id+".png";
    },
    _classify:function(){
        return $(".h_qkTab .dlOn").attr("game_type");
    },
    _letter:function(){
        var letter = $(".h_qkChoose .liOn").html();
        return (letter =='0-9') ? '0123456789' : letter;
    },
    _menuHotGame:function(index,limit){
        G_Port._ajax('hotGame','get',true,'index='+index+'&limit='+limit,function(){
                $('.h_qkList').html(G_Pre._loading());
            },function(){
                $('.h_qkList').html('');
            },function(data,msg){
                if(data && data.hot_project_list.length > 0){
                    var str = '';
                    var gameInfo = G_Game._getGame(data.hot_project_list);
                    if(gameInfo){
                        $.each(gameInfo,function(key,value){
                            var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                            var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                            str += '\
                            <dl onclick="G_Jump._url(\'light\','+key+')">\
                                <img src="'+value[0]+'">\
                                <dt title="'+value[1]+'">'+gameName+'</dt>\
                                <dd title="'+value[2]+'">'+gameCompany+'</dd>\
                            </dl>';
                        });
                    }
                    $('.h_qkList').html(str);
                }
            },function(data,msg,code){
                $('.h_qkList').html(G_Pre._empty(msg));
            }
        )
    },
    _menuGuessLikeList:function(index,limit){
        G_Port._ajax('guessLike','get',true,'project_id='+G_GameId,function(){
                $('.bs_favorite').html(G_Pre._loading());
            },function(){
                $('.bs_favorite').html('');
            },function(data,msg){
                if(data && data.get.length > 0){
                    var str = '';
                    var gameId = [];
                    for(var i=0;i<data.get.length;i++){
                        gameId.push(data.get[i].project_id);
                    }
                    var gameInfo = G_Game._getGame(gameId);
                    if(gameInfo){
                        $.each(gameInfo,function(key,value){
                            var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                            var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                            str += '\
                            <dl onclick="G_Jump._url(\'light\','+key+')">\
                                <img src="'+value[0]+'">\
                                <dt title="'+value[1]+'">'+gameName+'</dt>\
                                <dd title="'+value[2]+'">'+gameCompany+'</dd>\
                            </dl>';
                        });
                    }
                    $('.bs_favorite').html(str);
                }
            },function(data,msg,code){
                $('.bs_favorite').html(G_Pre._empty(msg));
            }
        )
    },
    _menuHistoryList:function(){
        G_Port._ajax('history','get',true,null,function(){
                $('.bs_history').html(G_Pre._loading());
            },function(){
                $('.bs_history').html('');
            },function(data,msg){
                if(data && data.project_list.length > 0){
                    var str = '';
                    var gameInfo = G_Game._getGame(data.project_list);
                    if(gameInfo){
                        $.each(gameInfo,function(key,value){
                            var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                            var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                            str += '\
                            <dl onclick="G_Jump._url(\'light\','+key+')">\
                                <img src="'+value[0]+'">\
                                <dt title="'+value[1]+'">'+gameName+'</dt>\
                                <dd title="'+value[2]+'">'+gameCompany+'</dd>\
                            </dl>';
                        });
                    }
                    $('.bs_history').html(str);
                }
            },function(data,msg,code){
                $('.bs_history').html(G_Pre._empty(msg));
            }
        )
    },
    _menuCollectList:function(){
        !!G_Collects ? G_Game._htmlMenuCollectList(G_Collects) : G_Game._getCollect('menu');
    },
    _htmlMenuCollectList:function(data){
        if(data){
            var str = '';
            var gameInfo = G_Game._getGame(data);
            if(gameInfo){
                $.each(gameInfo,function(key,value){
                    var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                    var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                    str += '\
                            <dl onclick="G_Jump._url(\'light\','+key+')">\
                                <img src="'+value[0]+'">\
                                <dt title="'+value[1]+'">'+gameName+'</dt>\
                                <dd title="'+value[2]+'">'+gameCompany+'</dd>\
                            </dl>';
                });
            }
            $('.bs_collect').html(str);
        }
    },
    _search:function(keyword){
        var games = G_Login._user;
        if(!games.gas_projects){
            return false;
        }
        var games = games.gas_projects;
        var m = [];
        if(keyword && keyword != ''){
            for(var i=0; i<games.length; ++i){
                if(games[i].project_name.toLowerCase().indexOf(keyword.toLowerCase())>-1){
                    m.push(games[i]);
                }
            }
        }else{
            for(var i=0; i<games.length; ++i){
                m.push(games[i]);
            }
        }
        return m;
    },
    _chooseGame:function(){
        var zone = $(".h_qkItem");
        zone.html('');
        var letter = this._letter();
        var classify = this._classify();
        var games = G_Login._user;
        if(!games.gas_projects){
            return false;
        }
        var games = games.gas_projects;
        var m = {};
        var founded = false;
        function hasLetterOrClassify(source,aim){
            for(var i=0; i<source.length; ++i){
                if(source[i] != ',' && aim.indexOf(source[i])>=0){
                    return true;
                }
            }
            return false;
        }
        for(var i=0; i<games.length; ++i){
            if(hasLetterOrClassify(classify, games[i].game_type) && hasLetterOrClassify(letter, games[i].pinyin)){
                founded = true;
                for(var k=0; k<games[i].pinyin.length; ++k){
                    if(games[i].pinyin[k]==","){
                        continue;
                    }else if(games[i].pinyin[k] in m){
                        m[games[i].pinyin[k]].push(games[i]);
                    }else{
                        m[games[i].pinyin[k]] = [games[i]];
                    }
                }
            }
        }
        var str = '';
        if(founded){
            for(var i=0; i<letter.length; ++i){
                if(letter[i] in m){
                    str += '<dl>';
                    str += '<dt>'+letter[i]+'</dt>';
                    for(var j=0; j<m[letter[i]].length; ++j){
                        var choose = m[letter[i]][j];
                        str += '<dd onclick="G_Jump._url(\'light\','+choose.project_id+')">'+choose.project_name+'</dd>';
                    }
                    str += '</dl><div class="clearfix"></div>';
                }
            }
        }else{
            str = G_Pre._empty('没有找到！');
        }
        zone.html(str);
    },
    _name:function(id){
        var games = G_Login._user;
        if(!(games && games.gas_projects)){
            return '';
        }
        var projects = games.gas_projects;
        for(var i=0; i<projects.length; ++i){
            if(projects[i].project_id == id)
                return projects[i].project_name;
        }
        return '';
    },
    _getGame:function(data,limit){
        var games = G_Login._user;
        if(!(games && games.gas_projects)){
            return '';
        }
        var projects = games.gas_projects;
        var back = {};
        var count = 1;
        for(var i=0; i<projects.length; i++){
            if(count > limit)break;
            if($.inArray(projects[i].project_id,data) > -1 || $.inArray(projects[i].project_id+'',data) > -1){
                back[projects[i].project_id] = [this._imgUrl(projects[i].project_id),projects[i].project_name,projects[i].author];
                count++;
            }
        }
        return back;
    },
    _type:function(types){
        var type = [{'S':'手游'},{'Y':'页游'},{'D':'端游'},{'W':'单机 电玩'}];
        var back = [];
        if(types){
            types = types.split(',');
            for(var i=0;i<types.length;i++){
                this._typeName(types[i]) ? back.push(this._typeName(types[i])) : '';
            }
        }
        return (back.length > 0 ? back.join(','): '')
    },
    _typeName:function(typeId){
        switch(typeId){
            case 'S':
                return '手游';
                break;
            case 'Y':
                return '页游';
                break;
            case 'D':
                return '端游';
                break;
            case 'W':
                return '单机 电玩';
                break;
        }
        return '';
    },
    _tag:function(data){
        if(!data)return '';
        var games = G_Login._user;
        if(!games.project_tag_dim){
            return '';
        }
        var back = {};
        var tags = games.project_tag_dim;
        for(var i=0; i<tags.length; i++){
            if($.inArray(tags[i].tag_id,data) > -1){
                back[tags[i].tag_id] = tags[i].tag_name;
            }
        }
        return back;
    },
    _tagAll:function(){
        var games = G_Login._user;
        if(!games.project_tag_dim){
            return '';
        }
        var back = {};
        var tags = games.project_tag_dim;
        for(var i=0; i<tags.length; i++){
            back[tags[i].tag_id] = tags[i].tag_name;
        }
        return back;
    },
    _getLast:function(){
        return G_Storage._get('last') || demoProjectId();
    },
    _setLast:function(id){
        G_Storage._set('last',id);
    },
    _getCollect:function(type){
        if(isDemoUser())return;
        G_Port._ajax('collect_all','get',true,'action=get_collections',null,null,function(data,msg){
            G_Collects = (data && data.collection_list) ? data.collection_list : [];
            if(type){
                switch(type){
                    case 'menu':
                        G_Game._htmlMenuCollectList(G_Collects)
                        break;
                }
            }
        },function(data,msg,code){
            G_Collects = [];
        });
    },
    _setCollect:function(id,dom,style){
        if(isDemoUser()){
            openLogin();
            return;
        }
        setTimeout(function(){
            if(G_Game._checkCollect(id)){
                G_Port._ajax('collect_cancel','get',true,'project_id='+id,function(){
                    $('#'+dom).removeClass(style+'On').addClass(style+'Off');
                },null,function(data,msg){
                    G_Collects = arrayRemove(G_Collects,id);
                },null);
            }else{
                G_Port._ajax('collect_set','get',true,'project_id='+id,function(){
                    $('#'+dom).addClass(style+'On').removeClass(style+'Off');
                },null,function(data,msg){
                    G_Collects.push(id);
                },null);
            }
        },300);
    },
    _checkCollect:function(id){
        return ($.inArray(id,G_Collects) > -1);
    },
    _exists:function(id){
        var result = G_Storage.get('game');
        if(result){
            var _buf = null;
            if(id in result){
                _buf = result[id];
            }else if(id+'' in p){
                _buf = result[id];
            }else{
                return false;
            }
            if( _buf.timeout < (new Date()).getTime() ){
                return false;
            }else{
                var storageCrawler = G_Storage._init('crawler');
                var storageApp = G_Storage._init('app');
                if(!(storageCrawler in this.user)){
                    G_Login._user.gas_crawler_info = {};
                }
                if(!(storageApp in this.user)){
                    G_Login._user.gas_apps = {};
                }
                G_Login._user.gas_crawler_info[id] = _buf[storageCrawler];
                G_Login._user.gas_apps[id] = _buf[storageApp];
                return true;
            }
        }else{
            return false;
        }
    },
    _source:function(source_type){
        source_type = parseInt(source_type);
        var storageSource = G_Storage._init('source');
        if(storageSource in G_Login._user){
            for(var i=0; i<G_Login._user.gas_source_dim.length; ++i){
                if(G_Login._user.gas_source_dim[i].source_type == source_type){
                    return G_Login._user.gas_source_dim[i];
                }
            }
        }
        return null;
    },
    _getType:function(type){
        var storageType = G_Storage._init('type');
        if(storageType in G_Login._user){
            if(type){
                for(var i=0; i<G_Login._user.project_detail_type_dim.length; ++i){
                    if(G_Login._user.project_detail_type_dim[i].detail_type == type){
                        return G_Login._user.project_detail_type_dim[i];
                    }
                }
            }else{
                return G_Login._user.project_detail_type_dim;
            }
        }
        return null;
    }
}
var G_Port = {
    _init:function(type){
        var url = (window.location.host.indexOf("127.0.0.1")>=0 || window.location.host.indexOf("192.")>=0) ? "http://"+window.location.host+"/web-server/" : "http://"+window.location.host+"/";
        switch(type){
            case 'history':
                return url+'UserProjectViewHistroyServlet';
                break;
            case 'hotGame':
                return url+'HotProjectListServlet';
                break;
            case 'guessLike':
                return url+'GetUserRecommendProjectsServlet';
                break;
            case 'collect_all':
                return url+'UserProjectCollectionServlet';
                break;
            case 'collect_set':
                return url+'UserProjectCollectionServlet?action=collect';
                break;
            case 'collect_cancel':
                return url+'UserProjectCollectionServlet?action=uncollect';
                break;
            case 'login':
                return url+'LoginServlet';
                break;
            case 'logout':
                return url+'LogoutServlet';
                break;
            case 'check':
                return url+'CheckLoginServlet.do';
                break;
            case 'gameInfo':
                return url+'ProjectBaseInfoServlet';
                break;
            case 'gameArticle':
                return url+'ProjectRelatedArticleServlet';
                break;
            case 'insight':
                return url+'LtInsightCommonServlet';
                break;
            case 'insightRelation':
                return url+'LtInsightDetailServlet';
                break;
            case 'hotWordTrend':
                return url+'ForumTermsDateHistogramAggServlet.do';
                break;
            case 'insertCustomKeywords':
                return url+'InsertCustomKeywordsServlet';
                break;
            case 'forumCommon':
                return url+'ForumCommonDataServlet';
                break;
            case 'forumTitle':
                return url+'ForumForumPostNumDistributeServlet.do';
                break;
            case 'forumEmotion':
                return url+'ForumAttitudesGroupDistributeServlet2.do';
                break;
            case 'forumUseless':
                return url+'ForumUselessClassifyDistriServlet';
                break;
            case 'forumKeywords':
                return url+'ForumKeywordsDistributeServlet.do';
                break;
            case 'forumTopic':
                return url+'ForumTopicDistriServlet';
                break;
            case 'appChannelInfo':
                return url+'ChannelProjChannelInfoMidServlet.do';
                break;
            case 'appChannelChart':
                return url+'ChannelProjChannelRatingDistriServlet.do';
                break;
            case 'appWord':
                return url+'ChannelSentiWordDistriServlet';
                break;
            case 'appWordDay':
                return url+'ChannelSentiWordDistriServlet';
                break;
            case 'appRank':
                return url+'ProjectAppstoreRankDistriServlet';
                break;
            case 'articleRelation':
                return url+'ArticleRelatedArticlesServlet';
                break;
            case 'articleHot':
                return url+'IndustryHotArticleServlet';
                break;
            case 'articleList':
                return url+'ArticleQueryServlet';
                break;
            case 'articleDetail':
                return url+'ArticleDetailServlet';
                break;
            case 'crawlerAndApp':
                return url+'GetGasCrawlerInfoAndGasAppsServlet';
                break;
            case 'forumSearch':
                return url+'ForumQueryPostsServlet.do';
                break;
            case 'forumDetail':
                return url+'ForumQueryReplyPostsServlet.do';
                break;
            case 'appDetail':
                return url+'ChannelQueryCommentsServlet.do';
                break;
            case 'atlasList':
                return url+'ProjectGraphListServlet';
                break;
            case 'tagList':
                return url+'ProjectTagListServlet';
                break;
            case 'gameFrom':
                return url+'ProjectQueryServlet';
                break;
            case 'opinion':
                return url+'SubmitOpinionServlet.do';
                break;
            case 'addProject':
                return url+'UserFollowProjectAddServlet.do';
                break;
            case 'addWord':
                return url+'GasWordsClassifysAddServlet.do';
                break;
            case 'addSource':
                return url+'ProjectDataSourceAddServlet.do';
                break;
            case 'serviceStatus':
                return url+'GetServiceServlet';
                break;
            case 'serviceOpen':
                return url+'FreeTrialServlet';
                break;
            case 'userInfo':
                return url+'Reg2Servlet';
                break;
            case 'identity':
                return url+'Reg3Servlet';
                break;
            case 'password':
                return url+'ChangePasswordServlet.do';
                break;
        }
    },
    _ajax:function(type,postOrGet,sync,data,start,end,success,fail){
        var url = this._init(type);
        $.ajax({
            timeout:10000,
            async:sync,
            type:postOrGet,
            url:url,
            data:data,
            beforeSend:function(){
                start && start();
            },
            complete:function(){},
            error:function(XMLHttpRequest, textStatus, errorThrown){
                end && end();
                fail && fail();
            },
            success:function(back){
                end && end();
                try{
                    back.return_message = doXss(back.return_message);
                    if (back.return_code+'' == '0'){
                        if (typeof back.data == 'string'){
                            if (back.data != '')
                                back.data = $.parseJSON(back.data);
                            else
                                back.data = {};
                        }
                        back.data = doXss(back.data) ;
                        success && success(back.data,back.return_message) ;
                    }else{
                        fail && fail(back.data,back.return_message,back.return_code);
                    }
                }catch(e){
                    console.log(e);
                    fail && fail();
                }
            }
        });
    }
}
var G_Login = {
    _pre:function(){
        var loginName = G_Storage._get('login');
        if(!loginName)loginName = '';
        return loginName;
    },
    _buff:function(){
        return G_Storage._get('user');
    },
    _user:{},
    _in:function(data,start,end){
        G_Storage._set('login',data.login_name);
        G_Port._ajax('login','post',true,data,start,end,
            function(data, msg){
                setStatus('out');
                G_Login._user = data;
                top.window.location.reload();
                return false;
            },
            function(data, msg, code){
                G_Pop._init('msg',{'content':msg});
                return false;
            }
        )
    },
    _out:function(){
        G_Port._ajax('logout','post',true,{},null,null,
            function(data, msg){
                setStatus('out');
                top.window.location.reload();
            },
            function(data, msg, code){
                G_Pop._init('msg',{'content':msg});
            }
        )
    },
    _check:function(success,fail){
        var update = true;
        var status = G_Storage._get('status');
        if(status && status.expire){
            var curDate = G_Date._current();
            var dateDiff = G_Date._diff(curDate,status.expire);
            if(dateDiff > 0){
                update = false;
            }
        }
        if(update){
            G_Port._ajax('check','post',false,{},null,null,
                function(data,msg){
                    G_Login._user = data;
                    G_Storage._set('user',data);
                    setStatus('game');
                    success && success(data);
                    return true;
                },
                function(data, msg, code){
                    fail && fail(data,msg,code);
                    return false;
                }
            );
        }else{
            G_Login._user = G_Storage._get('user');
        }
    },
    //登陆态消失或者登出后的状态
    _status:function(type){
        if(!isDemoUser()){
            $('.h_user').html('\
                <div class="h_info c_floatRight">\
                    <div class="h_ifMask">\
                        <img src="elements/img/user_icon.png">\
                        </div>\
                        <i class="glyphicon glyphicon-triangle-bottom"></i>\
                        <dl class="c_bgWhite c_border">\
                            <dt>'+this._nick()+'</dt>\
                            <dd>个人中心</dd>\
                            <dd>退出登录</dd>\
                        </dl>\
                    </div>\
                </div>');
            $('.h_info').click(function(){
                arrowPopOpen('user',{'open':$(".h_info dl")});
            });
            arrowPopClickClose($(".h_info dl"));
            $('.h_info dl dd').each(function(index){
                $(this).click(function(){
                    switch(index){
                        case 0:
                            G_Jump._go('user');
                            break;
                        case 1:
                            G_Login._out();
                            break;
                    }
                });
            });
        }else{
            $('.h_user').html('<button class="h_login">登录</button><button class="h_reg">注册用户</button>');
            $('.h_login').click(function(){
                openLogin();
            });
            $('.h_reg').click(function(){
                G_Jump._go('reg');
            });
            if(type){
                switch(type){
                    case 'light':
                        var demoPorjectId = demoProjectId();
                        var lastProjectId = G_Game._getLast();
                        if(demoPorjectId != lastProjectId){
                            openLogin();
                        }
                        break;
                    case 'user':
                        if(isDemoUser()){
                            G_Jump._go('login');
                        }
                        break;
                }
            }
        }
    },
    _nick:function(){
        var user = this._user.user;
        if(!!user && !!user.nick_name){
            var nick_name = user.nick_name;
            if(nick_name.indexOf("*")==0){
                // 自动生成的昵称
                if(user.mobile){
                    if(user.mobile.length>=11){
                        nick_name = user.mobile.substr(0,3)+"*****"+user.mobile.substr(8,11);
                    }
                }else if(user.email){
                    var p1 = user.email.split("@")[0];
                    var p2 = user.email.split("@")[1];
                    if(p1.length>1){
                        var p11 = p1[0] ;
                        for(var i=1; i<p1.length; ++i){
                            p11 += "*";
                        }
                        p1 = p11;
                    }
                    nick_name = p1+"@"+p2;
                }
            }
            return nick_name;
        }else{
            return '';
        }
    }
}
var G_Article ={
    _init:function(type){
        var data = G_Login._user;
        switch(type){
            case 'classify':
                if(!(data && data.article_classify_dim)){
                    return [];
                }else{
                    return data.article_classify_dim;
                }
                break;
            case 'source':
                if(!(data && data.article_source_dim)){
                    return [];
                }else{
                    return data.article_source_dim;
                }
                break;
        }
    },
    _imgUrl:function(mainClass){
        switch(mainClass){
            case '公司':
                return {img:'elements/img/mediarticle/company.png',color:'#9DBF5E'};
                break;
            case '前沿':
                return {img:'elements/img/mediarticle/front.png',color:'#FDD644'};
                break;
            case '研发':
                return {img:'elements/img/mediarticle/research.png',color:'#FF895A'};
                break;
            case '行业':
                return {img:'elements/img/mediarticle/indus.png',color:'#A9D443'};
                break;
            case '电竞':
                return {img:'elements/img/mediarticle/game.png',color:'#ff9800'};
                break;
            case '人物':
                return {img:'elements/img/mediarticle/person.png',color:'#FDB040'};
                break;
            default:
                return {img:'elements/img/mediarticle/other.png',color:'#2da5df'};
                break;
        }
    },
    _getClassify:function(){
        var classify = G_Article._init('classify');
        var back = {};
        for(var i=0; i<classify.length; ++i){
            back[classify[i].main_class] = {img:G_Article._imgUrl(classify[i].main_class),sub:classify[i].sub_class_list};
        }
        return back;
    },
    _getMainClass:function(className,type){
        var classify = G_Article._init('classify');
        var mainClass = '';
        if(className){
            for(var i=0; i<classify.length; ++i){
                if(classify[i].main_class == className){
                    mainClass = classify[i].main_class;
                    break;
                }else{
                    for(var d=0;d<classify[i].sub_class_list.length;d++){
                        if(classify[i].sub_class_list[d].sub_class == className){
                            mainClass = classify[i].main_class;
                            break;
                        }
                    }
                }
            }
        }
        switch(type){
            case 'img':
                return G_Article._imgUrl(mainClass);
                break;
            default:
                return mainClass;
                break;
        }
    },
    _getSource:function(key){
        if(!!key){
            var source = G_Article._init('source');
            for(var i=0;i<source.length;i++){
                if(key == source[i].source){
                    return source[i].source_name;
                }
            }
        }
        return '';
    }
}
var G_Date = {
    _current:function(){
       return (new Date()).getTime();
    },
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
    _diff:function(begin,end){
        return (end - begin);
    },
    _getByDiff:function(date,diff){
        if(date+'' === date)date = this._strTo(date);
        var back = new Date();
        back.setDate(date.getDate()+diff);
        return back.format('yyyy-MM-dd');
    },
    _get:function(diff){
        var _curDate = new Date();
        var back = new Date();
        back.setDate(_curDate.getDate()+diff);
        return back.format('yyyy-MM-dd');
    },
    _strTo:function(yyyyMMdd){
        var str = yyyyMMdd;
        str = str.replace(/-/g,"/");
        var date = new Date(str);
        return date;
    },
    _dateArr:function(begin,end){
        var back = {};
        begin = this._strTo(begin);
        end = this._strTo(end);
        for(var d = begin; d.getTime() <= end.getTime(); d.setDate(d.getDate() + 1)) {
            back[d.format('MM/dd')] = d.format('yyyy-MM-dd');
        }
        return back;
    },
    _dateFormat:function(type,date){
        if(date){
            var format = "yyyy-MM-dd";
            switch(type){
                case 'short':
                    format = "yyyy/MM/dd";
                    break;
            }
            switch(typeof date) {
                case "string":
                    date = new Date(date.replace(/-/, "/"));
                    break;
                case "number":
                    date = new Date(date);
                    break;
            }
            if (!date instanceof Date) return '';
            var dict = {
                "yyyy": date.getFullYear(),
                "M": date.getMonth() + 1,
                "d": date.getDate(),
                "H": date.getHours(),
                "m": date.getMinutes(),
                "s": date.getSeconds(),
                "MM": ("" + (date.getMonth() + 101)).substr(1),
                "dd": ("" + (date.getDate() + 100)).substr(1),
                "HH": ("" + (date.getHours() + 100)).substr(1),
                "mm": ("" + (date.getMinutes() + 100)).substr(1),
                "ss": ("" + (date.getSeconds() + 100)).substr(1)
            };
            return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
                return dict[arguments[0]];
            });
        }
         return '';
    }
}
function setStatus(type){
    var date = G_Date._current();
    var status = G_Storage._get('status');
    if(!status) status = {};
    switch(type){
        case 'game':
            status['expire'] = date+3600*1000;
            break;
        case 'out':
            status['expire'] = 0;
            break;
    }
    G_Storage._set('status',status);
}
function demoProjectId(){
    return 60;
}
function isDemoUser(){
    return !!(G_Login._user && G_Login._user.user && G_Login._user.user.nick_name === 'demo');
}
function btnStatus(type,status,dom){
    switch(type){
        case 'login':
            switch(status){
                case 'disable':
                    dom.text('登录中,请稍等...').attr('disabled',true);
                    break;
                case 'normal':
                    dom.text('登录').attr('disabled',false);
                    break;
            }
            break;
        case 'set':
            switch(status){
                case 'disable':
                    dom.text('提交中,请稍等...').attr('disabled',true);
                    break;
                case 'normal':
                    dom.text('确定').attr('disabled',false);
                    break;
            }
            break;
        case 'post':
            switch(status){
                case 'disable':
                    dom.text('提交中,请稍等...').attr('disabled',true);
                    break;
                case 'normal':
                    dom.text('确认提交').attr('disabled',false);
                    break;
            }
            break;
        case 'save':
            switch(status){
                case 'disable':
                    dom.text('保存中,请稍等...').attr('disabled',true);
                    break;
                case 'normal':
                    dom.text('保存').attr('disabled',false);
                    break;
            }
            break;
    }
}
function doXss(data){
    if(typeof data === "number"){
        return data;
    }else if(typeof data === "string"){
        // 换行是特例
        return data.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&lt;br&gt;/ig, "<br>").replace(/&lt;br\/&gt;/ig, "<br/>");
    }else if(data instanceof Array){
        for(var i=0; i<data.length; ++i){
            data[i] = doXss(data[i]);
        }
        return data;
    }else if(data instanceof Object){
        for(var key in data){
            data[key] = doXss(data[key]);
        }
        return data;
    }
}
function getUrl(type){
    var fullUrl = window.document.location.href.toString();
    var urlArray = fullUrl.split("?");
    var url = urlArray[0];
    var query = urlArray[1];

    switch(type){
        case 'query':
            if(typeof(query) == "string"){
                urlArray = query.split("&");
                var get = {};
                for(var i in urlArray){
                    var j = urlArray[i].split("=");
                    get[j[0]] = j[1];
                }
                return get;
            } else {
                return {};
            }
            break;
        case 'controller':
            url = url.toLowerCase();
            urlArray = url.split("/");
            var controller = urlArray.pop();
            controller = controller.replace('.html','');
            return controller;
            break;
    }
}
var G_Page = {
    _size:10,
    _number:2,
    _init:function(data){
        var back = {pageSize:10,pageCount:0,total:data.total};
        back.pageSize = data.pagesize ? data.pagesize : G_Page._size;
        if(data.total && data.total > 0){
            back.pageCount =  Math.ceil(data.total/back.pageSize);
        }
        data.page = data.page ? data.page : 1;
        back.page =  (data.page > back.pageCount) ? back.pageCount : data.page;
        return back;
    },
    _show:function(data,type){
        var pageInit = G_Page._init(data);
        return G_Page._format(pageInit,type);
    },
    _format:function(data,type){
        var str = '';
        var front = '';
        var back = '';
        if(data.pageSize > 0){
            switch(type){
                case 'number':
                    str += '<li>';
                    if(data.page <= 1){
                        front += '<span class="prev"><button type="" disabled>上一页</button></span>';
                    }else{
                        front += '<span class="prev"><button type="">上一页</button></span>';
                    }
                    if(data.pageCount > 5 && data.page > 3){
                        front += '<span class="page-num">1</span><span class="page-num">…</span>';
                    }
                    if(data.pageCount > 5 && (data.pageCount- data.page) > 3){
                        back += '<span class="page-num">…</span><span class="page-num">'+data.pageCount+'</span>';
                    }
                    if(data.page >= data.pageCount){
                        back += '<span class="next"><button type="" disabled>下一页</button></span>';
                    }else{
                        back += '<span class="next"><button type="">下一页</button></span>';
                    }
                    data.page = parseInt(data.page);
                    var pageBegin = data.page - parseInt(G_Page._number);
                    var pageEnd = data.page + parseInt(G_Page._number);

                    if (pageBegin < 1) {
                        pageEnd = pageEnd + (1 - pageBegin);
                        pageBegin = 1;
                    }
                    if (pageEnd > data.pageCount) {
                        pageBegin = pageBegin - (pageEnd - data.pageCount);
                        pageEnd = data.pageCount;
                    }
                    if (pageBegin < 1)pageBegin = 1;
                    str += front;
                    for(var i=pageBegin;i<=pageEnd;i++){
                        if (i == data.page){
                            str += '<span class="page-num num-selected">'+i+'</span>';
                        }else{
                            str += '<span class="page-num">'+i+'</span>';
                        }
                    }
                    str += back;
                    str += '</li><li class="page-num-total">共 <b>'+data.pageCount+'</b> 页 <b>'+data.total+'</b>个 结果</li>';
                    break;
                case 'simple':
                    str += '<li class="page-num-total">共 <b>'+data.pageCount+'</b> 页</li>';
                    str += '<li>';
                    if(data.page <= 1){
                        str += '<span class="prev page-op" disabled></span>';
                    }else{
                        str += '<span class="prev page-op"></span>';
                    }
                    str += '';
                    str += ' <span class="page-num">第<input type="text" value="'+data.page+'">页</span> ';
                    if(data.page >= data.pageCount){
                        str += '<span class="next page-op" disabled></span>';
                    }else{
                        str += '<span class="next page-op"></span>';
                    }
                    str += '</li>';
                    str += '<li>';
                    str += '<span class="confirm"><button data-a="'+data.pageCount+'" type="">确定</button></span>';
                    str += '</li>';
                    break;
            }
        }
        return str;
    }
}
function arrayRemove(array,item){
    var index = $.inArray(item,array);
    return array.slice(0,index).concat(array.slice(index+1,array.length));
}
function blankRemove(str){
    return str.replace(/\s+/g, "");
}
function submitBind(dom){
    $("body").keydown(function() {
        if (event.keyCode == "13") {//keyCode=13是回车键
            dom.click();
        }
    });
}
function htmlspecialchars_encode(str) {
    return str.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
}
function htmlspecialchars_decode(str) {
    str = str.replace('\\r','');
    str = str.replace('\\n','');
    var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){
        return arrEntities[t];
    });
}
function htmltTagScriptEscape(str) {
    str = str.replace(/<script[^>]*?>.*?<\\?\/script>/g,"");
    return str;
}
function htmltUnicodeTagScriptEscape(str) {
    str = str.replace(/script.*?\/script/g,"");
    return str;
}
function checkLength(which,maxC,showTag){
    var maxChars = maxC;
    if (which.value.length > maxChars)
        which.value = which.value.substring(0,maxChars);
    var curr = maxChars - which.value.length;
    $("#"+showTag).html(curr.toString());
}
function radioVal(dom){
    val = '';
    $("input:radio[name='"+dom+"']").each(function(){
        if($(this).prop("checked")==true){
            val = $(this).val();
        }
    });
    return val;
}