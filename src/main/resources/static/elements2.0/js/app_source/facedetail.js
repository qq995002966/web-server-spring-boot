var F_FaceDetail_Entrance = {
    _init:function (gameId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('游戏详情','7-9-2');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else{
            M_Init._clean();
            var $_GET = B_Common._getUrl('query');
            if($_GET.g){
                M_Init._gameDetailId = $_GET.g;
                B_Game._setLast(M_Init._gameDetailId, 'outsideGameDetail');
            }else{
                if(gameId){
                    M_Init._gameDetailId = gameId;
                    B_Game._setLast(M_Init._gameDetailId, 'outsideGameDetail');
                }else{
                    if(!M_Init._gameDetailId){
                        M_Init._gameDetailId = M_Init._getGameId('outsideGameDetail');
                    }
                }
            }

            M_Game._checkGameVisitList('gameFaceDetail');
            $('#changeTagZone1').click(function(){
                F_Face_Common._changeTagOpen(1);
            });
            F_Face_Common._cache.data[1].refresh = true;

            $('#tab_message_li ul li').each(function (index) {
                $(this).click(function () {
                    if(!$(this).hasClass('tg-tab-btn-selected')){
                        $(this).addClass('tg-tab-btn-selected').siblings().removeClass('tg-tab-btn-selected');
                        switch(index+''){
                            case '0':
                                F_Face_Html._chartLine('主帖发言量','chart_title_num',F_Face_Common._cache.data[1].buff.title_num_distri);
                                break;
                            case '1':
                                F_Face_Html._chartLine('回复帖发言量','chart_title_num',F_Face_Common._cache.data[1].buff.content_num_distri);
                                break;
                            case '2':
                                F_Face_Html._chartLine('发言响应量','chart_title_num',F_Face_Common._cache.data[1].buff.be_replied_num_distri);
                                break;
                        }
                    }
                });
            });

            $('#tab_age_li ul li').each(function (index) {
                $(this).click(function () {
                    $(this).addClass('tg-tab-btn-selected').siblings().removeClass('tg-tab-btn-selected');
                    switch(index+''){
                        case '0':
                            F_Face_Html._chartBar('吧龄分布','chart_tieba_age',F_Face_Common._cache.data[1].buff.tieba_age_distri);
                            break;
                        case '1':
                            F_Face_Html._chartBar('粉丝魅力','chart_tieba_age',F_Face_Common._cache.data[1].buff.fans_num_distri);
                            break;
                    }
                });
            });
        }
    }
}
var F_FaceDetail_Info = {
    _getUnion:function(index){
        var postData = F_Face_Common._postData(index);
        if(!postData){
            if(F_Face_Common._cache.data[index].refresh){
                $('#changeTagZone'+index+' span').html(F_Face_Common._cache.data[index].choose).attr('title',F_Face_Common._cache.data[index].choose);
                F_Face_Common._cache.data[index].refresh = false;
                F_FaceDetail_Info._setInfo(index,F_Face_Common._cache.data[index].buff);
            }
            return false;
        }else{
            F_FaceDetail_Info._getInfo(index,postData);
        }
    },
    _getInfo:function(index,postData){
        B_Port._ajax('faceProfileCustomer','post',true,postData,function () {
            B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        },function(){
            B_Pop._init('close');
        },function(data,msg){
            F_Face_Common._cache.data[1].buff = data;
            F_FaceDetail_Info._setInfo(index,data);
        },function(data,msg,code){
            B_Pop._init('msg',{content:msg});
        });
    },
    _setInfo:function (index,data) {
        $('#tab_message_li ul li').eq(0).addClass('tg-tab-btn-selected').siblings().removeClass('tg-tab-btn-selected');
        $('#tab_age_li ul li').eq(0).addClass('tg-tab-btn-selected').siblings().removeClass('tg-tab-btn-selected');

        F_Face_Html._htmlLine($('#lt_item_list'),data.interest_classify_distri);
        F_Face_Html._htmlList(index,$('#str_attention_forum'),data.attention_forum_distri);
        F_Face_Html._htmlList(index,$('#str_attention_game'),data.attention_game_forum_distri);
        F_Face_Html._chartMap('bs_map_distribute','bs_line_distribute',data.province_distri);
        $('#lt_gender_compare').html(F_Face_Html._htmlGender(data.sex_distri));
        F_Face_Html._chartLine('活跃用户数','chart_hot_value',data.hot_value_distri);
        F_Face_Html._chartLine('百分比','chart_post_hour',data.post_hour_distri);
        F_Face_Html._chartBar('吧龄分布','chart_tieba_age',data.tieba_age_distri);
        F_Face_Html._chartLine('主帖发言量','chart_title_num',data.title_num_distri);
    }
}