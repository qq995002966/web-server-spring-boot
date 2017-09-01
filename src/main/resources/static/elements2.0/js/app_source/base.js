var B_Cookie = {
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
        B_Cookie._set(name,'',-1);
    }
};
var B_Game = {
    _searchEmpty:function (keywords) {
      var str = '\
          <div class="b_empty">\
              <div class="des">\
                <img src="elements2.0/img/empty.png" alt="">\
                <span>没有找到与"'+keywords+'"相关的游戏</span>\
                <p>ThinkingGame中能够查询过千款热门的游戏舆情以及在AppStore排名靠前的游戏</p>\
                <p>如果没有直达你希望查询的游戏，可以向我们提交增加更多游戏的建议</p>\
                <button onclick="B_Login._openPlan()">申请添加游戏</button>\
              </div>\
           </div>';
        return str;
    },
    _collectCache:[],
    _getDemoProjectId:function(){
        return 134;
    },
    _setLast:function(id,type){
        B_Storage._set(type,id);
    },
    _getLast:function(type){
        return B_Storage._get(type) || B_Game._getDemoProjectId();
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
    _appClassify:function(){
        return ['','全游戏','体育','动作','娱乐场','家庭','小游戏','扑克牌','探险','教育','文字','智力','桌面','模拟','策略','街机','角色扮演','赛车','音乐','骰子'];
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
    _classify:function(dom){
        return dom.attr("game_type");
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
    _checkAuthMenu:function () {
        var games = B_Login._user;
        if(!(games && games.auth_opinion_monitor)){
            return false;
        }else{
            return true;
        }
    },
    _checkAuthChat:function () {
        var games = B_Login._user;
        if(!(games && games.auth_chat_analysis)){
            return false;
        }else{
            return true;
        }
    },
    _checkAuthGame:function (gameId) {
        var games = B_Login._user;
        if(!(games && games.auth_project_list && games.auth_project_list.length > 0)){
            return false;
        }else{
            if($.inArray(gameId,games.auth_project_list) > -1){
                return true;
            }else{
                return false;
            }
        }
    },
    _getAuthRecommend:function () {
        var games = B_Login._user;
        if(!(games && games.auth_project_list && games.gas_projects)){
            return '';
        }
        var back = null;
        var auteProjects = games.auth_project_list;
        if(auteProjects && auteProjects.length>0){
            auteProjects = auteProjects.slice(0,3);
            return B_Game._getGame(auteProjects,auteProjects.length);
        }
    },
    _getAuthGame:function () {
        if(B_Storage._get('AuthProjects')){
            return B_Storage._get('AuthProjects');
        }else{
            var games = B_Login._user;
            if(!(games && games.auth_project_list && games.gas_projects)){
                return '';
            }
            var auteProjects = games.auth_project_list;
            var projects = games.gas_projects;
            var projectsUnion = {};
            var back = [];
            for(var i=0; i<projects.length; i++){
                projectsUnion[projects[i].project_id] = projects[i];
            }
            for(var i=0;i<auteProjects.length;i++){
                if(projectsUnion[auteProjects[i]]){
                    back.push(projectsUnion[auteProjects[i]]);
                }
            }
            B_Storage._set('AuthProjects',back);
            return back;
        }
    },
    _getGame:function(data,limit,type){
        var games = B_Login._user;
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
    _dropChoosed:function(gameId,gameName,type){
        var str = '<img src="'+this._imgUrl(gameId,type)+'">'+gameName+'<i class="tg-graph tg-triangle-gray-bottom"></i>';
        return str;
    },
    _dropChoose:function(gameId,dom,type,callback){
        if(type != 'edit' && type != 'reset'){
            if(!gameId)gameId = B_Game._getDemoProjectId();
        }
        var games = B_Login._user;
        if(!(games && games.gas_projects)){
            return '';
        }
        //var projects = games.gas_projects;
        var projects = B_Game._getAuthGame();
        var gameStr = '';
        var gameCur = '<p class="tg-drop-text-part gameDropCurrent">';
        for(var i=0; i<projects.length; i++){
            switch(type){
                case 'select':
                    if(i==0)gameCur += '选择游戏...';
                    break;
                case 'edit':
                    if(!!gameId){
                        if(projects[i].project_id+'' == gameId+'')gameCur += '<img src="'+this._imgUrl(projects[i].project_id)+'">'+projects[i].project_name;
                    }else{
                        if(i==0)gameCur += '选择游戏...';
                    }
                    break;
                case 'reset':
                    if(!!gameId){
                        if(projects[i].project_id+'' == gameId+'')gameCur += '<img src="'+this._imgUrl(projects[i].project_id)+'">'+projects[i].project_name;
                    }else{
                        if(i==0)gameCur += '选择游戏...';
                    }
                    if(type == 'reset' && i==0){
                        gameStr += '<li id="0">选择游戏...</li>';
                    }
                    break;
                default:
                    if(projects[i].project_id+'' == gameId+'')gameCur += '<img src="'+this._imgUrl(projects[i].project_id)+'">'+projects[i].project_name;
                    break;
            }
            gameStr += '<li id="'+projects[i].project_id+'">'+projects[i].project_name+'</li>';
        }
        gameCur += '<i class="tg-graph tg-triangle-gray-bottom"></i></p>';
        var str = '\
            '+gameCur+'\
            <div class="tg-drop-content gameDropPop">\
                <div class="gameDropSearch">\
                    <i class="tg-icon tg-search-icon"></i>\
                    <input type="text" id="gameSearch">\
                </div>\
                <ul><div class="b_none">没有找到！</div>'+gameStr+'</ul>\
            </div>';

        $(dom).html(str);

        B_Format._arrowOpenClose(dom+" .tg-drop-text-part",dom+" .gameDropPop");
        $(dom).find('ul li').each(function(){
            $(this).click(function(){
                var id = $(this).attr('id');
                var name = $(this).html();
                if(id && id != ''){
                    $(dom).find('.gameDropCurrent').html(B_Game._dropChoosed(id,name));
                    $(dom).find('.gameDropPop').slideUp("fast");
                    callback && callback(id);
                }
            });
        });
        var gameChooseTimeOut = '';
        $(dom).find('input').keyup(function(){
            var val = $.trim($(this).val());
            clearTimeout(gameChooseTimeOut);
            gameChooseTimeOut = setTimeout(function(){
                B_Game._dropSearch(dom,val);
            },300);
        });
    },
    _dropSearch:function(dom,keyword){
        if(keyword && keyword != ''){
            var hasChoosed = false;
            $(dom).find('ul li').each(function(){
                if($(this).html().toLowerCase().indexOf(keyword.toLowerCase())>-1){
                    hasChoosed = true;
                    $(this).show();
                }else{
                    $(this).hide();
                }
            });
            hasChoosed ? $(dom).find('ul div').hide() : $(dom).find('ul div').show();
        }else{
            $(dom).find('ul div').hide();
            $(dom).find('ul li').each(function(){
                $(this).show();
            });
        }
    },
    _dropInnerGame:function(games,gameId,dom,callback,isReselect){
        gameId = gameId ? gameId : (gameId == 0 ? 0 :games[0].game_id);
        var gameStr = '';
        var gameName = '';
        var gameLength = 0;
        if(games){
            gameLength = games.length;
            for(var i=0;i<gameLength;i++){
                if(gameId+'' != games[i].game_id+''){
                    gameStr += '<li id="'+games[i].game_id+'">'+games[i].game_name+'</li>';
                }else{
                    gameName = games[i].game_name;
                }
            }
        }
        var gameCur = '<p class="tg-drop-text-part gameDropCurrent">';
        if(gameName == ''){
            gameId = games[0].game_id;
            gameName = games[0].game_name;
            for(var i=0;i<games.length;i++){
                if(gameId+'' != games[i].game_id+''){
                    gameStr += '<li id="'+games[i].game_id+'">'+games[i].game_name+'</li>';
                }
            }
            gameCur += B_Game._dropChoosed(games[0].game_id,games[0].game_name,'inner');
        }else{
            gameCur += B_Game._dropChoosed(gameId,gameName,'inner');
        }
        if(gameName != '' && gameName == 'demo' && gameLength == 1){
            gameCur += '<a class="tg-main-btn demo-game-btn" onclick="B_Login._openProbation();">接入游戏</a>';
        }
        gameCur += '</p>';
        var str = '\
            '+gameCur+'\
            <div class="tg-drop-content gameDropPop">\
                <ul>'+gameStr+'</ul>\
            </div>';

        $(dom).html(str);

        callback && callback(gameId,isReselect);

        B_Format._arrowOpenClose(dom+" .tg-drop-text-part",dom+" .gameDropPop");
        $(dom).find('ul li').each(function(){
            $(this).click(function(){
                var id = $(this).attr('id');
                var name = $(this).html();
                if(id != ''){
                    B_Game._dropInnerGame(games,id,dom,callback,true);
                    $(dom).find('.gameDropCurrent').html(B_Game._dropChoosed(id,name,'inner'));
                    $(dom).find('.gameDropPop').slideUp("fast");
                }
            });
        });
    },
    _tag:function(data){
        if(!data)return '';
        var games = B_Login._user;
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
    _source:function(source_type){
        source_type = parseInt(source_type);
        var storageSource = B_Storage._init('source');
        if(storageSource in B_Login._user){
            for(var i=0; i<B_Login._user.gas_source_dim.length; ++i){
                if(B_Login._user.gas_source_dim[i].source_type == source_type){
                    return B_Login._user.gas_source_dim[i];
                }
            }
        }
        return null;
    },
    _getCollect:function(back){
        if(B_User._isDemoUser()){
            B_Game._collectCache = [];
            back && back();
            return;
        }
        B_Port._ajax('collect_all','get',true,null,null,null,function(data,msg){
            B_Game._collectCache = (data && data.collection_list) ? data.collection_list : [];
            back && back();
        },function(data,msg,code){
            B_Game._collectCache = [];
            back && back();
        });
    },
    _setCollect:function(id,dom,style){
        if(B_User._isDemoUser()){
            B_Login._openLogin();
            return;
        }
        setTimeout(function(){
            var classOn = '';
            var classOff = '';
            var onWord = '';
            var offWord = '';
            if(style && style['on']){
                classOn = style['on'][0];
                classOff = style['off'][0];
                onWord = style['on'][1];
                offWord = style['off'][1];
            }else{
                classOn = style+'On';
                classOff = style+'Off';
            }
            id = parseInt(id);
            var postData = {};
            postData['project_id'] = id;
            postData = B_Common._postData(postData);
            if(B_Game._checkCollect(id)){
                B_Game._collectCache = B_Common._arrayRemove(B_Game._collectCache,id);
                B_Port._ajax('collect_cancel','get',true,postData,function(){
                    $('#'+dom).removeClass(classOn).addClass(classOff);
                    $('#'+dom).html(offWord);
                },null,function(data,msg){

                },null);
            }else{
                B_Game._collectCache.push(id);
                B_Port._ajax('collect_set','get',true,postData,function(){
                    $('#'+dom).addClass(classOn).removeClass(classOff);
                    $('#'+dom).html(onWord);
                },null,function(data,msg){

                },null);
            }
        },300);
    },
    _checkCollect:function(id){
        return ($.inArray(parseInt(id),B_Game._collectCache) > -1);
    }
}
var B_User = {
    _information:{
        companyArr:['游戏研发','渠道','发行/运营','外包','投资','第三方服务','广告商','IP授权方','游戏媒体','其他'],
        jobArr:['公司高管','游戏制作人','游戏运营','市场人员','商务人员','游戏策划','开发工程师','游戏测试','美术/UI/动画','音乐/音效','行政/人力','投资','销售','客服','其他']},
    _isDemoUser:function(){
        //return !(B_Login._user && B_Login._user.user && B_Login._user.user.nick_name !== 'demo');
        return !(B_Login._user && B_Login._user.user);
    },
    _isDemoUserStrict:function(){
        return !(B_Login._user && B_Login._user.user && B_Login._user.user.nick_name !== 'demo');
    },
    _getData:function(){
        var user = B_Login._user;
        if(!(user && user.user)){
            return '';
        }else{
            return user.user;
        }
    },
    _setData:function(data){
        var user = B_Login._user;
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
                B_Storage._set('user',user);
            }
        }
    },
    _getNick:function(type){
        var user = B_Login._user.user;
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
    }
}
var B_Captcha ={
    _cache:{timeDiff:0},
    _getVCode:function(mobile){
        var postData = {mobile_or_email:B_Common._encodeUrl(mobile)};
        postData = $.extend(postData, B_CaptchaObj.getValidate());
        B_Port._ajax('sms','post',true,postData,function(){
            B_Captcha._timeout();
            B_Captcha._refreshCaptcha();
        },null,function(data,msg){
            B_Pop._init('msg',{'content':'验证码已发送！请注意查收'});
        },function(data,msg,code){
            B_Pop._init('msg',{'content':msg});
        })
    },
    _timeout:function(){
        $('#bs_sms_send').text('60秒后重发').attr('disabled',true);
        B_Captcha._cache.timeDiff = 60;
        timeGo = setInterval('B_Captcha._timeRun()',1000);
    },
    _timeRun:function(dom){
        if(B_Captcha._cache.timeDiff <= 0){
            clearInterval(timeGo);
            $('#bs_sms_send').text('获取验证码').attr('disabled',false);
        }else{
            B_Captcha._cache.timeDiff -= 1
            $('#bs_sms_send').text(B_Captcha._cache.timeDiff+'秒后重发');
        }
    },
    _getCaptcha:function(dom){
        try{
            var url = B_Port._init('captcha');
            $.ajax({
                timeout:30000,
                async:true,
                type:'get',
                url:url,
                data:null,
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    B_Pop._init('msg','验证码生成失败，请刷新页面重试');
                    return;
                },
                success:function(config){
                    if(config){
                        window.B_CaptchaObj = new window.Geetest({
                            gt : config.gt,
                            challenge : config.challenge,
                            product : 'float',
                            offline : !config.success
                        });
                        B_CaptchaObj.appendTo('#'+dom);
                    }
                }
            });
        }catch (e){
            B_Pop._init('msg','验证码生成失败，请刷新页面重试');
            return;
        }
    },
    _refreshCaptcha:function(){
        B_CaptchaObj && B_CaptchaObj.refresh();
    }
}
var B_Login = {
    _isOpen:false,
    _user:{},
    _openPlan:function (gameName) {
        B_Pop._init('close');
        if(B_User._isDemoUser()){
            B_Login._openLogin();
        }else{
            var user = B_Login._user.user;
            if(!!user && !!user.mobile && user.mobile != ''){
                if(!gameName)gameName = '';
                B_Pop._init('open',{'type':2,'scroll':true,'title':'改进计划','width':'720px','height':'580px','shift':2,'content':'plan_s.html?f=1&n='+gameName},'');
            }else{
                B_Login._openBind();
            }
        }
    },
    _openLogin:function(from){
        if(!from)from = '';
        var data = {'type':2,'scroll':true,'title':'欢迎登录','width':'700px','height':'470px','shift':2,'content':'login_s.html?from='+from};
        switch(from){
            case 'background':
                data.closeBtn = false;
                break;
        }
        B_Pop._init('close');
        B_Pop._init('open',data,'')
    },
    _openSalon:function(){
        var data = {'type':2,'scroll':true,'title':'沙龙会议','width':'1180px','height':'700px','shift':2,'content':'salon_s.html'};
        B_Pop._init('close');
        B_Pop._init('open',data,'')
    },
    _openApplication:function(){
        var data = {'type':2,'scroll':true,'title':'欢迎报名本次活动','width':'700px','height':'470px','shift':2,'content':'application_s.html'};
        B_Pop._init('close');
        B_Pop._init('open',data,'')
    },
    _openOpen:function(){
        var data = {'type':2,'scroll':true,'title':'申请试用','width':'700px','height':'550px','shift':2,'content':'open_s.html'};
        B_Pop._init('close');
        B_Pop._init('open',data,'')
    },
    _openProbation:function(from){
        if(!from)from = '';
        var data = {'type':2,'title':false,'closeBtn':false,'scroll':true,'width':'980px','height':'520px','shift':2,'content':'probation_s.html?from='+from};
        B_Pop._init('close');
        B_Pop._init('open',data,'')
    },
    _openBind:function(){
        B_Pop._init('close');
        B_Pop._init('open',{'type':2,'scroll':true,'title':'绑定手机','width':'360px','height':'520px','shift':2,'content':'bind_s.html'},'')
    },
    _pre:function(){
        var loginName = B_Storage._get('login');
        if(!(loginName && loginName != 'demo'))loginName = '';
        return loginName;
    },
    _buff:function(){
        return B_Storage._get('user');
    },
    _setStatus:function(type){
        var date = B_Date._getCurrentTime();
        var status = B_Storage._get('status');
        if(!status) status = {};
        switch(type){
            case 'game':
                status['expire'] = date+(3600*1000);
                break;
            case 'out':
                status['expire'] = 0;
                break;
        }
        B_Storage._set('status',status);
    },
    _inDemo:function(url){
        var postData = {};
        postData['login_name'] = 'demo';
        postData['password'] = 'demo';
        postData['maxInactiveInterval'] = 0;
        postData = B_Common._postData(postData);
        B_Storage._set('login','demo');
        B_Port._ajax('login','post',true,postData,function () {
                B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
            },function () {
                B_Pop._init('close');
            },function(data, msg){
                B_Login._setStatus('out');
                B_Storage._set('AuthProjects',null);
                B_Login._user = data;
                url ? B_Jump._go('base',url) : B_Jump._go('reload');
                return false;
            },function(data, msg, code){
                B_Pop._init('msg',{'content':msg});
                return false;
            }
        )
    },
    _in:function(data,start,end,url){
        B_Storage._set('login',data.login_name);
        B_Port._ajax('login','post',true,data,start,end,
            function(data, msg){
                B_Login._setStatus('out');
                B_Login._user = data;
                if(url.indexOf('Mobile/') > -1)B_Cookie._set('MobileLoginInit',1);
                url ? B_Jump._go('base',url) : B_Jump._go('reload');
                return false;
            },
            function(data, msg, code){
                B_Pop._init('msg',{'content':msg});
                return false;
            }
        )
    },
    _out:function(url){
        B_Port._ajax('logout','post',true,{},null,null,
            function(data, msg){
                B_Login._setStatus('out');
                url ? B_Jump._go('base',url) : top.window.location.reload();
            },
            function(data, msg, code){
                B_Pop._init('msg',{'content':msg});
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
        B_Common._visitFromMobile();
        B_Login._checkUpdate(success,fail);
    },
    _checkUpdate:function(success,fail) {
        var browser = B_Common._browser();
        if(browser && browser.name && browser.name.toLowerCase() == 'msie' && browser.version && parseInt(browser.version) < 9){
            B_Jump._go('base','nobrowsersupport.html');
            return ;
        }
        B_Common._visitCount();
        var update = true;
        var status = B_Storage._get('status');
        if(status && status.expire){
            var dateDiff = B_Date._getDiffUnixTime('',status.expire);
            if(dateDiff > 0){
                update = false;
            }
        }
        B_Login._user = B_Storage._get('user');
        //如果数据不全，强制刷新
        if(!update){
            if(!B_Login._user){
                update = true;
            }else{
                if(!B_Login._user.article_classify_dim || !B_Login._user.article_source_dim || !B_Login._user.gas_projects || !B_Login._user.gas_source_dim || !B_Login._user.project_detail_type_dim || !B_Login._user.project_tag_dim){
                    update = true;
                }else{
                    if(!B_User._isDemoUser() && !B_Login._user.user)update = true;
                }
            }
            if(!B_Login._sessionStorage('get','user'))update = true;
        }
        if(update){
            B_Port._ajax('init','post',false,null,null,null,
                function(data,msg){
                    B_Login._user = data;
                    B_Storage._set('user',data);
                    B_Login._setStatus('game');
                    B_Login._sessionStorage('set','user',B_Date._getCurrentTime());
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
    _backUrl:function(type,url){
        var cookieName = 'CLoginBackUrl';
        switch(type){
            case 'set':
                var backUrl = url ? url : B_Common._lastUrl();
                if(backUrl){
                    var isExcepted = false;
                    var excepted = ['register','login','find','information','bind'];
                    for(var i=0;i<excepted.length;i++){
                        if(backUrl.indexOf(excepted[i]) > -1){
                            isExcepted = true;
                        }
                    }
                    backUrl = B_Common._encodeUrl(backUrl);
                    if(!isExcepted)B_Cookie._set(cookieName,backUrl);
                }
                break;
            case 'get':
                var backUrl = B_Cookie._get(cookieName);
                if(backUrl){
                    B_Cookie._del(cookieName);
                    backUrl = B_Common._decodeUrl(backUrl);
                    return backUrl;
                }else{
                    return B_Jump._getUrl('index');
                }
                break;
            case 'reg':
                var backUrl = B_Cookie._get(cookieName);
                if(!backUrl)B_Login._backUrl('set');
                break;
        }
    },
    _loginBackUrl:function(){
        var url = B_Login._backUrl('get');
        if(url.toLowerCase().indexOf('_s.html')>-1){
            if(url.toLowerCase().indexOf('assistant') > -1){
                url = B_Jump._getUrl('yuqin');
            }else if(url.toLowerCase().indexOf('account') > -1){
                url = B_Jump._getUrl('account');
            }else if(url.toLowerCase().indexOf('hotword') > -1){
                url = B_Jump._getUrl('reci');
            }else if(url.toLowerCase().indexOf('talkresult') > -1){
                url = B_Jump._getUrl('chat');
            }else{
                url = B_Jump._getUrl('index');
            }
        }
        return url;
    }
}

var B_Pre = {
    _loading:function(useClass){
        if(useClass){
            return '<div class="b_loading '+useClass+'"><img src="elements2.0/img/loading.gif"></div>';
        }else{
            return '<div class="b_loading"><img src="elements2.0/img/loading.gif"></div>';
        }
    },
    _empty:function(msg,useClass){
        if(useClass){
            return '<div class="b_empty '+useClass+'">'+msg+'</div>';
        }else{
            return '<div class="b_empty">'+msg+'</div>';
        }
    }
}

var B_Pop = {
    _init:function(type,data,callback,callback2){
        switch(type){
            case 'open':
                if(!data.color)data.color = '#000';
                if(!data.shift)data.shift = 1;
                if(!data.shade)data.shade = '0.4';
                if(!data.closeBtn)data.closeBtn = data.closeBtn == 0 ? 0 : 1;
                var index = layer.open({
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
                return index;
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
            case 'closeFrame':
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
                break;
            case 'checkAlert':
                B_Pop._init('close');
                B_Pop._init('alert',data,callback);
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

var B_Storage = {
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
            default:
                return type;
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

var B_Port = {
    _init:function(type){
        var url = B_Common._baseHost()+"rest/";
        switch(type){
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
            case 'industryAppStore':
                return url+'v1/industry/appstoretype';
                break;
            case 'industryArticleTopic':
                return url+'v1/industry/article/topic';
                break;
            case 'industryArticleHotWords':
                return url+'v1/industry/article/hotwords';
                break;
            case 'login':
                return url+'v1/login/auth';
                break;
            case 'logout':
                return url+'v1/login/logout';
                break;
            case 'init':
                return url+'v1/login/check';
                break;
            case 'hotGame':
                return url+'v1/project/home/hot';
                break;
            case 'recommendGame':
                return url+'v1/service/outer/reputation/recommend';
                break;
            case 'itemList':
                return url+'v1/item/';
                break;
            case 'history':
                return url+'v1/user/project/histroy';
                break;
            case 'guessLike':
                return url+'v1/project/user/recommend';
                break;
            case 'collect_all':
                return url+'v1/user/project/collection';
                break;
            case 'userApplicationFree':
                return url+'v1/service/user/free'
                break;
            case 'hotWordTrend':
                return url+'v1/forum/termsdate/histogramagg';
                break;
            case 'insertCustomKeywords':
                return url+'v1/service/custom/keywords';
                break;
            case 'forumSearch':
                return url+'v1/forum/title';
                break;
            case 'forumDetail':
                return url+'v1/forum/reply';
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
            case 'assistantGetQuery':
                return url+'v1/service/opinionmonitor';
                break;
            case 'assistantAddQuery':
            case 'assistantDel':
            case 'assistantUpdate':
                return url+'v1/service/opinionmonitor/task';
                break;
            case 'talkInfo':
            case 'talkAdd':
            case 'talkDel':
                return url+'v1/service/gas/chatinfo';
                break;
            case 'talkUpdate':
                return url+'v1/service/gas/chatinfo/analysis';
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
            case 'getReportList':
                return url+'v1/service/report/user';
                break;
            case 'getReportItem':
                return url+'v1/service/report/classify';
                break;
            case 'faceProfileGlobal':
                return url+'v1/service/profile';
                break;
            case 'userServiceProject':
                return url+'v1/service/user/project';
                break;
            case 'userProjectDetail':
                return url+'v1/service/user/project/detail';
                break;
            case 'innerGame':
                return url+'v1/service/inner/game';
                break;
            case 'innerOperationBase':
                return url+'v1/service/inner/operation/base';
                break;
            case 'faceProfileCustomer':
                return url+'v1/service/profile/custom';
                break;
            case 'innerSearchMeta':
                return url+'v1/service/inner/search/meta';
                break;
            case 'innerUserDetail':
                return url+'v1/service/inner/property/detail';
                break;
            case 'innerSearchCsv':
                return url+'v1/service/inner/search/excel';
                break;
            case 'innerSearch':
                return url+'v1/service/inner/search';
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
            case 'innerOperationKpi':
                return url+'v1/service/inner/operation/kpi';
                break;
            case 'innerRetentionCount':
                return url+'v1/service/inner/operation/retentioncount';
                break;
            case 'innerPayData':
                return url+'v1/service/inner/operation/paydata';
                break;
            case 'innerLostAnalysis':
                return url+'v1/service/inner/operation/lostcount';
                break;
            case 'innerChannelQuality':
                return url+'v1/service/inner/operation/channelquality';
                break;
            case 'innerLostFunnel':
                return url+'v1/service/inner/operation/lostfunnel';
                break;
            case 'innerOperationNewUser':
                return url+'v1/service/inner/operation/newuser';
                break;
            case 'innerOperationActiveUser':
                return url+'v1/service/inner/operation/activeuser';
                break;
            case 'innerOperationRetentionUser':
                return url+'v1/service/inner/operation/retentionuser';
                break;
            case 'innerOperationPayUser':
                return url+'v1/service/inner/operation/payuser';
                break;
            case 'innerOperationLostUser':
                return url+'v1/service/inner/operation/lostuser';
                break;
            case 'innerOperationHabitUser':
                return url+'v1/service/inner/operation/habituser';
                break;
            case 'innerOperationPayRateData':
                return url+'v1/service/inner/operation/payratedata'
                break;
            case 'innerOperationFirstPay':
                return url+'v1/service/inner/operation/firstpay';
                break;
            case 'innerOperationPayHabit':
                return url+'v1/service/inner/operation/payhabit';
                break;
            case 'innerOperationChannelPay':
                return url+'v1/service/inner/operation/channelpay';
                break;
            case 'innerOperationMenu':
                return url+'v1/service/inner/operation/menu';
                break;
            case 'innerOperationPage':
                return url+'v1/service/inner/operation/page';
                break;

            case 'demoInnerOperationBase':
                return url+'v1/demo/inner/operation/base';
                break;
            case 'demoInnerSearchMeta':
                return url+'v1/demo/inner/search/meta';
                break;
            case 'demoInnerUserDetail':
                return url+'v1/demo/inner/property/detail';
                break;
            case 'demoInnerSearchCsv':
                return url+'v1/demo/inner/search/excel';
                break;
            case 'demoInnerSearch':
                return url+'v1/demo/inner/search';
                break;
            case 'demoInnerLogType':
                return url+'v1/demo/inner/gamelog/type';
                break;
            case 'demoInnerLogMeta':
                return url+'v1/demo/inner/gamelog/meta';
                break;
            case 'demoInnerLogSearch':
                return url+'v1/demo/inner/gamelog/search';
                break;
            case 'demoInnerLogChart':
                return url+'v1/demo/inner/gamelog/chart';
                break;
            case 'demoInnerOperationKpi':
                return url+'v1/demo/inner/operation/kpi';
                break;
            case 'demoInnerRetentionCount':
                return url+'v1/demo/inner/operation/retentioncount';
                break;
            case 'demoInnerPayData':
                return url+'v1/demo/inner/operation/paydata';
                break;
            case 'demoInnerLostAnalysis':
                return url+'v1/demo/inner/operation/lostcount';
                break;
            case 'demoInnerChannelQuality':
                return url+'v1/demo/inner/operation/channelquality';
                break;
            case 'demoInnerLostFunnel':
                return url+'v1/demo/inner/operation/lostfunnel';
                break;
            case 'demoInnerOperationNewUser':
                return url+'v1/demo/inner/operation/newuser';
                break;
            case 'demoInnerOperationActiveUser':
                return url+'v1/demo/inner/operation/activeuser';
                break;
            case 'demoInnerOperationRetentionUser':
                return url+'v1/demo/inner/operation/retentionuser';
                break;
            case 'demoInnerOperationPayUser':
                return url+'v1/demo/inner/operation/payuser';
                break;
            case 'demoInnerOperationLostUser':
                return url+'v1/demo/inner/operation/lostuser';
                break;
            case 'demoInnerOperationHabitUser':
                return url+'v1/demo/inner/operation/habituser';
                break;
            case 'demoInnerOperationPayRateData':
                return url+'v1/demo/inner/operation/payratedata';
                break;
            case 'demoInnerOperationFirstPay':
                return url+'v1/demo/inner/operation/firstpay';
                break;
            case 'demoInnerOperationPayHabit':
                return url+'v1/demo/inner/operation/payhabit';
                break;
            case 'demoInnerOperationChannelPay':
                return url+'v1/demo/inner/operation/channelpay';
                break;
            case 'demoInnerOperationMenu':
                return url+'v1/demo/inner/operation/menu';
                break;
            case 'demoInnerOperationPage':
                return url+'v1/demo/inner/operation/page';
                break;

            case 'atlasProjectGraphList':
                return url+'v1/project/graph';
                break;
            case 'opinionRank':
                return url+'v1/service/outer/reputation/opinion/rank';
                break;
            case 'appstoreRank':
                return url+'v1/service/outer/reputation/appstore/rank';
                break;
            case 'reputationIntroduceOpinion':
                return url+'v1/service/outer/reputation/introduce/opinion';
                break;
            case 'reputationIntroduceFeedback':
                return url+'v1/service/outer/reputation/introduce/feedback';
                break;
            case 'reputationIntroduce':
                return url+'v1/service/outer/reputation/introduce';
                break;
            case 'reputationFeedbackRank':
                return url+'v1/service/outer/reputation/feedback/rank';
                break;
            case 'reputationFeedbackKeywords':
                return url+'v1/service/outer/reputation/feedback/keywords';
                break;
            case 'appstoreClassify':
                return url+'v1/project/appstore/classify';
                break;
            case 'forumAnalyse':
                return url+'v1/service/outer/reputation/forum/analyse';
                break;
            case 'forumAnalyseRate':
                return url+'v1/service/outer/reputation/forum/analyse/rate';
                break;
            case 'forumQualityAnalyse':
                return url+'v1/service/outer/reputation/forum/quality/analyse';
                break;
            case 'feedbackAnalyse':
                return url+'v1/service/outer/reputation/feedback/analyse';
                break;
            case 'feedbackAnalyseDetail':
                return url+'v1/service/outer/reputation/feedback/analyse/detail';
                break;
            case 'feedbackHotwords':
                return url+'v1/service/outer/reputation/feedback/hotwords';
                break;
            case 'feedbackKeywords':
                return url+'v1/service/outer/reputation/feedback/keywords';
                break;
            case 'feedbackRank':
                return url+'v1/service/outer/reputation/feedback/rank';
                break;
            case 'forumAnalyse':
                return url+'v1/service/outer/reputation/forum/analyse';
                break;
            case 'forumAnalyseRate':
                return url+'v1/service/outer/reputation/forum/analyse/rate';
                break;
            case 'forumQualityAnalyse':
                return url+'v1/service/outer/reputation/forum/quality/analyse';
                break;
            case 'forumSearchClassify':
                return url+'v1/service/outer/reputation/forum/search/classify';
                break;
            case 'channelCount':
                return url+'v1/service/outer/reputation/channel/count';
                break;
            case 'channelAnalyse':
                return url+'v1/service/outer/reputation/channel/analyse';
                break;
            case 'reputationSearch':
                return url+'v1/service/outer/reputation/search';
                break;
            case 'reputationCollect':
                return url+'v1/service/outer/reputation/collection';
                break;
            case 'reputationHot':
                return url+'v1/service/outer/reputation/hot';
                break;
            case 'crawlerInfoApps':
                return url+'v1/gas/crawlerinfo/apps';
                break;
            case 'channelComments':
                return url+'v1/channel/comments';
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
            case 'operationJoin':
                return url+'v1/activity/operation/join';
                break;
            case 'appstoreDate':
                return url+'v1/service/outer/reputation/appstore/date';
                break;
            case 'serviceDownload':
                return url+'v1/service/download';
                break;
            case 'articleList':
                return url+'v1/article/home';
                break;
            case 'articleDetail':
                return url+'v1/article/detail';
                break;
            case 'articleRelation':
                return url+'v1/article/related';
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
            case 'qqLogin':
                return url+'v1/login/qq/login';
                break;
            case 'wxLogin':
                return url+'v1/login/weixin/login';
                break;
            case 'bindMobile':
                return url+'v1/user/mobile/bind';
                break;
            case 'checkMobile':
                return url+'v1/user/mobile';
                break;
            case 'identity':
                return url+'v1/user/identity';
                break;
            case 'detailMobile':
                return url+'v1/user/details';
                break;
            case 'resetPass':
                return url+'v1/login/password';
                break;
            case 'articleClassifyCount':
                return url+'v1/article/classify';
                break;
            case 'projectReputationSearch':
                return url+'v1/project/reputation/search';
                break;
            case 'userInfo':
                return url+'v1/user/details';
                break;
            case 'thirdpartyBind':
                return url+'v1/login/thirdparty/bind';
                break;
            case 'playerCluster':
                return url+'v1/service/inner/analysis/player/cluster';
                break;
            case 'playerTag':
                return url+'v1/service/inner/analysis/player/tag';
                break;
            case 'playerKey':
                return url+'v1/service/inner/analysis/player/key';
                break;
            case 'clusterType':
                return url+'v1/service/inner/analysis/cluster/type';
                break;
            case 'playerData':
                return url+'v1/service/inner/analysis/player/data';
                break;
            case 'playerGroupTag':
                return url+'v1/service/inner/analysis/player/group/tag';
                break;
            case 'playerGroupSearch':
                return url+'v1/service/inner/analysis/player/search';
                break;
            case 'searchExcel':
                return url+'v1/service/inner/analysis/search/excel';
                break;
            case 'operationApply':
                return url+'v1/operation/apply';
                break;
            case 'playerDistribution':
                return url+'v1/service/inner/analysis/player/distribution';
                break;
            case 'playerDistributionClassify':
                return url+'v1/service/inner/analysis/player/distribution/classify'
                break;
            case 'ossChatPolicy':
                return url+'v1/oss/chat_policy';
                break;
            case 'readReport':
                return url+'v1/service/report';
                break;

            case 'demoPlayerCluster':
                return url+'v1/demo/inner/analysis/player/cluster';
                break;
            case 'demoPlayerTag':
                return url+'v1/demo/inner/analysis/player/tag';
                break;
            case 'demoPlayerKey':
                return url+'v1/demo/inner/analysis/player/key';
                break;
            case 'demoClusterType':
                return url+'v1/demo/inner/analysis/cluster/type';
                break;
            case 'demoPlayerData':
                return url+'v1/demo/inner/analysis/player/data';
                break;
            case 'demoPlayerGroupTag':
                return url+'v1/demo/inner/analysis/player/group/tag';
                break;
            case 'demoPlayerGroupSearch':
                return url+'v1/demo/inner/analysis/player/search';
                break;
            case 'demoSearchExcel':
                return url+'v1/demo/inner/analysis/search/excel';
                break;
            case 'demoPlayerDistribution':
                return url+'v1/demo/inner/analysis/player/distribution';
                break;
            case 'demoPlayerDistributionClassify':
                return url+'v1/demo/inner/analysis/player/distribution/classify'
                break;

            case 'countryDetail':
                return url+'v1/home/content';
                break;
            case 'innerOperationEvaluate':
                return url+'v1/service/inner/operation/evaluate';
                break;
            case 'demoInnerOperationEvaluate':
                return url+'v1/demo/inner/operation/evaluate';
                break;
            case 'industryComplainDetail':
                return url+'v1/industry/complain/detail';
                break;
            case 'profileTiebaProject':
                return url+'v1/service/profile/tieba/project';
                break;
        }
    },
    _ajax:function(type,postOrGet,sync,data,start,end,success,fail){
        var url = B_Port._init(type);
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
                    back.return_message = B_Format._doXss(back.return_message);
                    switch(back.return_code+''){
                        case '0':
                            if (typeof back.data == 'string'){
                                if (back.data != ''){
                                    back.data = $.parseJSON(back.data);
                                }else
                                    back.data = {};
                            }
                            back.data = B_Format._doXss(back.data) ;
                            success && success(back.data,back.return_message) ;
                            break;
                        case '-1001':
                        case '-1016':
                            if(B_Storage._get('login') && B_Storage._get('login') == 'demo'){
                                B_Login._inDemo();
                            }else{
                                if(!B_Login._isOpen){
                                    B_Login._isOpen = true;
                                    B_Login._setStatus('out');
                                    B_Login._openLogin('background');
                                }
                            }
                            break
                        case '-1047':
                            B_Login._openBind();
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

var B_Format = {
    _arrowOpenClose:function (domEvent,domShow,type) {
        $(domEvent).click(function(){
            if($(domShow).is(":hidden")){
                $(domShow).fadeIn('slow');
            }else{
                switch (type){
                    case 'operateSearch':
                        $(domShow).fadeOut('slow');
                        break;
                }
            }
            if(type){
                switch(type){
                    case 'operateSearch':
                        break;
                    case 'gameSearch':
                        if($('#bs_menu_hot_game').html() == '')M_Game._menuHotGame(0,8);
                        break;
                    case 'headMenu':
                        $('.searchItem ').hide();
                        if($(".h_qkList").html() == '')S_Game._menuHotGame(0,6);
                        break;
                    case 'indexSearch':
                        $('#bs_head_search').hide();
                        break;
                    default:
                        $('#bs_head_search').hide();
                        break;
                }
            }
        });
        $(domEvent+','+domShow).hover(function(){
            $('html').unbind('mousedown');
        },function (){
            $('html').mousedown(function(e){
                $(domShow).fadeOut('quick');
            });
        });
    },
    _doXss:function (data) {
        if(typeof data === "number"){
            return data;
        }else if(typeof data === "string"){
            // 换行是特例
            return data.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&lt;br&gt;/ig, "<br>").replace(/&lt;br\/&gt;/ig, "<br/>");
        }else if(data instanceof Array){
            for(var i=0; i<data.length; ++i){
                data[i] = B_Format._doXss(data[i]);
            }
            return data;
        }else if(data instanceof Object){
            for(var key in data){
                data[key] = B_Format._doXss(data[key]);
            }
            return data;
        }
    },
    _arrayRemove:function(array,item) {
        var index = $.inArray(item, array);
        return array.slice(0, index).concat(array.slice(index + 1, array.length));
    },
    _blankRemove:function(str){
        return str.replace(/\s+/g, "");
    },
    _htmlSpecialChars_encode:function(str){
        return str.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
    },
    _htmlSpecialChars_decode:function(str) {
        str = str.replace(/(\\r|\\n|\\t)/g,"");
        str = str.replace(/\\/g,"");
        var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){
            return arrEntities[t];
        });
    },
    _checkLength:function(which,maxC,showTag){
        var maxChars = maxC;
        if (which.value.length > maxChars)
            which.value = which.value.substring(0,maxChars);
        var curr = maxChars - which.value.length;
        $("#"+showTag).html(curr.toString());
    }
}

var B_Common = {
    _submitBind:function(dom,hover){
        if(hover){
            hover.keyup(function(event){
                var eventCode = (event.keyCode ? event.keyCode : event.which);
                if(eventCode == '13')dom.click();
            });
        }
    },
    _arrayRemove:function(array,item){
        var index = $.inArray(item,array);
        return array.slice(0,index).concat(array.slice(index+1,array.length));
    },
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
    _postData:function (data) {
        var postData = [];
        if(data && !B_Common._checkObjectIsEmpty(data)){
            $.each(data,function (key,value) {
                postData.push(key+'='+B_Common._encodeUrl(value));
            });
        }
        if(postData && postData.length > 0){
            postData = postData.join('&');
        }else{
            postData = '';
        }
        return postData;
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
            return data.replace(reg,'<b class="b_colorR">$1</b>');
        }else{
            return data;
        }
    },
    _imgDecode:function(imgUrl){
        if(imgUrl){
            imgUrl = decodeURIComponent(imgUrl);
            return B_Common._replaceLeft(imgUrl);
        }else{
            return '';
        }
    },
    _imgBuff:function(imgUrls){
        for(var i=0;i<imgUrls.length;i++){
            try{
                $('<iframe style="display: none" id="img_'+i+'" frameborder=no border=0 src="javascript:\'<!doctype html><html><head><style>*{margin:0;padding:0}</style></head><body><div></div><img src=\\\''+decodeURIComponent(imgUrls[i])+'\\\' /></body></html>\'"></iframe>').appendTo('body');
            }catch(e){}
        }
    },
    _checkObjectIsEmpty:function(data){
        return JSON.stringify(data) == "{}" ? true : false;
    },
    _submitBind:function(dom,hover) {
        if (hover) {
            hover.keyup(function (event) {
                var eventCode = (event.keyCode ? event.keyCode : event.which);
                if (eventCode == '13')dom.click();
            });
        }
    },
    _btnTextStatus:function (status,dom,desc) {
        switch(status){
            case 'disable':
                dom.text(desc['disable']).attr('disabled',true);
                break;
            case 'normal':
                dom.text(desc['normal']).attr('disabled',false);
                break;
        }
    },
    _getUrl:function (type) {
        var fullUrl = window.document.location.href.toString();
        var urlArray = fullUrl.split("?");
        var url = urlArray[0];
        var query = urlArray[1];
        switch(type){
            case 'hash':
                url = url.split("#");
                if(url[1]){
                    url[1] = url[1].substr(1,(url[1].length-1));
                    url[1] = url[1].replace('/','|');
                    return url[1];
                }else{
                    return '';
                }
                break;
            case 'query':
                if(typeof(query) == "string"){
                    query = query.split("#");
                    query = query[0];
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
                urlArray = url.split("#");
                url = urlArray[0];
                urlArray = url.split("/");
                var controller = urlArray.pop();
                controller = controller.replace('.html','');
                return controller;
                break;
        }
    },
    _getRadioVal:function(dom){
        var val = '';
        $("input:radio[name='"+dom+"']").each(function(){
            if($(this).prop("checked")==true){
                val = $(this).val();
            }
        });
        return val;
    },
    _getCheckboxVal:function(dom){
        var val = [];
        $("input:checkbox[name='"+dom+"']").each(function(){
            if($(this).prop("checked")==true){
                val.push($(this).val());
            }
        });
        return val.length>0 ? val.join(','):'';
    },
    _visitFromMobile:function(){
        var mobileVisitPc = B_Cookie._get('MobileVisitPc');
        if(!mobileVisitPc){
            var thisOS = navigator.platform;
            var os = new Array("iPhone","iPod","iPad","android","Nokia","SymbianOS","Symbian","Windows Phone","Phone","MAUI","UNTRUSTED/1.0","Windows CE","BlackBerry","IEMobile");
            var isLoginReg = false;
            if(window.location.href.toLowerCase().indexOf('register') > -1 || window.location.href.toLowerCase().indexOf('login') > -1)isLoginReg = true;
            for(var i=0;i<os.length;i++){
                if(!isLoginReg && thisOS.match(os[i])){
                    var url = B_Common._baseHost();
                    window.location.href = url+'Mobile';
                    return false;
                    break;
                }
            }
        }
    },
    _visitCount:function () {
        if(window.location.host.toLowerCase().indexOf("thinkinggame.cn")>=0){
            var cnzz_s_tag = document.createElement('script');
            cnzz_s_tag.type = 'text/javascript';
            cnzz_s_tag.async = true;
            cnzz_s_tag.charset = 'utf-8';
            cnzz_s_tag.src = 'https://w.cnzz.com/c.php?id=1259271417&async=1';
            var root_s = document.getElementsByTagName('script')[0];
            root_s.parentNode.insertBefore(cnzz_s_tag, root_s);

            var _hmt = _hmt || [];
            (function() {
                var hm = document.createElement("script");
                hm.src = "//hm.baidu.com/hm.js?807f1c5d79f269ff4780a3018e230b2e";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
            })();
        }
    },
    _htmlUnicodeTagScriptEscape:function(str) {
        str = str.replace(/script.*?\/script/g,"");
        str = str.replace(/'/g,'"');
        return str;
    },
    _htmlspecialchars_decode:function(str) {
        str = str.replace(/(\\r|\\n|\\t)/g,"");
        str = str.replace(/\\/g,"");
        var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){
            return arrEntities[t];
        });
    },
    _htmlTagScriptEscape:function(str) {
        str = str.replace(/<script[^>]*?>.*?<\\?\/script>/g,"");
        return str;
    }
}
var B_Jump = {
    _top:function () {
        $("body,html").animate({
            'scrollTop':0
        },500);
    },
    _go:function(type,url){
        switch(type){
            case 'hash':
                location.hash="#"+url;
                break;
            case 'open':
                window.open(this._getUrl(url));
                break;
            case 'openUrl':
                window.open(url);
                break;
            case 'reload':
                top.window.location.reload();
                break;
            case 'target':
                top.window.location.href = this._getUrl(url);
                break;
            default:
                top.window.location.href = url;
                break;
        }
        return false;
    },
    _getUrl:function(type,data){
        switch(type){
            case 'demo':
                return type+'.html#/'+data.demo;
                break;
            case 'datacenter':
            case 'bind':
            case 'information':
            case 'refresh':
            case 'detail':
            case 'operation':
            case 'analysis':
            case 'radar':
            case 'sigma':
            case 'product':
            case 'price':
            case 'company':
            case 'join':
            case 'partner':
            case 'index':
            case 'search':
            case 'login':
            case 'find':
            case 'user':
            case 'light':
            case 'article':
            case 'insidepay':
            case 'item':
            case 'guide':
            case 'service':
            case 'atlas':
            case 'main':
            case 'datasolution':
            case 'analysissolution':
            case 'popluarsolution':
            case 'professional':
                return type+'.html';
                break;
            case 'reg':
                return'register.html';
                break;
            case 'notices':
                return 'notice_s.html';
                break;
            case 'reportDetail':
                return'reports_s.html';
                break;
            case 'outsideAlarm':
            case 'outsideHotWord':
            case 'outsideAssistant':
            case 'outsideChat':
            case 'outsideCompare':
            case 'outsideFaceSummary':
            case 'outsideFaceDetail':
            case 'outsideFaceCompare':
            case 'outsideRankApp':
            case 'outsideTask':
                if(data){
                    if(data.id){
                        return 'outside.html?g='+data.id+'#/'+type;
                    }
                    if(data.nofresh){
                        return 'outside.html?nofresh='+data.nofresh+'#/'+type;
                    }
                }else{
                    return 'outside.html#/'+type;
                }
                break;
            case 'outsideRankSentiment':
            case 'outsideCenter':
            case 'outsideAtlas':
            case 'outsideChatResult':
                var page = 'outside.html';
                if(typeof(M_Init) != 'undefined'){
                    switch(M_Init._controller){
                        case 'demo':
                            page = 'demo.html';
                            break;
                    }
                }
                if(data){
                    if(data.id){
                        return page+'?g='+data.id+'#/'+type+'/';
                    }else{
                        if(data.nofresh){
                            return page+'?nofresh='+data.nofresh+'#/'+type+'/';
                        }else{
                            return page+'#/'+type+'/'+data.gameId;
                        }
                    }
                }else{
                    return page+'#/'+type+'/';
                }
                break;
            case 'reportsGeneral':
            case 'reportsItemLost':
            case 'reportsItemPay':
            case 'reportsItemRationality':
            case 'reportsItemHot':
            case 'reportsItemDeep':
            case 'reportsItemRival':
            case 'reportsItemGuide':
            case 'reportsItemClustering':
            case 'reportsItemIp':
                return 'reports.html#/'+type;
                break;
            case 'insideRetentioncount':
            case 'insidePayOsmosis':
            case 'insidePayData':
            case 'insideLostAnalysis':
            case 'insideLostFunnel':
            case 'insideChannelQuality':
            case 'insideSummary':
            case 'insideKeypoint':
            case 'insideAdditional':
            case 'insideActivity':
            case 'insideSave':
            case 'insidePay':
            case 'insideLost':
            case 'insideHabit':
            case 'insideAttribute':
            case 'insideLog':
            case 'insidePayConversion':
            case 'insidePayHabit':
            case 'insideChannelEarn':
            case 'insidePersonality':
            case 'insideDemo':
            case 'insideAttribute':
            case 'insideLog':
            case 'operatePlayer':
            case 'operateLog':
            case 'operateHelper':
            case 'operateBasic':
            case 'operatePay':
            case 'operateLost':
            case 'operateDemo':
                var page = 'inside.html';
                /*
                var pageType = '';
                if(data && data.type){
                    pageType = data.type;
                }else{
                    pageType = type;
                }
                */
                switch (type){
                    case 'operatePlayer':
                    case 'operateLog':
                    case 'operateHelper':
                    case 'operateBasic':
                    case 'operatePay':
                    case 'operateLost':
                    case 'operateDemo':
                        page = 'operate.html';
                        break;
                }
                if(typeof(M_Init) != 'undefined'){
                    switch(M_Init._controller){
                        case 'demo':
                            page = 'demo.html';
                            break;
                    }
                }
                if(data){
                    if(typeof(data.id) != 'undefined'){
                        return page+'?g='+data.id+'#/'+type;
                    }else{
                        return page+'#/'+type+'/'+data.type;
                    }
                }else{
                    switch (type){
                        case 'operatePlayer':
                        case 'operateBasic':
                            return page+'#/'+type+'/';
                            break;
                        default:
                            return page+'#/'+type;
                            break;
                    }

                }
                break;
            case 'gameLight':
            case 'gameSummary':
            case 'gameSentiment':
            case 'gameForum':
            case 'gameChannel':
            case 'gamePost':
            case 'gameComment':
            case 'gameFaceSummary':
            case 'gameFaceDetail':
            case 'gameFaceCompare':
            case 'gameAnalysis':
            case 'gameAssistant':
            case 'gameTieba':
                if(data){
                    if(data.id){
                        return 'outside.html?g='+data.id+'#/'+type+'/';
                    }else{
                        return 'outside.html#/'+type+'/'+data.gameId;
                    }
                }else{
                    return 'outside.html#/'+type+'/';
                }
                break;
            case 'member':
                return 'member.html#/'+type;
                break;
        }
    }
}
var B_Date = {
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
    _strToTime:function(yyyyMMdd){
        var str = yyyyMMdd;
        str = str.replace(/-/g,"/");
        var date = new Date(str);
        return date;
    },
    _getDiffUnixTime:function(date,diff){
        date = date ? B_Date._strToTime(date) : new Date();
        return Math.round(date.getTime()/1000)+(diff*86400);
    },
    _getDiffDate:function(date,diff){
        date = date ? ((date+'' === date) ? B_Date._strToTime(date) : date) : new Date();
        var back = date;
        back.setDate(date.getDate()+diff);
        return back.format('yyyy-MM-dd');
    },
    _getCurrentTime:function(){
        return (new Date()).getTime();
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
        var date = this._strToTime(date);
        var hour = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
        var minute = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
        var texts = [hour, minute];
        return texts.join(':');
    },
    _dateArray:function(begin,end){
        begin = this._strToTime(begin);
        end = this._strToTime(end);
        var back = [];
        for(var d = begin; d.getTime() <= end.getTime(); d.setDate(d.getDate() + 1)) {
            back.push({'small':d.format('MM/dd'),'big':d.format('yyyy-MM-dd')});
        }
        return back;
    },
    _chooseSingle:function(config,dom,start,end,callback){
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
    _chooseSection:function(config,dom,start,end,callback){
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

var B_Tab = {
    _maskShow:function(dom,maskDom,maskClass,shadeDom) {
        dom.each(function (index) {
            $(this).hover(
                function () {
                    if (maskDom != '') {
                        maskDom.eq(index).addClass(maskClass);
                    }
                    shadeDom.eq(index).show();
                },
                function () {
                    if (maskDom != '') {
                        maskDom.eq(index).removeClass(maskClass);
                    }
                    shadeDom.eq(index).hide();
                }
            )
        })
    },
    _choose:function(dom,domSlider,width,diff,onClass,type,current,contentDom,chartDom) {
        switch (type) {
            case 'index':
                dom.each(function (index) {
                    $(this).click(function () {
                        if (typeof(onClass) != 'undefined') {
                            $(this).addClass(onClass).siblings().removeClass(onClass);
                        }
                        contentDom.eq(index).show().siblings('.p_qkArea').hide();
                        domSlider.animate({
                            left: ((index * width) + diff) + 'px'
                        }, function () {
                        });
                    })
                });
                break;
            case 'vertical':
                dom.each(function (index) {
                    $(this).click(function () {
                        if (typeof(onClass) != 'undefined') {
                            $(this).addClass(onClass).siblings().removeClass(onClass);
                        }
                        domSlider.animate({
                            top: ((index * width) + diff) + 'px'
                        }, function () {
                        });
                    })
                });
                break;
            default:
                dom.each(function (index) {
                    $(this).click(function () {
                        if (typeof(onClass) != 'undefined') {
                            $(this).addClass(onClass).siblings().removeClass(onClass);
                        }
                        if (typeof(contentDom) != 'undefined' && contentDom) {
                            contentDom.each(function (c_index) {
                                if (c_index == index) {
                                    contentDom.eq(c_index).show();
                                } else {
                                    contentDom.eq(c_index).hide();
                                }
                            })
                        }
                        if (typeof(chartDom) != 'undefined' && chartDom) {
                            chartDom.each(function (c_index) {
                                if (c_index == index) {
                                    chartDom.eq(c_index).show();
                                } else {
                                    chartDom.eq(c_index).hide();
                                }
                            })
                        }
                        if (typeof(domSlider) != 'undefined' && domSlider) {
                            domSlider.animate({
                                left: ((index * width) + diff) + 'px'
                            }, function (){});
                        }
                    })
                });
                break;
        }
    }
}
var B_Chart = {
    _chartBarn:[],
    _getEChart:function(type,dom,data,chartClickId){
         var option = {
             color:!data.color ? ['#AEDD8C','#72C4FF', '#FFA6A5', '#BFA4F1', '#FFDE5D','#EE9ABC', '#4ECDC4', '#73D7F7', '#FDB96A', '#F9FF91','#FF9900'] : data.color,
             title: !data.title ? '': data.title,
             tooltip : {
                 formatter:!data.tooltip.formatter ? '': data.tooltip.formatter,
                 trigger: data.tooltip.trigger,
                 backgroundColor:"#ffffff",
                 borderColor:'#E5E5E5',
                 borderWidth:1,
                 padding:5,
                 textStyle:{
                     color:'#A9A9A9',
                     fontSize:'11px'
                 },
                 axisPointer:{
                     type:!data.tooltip.axisPointerType ? 'line': data.tooltip.axisPointerType,
                     lineStyle:{
                         color:'#DBDBDB'
                     }
                 }
             },
             visualMap: !data.visualMap ? '': data.visualMap,
             dataZoom: !data.dataZoom ? '': data.dataZoom,
             radar: !data.radar ? '': data.radar,
             legend: data.legend,
             grid: data.grid,
             xAxis : data.xAxis,
             yAxis : data.yAxis,
             series : data.series
         };
        var myChart = echarts.init(document.getElementById(dom));
        B_Chart._chartBarn.push([dom,myChart]);
        switch(type){
            case 'lineActive':
                var used = 29;
                setInterval(function () {
                    used = (used > F_Industry_Common._cache['allData'].length) ? 0 : used+1;
                    data.series[0].data.shift();
                    data.xAxis[0].data.shift();
                    data.series[0].data.push(F_Industry_Common._cache['allData'][used]);
                    data.xAxis[0].data.push(F_Industry_Common._cache['allDate'][used]);
                    myChart.setOption({
                        xAxis:[{
                            data: data.xAxis[0].data
                        }],
                        series: [{
                            data: data.series[0].data
                        }]
                    });
                }, 2000);
            default:
                myChart.setOption(option);
                break;
        }

        if(!B_Storage._get('CLIENT_WIDTH'))B_Storage._set('CLIENT_WIDTH',document.body.clientWidth);
        window.addEventListener("resize", function(){
            var client_width = document.body.clientWidth;
            var cache_width = B_Storage._get('CLIENT_WIDTH');
            if(client_width != cache_width){
                for(var i=0;i<B_Chart._chartBarn.length;i++){
                    B_Chart._chartBarn[i][1].resize();
                }
                B_Storage._set('CLIENT_WIDTH',client_width);
            }
        });
        switch(chartClickId){
            case 'gameForumTotalLight':
                myChart.on('click',function (params){
                    if(params.value == 0){
                        B_Pop._init('msg',{'content':'当前日期无数据，请选择其他日期'});
                    }else{
                        if(params.name){
                            F_GameLight_Info._chartClick(chartClickId,{date:params.name,type:params.seriesName});
                        }
                    }
                });
                break;
            case 'gameChannelCountLight':
                myChart.on('click',function (params){
                    if(params.value == 0){
                        B_Pop._init('msg',{'content':'当前日期无数据，请选择其他日期'});
                    }else{
                        if(params.name){
                            F_GameAnalysis_Info._chartClick(chartClickId,{date:params.name,type:params.seriesName});
                        }
                    }
                });
                break;
            case 'appStoreRank':
                myChart.on('click',function (params){
                    F_Industry_AppStore._more(params.name);
                });
                break;
            case 'gameForumTotal':
            case 'gameEmotionRank':
                myChart.on('click',function (params){
                    if(params.value == 0){
                        B_Pop._init('msg',{'content':'当前日期无数据，请选择其他日期'});
                    }else{
                        if(params.name){
                            F_GameForum_Info._chartClick(chartClickId,{date:params.name,type:params.seriesName});
                        }
                    }
                });
                break;
            case 'gameChannelCount':
                myChart.on('click',function (params){
                    if(params.value == 0){
                        B_Pop._init('msg',{'content':'当前日期无数据，请选择其他日期'});
                    }else{
                        if(params.name){
                            F_GameChannel_Info._chartClick(chartClickId,{name:params.name});
                        }
                    }
                });
            case 'gameAssistantAlarm':
                myChart.on('click',function (params){
                    if(params.value == 0){
                        B_Pop._init('msg',{'content':'当前时间段该类问题舆情正常，无需警戒'});
                    }else{
                        if(params.name){
                            F_GameAssistant_Info._chartClick('bs_suddenly_chart',{date:params.name,classify:params.seriesName});
                        }
                    }
                });
                break;
            default:
                switch(dom) {
                    case 'bs_suddenly_chart':
                        myChart.on('click',function (params){
                            if(params.value == 0){
                                B_Pop._init('msg',{'content':'当前时间段该类问题舆情正常，无需警戒'});
                            }else{
                                if(params.name){
                                    F_Alarm_Info._getFromChartClick(params.name,params.seriesName);
                                }
                            }
                        });
                        break;
                    case 'bs_hotwrod_tread':
                        myChart.on('click', function (params) {
                            if (params.value == 0) {
                                B_Pop._init('msg', {'content': '当前日期无数据，请选择其他日期'});
                            } else {
                                if (params.name) {
                                    F_Hot_Info._getFromChartClick(params.name, params.seriesName);
                                }
                            }
                        });
                        break;
                    case 'bs_chatresult_topic':
                        myChart.on('click',function (params){
                            if(params.name){
                                F_ChatResult_Topic._formatTopic(params.name);
                            }
                        });
                        break;
                    case 'bs_chatresult_keywords':
                        myChart.on('click',function (params){
                            if(params.name){
                                F_ChatResult_Common._openDetail('detail',{word:params.name});
                            }
                        });
                        break;
                    case 'bs_emotion':
                        myChart.on('click',function (params){
                            if(params.value == 0){
                                B_Pop._init('msg', {'content': '当前日期无数据，请选择其他日期'});
                            }else{
                                F_GameSummary_Info._chartClick('bs_emotion',{date:params.name,type:params.seriesName});
                            }
                        });
                        break;
                    case 'bs_word_tendency':
                        myChart.on('click',function (params){
                            if(params.value == 0){
                                B_Pop._init('msg', {'content': '当前日期无数据，请选择其他日期'});
                            }else{
                                F_GameSentiment_Info._chartClick('bs_word_tendency',{date:params.name});
                            }
                        });
                        break;
                    case 'bs_word_distribute':
                        myChart.on('click',function (params){
                            if(params.value == 0){
                                B_Pop._init('msg', {'content': '当前日期无数据，请选择其他日期'});
                            }else{
                                F_GameSentiment_Info._chartClick('bs_word_distribute',{type:params.name});
                            }
                        });
                        break;
                    case 'bs_rank_detail_chart':
                        myChart.on('click',function (params){
                            if(params.value == 0){
                                B_Pop._init('msg', {'content': '当前日期无数据，请选择其他日期'});
                            }else{
                                F_GameSentiment_Info._chartClick('bs_rank_detail_chart',{date:params.name});
                            }
                        });
                        break;
                    case 'bs_emotion_light':
                        myChart.on('click',function (params){
                            if(params.value == 0){
                                B_Pop._init('msg', {'content': '当前日期无数据，请选择其他日期'});
                            }else{
                                F_GameLight_Info._chartClick('bs_emotion_light',{date:params.name,type:params.seriesName});
                            }
                        });
                        break;
                    case 'bs_word_tendency_light':
                        myChart.on('click',function (params){
                            if(params.value == 0){
                                B_Pop._init('msg', {'content': '当前日期无数据，请选择其他日期'});
                            }else{
                                F_GameLight_Info._chartClick('bs_word_tendency_light',{date:params.name});
                            }
                        });
                        break;
                    case 'bs_rank_detail_chart_light':
                        myChart.on('click',function (params){
                            if(params.value == 0){
                                B_Pop._init('msg', {'content': '当前日期无数据，请选择其他日期'});
                            }else{
                                F_GameLight_Info._chartClick('bs_rank_detail_chart_light',{date:params.name});
                            }
                        });
                        break;
                    case 'bs_hotword_tread_light':
                        myChart.on('click', function (params) {
                            if (params.value == 0) {
                                B_Pop._init('msg', {'content': '当前日期无数据，请选择其他日期'});
                            } else {
                                if (params.name) {
                                    F_GameAssistant_Info._chartClick('bs_hotword_tread_light',{'date':params.name, 'name':params.seriesName});
                                }
                            }
                        });
                        break;
                }
                break;
        }

    }
}
var B_Page = {
    _size:10,
    _currentPage:1,
    _number:2,
    _init:function(data){
        var back = {pageSize:10,pageCount:0,total:data.total,dom:data.dom};
        back.pageSize = data.pageSize ? data.pageSize : B_Page._size;
        if(data.total && data.total > 0){
            back.pageCount =  Math.ceil(data.total/back.pageSize);
            if(back.pageCount > 1000)back.pageCount = 1000;
        }
        data.page = data.page ? data.page : 1;
        back.page =  (data.page > back.pageCount) ? back.pageCount : data.page;
        return back;
    },
    _show:function(data,type){
        var pageInit = B_Page._init(data);
        return B_Page._format(pageInit,type);
    },
    _format:function(data,type){
        var str = '';
        if(data.pageCount > 1){
            switch(type){
                case 'simple':
                case 'number':
                    str += '<ul class="fl">';
                    if(type == 'number')str += '<li>每页显示<b>'+data.pageSize+'</b>条记录</li>';
                    str += '<li>(共<b>'+data.total+'</b>条记录)</li></ul>';
                    str += '<ul class="fr">';
                    str += '<li>第<input type="text" value="'+data.page+'">页</li>';
                    str += '<li><button class="jump-page tg-assist-btn" data-d="'+data.dom+'" data-a="'+data.pageCount+'">确定</button></li>';
                    str += '<li>';
                    if(data.page <= 1){
                        str += '<button  data-d="'+data.dom+'" class="prev-page tg-assist-btn turn" disabled>&lt;</button>';
                    }else{
                        str += '<button  data-d="'+data.dom+'" class="prev-page tg-assist-btn turn">&lt;</button>';
                    }
                    str += '</li>';
                    str += '<li>';
                    if(data.page >= data.pageCount){
                        str += '<button  data-d="'+data.dom+'" class="next-page tg-assist-btn turn" disabled>&gt;</button>';
                    }else{
                        str += '<button  data-d="'+data.dom+'" class="next-page tg-assist-btn turn">&gt;</button>';
                    }
                    str += '</li>';
                    break;
                case 'page':
                    var front = '';
                    var back = '';
                    str += '<li>';
                    front += '<span class="prev"><button';
                    if(data.page <= 1){
                        front += ' disabled';
                    }
                    front += '>上一页</button></span>';
                    if(data.pageCount > 5 && data.page > 3){
                        front += '<span class="page-num">1</span><span class="page-num">…</span>';
                    }
                    if(data.pageCount > 5 && (data.pageCount- data.page) > 3){
                        back += '<span class="page-num">…</span><span class="page-num">'+data.pageCount+'</span>';
                    }
                    back += '<span class="next"><button';
                    if(data.page >= data.pageCount){
                        back += ' disabled';
                    }
                    back += '>下一页</button></span>';
                    data.page = parseInt(data.page);

                    var pageBegin = data.page - parseInt(B_Page._number);
                    var pageEnd = data.page + parseInt(B_Page._number);

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
            }
        }
        return str;
    },
    _click:function (page,callback,type) {
        switch (type){
            case 'bs_search_game_page':
            case 'bs_search_article_page':
                var dom = $('#'+type);
                dom.find('span').each(function(){
                    var isJump = false;
                    $(this).click(function(){
                        if($(this).hasClass('prev')){
                            isJump = true;
                            page = parseInt(page)-1;
                        }else if($(this).hasClass('next')){
                            isJump = true;
                            page = parseInt(page)+1;
                        }else if($(this).hasClass('page-num')){
                            if($(this).html() != '…' && page != $(this).html()){
                                isJump = true;
                                page = $(this).html();
                            }
                        }
                        if(isJump){
                            callback(page);
                            B_Jump._top();
                        }
                    });
                })
                break;
            default:
                var dom = type ? 'bs_page_'+type : 'lt_forum_page';
                $('#'+dom+' .prev-page').click(function(){
                    callback && callback(parseInt(page)-1,$(this).attr('data-d'));
                });
                $('#'+dom+' .next-page').click(function(){
                    callback && callback(parseInt(page)+1,$(this).attr('data-d'));
                });
                $('#'+dom+' .jump-page').click(function(){
                    var goPage = $.trim($('#'+dom+' input').val());
                    var pageTotal = $(this).attr('data-a');
                    if(goPage == '' || isNaN(goPage)){
                        B_Pop._init('msg',{content:'页码必须为数字,请确认！'});
                        return false;
                    }
                    if(parseInt(goPage) <= 0){
                        B_Pop._init('msg',{content:'页码错误,请确认！'});
                        return false;
                    }
                    if(parseInt(goPage) == parseInt(page)){
                        return false;
                    }
                    if(parseInt(pageTotal) < parseInt(goPage)){
                        B_Pop._init('msg',{content:'页码错误,请确认！'});
                        return false;
                    }
                    callback && callback(goPage,$(this).attr('data-d'));
                });
                B_Common._submitBind($('#'+dom+' .jump-page'),$('#'+dom+' input'));
                break;
        }

    }
}

var B_AD = {
    _adImg:function () {
        return 'elements2.0/img/post/';
    },
    _ad:function(dom,url){
        var img = B_AD._adImg();
        switch (dom){
            case 'ad_1':
                img += 'report.jpg';
                $('#ad_1').html('<a href="http://file.thinkinggame.cn/pdf/report/2016%E5%B9%B4%E4%B8%8B%E5%8D%8A%E5%B9%B4%E6%B8%B8%E6%88%8F%E8%A1%8C%E4%B8%9A%E8%88%86%E6%83%85%E6%8A%A5%E5%91%8A.pdf" target="_blank"><img src="'+img+'"></a>');
                break;
            case 'ad_2':
                img += 'activity.jpg';
                $('#ad_2').html('<img src="'+img+'" onclick="B_Login._openApplication()">');
                break;
            case 'ad_3':
                img += 'post-a.png';
                $('.lg_right').html('<img src="'+img+'" onclick="B_Jump._go(\'base\',\''+url+'\')">');
                break;
        }
    }
}