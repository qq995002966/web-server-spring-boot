$(function() {
    //手机号验证
    $('#phoneNum').blur(function() {
        var phone = $.trim($('#phoneNum').val());
        if (phone.length < 1) {
            $('.errorMessage').text('手机号不能为空！');
            // $('#phoneNum').focus();
               $('#phoneNum').parent('li').addClass('red-border');
            return false;
        }
        //手机号格式验证
        var pattern = /^1[34578]\d{9}$/; //手机号
        var flag = pattern.test(phone);
        if (!flag) {
            $(".errorMessage").text("输入的手机号格式有误，请重新输入！")
            // $('#phoneNum').focus();
             $('#phoneNum').parent('li').addClass('red-border');
            return false;
        } else {
            $('.errorMessage').text('');
               $('#phoneNum').parent('li').removeClass('red-border');
        }
    });

    //qq号验证
    $('#qNum').blur(function() {
        var qq = $.trim($('#qNum').val());
        if (qq.length < 1) {
            $('.errorMessage').text('QQ号不能为空！');
            // $('#qNum').focus();
              $('#qNum').parent('li').addClass('red-border');
            return false;
        }
        //qq号验证
        var patternq = /^\d{5,15}$/; //qq号
        var flagq = patternq.test(qq);
        if (!flagq) {
            $(".errorMessage").text("输入的QQ号有误，请重新输入！")
            // $('#qNum').focus();
               $('#qNum').parent('li').addClass('red-border');
            return false;
        } else {
            $('.errorMessage').text('');
            $('#qNum').parent('li').removeClass('red-border');
        }
    });

    $('#regBtn').on('click', function() {
        var phone = $.trim($('#phoneNum').val());
        var qq = $.trim($('#qNum').val());
        var pattern = /^1[34578]\d{9}$/; //手机号
        var flag = pattern.test(phone);
        var patternq = /^\d{5,15}$/; //qq号
        var flagq = patternq.test(qq);
        if (phone.length < 1 || qq.length < 1) {
            $(".errorMessage").text("请输入必填项！");
             $('#phoneNum').parent('li').addClass('red-border');
             $('#qNum').parent('li').addClass('red-border');
        } else if (!flag) {
            $(".errorMessage").text("输入手机号格式有误，请重新输入！");
        } else if (!flagq) {
            $(".errorMessage").text("输入QQ号格式有误，请重新输入！");
        } else {
            var companyName = $.trim($('input[name="company"]').val());
            var jobTitle = $.trim($('select[name="jobTitle"]').val());
            var postData = 'mobile='+phone+'&qq='+qq+'&company_name='+encodeURIComponent(companyName)+'&job_type='+jobTitle;
            CJ_Bind._doBind(postData);
        }
    });
});
var CJ_Bind = {
    _doBind:function(postData){
        CJ_Port._ajax('wxLoginDetail','get',true,postData,function(){
            $('#regBtn').text('登记中，请稍等...').attr('disabled',true);
        },function(){
            $('#regBtn').text('登记').attr('disabled',false);
        },function(data,msg){
            $('.content').hide();
            $('.success').show();
            setTimeout(function() {
                $('.success').hide();
                self.location.href = CJ_Common._baseHost()+'refreshMobile.html'
            }, 2000)
        },function(data,msg,code){
            alert(msg);
        })
    }
}
