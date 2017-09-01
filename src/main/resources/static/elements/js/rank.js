var date1Begin = '';
var date1End = '';
var PlatformId = 0;
var ListTypeId = 0;
var ClassifyId = 0;
$(function(){
    G_Login._check();
    var $_GET = getUrl('query');
    if(!($_GET.t && !isNaN($_GET.t) && $_GET.p && !isNaN($_GET.p) && $_GET.d && $_GET.c)){
        G_Pop._init('alert',{content:'选择类型错误,请确认！'});
        return;
    }
    PlatformId = $_GET.p;
    ListTypeId = $_GET.t;
    var ClassifyId = F_List._getMenu(decodeURIComponent($_GET.c));
    if(ClassifyId == 0){
        G_Pop._init('alert',{content:'选择类型错误,请确认！'});
        return;
    }
    var typeName = '';
    switch($_GET.t+''){
        case '1':
            typeName = '免费榜';
            break;
        case '2':
            typeName = '付费榜';
            break;
        case '3':
            typeName = '畅销榜';
            break;
    }
    if(typeName == ''){
        G_Pop._init('alert',{content:'选择榜单错误,请确认！'});
        return;
    }
    $('.rk_fmName h1').html('App Store榜单-'+typeName);
    dataChoose._single({'autoCommit':true,'todayValid':false},1,$_GET.d,$_GET.d,function(begin,end){
        if(begin !=date1Begin || date1End != end){
            date1Begin = begin;
            date1End = end;
            F_List._getData(ClassifyId);
        }
    });
});
var F_List = {
    _buff:{},
    _getMenu:function(type){
        var menu = '<div class="t_slider"></div><ul>';
        var typeId = 0;
        var appClassify = G_Game._appClassify();
        for(var i=1;i<appClassify.length;i++){
            if(appClassify[i].indexOf(type) > -1){
                typeId = i;
                menu +=  '<li class="liOn"';
            }else{
                menu +=  '<li';
            }
            menu += ' data-i="'+i+'">';
            //menu += appClassify[i] != '小游戏' ? appClassify[i].replace('游戏','') : '小游戏';
            menu += appClassify[i];
            menu += '</li>';
        }
        menu += '</ul><div class="clearfix"></div>';
        $('.rk_tab').html(menu);
        $('.t_slider').css('left',(59*(typeId-1))+'px');
        tabChoose($('.rk_tab li'),$('.t_slider'),59,0,'liOn','rank');
        return typeId;
    },
    _getDate:function(){
        return $('#db1').val();
    },
    _getData:function(gameClassifyId){
        var date = F_List._getDate();
        ClassifyId = gameClassifyId;
        if(!(F_List._buff.classifyId && F_List._buff.classifyId == ClassifyId && F_List._buff.date && F_List._buff.date == date)){
            G_Port._ajax('industryAppstoreTypeRank','get',true,'data_date='+date+'&device_type='+PlatformId+'&list_type='+ListTypeId+'&app_type='+ClassifyId+'&index=0&limit=200',function(){
                    $('.rk_list').html(G_Pre._loading());
                },function(){
                    $('.rk_list').html('');
                },function(data,msg){
                    F_List._buff.classifyId = gameClassifyId;
                    F_List._buff.date = date;
                    if(data.appstore_type_rank && data.appstore_type_rank.length>0){
                        $('.rk_list').html(F_List._html(data.appstore_type_rank));
                    }
                },function(data,msg,code){
                    $('.rk_list').html(G_Pre._empty(msg));
                }
            )
        }
    },
    _html:function(data){
        var str = '<table><tr><th>排名</th><th>名字</th><th>评分</th><th>用户评论数</th></tr>';
        for(var i=0;i<data.length;i++){
            var score = data[i].app_score ? data[i].app_score : 0;
            var comment = data[i].comment_num ? data[i].comment_num : 0;
            var percent = score*20;
            percent = percent > 100 ? 100 : percent;
            str += '<tr>';
            str += '<td>'+(i+1)+'</td>';
            str += '<td><img src="'+data[i].app_img+'"><p>'+data[i].app_name+'</p><p class="rk_company">'+data[i].app_author+'</p></td>';
            str += '<td class="td2"><div class="rk_number">'+score+'</div><div class="rk_lineBg"><div class="rk_line" style="width: '+percent+'%"></div></div></td>';
            str += '<td>'+comment+'</td>';
            str += '</tr>';
        }
        str += '</table>';
        return str;
    }
}

