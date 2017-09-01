$(function () {
    submitBind($('#faqForm button'));
    $('#faqForm button').click(function(){
        var type = radioVal('opinion');
        var content = $.trim($('textarea[name="content"]').val());
        if(content == ''){
            parent.G_Pop._init('msg',{'content':'请填写反馈内容'});
            return false;
        }
        G_Port._ajax('opinion','post',true,'opinion_type='+type+'&opinion_msg='+content,function(){
                parent.btnStatus('post','disable',$('#faqForm button'));
            },function(){
                parent.btnStatus('post','normal',$('#faqForm button'));
            },function(data,msg){
                parent.G_Pop._init('checkAlert',{'content':'您的反馈已收到，感谢您的反馈！','icon':6});
            },function(data,msg,code){
                parent.G_Pop._init('msg',{'content':msg});
            }
        )
        return false;
    });
});