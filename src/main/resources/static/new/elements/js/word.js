$(function(){
    parent.isDemoUser() ? $('.wd_notice').show() : $('.wd_input').show();
    $('.wd_notice a').click(function(){
        parent.openLogin();
    });
    $('.wd_notice button').click(function(){
        G_Jump._url('reg');
    });
    var word = getUrl('query');
    if(word.w){
        word = decodeURIComponent(word.w);
        word = word.split(' ');
        for(var i=0;i<word.length;i++){
            $('input[type="text"]').eq(i).val(word[i]);
        }
    }
    submitBind($('#wordSForm button'));
    $('#wordSForm button').click(function(){
        var word = [];
        $('input[type="text"]').each(function(){
            var val = $.trim($(this).val());
            if(val != ''){
                val = blankRemove(val);
                word.push(val);
            }
        });
        if(word.length == 0){
            parent.G_Pop._init('msg',{'content':'词汇不能为空'});
            return false;
        }else{
            word = word.join(' ');
            G_Port._ajax('insertCustomKeywords','post',true,'custom_keywords='+word+'&project_id='+parent.G_Game._id(),function(){
                    btnStatus('set','disable',$('#wordSForm button[type="submit"]'));
                },function(){
                    btnStatus('set','normal',$('#wordSForm button[type="submit"]'));
                },function(data,msg){
                    parent.F_HotWordTrend._getTrend();
                    parent.G_Pop._init('close');
                    return false;
                },function(data,msg,code){
                    parent.G_Pop._init('msg',{'content':msg});
                    return false;
                }
            );
        }
    });
});