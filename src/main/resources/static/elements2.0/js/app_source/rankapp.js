var F_RankApp_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('舆情分析','3-4-2');
        M_Game._htmlGameVisitHide('outsideRankApp');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            F_RankApp_Info._getFirstRankDate();
        }
    }
}
var F_RankApp_Info = {
    _cache:{},
    _getFirstRankDate:function () {
        B_Port._ajax('appstoreDate', 'get', true,null,null, null, function(data, msg) {
            if(data && data.date){
                M_Init._dateCache.end = data.date;
            }else{
                M_Init._dateCache.end = M_Init._dateChoose.end;
            }
            F_RankApp_Info._domInit();
        }, null)
    },
    _domInit:function () {
        B_Date._chooseSingle({'autoCommit':false,'todayValid':false},1,M_Init._dateCache.end,M_Init._dateCache.end,function(begin,end){
            if(begin != M_Init._dateCache.end){
                M_Init._dateCache.end = begin;
                F_RankApp_Info._getList(1);
            }
        });
        M_Init._dateCache['platId'] = 1;
        M_Init._dateCache['typeId'] = 1;
        M_Init._dateCache['listId'] = 3;

        var device = M_Outside._dropHtml('bs_device','设备',M_Game._appPlatType,'tg-area-icon1');
        var list = M_Outside._dropHtml('bs_list','榜单类型',M_Game._appListType,'tg-area-icon2',2);
        var type = M_Outside._dropHtml('bs_type','游戏类型',M_Game._appGameType,'tg-area-icon3');
        var table = M_Outside._tableHtml('bs_table','Appstore排行榜');
        $('#headerTop').prepend(device+list+type);
        $('#ct_main_area').html(table);

        M_Inside._dropShow();
        M_Inside._dropLeave();
        M_Inside._dropSelected(function (key) {
            M_Init._dateCache['platId'] = key;
            F_RankApp_Info._getList(1);
        },'bs_device');
        M_Inside._dropSelected(function (key) {
            M_Init._dateCache['listId'] = key;
            F_RankApp_Info._getList(1);
        },'bs_list');
        M_Inside._dropSelected(function (key) {
            M_Init._dateCache['typeId'] = key;
            F_RankApp_Info._getList(1);
        },'bs_type');

        F_RankApp_Info._getList(1);
    },
    _getList:function(page){
        var dom = $('#bs_table .table-out-wrap');
        var domPageList = $('#bs_table .tg-page-list');
        var postData = {};
        postData['data_date'] = M_Init._dateCache.end;
        postData['device_type'] = M_Init._dateCache['platId'];
        postData['list_type'] = M_Init._dateCache['listId'];
        postData['app_type'] = M_Init._dateCache['typeId'];
        postData['index'] = (page-1)*B_Page._size;
        postData['limit'] = B_Page._size;
        postData = B_Common._postData(postData);
        B_Port._ajax('appstoreRank', 'get', true, postData, function() {
            dom.html(B_Pre._loading());
            domPageList.html('');
        }, function() {
            dom.html('');
        }, function(data, msg) {
            if(data && data.total > 0){
                dom.html(F_RankApp_Info._htmlList(data.data));
                domPageList.html(B_Page._show({total:data.total,page:page},'number'));
                B_Page._click(page,function (page) {
                    F_RankApp_Info._getList(page);
                });
            }else{
                dom.html(B_Pre._empty('暂无数据'));
            }
        }, function(data, msg, code) {
            dom.html(B_Pre._empty(msg));
        })
    },
    _htmlStar:function(star) {
        star = star ? star : 0;
        var starFloor = Math.floor(star);
        var isHasHalf = (star > starFloor) ? true : false;
        var starStr = '';
        for(var star=1;star<6;star++){
            if(star <= starFloor){
                starStr += '<i class="tg-icon full-blue-star"></i>';
            }else{
                if(isHasHalf){
                    isHasHalf = false;
                    starStr += '<i class="tg-icon half-star"></i>';
                }else{
                    starStr += '<i class="tg-icon full-gray-star"></i>';
                }
            }
        }
        return '<div class="star-level">'+starStr+'</div>';
    },
    _htmlList:function (data) {
        var str = '';
        str += '<table class="tg-table table table-bordered">';
        str += '<thead class="boxshadow"><tr>';
        str += '<th>排名</th>';
        str += '<th>游戏</th>';
        str += '<th class="game-tag">Appstore评价</th>';
        str += '<th>评价总数</th>';
        str += '<th>正面评价数</th>';
        str += '<th>负面评价数</th>';
        str += '<th>操作</th>';
        str += '</tr></thead>';
        str += '<tbody>';
        for(var i=0;i<data.length;i++){
            str += '<tr>';
            str += '<td>'+data[i].rank;
            //str += M_Outside._htmlArrow(data[i].rank_span,'');
            str += '</td>';
            if(data[i].project_id && data[i].project_id != '-') {
                str += '<td><img src="' + data[i].app_img + '" alt="' + data[i].app_name + '" onclick="M_Outside._redirectLight('+data[i].project_id+')">';
                str += '<div class="table-des"><p onclick="M_Outside._redirectLight('+data[i].project_id+')">' + data[i].app_name + '</p><span>开发商：' + data[i].app_author + '</span></div>';
            }else{
                str += '<td><img src="' + data[i].app_img + '" alt="' + data[i].app_name + '" onclick="B_Login._openPlan(\''+data[i].app_name+'\');">';
                str += '<div class="table-des"><p onclick="B_Login._openPlan(\''+data[i].app_name+'\');">' + data[i].app_name + '</p><span>开发商：' + data[i].app_author + '</span></div>';
            }
            str += '</td>';
            str += '<td>'+(data[i].app_score ? data[i].app_score : '-');
            str += this._htmlStar(data[i].app_score);
            str += '</td>';
            str += '<td><div class="user-comment">'+data[i].comment_num;
            //str += M_Outside._htmlArrow(data[i].comment_rate,'app',data[i].comment_num);
            str += '</div></td>'
            str += '<td><div class="user-comment">'+data[i].positive_num;
            //str += M_Outside._htmlArrow(data[i].positive_rate,'app',data[i].positive_num);
            str += '</div></td>'
            str += '<td><div class="user-comment">'+data[i].negative_num;
            //str += M_Outside._htmlArrow(data[i].negative_rate,'app',data[i].negative_num);
            str += '</div></td>';
            str += '<td>';
            if(data[i].project_id && data[i].project_id != '-'){
                str += '<button class="tg-main-btn" onclick="M_Outside._redirectLight('+data[i].project_id+')">查看口碑</button><!--button class="tg-assist-btn" onclick="M_Outside._redirectAtlas('+data[i].project_id+')">游戏图谱</button-->';
            }else{
                str += '<button class="tg-assist-btn" onclick="B_Login._openPlan(\''+data[i].app_name+'\');">申请收录</button>';
            }


            str += '</td>';
            str += '</tr>';
        }
        str += '</tbody>';
        str += '</table>';

        return str;

    }
}