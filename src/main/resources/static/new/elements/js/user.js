$(function(){
    G_Login._check();
    C_Dom._header(-1);
    C_Dom._footer();
    G_Login._status('user');
    G_Game._getCollect();


    F_Person._getInfo();
    submitBind($('.save-btn button'));
    $('.save-btn button').click(function(){
        var nick_name = $.trim($('input[name="nick"]').val());
        if(nick_name == ''){
            G_Pop._init('msg',{'content':'请填写昵称，格式为1-20位字符，支持汉字、字母、数字及"-"、"_"组合'});
            return false;
        }
        var gaming_years = $('#selectWrap #dropDown p').attr('data-i');
        var gender = radioVal('gender');
        var tags_id = '';
        var tags = [];
        $('.tags li').each(function(){
            if($(this).hasClass('tag-selected')){
                tags.push($(this).attr('data-i'));
            }
        });
        if(tags)tags_id = tags.join(',');

        G_Port._ajax('userInfo','post',true,'gender='+gender+'&nick_name='+nick_name+'&gaming_years='+gaming_years+'&tags_id='+tags_id,function(){
                btnStatus('save','disable',$('.save-btn button'));
            },function(){
                btnStatus('save','normal',$('.save-btn button'));
            },function(data,msg){
                var data = {'key':['gaming_years','gender','nick_name','tags_id'],'val':[gaming_years,gender,nick_name,tags_id]}
                G_User._setData(data);
                G_Pop._init('alert',{'content':'数据保存成功！','icon':6});
            },function(data,msg,code){
                G_Pop._init('msg',{'content':msg});
            }
        )
        return false;
    });

});

var F_Person = {
    _getInfo:function(){
        var person = G_User._getData();
        var nick = person.nick_name ? person.nick_name : '';
        $('input[name="nick"]').val(nick);

        var mobile = person.mobile ? person.mobile.substr(0,3)+'*****'+person.mobile.substr(-3,3) : "未设置";
        $('#bs_mobile').html(mobile);

        var email = '未设置';
        if(person.email){
            var emailArr = person.email.split('@');
            var email = emailArr[0].substr(0,1)+new Array( emailArr[0].length ).join('*')+'@'+emailArr[1];
        }
        $('#bs_email').html(email);

        switch(person.gender+''){
            default:
                $('#Male').attr('checked','checked')
                break;
            case '1':
                $('#feMale').attr('checked','checked')
                break;
        }
        $('#selectWrap #dropDown p').html(F_Person._htmlYear(person.gaming_years)).attr('data-i',person.gaming_years);

        var tagIds = person.tags_id ? person.tags_id.split(',') : [];
        $('.tags').html(F_Person._htmlTag(tagIds));

        // tags选择
        $('.tags li').on('click', function(){
            if($(this).hasClass('tag-selected')){
                $(this).removeClass('tag-selected');
            }else{
                if($('.tag-selected').size()> 9 ){
                    G_Pop._init('msg',{'content':'最多只能选择10个哦'});
                    return;
                }else{
                    $(this).addClass('tag-selected');
                }
            }

        });
    },
    _htmlTag:function(data){
        var tag = G_Game._tagAll();
        var str = '';
        if(tag){
            $.each(tag,function(key,value){
                str += '<li data-i="'+key+'"';
                if($.inArray(key,data) > -1){
                    str += ' class="tag-selected"';
                }
                str += '>'+value+'</li>';
            })
        }
        return str
    },
    _htmlYear:function(data){
        switch(data+''){
            default:
                return '请选择年限';
                break;
            case '1':
                return '不到1年';
                break;
            case '3':
                return '1~3年';
                break;
            case '5':
                return '3~5年';
                break;
            case '10':
                return '5~10年';
                break;
            case '11':
                return '10年以上';
                break;
        }
    }
}