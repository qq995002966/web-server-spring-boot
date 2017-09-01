$(function(){
    var $_GET = W_Common._getUrl('query');
    if($_GET.t && $_GET.t == 's'){
        var shareToken = W_Login._shareTokenGet();
        var fightUrl = W_Jump._getUrl('fight');
        if(shareToken)fightUrl += '?token='+shareToken;
        if(W_Login._check()){
            $('.fortribal').show();
            $('.login-input').hide();
            setTimeout(function(){
                W_Jump._go('target',fightUrl);
            },5000);
        }else{
            W_Jump._go('target',fightUrl);
        }
    }else{
        $('#loginBtn').click(function(){
            var userName = $.trim($('input[name="username"]').val());
            var userPass = $.trim($('input[name="userpass"]').val());
            var userExpire = 0;
            var url = '';
            var checkBtn = ['<button class="pop-btn recieve">重新填写</button>'];
            if(userName == ''){
                W_Common._pop('手机号不能为空',checkBtn);
                return false;
            }
            if(!(W_Common._isMail(userName) || W_Common._isMobile(userName))){
                W_Common._pop('手机号格式错误',checkBtn);
                return false;
            }
            if(userPass == ''){
                W_Common._pop('密码不能为空',checkBtn);
                return false;
            }
            if($('input[name="userexpire"]').prop("checked")==true){
                userExpire = 604800;
            }
            W_Login._in(
                {
                    login_name : userName,
                    password : userPass,
                    maxInactiveInterval:userExpire
                },
                function(){
                    $('#loginBtn').attr('disabled',true);
                },
                function(){
                    $('#loginBtn').attr('disabled',false);
                },
                url,
                checkBtn
            );
        });
        $('.login-input').show();
    }
});