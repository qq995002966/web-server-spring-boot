var F_RankSentiment_Entrance = {
    _init:function (keyword) {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('舆情分析','3-4-1');
        M_Game._htmlGameVisitHide('outsideRankSentiment');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();

            var $_GET = '';
            var page = 1;
            if(keyword){
                $_GET = M_Outside._keywordSplit(keyword);
            }else{
                $_GET = B_Common._getUrl('query');
            }
            if($_GET.t){
                $_GET.t = B_Common._decodeUrl($_GET.t);
                if($_GET.t == '单机 电玩')$_GET.t = '单机';
                M_Init._dateCache['platId'] = $_GET.t;
            }else{
                M_Init._dateCache['platId'] = '手游';
            }
            if($_GET.p && !isNaN($_GET.p)){
                page = $_GET.p;
            }
            F_RankSentiment_Info._domInit();
            F_RankSentiment_Info._getList(page);
        }
    }
}
var F_RankSentiment_Info = {
    _cache:{},
    _domInit:function () {
        $('#headerTop .fr').remove();

        M_Init._dateCache['listId'] = '全部';
        var device = M_Outside._dropHtml('bs_device','游戏载体',M_Game._gameClassify,'tg-area-icon4');
        var list = M_Outside._dropHtml('bs_list','游戏类型',M_Game._gameType,'tg-area-icon5');
        var table = M_Outside._tableHtml('bs_table','ThinkingGame舆情量排行榜');
        $('#headerTop').prepend(device+list);
        $('#ct_main_area').html(table);
        var index = 0;
        for(var i=0;i<M_Game._gameClassify.length;i++){
            if(M_Game._gameClassify[i] == M_Init._dateCache['platId']){
                index = i;
                break;
            }
        }
        $('.bs_device .tg-drop-text-part span').attr('data-i',index).html(M_Init._dateCache['platId']);
        M_Inside._dropShow();
        M_Inside._dropLeave();
        M_Inside._dropSelected(function (key) {
            M_Init._dateCache['platId'] = M_Game._gameClassify[key];
            F_RankSentiment_Info._getList(1);
        },'bs_device');
        M_Inside._dropSelected(function (key) {
            M_Init._dateCache['listId'] = M_Game._gameType[key];
            F_RankSentiment_Info._getList(1);
        },'bs_list');

    },
    _getList:function(page){
        var dom = $('#bs_table .table-out-wrap');
        var domPageList = $('#bs_table .tg-page-list');
        var postData = {};
        postData['platform'] = M_Init._dateCache['platId'];
        postData['detail_type'] = M_Init._dateCache['listId'];
        postData['index'] = (page-1)*B_Page._size;
        postData['limit'] = B_Page._size;
        postData = B_Common._postData(postData);
        B_Port._ajax('opinionRank', 'get', true, postData, function() {
            dom.html(B_Pre._loading());
            domPageList.html('');
        }, function() {
            dom.html('');
        }, function(data, msg) {
            if(data && data.game_rank_total > 0){
                dom.html(F_RankSentiment_Info._htmlList(data.game_rank_data));
                domPageList.html(B_Page._show({total:data.game_rank_total,page:page},'number'));
                B_Page._click(page,function (page) {
                    F_RankSentiment_Info._getList(page);
                });
            }else{
                dom.html(B_Pre._empty('暂无数据'));
            }
        }, function(data, msg, code) {
            dom.html(B_Pre._empty(msg));
        })
    },
    _htmlList:function (data) {
        var str = '';
        str += '<table class="tg-table table table-bordered">';
        str += '<thead class="boxshadow"><tr>';
        str += '<th>舆情排名</th>';
        str += '<th>游戏</th>';
        str += '<th>类别</th>';
        str += '<th class="game-tag">游戏标签</th>';
        str += '<th>昨日反馈总量</th>';
        str += '<th>正面反馈情况</th>';
        str += '<th>负面反馈情况</th>';
        str += '<th>操作</th>';
        str += '</tr></thead>';
        str += '<tbody>';
        var gameInfo = '';
        var tag = '';
        var type = '';
        var typeName = '';
        for(var i=0;i<data.length;i++){
            gameInfo = B_Game._getGame([data[i].project_id],1);
            if(gameInfo && gameInfo[data[i].project_id]){
                gameInfo = gameInfo[data[i].project_id];
            }else{
                gameInfo = [B_Game._imgUrl(data[i].project_id),data[i].project_name,data[i].author,data[i].game_type];
            }
            str += '<tr>';
            str += '<td>'+data[i].rank;
            //str += M_Outside._htmlArrow(data[i].rank_span,'');
            str += '</td>';
            str += '<td><img src="'+gameInfo[0]+'" alt="'+data[i].project_name+'" onclick="M_Outside._redirectLight('+data[i].project_id+')">';
            str += '<div class="table-des"><p onclick="M_Outside._redirectLight('+data[i].project_id+')">'+data[i].project_name+'</p><span>开发商：'+data[i].author+'</span><span>发行商：'+data[i].distributor+'</span></div>';
            str += '</td>';
            str += '<td>';
            if(data[i].game_type){
                type = data[i].game_type.split(',');
                for(var d=0;d<type.length;d++){
                    typeName = B_Game._typeName(type[d]);
                    if(typeName){
                        str += typeName+' ';
                    }
                }
            }
            str += '</td>';
            str += '<td>';
            if(data[i].game_tag){
                str += '<ul class="tg-tab-btn">';
                tag = B_Game._tag(data[i].game_tag);
                for(var d=0;d<data[i].game_tag.length;d++){
                    if(tag[data[i].game_tag[d]]){
                        str += '<li class="tg-tab-btn-normal" onclick="M_Outside._redirectCenter(\''+B_Common._encodeUrl(tag[data[i].game_tag[d]])+'\');">'+tag[data[i].game_tag[d]]+'</li>';
                    }
                }
                str += '</ul>';
            }
            str += '</td>';
            str += '<td><div class="user-comment">';
            str += M_Outside._htmlArrow(data[i].total_rate,'%',data[i].total);
            str += '</div></td>'
            str += '<td><div class="user-comment">';
            str += M_Outside._htmlArrow(data[i].positive_rate,'%',data[i].positive);
            str += '</div></td>'
            str += '<td><div class="user-comment">';
            str += M_Outside._htmlArrow(data[i].negative_rate,'%',data[i].negative);
            str += '</div></td>';
            str += '<td><button class="tg-main-btn bs_btn_light" onclick="M_Outside._redirectLight('+data[i].project_id+')">查看口碑</button><!--button class="tg-assist-btn  bs_btn_atlas" onclick="M_Outside._redirectAtlas('+data[i].project_id+')">游戏图谱</button--></td>';
            str += '</tr>';
        }
        str += '</tbody>';
        str += '</table>';

        return str;

    }
}