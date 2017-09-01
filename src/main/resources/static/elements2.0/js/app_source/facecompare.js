var F_FaceCompare_Entrance = {
    _init:function (gameId) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('游戏详情','7-9-3');
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
            M_Init._gameIdRight = M_Init._getGameId('gameFaceCompareRight');

            B_Game._dropChoose(M_Init._gameIdRight,'#gameDropChooseRight',null,function(gameIdRight){
                if(gameIdRight+'' != M_Init._gameIdRight+''){
                    B_Game._setLast(gameIdRight, 'gameFaceCompareRight');
                    M_Init._gameIdRight = gameIdRight;
                    F_FaceCompare_Info._getUnion(3);
                }
            });

            M_Game._checkGameVisitList('gameFaceCompare');

            $('#changeTagZone2').click(function(){
                F_Face_Common._changeTagOpen(2);
            });
            $('#changeTagZone3').click(function(){
                F_Face_Common._changeTagOpen(3);
            });

            F_Face_Common._cache.data[2].refresh = true;
            F_Face_Common._cache.data[3].refresh = true;

            $('#tab_forum_li ul li').each(function (index) {
                $(this).click(function () {
                    if(!$(this).hasClass('tg-tab-btn-selected')){
                        $(this).addClass('tg-tab-btn-selected').siblings().removeClass('tg-tab-btn-selected');
                        switch(index+''){
                            case '0':
                                F_Face_Html._htmlList(2,$('#str_attention_forum_left'),F_Face_Common._cache.data[2].buff.attention_forum_distri);
                                F_Face_Html._htmlList(3,$('#str_attention_forum_right'),F_Face_Common._cache.data[3].buff.attention_forum_distri);
                                break;
                            case '1':
                                F_Face_Html._htmlList(2,$('#str_attention_forum_left'),F_Face_Common._cache.data[2].buff.attention_game_forum_distri);
                                F_Face_Html._htmlList(3,$('#str_attention_forum_right'),F_Face_Common._cache.data[3].buff.attention_game_forum_distri);
                                break;
                        }
                    }
                })
            })

            $('#tab_message_li ul li').each(function (index) {
                $(this).click(function () {
                    if(!$(this).hasClass('tg-tab-btn-selected')){
                        $(this).addClass('tg-tab-btn-selected').siblings().removeClass('tg-tab-btn-selected');
                        switch(index+''){
                            case '0':
                                F_Face_Html._chartLine(F_FaceCompare_Info._compareName,'chart_title_num_compare',{left:F_Face_Common._cache.data[2].buff.title_num_distri,right:F_Face_Common._cache.data[3].buff.title_num_distri});
                                break;
                            case '1':
                                F_Face_Html._chartLine(F_FaceCompare_Info._compareName,'chart_title_num_compare',{left:F_Face_Common._cache.data[2].buff.content_num_distri,right:F_Face_Common._cache.data[3].buff.content_num_distri});
                                break;
                            case '2':
                                F_Face_Html._chartLine(F_FaceCompare_Info._compareName,'chart_title_num_compare',{left:F_Face_Common._cache.data[2].buff.be_replied_num_distri,right:F_Face_Common._cache.data[3].buff.be_replied_num_distri});
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
                            F_Face_Html._chartBar(F_FaceCompare_Info._compareName,'chart_tieba_age_compare',{left:F_Face_Common._cache.data[2].buff.tieba_age_distri,right:F_Face_Common._cache.data[3].buff.tieba_age_distri});
                            break;
                        case '1':
                            F_Face_Html._chartBar(F_FaceCompare_Info._compareName,'chart_tieba_age_compare',{left:F_Face_Common._cache.data[2].buff.fans_num_distri,right:F_Face_Common._cache.data[3].buff.fans_num_distri});
                            break;
                    }
                });
            });

        }
    }
}
var F_FaceCompare_Info = {
    _getUnion:function(index){
        var postData = F_Face_Common._postData(index);
        if(!postData){
            if(F_Face_Common._cache.data[index].refresh){
                $('#changeTagZone'+index+' span').html(F_Face_Common._cache.data[index].choose).attr('title',F_Face_Common._cache.data[index].choose);
                F_Face_Common._cache.data[index].refresh = false;
                F_FaceCompare_Info._setInfo();
            }
            return false;
        }else{
            F_FaceCompare_Info._getInfo(index,postData);
        }
    },
    _getInfo:function(index,postData){
        B_Port._ajax('faceProfileCustomer','post',true,postData,function () {
            F_Face_Common._cache.data[index].buff = '';
            B_Pop._init('load',{type:1,time:60,shade:[0.6, '#000000']});
        },function(){
            B_Pop._init('close');
        },function(data,msg){
            F_Face_Common._cache.data[index].buff = data;
            F_FaceCompare_Info._setInfo();
        },function(data,msg,code){
            B_Pop._init('msg',{content:msg});
        });
    },
    _setInfo:function () {
        if(F_Face_Common._cache.data[2].buff && F_Face_Common._cache.data[3].buff){
            F_FaceCompare_Info._identity(2);
            F_FaceCompare_Info._identity(3);

            $('#tab_message_li ul li').eq(0).addClass('tg-tab-btn-selected').siblings().removeClass('tg-tab-btn-selected');
            $('#tab_age_li ul li').eq(0).addClass('tg-tab-btn-selected').siblings().removeClass('tg-tab-btn-selected');
            F_FaceCompare_Info._htmlGender($('#lt_gender_compare'),F_Face_Common._cache.data[2].buff.sex_distri,F_Face_Common._cache.data[3].buff.sex_distri);
            F_FaceCompare_Info._htmlInteresting($('#lt_item_list'),F_Face_Common._cache.data[2].buff.interest_classify_distri,F_Face_Common._cache.data[3].buff.interest_classify_distri);
            F_Face_Html._htmlList(2,$('#str_attention_forum_left'),F_Face_Common._cache.data[2].buff.attention_forum_distri);
            F_Face_Html._htmlList(3,$('#str_attention_forum_right'),F_Face_Common._cache.data[3].buff.attention_forum_distri);
            F_Face_Html._chartLine(F_FaceCompare_Info._compareName,'chart_post_hour_compare',{left:F_Face_Common._cache.data[2].buff.post_hour_distri,right:F_Face_Common._cache.data[3].buff.post_hour_distri});

            F_Face_Html._chartLine(F_FaceCompare_Info._compareName,'chart_title_num_compare',{left:F_Face_Common._cache.data[2].buff.title_num_distri,right:F_Face_Common._cache.data[3].buff.title_num_distri});

            F_Face_Html._chartBar(F_FaceCompare_Info._compareName,'chart_tieba_age_compare',{left:F_Face_Common._cache.data[2].buff.tieba_age_distri,right:F_Face_Common._cache.data[3].buff.tieba_age_distri});

        }
    },
    _compareName:['',''],
    _htmlInteresting:function(dom,dataLeft,dataRight){
        var str = '';
        var allData = [];
        var total1 = 0;
        var total2 = 0;
        var percent1 = 0;
        var percent2 = 0;
        var value1 = '';
        var value2 = '';
        var i = 0;
        var interest1 = {};
        var interest2 = {};

        for(var i=0;i<dataLeft.length;i++){
            $.each(dataLeft[i],function(key,value){
                interest1[key] = value;
            })
        }
        for(var i=0;i<dataRight.length;i++){
            $.each(dataRight[i],function(key,value){
                interest2[key] = value;
            })
        }
        $.each(interest1,function(key,value){
            if($.inArray(key,allData) < 0){
                allData.push(key);
            }
            total1 += parseInt(value);
        });
        $.each(interest2,function(key,value){
            if($.inArray(key,allData) < 0){
                allData.push(key);
            }
            total2 += parseInt(value);
        });
        $.each(allData,function(key,value){
            if((typeof(interest1[value]) == "undefined")){
                value1 = 0;
                percent1 = 0.0;
            }else{
                value1 = interest1[value];
                if(total1 == 0){
                    percent1 = 0.0;
                }else{
                    percent1 = ((parseInt(value1)/total1)*100).toFixed(1);
                }
            }
            if((typeof(interest2[value]) == "undefined")){
                value2 = 0;
                percent2 = 0.0;
            }else{
                value2 = interest2[value];
                if(total2 == 0){
                    percent2 = 0.0;
                }else{
                    percent2 = ((parseInt(value2)/total2)*100).toFixed(1);
                }
            }
            str += F_FaceCompare_Info._htmlLineCompare(value,percent1,percent2,value1,value2);
            i++;
        });
        dom.html(str);
    },
    _htmlLineCompare:function(key,percent1,percent2,value1,value2){
        var lineWidth1 = parseFloat(percent1)*2;
        if(lineWidth1 > 100)lineWidth1 = 100;
        var lineWidth2 = parseFloat(percent2)*2;
        if(lineWidth2 > 100)lineWidth2 = 100;
        var str = '';
        str = '\
            <ul class="contrast-list">\
                <li class="word-des">'+key+'</li>\
                <li class="percent">\
                <span>'+percent1+'%</span>\
                <span class="fr">'+percent2+'%</span>\
                </li>\
                <li class="des">\
                <span>共'+value1+'人关注</span>\
                <span class="fr">共'+value2+'人关注</span>\
                </li>\
                <li class="line">\
                <div class="line-bg fl">\
                <div class="left-percent" style="width: '+lineWidth1+'%"></div>\
                </div>\
                <div class="line-bg fr">\
                <div class="right-percent" style="width: '+lineWidth2+'%"></div>\
                </div>\
                </li>\
            </ul>';

        return str;
    },
    _htmlGender:function(dom,dataLeft,dataRight){
        var str = '';
        var sex1 = {};
        var sex2 = {};
        var total1 = 0;
        var total2 = 0;
        var male1 = 0;
        var male2 = 0;
        var female1 = 0;
        var female2 = 0;

        for(var i=0;i<dataLeft.length;i++){
            $.each(dataLeft[i],function(key,value){
                sex1[key] = value;
            })
        }
        for(var i=0;i<dataRight.length;i++){
            $.each(dataRight[i],function(key,value){
                sex2[key] = value;
            })
        }

        $.each(sex1,function(key,value){
            switch(key){
                case '男':
                    male1 = parseInt(value);
                    break;
                case '女':
                    female1 = parseInt(value);
                    break;
            }
        });
        $.each(sex2,function(key,value){
            switch(key){
                case '男':
                    male2 = parseInt(value);
                    break;
                case '女':
                    female2 = parseInt(value);
                    break;
            }
        });
        total1 = male1+female1;
        if(total1 > 0){
            male1 = ((male1/total1)*100).toFixed(0);
            female1 = 100-male1;
        }
        total2 = male2+female2;
        if(total2 > 0){
            male2 = ((male2/total2)*100).toFixed(0);
            female2 = 100-male2;
        }
        str += F_FaceCompare_Info._htmlGenderCompare(male1,female1,male2,female2);

        dom.html(str);
    },
    _htmlGenderCompare:function(male1,female1,male2,female2){
        var str = '\
            <div class="man-percent">\
                <ul class="fl">\
                    <li><i class="graph-icon"></i></li>\
                    <li>\
                    <p>男性玩家占比</p>\
                    <b>'+male1+'%</b>\
                    <p>占全部玩家的</p>\
                    </li>\
                    <li class="color" style="width: '+(100*(male1/100)).toFixed(1)+'px">\
                    </li>\
                    </ul>\
                    <ul class="fr">\
                    <li class="color" style="width: '+(100*(male2/100)).toFixed(1)+'px">\
                    </li>\
                    <li><i class="graph-icon"></i></li>\
                    <li class="fr">\
                    <p>男性玩家占比</p>\
                    <b>'+male2+'%</b>\
                    <p>占全部玩家的</p>\
                    </li>\
                </ul>\
            </div>\
            <div class="woman-percent">\
                <ul class="fl">\
                    <li><i class="graph-icon"></i></li>\
                    <li>\
                    <p>女性玩家占比</p>\
                    <b>'+female1+'%</b>\
                    <p>占全部玩家的</p>\
                    </li>\
                    <li class="color" style="width: '+(100*(female1/100)).toFixed(1)+'px">\
                    </li>\
                    </ul>\
                    <ul class="fr">\
                    <li class="color" style="width: '+(100*(female2/100)).toFixed(1)+'px">\
                    </li>\
                    <li><i class="graph-icon"></i></li>\
                    <li class="fr">\
                    <p>女性玩家占比</p>\
                    <b>'+female2+'%</b>\
                    <p>占全部玩家的</p>\
                    </li>\
                </ul>\
            </div>';

        return str;
    },
    _identity:function(dom){
        switch(dom+''){
            case '2':
                F_FaceCompare_Info._compareName[0] = '追踪群体';
                for(var i=1;i<4;i++){
                    $('#leftNotice'+i).html('<i></i>追踪群体');
                }
                break;
            case '3':
                F_FaceCompare_Info._compareName[1] = '对照群体';
                for(var i=1;i<4;i++){
                    $('#rightNotice'+i).html('<i></i>对照群体');
                }
                break;
        }
    }
}