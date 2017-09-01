$(function(){
    $('input[name="username"]').val(parent.G_Login._pre());
    $('input').iCheck({
        checkboxClass: 'icheckbox_flat-aero',
        radioClass: 'iradio_flat-aero'
    });
    submitBind($('#loginSForm button'));
    $('#loginSForm button').click(function(){
        var userName = $.trim($('input[name="username"]').val());
        var userPass = $.trim($('input[name="userpass"]').val());
        var userExpire = 0;
        if(userName == ''){
            parent.G_Pop._init('msg',{'content':'手机号/邮箱不能为空'});
            return false;
        }
        if(!(_IsMobile(userName) || _IsEmail(userName))){
            parent.G_Pop._init('msg',{'content':'手机号/邮箱格式错误'});
            return false;
        }
        if(userPass == ''){
            parent.G_Pop._init('msg',{'content':'密码不能为空'});
            return false;
        }
        if($('input[name="userexpire"]').prop("checked")==true){
            userExpire = 604800;
        }
        parent.G_Login._in(
            {
                login_name : userName,
                password : userPass,
                maxInactiveInterval:userExpire
            },
            function(){
                parent.btnStatus('login','disable',$('#loginSForm button[type="submit"]'));
            },
            function(){
                parent.btnStatus('login','normal',$('#loginSForm button[type="submit"]'));
            }
        );
        return false;
    });

    $('p a').click(function(){
        G_Jump._go('reg');
    });
    $('.lg_check a').click(function(){
        G_Jump._go('find');
    });
});

function _IsMobile(s){
    return /^1\d{10}$/.test(s);
}
function _IsEmail(addr){
    return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(addr);
}