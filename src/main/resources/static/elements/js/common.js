$(function(){
    visitFromMobile();
});
if(window.location.host.toLowerCase().indexOf("thinkinggame.cn")>=0){
    var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write('<div style="display: none">'+unescape("%3Cspan id='cnzz_stat_icon_1259271417'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s4.cnzz.com/z_stat.php%3Fid%3D1259271417' type='text/javascript'%3E%3C/script%3E")+'</div>');
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?807f1c5d79f269ff4780a3018e230b2e";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
}
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
    _init:function(type,data,callback,callback2){
        switch(type){
            case 'open':
                if(!data.color)data.color = '#000';
                if(!data.shift)data.shift = 1;
                if(!data.shade)data.shade = '0.4';
                if(!data.closeBtn)data.closeBtn = data.closeBtn == 0 ? 0 : 1;
                layer.open({
                    type: data.type, //page层
                    area: [data.width, data.height],
                    title: data.title,
                    scrollbar: data.scroll,
                    closeBtn: data.closeBtn,
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
                    if(!data.offset)data.offset = 'auto';
                    layer.msg(data.content,{
                        offset:data.offset
                    });
                }
                break;
            case 'alert':
                if(data.icon){
                    layer.alert(data.content,{icon: data.icon,title:data.title,closeBtn:data.closeBtn},callback);
                }else{
                    layer.alert(data.content,callback);
                }
                break;
            case 'confirm':
                layer.confirm(data.content,{btn:data.btn,skin:data.skin,title:data.title,closeBtn:data.closeBtn},callback, callback2);
                break;
            case 'load':
                layer.load(data.type, {time: data.time*1000,shade: data.shade});
                break;
            case 'close':
                layer.closeAll();
                break;
            case 'checkAlert':
                G_Pop._init('close');
                G_Pop._init('alert',data,callback);
                break;
            case 'tips':
                layer.tips(data.content,data.dom, {
                    tips: [data.type,data.color],
                    time:3000
                });
                break;
        }
    }
}
var G_Storage = {
    _name:'G_LOCAL_STORAGE',
    _init:function(type){
        switch(type){
            case 'lastHotword':
                return 'LastChosenHotwordProjectId';
                break;
            case 'lastSuddenly':
                return 'LastChosenSuddenlyProjectId';
                break;
            case 'lastFace':
                return 'LastChosenFaceProjectId';
                break;
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
        /*
         var gameDemoId = demoProjectId();
         var demoUser = isDemoUser();
         if(demoUser && gameDemoId != id){
         openLogin();
         return false;
         }
         */
        G_Game._setLast(id);
        return true;
    },
    _url:function(type,id){
        switch(type){
            case 'light':
                if(this._init(id))G_Jump._go(type);
                break;
            case 'atlas':
                if(this._init(id)){
                    var url = G_Jump._getUrl('atlas');
                    G_Jump._go('base',url+'?g='+id);
                }
                break;
            case 'reg':
                G_Jump._go(type);
                break;
        }
    },
    _go:function(type,url){
        switch(type){
            case 'operation':
            case 'analysis':
            case 'radar':
            case 'price':
            case 'company':
            case 'join':
            case 'partner':
            case 'index':
            case 'main':
            case 'sigma':
            case 'light':
            case 'guide':
            case 'atlas':
            case 'login':
            case 'find':
            case 'reg':
            case 'service':
            case 'portrayal':
            case 'yuqin':
            case 'chat':
            case 'reci':
            case 'user':
            case 'identity':
            case 'password':
                top.window.location.href = G_Jump._getUrl(type);
                break;
            case 'checkgo':
                isDemoUser() ? openLogin() : top.window.location.href = url;
                break;
            case 'open':
                window.open(url);
                break;
            case 'buyItem':
                top.window.location.href = 'item.html?k=1';
                break;
            case 'pdf':
                window.open(G_Jump._getUrl(type));
                break;
            case 'reload':
                top.window.location.reload();
                break;
            default:
                top.window.location.href = url;
                break;
        }
    },
    _getUrl:function(type){
        switch(type){
            case 'sigma':
            case 'price':
            case 'company':
            case 'join':
            case 'partner':
            case 'operation':
            case 'analysis':
            case 'radar':
            case 'main':
            case 'index':
            case 'guide':
            case 'atlas':
            case 'light':
            case 'data':
            case 'login':
            case 'find':
            case 'article':
            case 'detail':
            case 'search':
            case 'service':
            case 'user':
            case 'password':
            case 'identity':
            case 'account':
            case 'item':
            case 'market':
            case 'pay':
            case 'order':
            case 'faq':
            case 'renew':
            case 'subscribe':
            case 'subscribeok':
            case 'pdf':
            case 'refresh':
            case 'insidepay':
                return type+'.html';
                break;
            case 'reg':
                return'register.html';
                break;
            case 'portrayal':
                return'face.html';
                break;
            case 'yuqin':
                return'assistant.html';
                break;
            case 'chat':
                return'talk.html';
                break;
            case 'chatresult':
                return'talkresult.html';
                break;
            case 'reci':
                return'hotword.html';
                break;
            case 'notices':
                return'notice_s.html';
                break;
            case 'alarmSuddenly':
                return'suddenly.html';
                break;
            case 'eventLost':
                return'lost.html';
                break;
            case 'actionReport':
                return'report.html';
                break;
            case 'reportDetail':
                return'report_s.html';
                break;
            case 'alarmLost':
                return'insidelost.html';
                break;
            case 'alarmPayUser':
                return'insidepay.html';
                break;
            case 'alarmLog':
                return'insidelog.html';
                break;
            case 'alarmAttribute':
                return'insideattribute.html';
                break;
            case 'actionBespoke':
                return'bespoke.html';
                break;
            case 'innerRationality':
                return'innerrationality.html';
                break;
            case 'reportHot':
                return'reporthot.html';
                break;
            case 'reportDeep':
                return'reportdeep.html';
                break;
            case 'reportRival':
                return'reportrival.html';
                break;
            case 'reportGuide':
                return'reportguide.html';
                break;
            case 'outsideAlarm':
            case 'outsideHotWord':
            case 'outsideAssistant':
            case 'outsideChat':
            case 'outsideCompare':
            case 'outsideFaceSummary':
            case 'outsideFaceDetail':
            case 'outsideFaceCompare':
                return 'outside.html#/'+type;
                break;
            case 'outsideCenter':
                return 'outside.html#/'+type+'/';
                break;
            case 'insideSummary':
                return 'inside.html#/'+type;
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
            case 'inner':
                return "http://image.thinkinggame.cn/img/inner_game/"+id+".png";
                break;
            case 'medium':
                return "http://image.thinkinggame.cn/img/project_medium/"+id+".png";
                break;
            default:
                return "http://image.thinkinggame.cn/img/project/"+id+".png";
                break;
        }
    },
    _imgSourceUrl:function(id,type){
        switch(type){
            case 'small':
                return "http://image.thinkinggame.cn/img/source/"+id+"_s.png";
                break;
            default:
                return "http://image.thinkinggame.cn/img/source/"+id+".png";
                break;
        }
    },
    _appClassify:function(){
        return ['','全游戏','体育','动作','娱乐场','家庭','小游戏','扑克牌','探险','教育','文字','智力','桌面','模拟','策略','街机','角色扮演','赛车','音乐','骰子'];
    },
    _classify:function(dom){
        return dom.attr("game_type");
    },
    _letter:function(dom){
        var letter = dom.html();
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
                        for(var i=0;i<data.hot_project_list.length;i++){
                            if(gameInfo[data.hot_project_list[i]]){
                                var key = data.hot_project_list[i];
                                var value = gameInfo[data.hot_project_list[i]];
                                var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                                var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                                str += '\
                                    <dl onclick="G_Jump._url(\'light\','+key+')">\
                                        <img src="'+value[0]+'">\
                                        <dt title="'+value[1]+'">'+gameName+'</dt>\
                                        <dd title="'+value[2]+'">'+gameCompany+'</dd>\
                                    </dl>';
                            }
                        }
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
                        for(var i=0;i<data.project_list.length;i++){
                            if(gameInfo[data.project_list[i]]){
                                var key = data.project_list[i];
                                var value = gameInfo[data.project_list[i]];
                                var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                                var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                                str += '\
                            <dl onclick="G_Jump._url(\'light\','+key+')">\
                                <img src="'+value[0]+'">\
                                <dt title="'+value[1]+'">'+gameName+'</dt>\
                                <dd title="'+value[2]+'">'+gameCompany+'</dd>\
                            </dl>';
                            }
                        }
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
    _chooseGame:function(dom,classifyDom,letterDom){
        var zone = dom;
        zone.html('');
        var letter = this._letter(letterDom);
        var classify = this._classify(classifyDom);
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
        zone.find('*').unbind().removeData();
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
    _getGame:function(data,limit,type){
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
                back[projects[i].project_id] = [this._imgUrl(projects[i].project_id,type),projects[i].project_name,projects[i].author,projects[i].game_type];
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
    _formatLastTypeName:function(type){
        var typeName = '';
        switch(type){
            case 'hotword':
                typeName = 'lastHotword';
                break;
            case 'suddenly':
                typeName = 'lastSuddenly';
                break;
            case 'lost':
                typeName = 'lastLost';
                break;
            case 'insideLost':
                typeName = 'lastInsideLost';
                break;
            case 'insidePay':
                typeName = 'lastInsidePay';
                break;
            case 'insideLog':
                typeName = 'lastInsideLog';
                break;
            case 'insideAttribute':
                typeName = 'lastInsideAttribute';
                break;
            case 'face':
                typeName = 'lastFace';
                break;
            default:
                typeName = 'last';
                break;
        }
        return typeName;
    },
    _getLast:function(type){
        switch(type){
            case 'insideLog':
            case 'insideAttribute':
            case 'insidePay':
            case 'insideLost':
                return G_Storage._get(G_Game._formatLastTypeName(type)) || null;
                break;
            default:
                return G_Storage._get(G_Game._formatLastTypeName(type)) || demoProjectId();
                break;
        }
    },
    _setLast:function(id,type){
        G_Storage._set(G_Game._formatLastTypeName(type),id);
    },
    _getCollect:function(type){
        if(isDemoUser())return;
        G_Port._ajax('collect_all','get',true,null,null,null,function(data,msg){
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
    _sourceName:function(source_type){
        source_type = parseInt(source_type);
        var storageSource = G_Storage._init('source');
        if(storageSource in G_Login._user){
            for(var i=0; i<G_Login._user.gas_source_dim.length; ++i){
                if(G_Login._user.gas_source_dim[i].source_type == source_type){
                    return G_Login._user.gas_source_dim[i].source_desc;
                }
            }
        }
        return '';
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
    },
    _dropInnerGame:function(games,gameId,dom){
        gameId = gameId ? gameId : games[0].game_id;
        G_GameId = gameId;
        var gameStr = '';
        var gameName = '';
        if(games){
            var hasGame = false;
            for(var i=0;i<games.length;i++){
                if(gameId+'' != games[i].game_id+''){
                    gameStr += '<li id="'+games[i].game_id+'"><img src="'+this._imgUrl(games[i].game_id,'inner')+'"> '+games[i].game_name+'</li>';
                }else{
                    hasGame = true;
                    gameName = games[i].game_name;
                }
            }
            if(!hasGame)gameStr = '';
        }
        var gameCur = '';
        if(gameName == ''){
            G_GameId = games[0].game_id;
            gameCur = G_Game._dropChoosed(games[0].game_id,games[0].game_name,'inner');
        }else{
            gameCur = G_Game._dropChoosed(gameId,gameName,'inner');
        }
        var str = '\
            <div id="gameDropChoose"><div class="gameDropCurrent">'+gameCur+'</div>\
                <div class="gameDropPop gameInner">\
                    <ul>'+gameStr+'</ul>\
                </div>\
            </div>';

        dom.html(str);
        G_Game._dropClick(dom);

        dom.find('ul li').each(function(){
            $(this).click(function(){
                var id = $(this).attr('id');
                var name = $(this).html();
                if(id && id != ''){
                    dom.find('.gameDropCurrent').html(G_Game._dropChoosed(id,name));
                    dom.find('.gameDropPop').slideUp("fast");
                    G_Jump._go('base','?g='+id);
                }
            });
        });
    },
    _dropBuyGame:function(gameIds,gameId,dom,itemId){
        var games = G_Game._getGame(gameIds,500);
        gameId = gameId ? gameId : games[0];
        var gameStr = '';
        var gameName = '';
        if(games){
            $.each(games,function(key,value){
                if(key+'' != gameId+''){
                    gameStr += '<li id="'+key+'">'+value[1]+'</li>';
                }else{
                    gameName = value[1];
                }
            })
        }
        var gameCur = G_Game._dropChoosed(gameId,gameName);
        var str = '\
            <div id="gameDropChoose"><div class="gameDropCurrent">'+gameCur+'</div>\
                <div class="gameDropPop">\
                    <ul>'+gameStr+'<div class="gameDropAdd c_cursor" onclick="G_Jump._go(\'base\',\''+G_Jump._getUrl('item')+'?k='+itemId+'\')"><i class="glyphicon glyphicon-plus-sign"></i> 添加更多游戏</div></ul>\
                </div>\
            </div>';

        dom.html(str);
        G_Game._dropClick(dom);

        dom.find('ul li').each(function(){
            $(this).click(function(){
                var id = $(this).attr('id');
                var name = $(this).html();
                if(id && id != ''){
                    dom.find('.gameDropCurrent').html(G_Game._dropChoosed(id,name));
                    dom.find('.gameDropPop').slideUp("fast");
                    G_Jump._go('base','?g='+id);
                }
            });
        });
    },
    _dropClick:function(dom){
        dom.find('.gameDropCurrent').click(function(){
            if(dom.find('.gameDropPop').is(":hidden")){
                dom.find('.gameDropPop').slideDown("fast");
            }else{
                dom.find('.gameDropPop').slideUp("fast");
            }
        });
        arrowPopClickClose(dom.find('.gameDropPop'));
    },
    _dropChoosed:function(gameId,gameName,type){
        var str = '<p data-i="'+gameId+'"><img src="'+this._imgUrl(gameId,type)+'">'+gameName+'<i class="glyphicon glyphicon-triangle-bottom"></i></p>';
        return str;
    },
    _dropChoose:function(gameId,dom,type){
        if(!gameId)gameId = demoProjectId();
        var games = G_Login._user;
        if(!(games && games.gas_projects)){
            return '';
        }
        var projects = games.gas_projects;
        var gameStr = '';
        var gameCur = '';
        for(var i=0; i<projects.length; i++){
            switch(type){
                case 'select':
                    if(i==0)gameCur += '<p style="text-indent: 10px; font-size: 14px">选择游戏...<i class="glyphicon glyphicon-triangle-bottom"></i></p>';
                    break;
                default:
                    if(projects[i].project_id == gameId)gameCur += '<p data-i="'+projects[i].project_id+'"><img src="'+this._imgUrl(projects[i].project_id)+'">'+projects[i].project_name+'<i class="glyphicon glyphicon-triangle-bottom"></i></p>';
                    break;
            }
            gameStr += '<li id="'+projects[i].project_id+'">'+projects[i].project_name+'</li>';
        }
        var str = '\
            <div id="gameDropChoose"><div class="gameDropCurrent">'+gameCur+'</div>\
                <div class="gameDropPop">\
                    <div class="gameDropSearch">\
                        <i class="glyphicon glyphicon-search"></i>\
                        <input type="text" id="gameSearch">\
                        </div>\
                    <ul><div class="gameDropNone">没有找到！</div>'+gameStr+'</ul>\
                </div>\
            </div>';

        dom.html(str);
        switch(type){
            case 'source':
                F_Game._getForum(gameId);
                break;
        }
        G_Game._dropClick(dom);
        var gameChooseTimeOut = '';
        dom.find('ul li').each(function(){
            $(this).click(function(){
                var id = $(this).attr('id');
                var name = $(this).html();
                if(id && id != ''){
                    if(type != 'select')dom.find('.gameDropCurrent').html(G_Game._dropChoosed(id,name));
                    dom.find('.gameDropPop').slideUp("fast");
                    switch(type){
                        case 'select':
                            F_Market._chooseGame(id,name);
                            break;
                        case 'compare':
                            F_Tag._getInfo(5,id);
                            break;
                        case 'source':
                            F_Game._getForum(id);
                            break;
                        case 'reload':
                            G_Jump._go('base','?g='+id);
                            break;
                    }
                }
            });
        });
        dom.find('input').keyup(function(){
            var val = $.trim($(this).val());
            clearTimeout(gameChooseTimeOut);
            gameChooseTimeOut = setTimeout(function(){
                G_Game._dropSearch(dom,val);
            },300);
        });
    },
    _dropSearch:function(dom,keyword){
        if(keyword && keyword != ''){
            var hasChoosed = false;
            dom.find('ul li').each(function(){
                if($(this).html().toLowerCase().indexOf(keyword.toLowerCase())>-1){
                    hasChoosed = true;
                    $(this).show();
                }else{
                    $(this).hide();
                }
            });
            hasChoosed ? dom.find('ul div').hide() : dom.find('ul div').show();
        }else{
            dom.find('ul div').hide();
            dom.find('ul li').each(function(){
                $(this).show();
            });
        }
    }
}
var G_Port = {
    _init:function(type){
        var url = G_Common._baseHost()+"rest/";
        switch(type){
            case 'indexRecom':
                return url+'v1/project/home/recom';
                break;
            case 'history':
                return url+'v1/user/project/histroy';
                break;
            case 'hotGame':
                return url+'v1/project/home/hot';
                break;
            case 'guessLike':
                return url+'v1/project/user/recommend';
                break;
            case 'collect_all':
                return url+'v1/user/project/collection';
                break;
            case 'collect_set':
                return url+'v1/service/proj/collection?action=collect';
                break;
            case 'collect_cancel':
                return url+'v1/service/proj/collection?action=uncollect';
                break;
            case 'login':
                return url+'v1/login/auth';
                break;
            case 'qqLogin':
                return url+'v1/login/qq/login';
                break;
            case 'logout':
                return url+'v1/login/logout';
                break;
            case 'check':
                return url+'v1/login/check';
                break;
            case 'gameInfo':
                return url+'v1/project/baseinfo';
                break;
            case 'gameArticle':
                return url+'ProjectRelatedArticleServlet';
                break;
            case 'insight':
                return url+'v1/lt/insight/common';
                break;
            case 'insightRelation':
                return url+'v1/lt/insight/detail';
                break;
            case 'hotWordTrend':
                return url+'v1/forum/termsdate/histogramagg';
                break;
            case 'insertCustomKeywords':
                return url+'v1/service/custom/keywords';
                break;
            case 'forumCommon':
                return url+'v1/forum/commondata';
                break;
            case 'forumTitle':
                return url+'v1/forum/postnum';
                break;
            case 'forumEmotion':
                return url+'v1/forum/distribute/attitudesgroup';
                break;
            case 'forumUseless':
                return url+'v1/forum/distribute/uselessclassify';
                break;
            case 'forumKeywords':
                return url+'v1/forum/distribute/keywords';
                break;
            case 'forumTopic':
                return url+'v1/forum/distribute/topic';
                break;
            case 'appChannelInfo':
                return url+'v1/channel/project/info';
                break;
            case 'appChannelChart':
                return url+'v1/channel/project/rating';
                break;
            case 'appWord':
                return url+'v1/channel/sentiworddistri';
                break;
            case 'appWordDay':
                return url+'v1/channel/sentiworddistri';
                break;
            case 'appRank':
                return url+'v1/project/appstore/rank';
                break;
            case 'articleRelation':
                return url+'v1/article/related';
                break;
            case 'articleHot':
                return url+'IndustryHotArticleServlet';
                break;
            case 'articleList':
                return url+'v1/article/home';
                break;
            case 'articleDetail':
                return url+'v1/article/detail';
                break;
            case 'crawlerAndApp':
                return url+'v1/gas/crawlerinfo/apps';
                break;
            case 'forumSearch':
                return url+'v1/forum/title';
                break;
            case 'forumDetail':
                return url+'v1/forum/reply';
                break;
            case 'appDetail':
                return url+'v1/channel/comments';
                break;
            case 'atlasList':
                return url+'v1/project/graph';
                break;
            case 'tagList':
                return url+'v1/project/tags';
                break;
            case 'gameFrom':
                return url+'v1/project/gamefrom';
                break;
            case 'opinion':
                return url+'v1/user/opinion';
                break;
            case 'addProject':
                return url+'v1/service/proj/userfollow';
                break;
            case 'addWord':
                return url+'v1/service/proj/wordsclassifys';
                break;
            case 'addSource':
                return url+'v1/service/proj/datasource';
                break;
            case 'serviceStatus':
                return url+'v1/service/custom';
                break;
            case 'serviceOpen':
                return url+'FreeTrialServlet';
                break;
            case 'userInfo':
                return url+'v1/user/details';
                break;
            case 'identity':
                return url+'v1/user/identity';
                break;
            case 'findUserCheck':
                return url+'Reg5Servlet';
                break;
            case 'password':
                return url+'v1/user/password';
                break;
            case 'appStoreClassify':
                return url+'v1/project/appstore/classify';
                break;
            case 'projectSearch':
                return url+'v1/project/search';
                break;
            case 'industryGeneral':
                return url+'v1/industry/trends';
                break;
            case 'industryGameType':
                return url+'v1/industry/gametype';
                break;
            case 'industryUserProvince':
                return url+'v1/industry/userprovince';
                break;
            case 'industryTypeDistri':
                return url+'v1/industry/typenum';
                break;
            case 'industryComplain':
                return url+'v1/industry/complain';
                break;
            case 'industryArticleDistri':
                return url+'v1/industry/article/distri';
                break;
            case 'industryArticleTopic':
                return url+'v1/industry/article/topic';
                break;
            case 'industryArticleHotWords':
                return url+'v1/industry/article/hotwords';
                break;
            case 'industryGameRank':
                return url+'v1/industry/article/gamerank';
                break;
            case 'industryAppStore':
                return url+'v1/industry/appstoretype';
                break;
            case 'industryAppstoreTypeRank':
                return url+'v1/industry/appstore/typerank';
                break;
            case 'register':
                return url+'v1/login/register';
                break;
            case 'captcha':
                return url+'v1/geetest/captcha';
                break;
            case 'sms':
                return url+'v1/login/sms';
                break;
            case 'projectListByTag':
                return url+'v1/project/tag';
                break;
            case 'checkMobile':
                return url+'v1/user/mobile';
                break;
            case 'resetPass':
                return url+'v1/login/password';
                break;
            case 'radar':
                return url+'v1/project/radar/stat';
                break;
            case 'assistantGetQuery':
                return url+'v1/service/opinionmonitor';
                break;
            case 'assistantAddQuery':
                return url+'v1/service/opinionmonitor/task';
                break;
            case 'assistantUpdate':
                return url+'v1/service/opinionmonitor/task';
                break;
            case 'assistantDel':
                return url+'v1/service/opinionmonitor/task';
                break;
            case 'hotWordGet':
                return url+'GetCustomKeywordsServlet';
                break;
            case 'hotWordUpdate':
                return url+'UserCustomKeywordsUpdateServlet';
                break;
            case 'hotWordDel':
                return url+'DeleteCustomKeywordsServlet';
                break;
            case 'faceProfileCustomer':
                return url+'v1/service/profile/custom';
                break;
            case 'faceProfileGlobal':
                return url+'v1/service/profile';
                break;
            case 'talkInfo':
                return url+'v1/service/gas/chatinfo';
                break;
            case 'talkAdd':
                return url+'v1/service/gas/chatinfo';
                break;
            case 'talkUpdate':
                return url+'v1/service/gas/chatinfo/analysis';
                break;
            case 'talkDel':
                return url+'v1/service/gas/chatinfo';
                break;
            case 'talkDetailTopic':
                return url+'v1/service/proj/chatinfo/topwords';
                break;
            case 'talkEmotion':
                return url+'v1/service/proj/chatinfo/attitude';
                break;
            case 'talkKeywords':
                return url+'v1/service/proj/chatinfo/keywords';
                break;
            case 'talkTopic':
                return url+'v1/service/proj/chatinfo/topic';
                break;
            case 'talkUser':
                return url+'v1/service/proj/chatinfo/active';
                break;
            case 'talkQueryPost':
                return url+'v1/service/gas/chatinfo/posts';
                break;
            case 'itemList':
                return url+'v1/item/';
                break;
            case 'itemShow':
                return url+'v1/item/';
                break;
            case 'couponCheck':
                return url+'v1/service/user/coupon';
                break;
            case 'orderAdd':
                return url+'v1/service/user/order';
                break;
            case 'orderDetail':
                return url+'v1/service/user/order';
                break;
            case 'payAdd':
                return url+'v1/service/pay/charge';
                break;
            case 'payStatus':
                return url+'v1/service/pay/qr';
                break;
            case 'orderList':
                return url+'v1/service/user/order';
                break;
            case 'orderCancel':
                return url+'v1/service/user/order';
                break;
            case 'invoiceAdd':
                return url+'v1/service/invoice';
                break;
            case 'invoiceDetail':
                return url+'v1/service/invoice';
                break;
            case 'sigmaItWarn':
                return url+'v1/service/sigma/itwarn';
                break;
            case 'sigmaItWarnMailGet':
                return url+'v1/service/sigma/itwarn/config';
                break;
            case 'sigmaItWarnMailSet':
                return url+'v1/service/sigma/itwarn/mail';
                break;
            case 'sigmaItWarnDetail':
                return url+'v1/service/sigma/itwarn/details';
                break;
            case 'getCoupon':
                return url+'v1/service/user/coupon';
                break;
            case 'getOutflowRadar':
                return url+'v1/service/outflow/radar/data';
                break;
            case 'getOutflowSumType':
                return url+'v1/service/outflow/sumtype';
                break;
            case 'getOutflowSumReason':
                return url+'v1/service/outflow/sumreason';
                break;
            case 'getReportList':
                return url+'v1/service/report/user';
                break;
            case 'readReport':
                return url+'v1/service/report';
                break;
            case 'getOutflowDate':
                return url+'v1/service/outflow/date';
                break;
            case 'createBook':
                return url+'v1/service/report/book';
                break;
            case 'getBookList':
                return url+'v1/service/report/book/item';
                break;
            case 'wxLogin':
                return url+'v1/login/weixin/login';
                break;
            case 'bindMobile':
                return url+'v1/user/mobile/bind';
                break;
            case 'detailMobile':
                return url+'v1/user/details';
                break;
            case 'applyTryForFree':
                return url+'v1/service/user/free';
                break;
            case 'getBookReportList':
                return url+'v1/service/report/book';
                break;
            case 'isMobileReg':
                return url+'v1/login/register';
                break;
            case 'articleClassifyCount':
                return url+'v1/article/classify';
                break;
            case 'checkVerifyCode':
                return url+'v1/login/sms/check';
                break;
            case 'atlasProjectGraphList':
                return url+'v1/project/graph';
                break;
            case 'innerGame':
                return url+'v1/service/inner/game';
                break;
            case 'innerChart':
                return url+'v1/service/inner/chart';
                break;
            case 'innerGameChart':
                return url+'v1/service/inner/game/chart';
                break;
            case 'innerSearchMeta':
                return url+'v1/service/inner/search/meta';
                break;
            case 'innerSearch':
                return url+'v1/service/inner/search';
                break;
            case 'innerCsv':
                return url+'v1/service/inner/search/excel';
                break;
            case 'innerChartSave':
                return url+'v1/service/inner/chart';
                break;
            case 'innerReport':
                return url+'v1/service/inner/game/report';
                break;
            case 'innerLogType':
                return url+'v1/service/inner/gamelog/type';
                break;
            case 'innerLogMeta':
                return url+'v1/service/inner/gamelog/meta';
                break;
            case 'innerLogSearch':
                return url+'v1/service/inner/gamelog/search';
                break;
            case 'innerLogChart':
                return url+'v1/service/inner/gamelog/chart';
                break;
            case 'innerUserDetail':
                return url+'v1/service/inner/property/detail';
                break;
            case 'innerSearchCsv':
                return url+'v1/service/inner/search/excel';
                break;
            case 'getReportItem':
                return url+'v1/service/report/item';
                break;
        }
    },
    _ajax:function(type,postOrGet,sync,data,start,end,success,fail){
        var url = this._init(type);
        if(postOrGet == 'get'){
            data = data ? data+'&nocached='+new Date().getTime() : 'nocached='+new Date().getTime();
        }
        $.ajax({
            timeout:30000,
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
                fail && fail('','加载失败，请刷新重试');
            },
            success:function(back){
                end && end();
                try{
                    back.return_message = doXss(back.return_message);
                    switch(back.return_code+''){
                        case '0':
                            if (typeof back.data == 'string'){
                                if (back.data != ''){
                                    back.data = $.parseJSON(back.data);
                                }else
                                    back.data = {};
                            }
                            back.data = doXss(back.data) ;
                            success && success(back.data,back.return_message) ;
                            break;
                        case '-1001':
                        case '-1016':
                            setStatus('out');
                            top.openLogin();
                            break
                        case '-1047':
                            top.openBind();
                            break;
                        case  '-1004':
                            fail && fail(back.data,'加载超时，请稍后刷新重试',back.return_code);
                            break;
                        default:
                            fail && fail(back.data,back.return_message,back.return_code);
                            break;
                    }
                }catch(e){
                    console.log(e);
                    fail && fail('','加载失败，请联系管理员');
                }
            }
        });
    }
}
var G_Captcha = {
    _getCaptcha:function(dom){
        try{
            var url = G_Port._init('captcha');
            $.ajax({
                timeout:30000,
                async:true,
                type:'get',
                url:url,
                data:null,
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    G_Pop._init('msg','验证码生成失败，请刷新页面重试');
                    return;
                },
                success:function(config){
                    if(config){
                        window.G_CaptchaObj = new window.Geetest({
                            gt : config.gt,
                            challenge : config.challenge,
                            product : 'float',
                            offline : !config.success
                        });
                        G_CaptchaObj.appendTo('#'+dom);
                    }
                }
            });
        }catch (e){
            G_Pop._init('msg','验证码生成失败，请刷新页面重试');
            return;
        }
    },
    _refreshCaptcha:function(){
        G_CaptchaObj && G_CaptchaObj.refresh();
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
    _in:function(data,start,end,url){
        G_Storage._set('login',data.login_name);
        G_Port._ajax('login','post',true,data,start,end,
            function(data, msg){
                setStatus('out');
                G_Login._user = data;
                if(url.indexOf('Mobile/') > -1)G_Cookie._set('MobileLoginInit',1);
                url ? top.window.location.href=url : top.window.location.reload();
                return false;
            },
            function(data, msg, code){
                G_Pop._init('msg',{'content':msg});
                return false;
            }
        )
    },
    _out:function(url){
        G_Port._ajax('logout','post',true,{},null,null,
            function(data, msg){
                setStatus('out');
                url ? G_Jump._go('base',url) : top.window.location.reload();
            },
            function(data, msg, code){
                G_Pop._init('msg',{'content':msg});
            }
        )
    },
    _sessionStorage:function(type,key,value){
        switch(type){
            case 'get':
                try{
                    return sessionStorage.getItem(key);
                }catch(e){
                    return false;
                }
                break;
            case 'set':
                try{
                    sessionStorage.setItem(key,value);
                    return true;
                }catch(e){
                    return false;
                }
                break;
        }
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
        G_Login._user = G_Storage._get('user');
        //如果数据不全，强制刷新
        if(!update){
            if(!G_Login._user){
                update = true;
            }else{
                if(!G_Login._user.article_classify_dim || !G_Login._user.article_source_dim || !G_Login._user.gas_projects || !G_Login._user.gas_source_dim || !G_Login._user.project_detail_type_dim || !G_Login._user.project_tag_dim){
                    update = true;
                }else{
                    if(!isDemoUser() && !G_Login._user.user)update = true;
                }
            }
            if(!update){
                if(document.referrer.indexOf("lt.html")>=0)update = true;
            }
            if(!G_Login._sessionStorage('get','user'))update = true;
        }
        if(update){
            G_Port._ajax('check','post',false,{},null,null,
                function(data,msg){
                    G_Login._user = data;
                    G_Storage._set('user',data);
                    setStatus('game');
                    G_Login._sessionStorage('set','user',G_Date._current());
                    success && success(data);
                    return true;
                },
                function(data, msg, code){
                    fail && fail(data,msg,code);
                    return false;
                }
            );
        }
    },
    //登陆态消失或者登出后的状态
    _status:function(type){
        if(!isDemoUser()){
            $('.h_user').html('\
                <div class="h_info c_floatRight">\
                    <div class="my-service h_my_service c_cursor">我的服务</div>\
                    <span class="user-name c_cursor">'+this._nick('head')+'</span>\
                    <i class="glyphicon glyphicon-triangle-bottom"></i>\
                    <dl class="c_bgWhite c_border">\
                        <dd>个人中心</dd>\
                        <dd>退出登录</dd>\
                    </dl>\
                </div>');
            $('.h_info .user-name,.h_info i').click(function(){
                arrowPopOpen('user',{'open':$(".h_info dl")});
            });
            arrowPopClickClose($(".h_info dl"));
            $('.h_my_service').click(function () {
                G_Jump._go('open',G_Jump._getUrl('main'));
            });
            $('.h_info dl dd').each(function(index){
                $(this).click(function(){
                    switch(index){
                        case 0:
                            G_Jump._go('user');
                            break;
                        /*case 1:
                         G_Jump._go('portrayal');
                         G_Jump._go('open',G_Jump._getUrl('portrayal'));
                         break;*/
                        case 1:
                            G_Login._out();
                            break;
                    }
                });
            });
        }else{
            $('.h_user').html('<button class="my-service h_my_service">我的服务</button><button class="h_login">登录</button><button class="h_reg">注册</button>');
            $('.h_login').click(function(){
                openLogin();
            });
            $('.h_reg').click(function(){
                G_Jump._go('reg');
            });
            $('.h_my_service').click(function(){
                openLogin('service');
            });
            if(type){
                switch(type){
                    case 'light':
                        /*
                         var demoPorjectId = demoProjectId();
                         var lastProjectId = G_Game._getLast();
                         if(demoPorjectId != lastProjectId){
                         openLogin();
                         }
                         */
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
    _nick:function(type){
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
                        switch(type){
                            case 'head':
                                p11 += '*';
                                break;
                            default:
                                for(var i=1; i<p1.length; ++i){
                                    p11 += "*";
                                }
                                break;
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
    },
    _backUrl:function(type,url){
        var cookieName = 'CLoginBackUrl';
        switch(type){
            case 'set':
                var backUrl = url ? url : G_Common._lastUrl();
                if(backUrl){
                    var isExcepted = false;
                    var excepted = ['register','login','find'];
                    for(var i=0;i<excepted.length;i++){
                        if(backUrl.indexOf(excepted[i]) > -1){
                            isExcepted = true;
                        }
                    }
                    backUrl = G_Common._encodeUrl(backUrl);
                    if(!isExcepted)G_Cookie._set(cookieName,backUrl);
                }
                break;
            case 'get':
                var backUrl = G_Cookie._get(cookieName);
                if(backUrl){
                    G_Cookie._del(cookieName);
                    backUrl = G_Common._decodeUrl(backUrl);
                    return backUrl;
                }else{
                    return G_Jump._getUrl('index');
                }
                break;
            case 'reg':
                var backUrl = G_Cookie._get(cookieName);
                if(!backUrl)G_Login._backUrl('set');
                break;
        }
    },
    _loginBackUrl:function(){
        var url = G_Login._backUrl('get');
        if(url.toLowerCase().indexOf('_s.html')>-1){
            if(url.toLowerCase().indexOf('assistant') > -1){
                url = G_Jump._getUrl('yuqin');
            }else if(url.toLowerCase().indexOf('account') > -1){
                url = G_Jump._getUrl('account');
            }else if(url.toLowerCase().indexOf('hotword') > -1){
                url = G_Jump._getUrl('reci');
            }else if(url.toLowerCase().indexOf('talkresult') > -1){
                url = G_Jump._getUrl('chat');
            }else{
                url = G_Jump._getUrl('index');
            }
        }
        return url;
    }
}
var G_Service = {
    _getData:function(type){
        G_Port._ajax('itemList','get',true,null,function(){
                switch(type){
                    case 'menu':
                        $('.bs_service_inside').html(G_Pre._loading('c_padding30'));
                        $('.bs_service_outside').html(G_Pre._loading('c_padding30'));
                        $('.bs_service_report').html(G_Pre._loading('c_padding30'));
                        break;
                    case 'page':
                        $('.market-content').html(G_Pre._loading('c_padding30'));
                        break;
                }
            },function(){
                switch(type){
                    case 'menu':
                        $('.bs_service_inside').html('');
                        $('.bs_service_outside').html('');
                        $('.bs_service_report').html('');
                        break;
                    case 'page':
                        $('.market-content').html('');
                        break;
                }
            },function(data,msg){
                if(data.item_map && !G_Common._checkObjectIsEmpty(data.item_map)){
                    G_Services = data.item_map;
                    switch(type){
                        case 'menu':
                            G_Service._menuHtml();
                            break;
                        case 'page':
                            $('.market-content').html(F_Info._formatData(G_Services));
                            break;
                    }
                }
            },function(data,msg,code){
                switch(type){
                    case 'menu':
                        $('.bs_service_inside').html(G_Pre._empty(msg));
                        $('.bs_service_outside').html(G_Pre._empty(msg));
                        $('.bs_service_report').html(G_Pre._empty(msg));
                        break;
                    case 'page':
                        $('.market-content').html(G_Pre._empty(msg));
                        break;
                }
            }
        )
    },
    _menuList:function(){
        if(G_Services && !G_Common._checkObjectIsEmpty(G_Services)){
            G_Service._menuHtml();
        }else{
            G_Service._getData('menu');
        }
    },
    _menuHtml:function(){
        if(G_Services && !G_Common._checkObjectIsEmpty(G_Services)){
            if(G_Services['游戏外数据服务']){
                $('.bs_service_outside').html(G_Service._htmlItem(G_Services['游戏外数据服务']));
            }
            if(G_Services['游戏内数据服务']){
                $('.bs_service_inside').html(G_Service._htmlItem(G_Services['游戏内数据服务']));
            }
            if(G_Services['深度定制分析报告']){
                $('.bs_service_report').html(G_Service._htmlItem(G_Services['深度定制分析报告']));
            }
        }
    },
    _htmlItem:function(data){
        var  str = '';
        for(var i=0;i<data.length;i++){
            if(i>5)break;
            str += '<dl onclick="G_Jump._go(\'base\',\''+G_Jump._getUrl('item')+'?k='+data[i]['item_id']+'\')"><dt>'+data[i]['item_name']+'</dt><dd>'+data[i]['item_slogan']+'</dd></dl>';
        }
        return str;
    }
}
var G_Security = {
    _salt:function(){
        return 'ko98108klka7n2jmqwopliuytrewbx72';
    },
    _rand:function(min,max){
        var range = max - min;
        var rand = Math.random();
        return (min + Math.round(rand * range));
    },
    _md5:function(data){
        return $.md5(data)
    }
}
var G_Cookie = {
    _set:function(name,val,expire){
        var d = new Date();
        d.setTime(d.getTime()+(expire*24*3600*1000));
        document.cookie = name+"="+val+";expires="+d.toGMTString()+";path=/";
    },
    _get:function(name){
        var cookies = document.cookie.split(";");
        var cookieValue = null;
        for(var i=0;i<cookies.length;i++){
            var cs = cookies[i].split("=");
            if($.trim(cs[0]) == name){
                cookieValue = cs[1];
                break;
            }
        }
        return cookieValue;
    },
    _del:function(name){
        G_Cookie._set(name,'',-1);
    }
};
var G_Article ={
    _previewImg:function(img,type){
        if(img && img != ''){
            if(type == 'gametanzi' || type == 'sfw' || type == 'n178' || type == 'youxiputao' || type == 'youxicheng' || type == 'wankr' || type == 'n07073' || type == 'candou' || type.indexOf('公众号') >= 0)G_Common._imgBuff([img]);
            return '<img src="'+img+'">';
        }else{
            return '<img src="elements/img/article_no_img.jpg">';
        }
    },
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
                return {img:'elements/img/mediarticle/company.png',color:'#9DBF5E',styleClass:'h_qkTb7',position:'article_icon_company'};
                break;
            case '前沿':
                return {img:'elements/img/mediarticle/front.png',color:'#FDD644',styleClass:'h_qkTb9',position:'article_icon_leading'};
                break;
            case '研发':
                return {img:'elements/img/mediarticle/research.png',color:'#FF895A',styleClass:'h_qkTb10',position:'article_icon_research'};
                break;
            case '行业':
                return {img:'elements/img/mediarticle/indus.png',color:'#A9D443',styleClass:'h_qkTb8',position:'article_icon_industry'};
                break;
            case '电竞':
                return {img:'elements/img/mediarticle/game.png',color:'#ff9800',styleClass:'h_qkTb5',position:'article_icon_game'};
                break;
            case '人物':
                return {img:'elements/img/mediarticle/person.png',color:'#FDB040',styleClass:'h_qkTb6',position:'article_icon_people'};
                break;
            default:
                return {img:'elements/img/mediarticle/other.png',color:'#2da5df',styleClass:'h_qkTb11',position:'article_icon_other'};
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
        return key;
    }
}
var G_Date = {
    _getUnixTimeCurrent:function(date){
        var date = this._strTo(date);
        return Math.round(date.getTime()/1000);
    },
    _getUinxTime:function(diff){
        return Math.round(new Date().getTime()/1000)+(diff*86400);
    },
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
        var back = date;
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
    _dateArr:function(begin,end,type){
        begin = this._strTo(begin);
        end = this._strTo(end);
        switch(type){
            case 'year':
                var back = [];
                for(var d = begin; d.getTime() <= end.getTime(); d.setDate(d.getDate() + 1)) {
                    back.push({'small':d.format('MM/dd'),'big':d.format('yyyy-MM-dd')});
                }
                break;
            default:
                var back = {};
                for(var d = begin; d.getTime() <= end.getTime(); d.setDate(d.getDate() + 1)) {
                    switch(type){
                        case 'year':
                            back = [];
                            back.push({'small':d.format('MM/dd'),'big':d.format('yyyy-MM-dd')});
                            break;
                        default:
                            back[d.format('MM/dd')] = d.format('yyyy-MM-dd');
                            break;
                    }
                }
                break;

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
                case 'mini':
                    format = "yyyy/MM/dd HH:mm";
                    break;
            }
            switch(typeof date) {
                case "string":
                    date = new Date(date.replace(/-/g, "/"));
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
    },
    _dateChart:function(date){
        var date = new Date(date);
        var month = (date.getMonth() + 1) < 10 ? '0'+(date.getMonth() + 1) : (date.getMonth() + 1);
        var day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
        var texts = [month, day];
        return texts.join('/');
    },
    _hourChart:function(date){
        var date = G_Date._strTo(date);
        var hour = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
        var minute = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
        var texts = [hour, minute];
        return texts.join(':');
    },
    _dateDiffDays:function(begin,end){
        try{
            begin = new Date(begin.replace(/-/g, "/"));
            end = new Date(end.replace(/-/g, "/"));
            var days = end.getTime() - begin.getTime();
            return parseInt(days / (1000 * 60 * 60 * 24))+1;
        }catch(e){
            return false;
        }
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
    return 134;
}
function isDemoUser(){
    //return !!(G_Login._user && G_Login._user.user && G_Login._user.user.nick_name === 'demo');
    return !(G_Login._user && G_Login._user.user && G_Login._user.user.nick_name !== 'demo');
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
        case 'bind':
            switch(status){
                case 'disable':
                    dom.text('绑定中,请稍等...').attr('disabled',true);
                    break;
                case 'normal':
                    dom.text('绑定手机号').attr('disabled',false);
                    break;
            }
            break;
        case 'reg':
            switch(status){
                case 'disable':
                    dom.text('注册中,请稍等...').attr('disabled',true);
                    break;
                case 'normal':
                    dom.text('注册').attr('disabled',false);
                    break;
            }
            break;
        case 'find':
            switch(status){
                case 'disable':
                    dom.text('保存中,请稍等...').attr('disabled',true);
                    break;
                case 'normal':
                    dom.text('确认重置').attr('disabled',false);
                    break;
            }
            break;
        case 'check':
            switch(status){
                case 'disable':
                    dom.text('验证中,请稍等...').attr('disabled',true);
                    break;
                case 'normal':
                    dom.text('下一步').attr('disabled',false);
                    break;
            }
            break;
        case 'coupon':
            switch(status){
                case 'disable':
                    dom.text('验证中,请稍等...').attr('disabled',true);
                    break;
                case 'normal':
                    dom.text('添加').attr('disabled',false);
                    break;
            }
            break;
        case 'alter':
            switch(status){
                case 'disable':
                    dom.text('修改中,请稍等...').attr('disabled',true);
                    break;
                case 'normal':
                    dom.text('修改').attr('disabled',false);
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
            if(back.pageCount > 1000)back.pageCount = 1000;
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
        if(data.pageCount > 1){
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
                        str += '<span class="prev page-op" disabled>上一页</span>';
                    }else{
                        str += '<span class="prev page-op">上一页</span>';
                    }
                    str += '';
                    str += ' <span class="page-num">第<input type="text" value="'+data.page+'">页</span><span class="confirm"><button data-a="'+data.pageCount+'">确定</button></span>';
                    if(data.page >= data.pageCount){
                        str += '<span class="next page-op" disabled>下一页</span>';
                    }else{
                        str += '<span class="next page-op">下一页</span>';
                    }
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
function submitBind(dom,hover){
    if(hover){
        hover.keyup(function(event){
            var eventCode = (event.keyCode ? event.keyCode : event.which);
            if(eventCode == '13')dom.click();
        });
    }
}
function htmlspecialchars_encode(str) {
    return str.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
}
function htmlspecialchars_decode(str) {
    str = str.replace(/(\\r|\\n|\\t)/g,"");
    str = str.replace(/\\/g,"");
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
    str = str.replace(/'/g,'"');
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
    var val = '';
    $("input:radio[name='"+dom+"']").each(function(){
        if($(this).prop("checked")==true){
            val = $(this).val();
        }
    });
    return val;
}
function checkboxVal(dom){
    var val = [];
    $("input:checkbox[name='"+dom+"']").each(function(){
        if($(this).prop("checked")==true){
            val.push($(this).val());
        }
    });
    return val.length>0 ? val.join(','):'';
}
var G_Common = {
    _qqUrl:function () {
        return 'http://b.qq.com/webc.htm?new=0&sid=800182808&eid=2188z8p8p8q8z8K8z8p8z&q=7';
    },
    _decodeUrl:function(data){
        data = data.replace(/\+/g, '%20');
        return decodeURIComponent(data);
    },
    _encodeUrl:function(data){
        return encodeURIComponent(data);
    },
    _cdnImgUrl:function(){
        return 'http://image.thinkinggame.cn/img/';
    },
    _lastUrl:function(){
        return document.referrer;
    },
    _isMail:function(data){
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(data);
    },
    _isMobile:function(data){
        return /^1\d{10}$/.test(data);
    },
    _isInner:function(){
        return (parent.window.location.href == window.location.href) ? false : true;
    },
    _parentUrl:function(){
        return parent.window.location.href;
    },
    _baseHost:function(){
        return (window.location.host.indexOf("127.0.0.1")>=0 || window.location.host.indexOf("192.")>=0) ? "http://"+window.location.host+"/" : "http://"+window.location.host+"/";
    },
    _browser:function(){
        var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
            return {name:'IE',version:(tem[1]||'')};
        }
        if(M[1]==='Chrome'){
            tem=ua.match(/\bOPR\/(\d+)/)
            if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
        return {
            name: M[0],
            version: M[1]
        };
    },
    _replaceLeft:function(str){
        return str.replace(/\\/g,"");
    },
    _focusKeywords:function(keywords,data){
        if(data && keywords != ''){
            var reg = new RegExp('('+keywords+')','gi');
            return data.replace(reg,'<b class="c_colorR">$1</b>');
        }else{
            return data;
        }
    },
    _imgDecode:function(imgUrl){
        if(imgUrl){
            imgUrl = decodeURIComponent(imgUrl);
            return G_Common._replaceLeft(imgUrl);
        }else{
            return '';
        }
    },
    _imgBuff:function(imgUrls){
        for(var i=0;i<imgUrls.length;i++){
            try{
                $('<iframe style="display: none" id="img_'+i+'" frameborder=no border=0 src="javascript:\'<!doctype html><html><head><style>*{margin:0;padding:0}</style></head><body><div></div><img src=\\\''+decodeURIComponent(imgUrls[i])+'\\\' /></body></html>\'"></iframe>').appendTo('body');
            }catch(e){

            }
        }
    },
    _checkObjectIsEmpty:function(data){
        return JSON.stringify(data.group_info) == "{}" ? true : false;
    }
}
var G_AD = {
    _ad1:function(dom){
        var img = 'elements/img/post/';
        /*
         var date = G_Date._get(0);
         switch(date){
         case '2016-05-24':
         img += 'post-2.gif';
         break;
         case '2016-05-25':
         img += 'post-1.gif';
         break;
         default:
         img += 'post-a.jpg';
         break;
         }
         */
        img += 'post-a.png';
        dom.html('<img src="'+img+'" onclick="G_Jump._go(\'buyItem\')">');
    },
    _ad2:function(dom){
        var img = 'elements/img/post/';
        img += 'post-c.png';
        dom.html('<img src="'+img+'" onclick="G_Jump._go(\'pdf\')">');
    }
}
var G_Open = {
    _notice:function(title,width,height,url){
        G_Pop._init('close');
        G_Pop._init('open',{'type':2,'scroll':true,'title':title,'width':width,'height':height,'shift':2,'content':url},'');
    }
}
function openLogin(from){
    if(!from)from = ''
    G_Pop._init('close');
    G_Pop._init('open',{'type':2,'scroll':true,'title':'欢迎登录','width':'700px','height':'470px','shift':2,'content':'login_s.html?from='+from},'');
}
function openBind(){
    G_Pop._init('close');
    G_Pop._init('open',{'type':2,'scroll':true,'title':'绑定手机','width':'360px','height':'520px','shift':2,'content':'bind_s.html'},'');
}
function arrowPopOpen(type,dom){
    if(dom.close && !dom.close.is(":hidden"))dom.close.fadeOut('quick');
    if(dom.close2 && !dom.close2.is(":hidden"))dom.close2.fadeOut('quick');
    if(dom.open.is(":hidden"))dom.open.fadeIn('slow');
}
function arrowPopClickClose(dom){
    dom.unbind("hover").hover(function(){
        $('html,body').unbind('mousedown');
    }, function() {
        $('html,body').bind('mousedown', function(){
            dom.hide();
        });
    });
}
function GoToTop(){
    $("body,html").animate({
        'scrollTop':0
    },500);
}
function wordCloudShow(dom,words,callback,extraclass){
    var ratio = [];
    wordCloudObj = new WordCloud(dom, words, callback, extraclass, null, words.length, null, ratio);
}
var dataChoose = {
    _single:function(config,dom,start,end,callback){
        new pickerDateRange('dc'+dom, {
            autoCommit : config.autoCommit,
            isTodayValid : config.todayValid,
            minValidDate:config.minValidDate,
            startDate : start,
            endDate : end,
            isSingleDay : true,
            success : (function(s,e,dr){
                return function(obj) {
                    s.val(obj.startDate);
                    e.val(obj.endDate);
                    callback && callback(obj.startDate,obj.endDate);
                }
            })($("#db"+dom),$("#de"+dom),$("#dc"+dom))
        });
    },
    _section:function(config,dom,start,end,callback){
        new pickerDateRange('dc'+dom, {
            autoCommit : config.autoCommit,
            isTodayValid : config.todayValid,
            minValidDate:config.minValidDate,
            startDate : start,
            endDate : end,
            theme : 'ta',
            defaultText : ' 至 ',
            success : (function(s,e,dr){
                return function(obj) {
                    s.val(obj.startDate);
                    e.val(obj.endDate);
                    callback && callback(obj.startDate,obj.endDate);
                }
            })($("#db"+dom),$("#de"+dom),$("#dc"+dom))
        });
    }
}
function visitFromMobile(){
    var mobileVisitPc = G_Cookie._get('MobileVisitPc');
    if(!mobileVisitPc){
        var thisOS = navigator.platform;
        var os = new Array("iPhone","iPod","iPad","android","Nokia","SymbianOS","Symbian","Windows Phone","Phone","MAUI","UNTRUSTED/1.0","Windows CE","BlackBerry","IEMobile");
        var isLoginReg = false;
        if(window.location.href.toLowerCase().indexOf('register') > -1 || window.location.href.toLowerCase().indexOf('login') > -1)isLoginReg = true;
        for(var i=0;i<os.length;i++){
            if(!isLoginReg && thisOS.match(os[i])){
                var url = G_Common._baseHost();
                window.location.href = url+'Mobile';
                return false;
                break;
            }
        }
    }
}