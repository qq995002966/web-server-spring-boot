$(function(){
    G_Login._check();
    C_Dom._header(-1);
    C_Dom._footer();
    G_Login._status('user');
    G_Game._getCollect();


    submitBind($('.save-btn button'));
    $('.save-btn button').click(function(){
        var oldPass = $.trim($('input[name="oldPass"]').val());
        var newPass = $.trim($('input[name="newPass"]').val());
        var comfirmPass = $.trim($('input[name="comfirmPass"]').val());
        if(oldPass == ''){
            G_Pop._init('msg',{'content':'旧密码必须填写'});
            return false;
        }
        if(oldPass.length < 6){
           G_Pop._init('msg',{'content':'密码长度不得少于6位字符'});
            return false;
        }
        if(newPass == ''){
            G_Pop._init('msg',{'content':'新密码必须填写'});
            return false;
        }
        if(newPass.length < 6){
            G_Pop._init('msg',{'content':'密码长度不得少于6位字符'});
            return false;
        }
        if(newPass != comfirmPass){
            G_Pop._init('msg',{'content':'两次输入的密码不一致，请确认'});
            return false;
        }

        G_Port._ajax('password','post',true,'old_password='+oldPass+'&password='+newPass,function(){
                btnStatus('save','disable',$('.save-btn button'));
            },function(){
                btnStatus('save','normal',$('.save-btn button'));
            },function(data,msg){
                G_Pop._init('alert',{'content':'密码修改成功！','icon':6});
            },function(data,msg,code){
                G_Pop._init('msg',{'content':msg});
            }
        )
        return false;
    });

});