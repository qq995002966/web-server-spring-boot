$(function(){
    var controller = W_Common._getUrl('controller');
    var $_GET = W_Common._getUrl('query');
    switch(controller){
        case 'startfight':
            if(!W_Login._check() && $_GET.token){
                W_InviteToken._set('invite',$_GET.token);
                W_InviteToken._set('join',$_GET.token);
            }
            F_Fight._getInfo();
            break;
        case 'hero':
            F_Hero._getInfo();
            break;
        case 'success':
            F_Success._getInfo();
            break;
    }
});
var F_Success = {
    _getToken:function(){
        var inviteToken = W_InviteToken._get('join');
        if(inviteToken){
            return inviteToken;
        }else{
            W_Jump._go('target',W_Jump._getUrl('fight'));
            return false;
        }
    },
    _join:function(inviteToken){
        W_Port._ajax('wowGroup','get',true,'invite_token='+inviteToken,function(){
                $('#bs_join_team').html('加入中...').attr('disabled',true);
            },function(){
                $('#bs_join_team').html('组队战斗').attr('disabled',false);
            },function(data, msg){
                W_InviteToken._del('join');
                F_Common._notice('加入成功，现在开始战斗吧！','加入成功')
            },function(data, msg){
                F_Common._notice(msg);
            }
        )
    },
    _getInfo:function(){
        var token = F_Success._getToken();
        W_Port._ajax('bindRegister','get',true,'invite_token='+token,null,null,
            function(data,msg){
                if(data && data.mobile){
                    F_Success._htmlInfo(data,token);
                }
            },function(data,msg,code){
                F_Common._notice(msg)
            }
        )
    },
    _htmlInfo:function(data,token){
        var str = '';
        str += '\
            <img src="'+W_Common._cdnImgUrl()+data.avatar+'">\
            <div> <span class="spanyellow"> 联军编号: <span class="spanyellow userid">'+data.mobile+'</span></span></div>\
            <p class="spanwhite">PC登录www.thinkinggame.cn使用数据分析装备</p>';

        $('.curtain-content').html(str);

        if(token && data.can_join_group == 1){
            $('.select-list li').eq(1).show();
            $('#bs_join_team').click(function(){
                F_Success._join(token);
            });
        }else{
            $('#bs_character').html('B');
        }
    }
}

var F_Common = {
    _btn:['<button class="pop-btn recieve">确定</button>'],
    _notice:function(content,title){
        if(!title)title = '提示信息';
        W_Common._pop(content,['<button class="pop-btn recieve">确定</button>'],title);
        return false;
    },
    _setCopy:function(data){
        $('input[name="inviteToken"]').val(data);
    },
    _getCopy:function(data){
        return $('input[name="inviteToken"]').val();
    },
    _formatCopyBtn:function(){
        $('#bs_copy_link').click(function(){
            F_Common._doCopy();
        });
        $('#bs_copy_btn').click(function(){
            F_Common._doCopy();
        });
    },
    _doCopy:function(){
        var url = F_Common._getCopy();
        W_Common._pop('<b>方式一：</b>请使用微信右上角分享按钮分享到朋友圈。<br><b>方式二：</b>邀请好友扫描二维码，完成注册，提升战斗值<div id="bs_pop_qrcode"></div><b>方式三：</b>请手动【复制】以下链接给好友，完成注册，提升战斗值<textarea style="width: 100%; ">'+url+'</textarea>',['<button class="pop-btn recieve">关闭</button>'],'联军招募');
        F_Common._setQRCode($('#bs_pop_qrcode'),url,80,80);

    },
    _setQRCode:function(dom,url,width,height){
        if(!width)width = 130;
        if(!height)height = 130;
        dom.qrcode({
            render: "canvas",
            width: width,
            height:height,
            text: url
        });
    }
}
var F_Fight = {
    _inviteToken:'',
    _getInfo:function(){
        W_Port._ajax('combatInfo','get',true,null,null,null,function(data,msg){
                if(data && data.mobile){
                    var url = W_Common._appUrl();
                    url += W_Jump._getUrl('register')+'?token='+data.invite_token;
                    F_Common._setCopy(url);
                    F_Common._setQRCode($('#bs_qr_code'),url);
                    F_Fight._htmlInfo(data);
                }
            },function(data,msg,code){
                W_Common._pop(msg,F_Common._btn);
            }
        )
    },
    _htmlInfo:function(data){
        var str = '';
        str += '\
            <li><span class="spanwhite">个人总战斗值:</span><span class="spanyellow p-value">'+data.total_dps+'</span></li>\
            <li><span class="spanwhite">我招募的联军数:</span><span class="p-num spanyellow">'+data.recruit_member_num+'</span></li>\
            <li><span class="spanwhite">我招募的援军数:</span><span class="p-rescuenum spanyellow">'+data.recruit_backup_num+'</span></li>';

        $('.left ul').html(str);
        str = '';
        if(JSON.stringify(data.group_info) != "{}"){
            $('.right .start-title-des').html('团队战斗值');
            str += '<li><span class="spanwhite">我的队友:</span><span class="spanyellow t-value">'+data.group_info.teammate+'</span></li>\
                <li><span class="spanwhite">团队总战斗值:</span><span class="spanyellow t-value">'+data.group_info.group_dps+'</span></li>\
                <li><span class="spanwhite">团队榜单排名:</span><span class="spanyellow t-ranking">'+data.group_info.dps_rank+'</span></li>\
                <li><span class="spanwhite">团队召募的联军数:</span><span class="t-num spanyellow">'+data.group_info.recruit_member_num+'</span></li>\
                <li><span class="spanwhite">团队招募的援军数:</span><span class="t-rescuenum spanyellow">'+data.group_info.recruit_backup_num+'</span></li>';
        }else{
            $('.right .start-title-des').html('组队战斗');
            str += '<li id="bs_copy_link"><span class="spanwhite">你需要邀请好友组队，一起招募联军，联军数越多队伍战斗值越高，排名会越高</span><span class="spanyellow t-ranking t-rank-bg">邀请好友</span></li>';
        }
        $('.right ul').html(str);
        F_Common._formatCopyBtn();
    }
}
var F_Hero = {
    _getInfo:function(){
        W_Port._ajax('dpsRank','get',true,null,null,null,function(data,msg){
                if(data.rank_list && data.rank_list.length > 0){
                    $('.combat-content').html(F_Hero._html(data.rank_list));
                }
            },function(data,msg,code){
                W_Common._pop(msg,F_Common._btn);
            }
        )
    },
    _html:function(data){
        var str = '<li class="bottom-head"><span class="spanwhite">联军团队</span><span class="spanwhite txt-right">战斗值</span></li>';
        for(var i=0;i<data.length;i++){
            str += '<li><img src="'+W_Common._cdnImgUrl()+data[i].avatar+'" class="per-img"><span class="spanwhite userid">'+data[i].group_name+'</span><span class="spanyellow uservalue">'+data[i].group_dps+'dps</span></li>';
        }
        return str;
    }
}