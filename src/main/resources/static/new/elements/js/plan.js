$(function(){
    G_Login._check();

    submitBind($('#addNewgame button'));
    $('#addNewgame button').click(function(){
        var type = radioVal('gamestyle');
        var gameName = $.trim($('input[name="gameName"]').val());
        var gameContent = $.trim($('textarea[name="gameContent"]').val());
        if(gameName == ''){
            parent.G_Pop._init('msg',{'content':'请填写游戏名称'});
            return false;
        }
        if(gameContent == ''){
            parent.G_Pop._init('msg',{'content':'请填写游戏介绍信息'});
            return false;
        }
        G_Port._ajax('addProject','post',true,'project_type='+type+'&project_name='+gameName+'&project_desc='+gameContent,function(){
                parent.btnStatus('post','disable',$('#addNewgame button'));
            },function(){
                parent.btnStatus('post','normal',$('#addNewgame button'));
            },function(data,msg){
                parent.G_Pop._init('checkAlert',{'content':'申请添加游戏已提交，请耐心等待！','icon':6});
            },function(data,msg,code){
                parent.G_Pop._init('msg',{'content':msg});
            }
        )
        return false;
    });

    submitBind($('#addGameword button'));
    $('#addGameword button').click(function(){
        var id = $('#addGameword #dropDown p').attr('data-i');
        var wordClassify = $.trim($('input[name="wordClassify"]').val());
        var wordContent = $.trim($('textarea[name="wordContent"]').val());
        if(id == ''){
            parent.G_Pop._init('msg',{'content':'请选择游戏'});
            return false;
        }
        if(wordClassify == ''){
            parent.G_Pop._init('msg',{'content':'请填写词汇分类'});
            return false;
        }
        if(wordContent == ''){
            parent.G_Pop._init('msg',{'content':'请填写词汇'});
            return false;
        }
        var wordNumber = wordContent.split(' ').length;
        G_Port._ajax('addWord','post',true,'word_number='+wordNumber+'&classify_name='+wordClassify+'&words='+wordContent+'&project_id='+id,function(){
                parent.btnStatus('post','disable',$('#addGameword button'));
            },function(){
                parent.btnStatus('post','normal',$('#addGameword button'));
            },function(data,msg){
                parent.G_Pop._init('checkAlert',{'content':'申请添加词汇已提交，请耐心等待！','icon':6});
            },function(data,msg,code){
                parent.G_Pop._init('msg',{'content':msg});
            }
        )
        return false;
    });

    submitBind($('#addGamefrom button'));
    $('#addGamefrom button').click(function(){
        var id = $('#addGamefrom #dropDown p').attr('data-i');
        var source1 = $.trim($('input[name="source1"]').val());
        var url1 = $.trim($('input[name="url1"]').val());
        var source2 = $.trim($('input[name="source2"]').val());
        var url2 = $.trim($('input[name="url2"]').val());
        if(id == ''){
            parent.G_Pop._init('msg',{'content':'请选择游戏'});
            return false;
        }
        if(source1 == '' || url1 == '' || source2 == '' || url2 == ''){
            parent.G_Pop._init('msg',{'content':'请填写数据源'});
            return false;
        }
        if(source1 != '' || url1 != ''){
            if(source1 == ''){
                parent.G_Pop._init('msg',{'content':'请填写数据源名称'});
                return false;
            }
            if(url1 == ''){
                parent.G_Pop._init('msg',{'content':'请填写数据源网址'});
                return false;
            }
        }
        if(source2 != '' || url2 != ''){
            if(source2 == ''){
                parent.G_Pop._init('msg',{'content':'请填写数据源名称'});
                return false;
            }
            if(url2 == ''){
                parent.G_Pop._init('msg',{'content':'请填写数据源网址'});
                return false;
            }
        }
        G_Port._ajax('addSource','post',true,'forum_name_0='+source1+'&forum_url_0='+url1+'&forum_name_1='+source2+'&forum_url_1='+url2+'&project_id='+id,function(){
                parent.btnStatus('post','disable',$('#addGamefrom button'));
            },function(){
                parent.btnStatus('post','normal',$('#addGamefrom button'));
            },function(data,msg){
                parent.G_Pop._init('checkAlert',{'content':'申请添加数据源已提交，请耐心等待！','icon':6});
            },function(data,msg,code){
                parent.G_Pop._init('msg',{'content':msg});
            }
        )
        return false;
    });

    F_Game._get(null,1);
    F_Game._get(null,2);
    F_Game._format(1,demoProjectId());
    F_Game._format(2,demoProjectId());
    F_Game._getForum(demoProjectId());
});

var F_Game = {
    _getForum:function(id){
        G_Port._ajax('crawlerAndApp','get',true,'project_id='+id,null,null,function(data,msg){
                $('#bs_forums a').remove();
                if(data.forum_info_list && data.forum_info_list.length>0){
                    $('#bs_forums').append(F_Game._htmlForum(data.forum_info_list));
                }
            },null
        )
    },
    _get:function(keyword,dom){
        var game = G_Game._search(keyword);
        $('.bs_game_'+dom+' ul li').remove();
        $('.bs_game_'+dom+' ul').append(F_Game._html(game));
        F_Game._choose(dom);
    },
    _htmlForum:function(data){
        var str = '';
        for(var i=0;i<data.length;i++){
            str += '<a href="javascript:void(0)">'+data[i].fourm_name+'</a>';
        }
        return str;
    },
    _html:function(data){
        var str = '';
        if(data.length > 0){
            for(var i=0;i<data.length;i++){
                str += '<li id="'+data[i].project_id+'">'+data[i].project_name+'</li>';
            }
        }else{
            str += '<li>没有找到！</li>';
        }
        return str;
    },
    _format:function(dom,id){
        var gameImg = G_Game._imgUrl(id);
        var gameName = G_Game._name(id);
        $('.bs_game_'+dom+' p').html('<img src="'+gameImg+'">'+gameName).attr('data-i',id);
    },
    _choose:function(dom){
        $('.bs_game_'+dom+' ul li').each(function(){
            $(this).click(function(){
                var id = $(this).attr('id');
                if(id && id != ''){
                    F_Game._format(dom,id);
                    $('.bs_game_'+dom+' ul').slideUp("fast");
                    if(dom == 2){
                        F_Game._getForum(id);
                    }
                }
            });
        })
        $('.bs_game_'+dom+' ul input').keyup(function(){
            F_Game._get($.trim($(this).val()),dom);
        });
    }
}