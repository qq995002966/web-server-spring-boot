$(function(){
    G_Login._check();
    var $_GET = getUrl('query');
    var fromBack = false;
    if($_GET.n)$('input[name="gameName"]').val(G_Common._decodeUrl($_GET.n));
    if($_GET.f)fromBack = true;
    $('#addNewgame button').click(function(){
        var type = radioVal('gamestyle');
        var gameName = $.trim($('input[name="gameName"]').val());
        var gameContent = $.trim($('textarea[name="gameContent"]').val());
        if(gameName == ''){
            if(fromBack){
                parent.B_Pop._init('msg',{'content':'请填写游戏名称'});
            }else{
                parent.G_Pop._init('msg',{'content':'请填写游戏名称'});
            }
            return false;
        }
        if(gameContent == ''){
            if(fromBack){
                parent.B_Pop._init('msg',{'content':'请填写游戏介绍信息'});
            }else{
                parent.G_Pop._init('msg',{'content':'请填写游戏介绍信息'});
            }
            return false;
        }
        var source1 = $.trim($('input[name="gameSource1"]').val());
        var url1 = $.trim($('input[name="gameUrl1"]').val());
        var source2 = $.trim($('input[name="gameSource2"]').val());
        var url2 = $.trim($('input[name="gameUrl2"]').val());
        if(url1 != '')url1 = encodeURIComponent(url1);
        if(url2 != '')url2 = encodeURIComponent(url2);
        G_Port._ajax('addProject','post',true,'project_type='+type+'&project_name='+gameName+'&project_desc='+gameContent+'&forum_name1='+source1+'&forum_url1='+url1+'&forum_name2='+source2+'&forum_url2='+url2,function(){
                $('#addNewgame button').text('提交中,请稍等...').attr('disabled',true);
            },function(){
                $('#addNewgame button').text('确认提交').attr('disabled',false);
            },function(data,msg){
                if(fromBack){
                    parent.B_Pop._init('checkAlert',{'content':'申请添加游戏已提交，请耐心等待！','icon':6});
                }else{
                    parent.G_Pop._init('checkAlert',{'content':'申请添加游戏已提交，请耐心等待！','icon':6});
                }

            },function(data,msg,code){
                if(fromBack){
                    parent.B_Pop._init('msg',{'content':msg});
                }else{
                    parent.G_Pop._init('msg',{'content':msg});
                }
            }
        )
        return false;
    });
    $('#addGameword button').click(function(){
        var id = $('#addGameword .bs_game_1 p').attr('data-i');
        var wordClassify = $.trim($('input[name="wordClassify"]').val());
        var wordContent = $.trim($('textarea[name="wordContent"]').val());
        if(id == ''){
            if(fromBack){
                parent.B_Pop._init('msg',{'content':'请选择游戏'});
            }else{
                parent.G_Pop._init('msg',{'content':'请选择游戏'});
            }
            return false;
        }
        if(wordClassify == ''){
            if(fromBack){
                parent.B_Pop._init('msg',{'content':'请填写词汇分类'});
            }else{
                parent.G_Pop._init('msg',{'content':'请填写词汇分类'});
            }
            return false;
        }
        if(wordContent == ''){
            if(fromBack){
                parent.B_Pop._init('msg',{'content':'请填写词汇'});
            }else{
                parent.G_Pop._init('msg',{'content':'请填写词汇'});
            }
            return false;
        }
        var wordNumber = wordContent.split(' ').length;
        G_Port._ajax('addWord','post',true,'word_number='+wordNumber+'&classify_name='+wordClassify+'&words='+wordContent+'&project_id='+id,function(){
                $('#addGameword button').text('提交中,请稍等...').attr('disabled',true);
            },function(){
                $('#addGameword button').text('确认提交').attr('disabled',false);
            },function(data,msg){
                if(fromBack){
                    parent.B_Pop._init('checkAlert',{'content':'申请添加词汇已提交，请耐心等待！','icon':6});
                }else{
                    parent.G_Pop._init('checkAlert',{'content':'申请添加词汇已提交，请耐心等待！','icon':6});
                }
            },function(data,msg,code){
                if(fromBack){
                    parent.B_Pop._init('msg',{'content':msg});
                }else{
                    parent.G_Pop._init('msg',{'content':msg});
                }
            }
        )
        return false;
    });

    $('#addGamefrom button').click(function(){
        var id = $('#addGamefrom .bs_game_2 p').attr('data-i');
        var source1 = $.trim($('input[name="source1"]').val());
        var url1 = $.trim($('input[name="url1"]').val());
        var source2 = $.trim($('input[name="source2"]').val());
        var url2 = $.trim($('input[name="url2"]').val());
        if(id == ''){
            if(fromBack){
                parent.B_Pop._init('msg',{'content':'请选择游戏'});
            }else{
                parent.G_Pop._init('msg',{'content':'请选择游戏'});
            }
            return false;
        }
        if((source1 == '' && url1 == '') && (source2 == '' && url2 == '')){
            if(fromBack){
                parent.B_Pop._init('msg',{'content':'请填写数据源'});
            }else{
                parent.G_Pop._init('msg',{'content':'请填写数据源'});
            }
            return false;
        }
        if(source1 != '' || url1 != ''){
            if(source1 == ''){
                if(fromBack){
                    parent.B_Pop._init('msg',{'content':'请填写数据源名称'});
                }else{
                    parent.G_Pop._init('msg',{'content':'请填写数据源名称'});
                }
                return false;
            }
            if(url1 == ''){
                if(fromBack){
                    parent.B_Pop._init('msg',{'content':'请填写数据源网址'});
                }else{
                    parent.G_Pop._init('msg',{'content':'请填写数据源网址'});
                }
                return false;
            }
        }
        if(source2 != '' || url2 != ''){
            if(source2 == ''){
                if(fromBack){
                    parent.B_Pop._init('msg',{'content':'请填写数据源名称'});
                }else{
                    parent.G_Pop._init('msg',{'content':'请填写数据源名称'});
                }
                return false;
            }
            if(url2 == ''){
                if(fromBack){
                    parent.B_Pop._init('msg',{'content':'请填写数据源网址'});
                }else{
                    parent.G_Pop._init('msg',{'content':'请填写数据源网址'});
                }
                return false;
            }
        }
        if(url1 != '')url1 = encodeURIComponent(url1);
        if(url2 != '')url2 = encodeURIComponent(url2);
        G_Port._ajax('addSource','post',true,'forum_name_0='+source1+'&forum_url_0='+url1+'&forum_name_1='+source2+'&forum_url_1='+url2+'&project_id='+id,function(){
                $('#addGamefrom button').text('提交中,请稍等...').attr('disabled',true);
            },function(){
                $('#addGamefrom button').text('确认提交').attr('disabled',false);
            },function(data,msg){
                if(fromBack){
                    parent.B_Pop._init('checkAlert',{'content':'申请添加数据源已提交，请耐心等待！','icon':6});
                }else{
                    parent.G_Pop._init('checkAlert',{'content':'申请添加数据源已提交，请耐心等待！','icon':6});
                }
            },function(data,msg,code){
                if(fromBack){
                    parent.B_Pop._init('msg',{'content':msg});
                }else{
                    parent.G_Pop._init('msg',{'content':msg});
                }
            }
        )
        return false;
    });
    G_Game._dropChoose(null,$('.bs_game_1'));
    G_Game._dropChoose(null,$('.bs_game_2'),'source');
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
    _htmlForum:function(data){
        var str = '';
        for(var i=0;i<data.length;i++){
            str += '<a href="'+data[i].forum_url+'" target="_blank">'+data[i].fourm_name+'</a>';
        }
        return str;
    }
}