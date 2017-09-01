function onLoad(){

    G_MENU.AddMenuFooter();

    FitMenuTextCenter('');

    g_project_id = G_LOCAL_STORAGE.LastChosenProjectId();

    if(!g_project_id)
    {
        g_project_id = 60; // 默认设置为刀塔传奇
    }
    var gameId = $_GET['g'];
    if(typeof($_GET['g']) != 'undefined'){
        g_project_id = DemoProjectId();
    }
    G_LOGIN.CheckLoginServlet(LoginDone,PopLogin,true);
}

var $_GET = (function(){
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u = u[1].split("&");
        var get = {};
        for(var i in u){
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();

var tagsGroup = [
    ['活跃度','active_class'],
    ['号召力','influence_level'],
    ['关注类目','interest_classify'],
    ['个人魅力','charm_level'],
    ['付费能力','pay_ability'],
    ['发言偏好','post_quality'],
    ['生命周期','game_lifecycle'],
    ['抱怨程度','complain_level'],
    ['吧务','op_type'],
    ['地域','province']
];

function openTags(type,dom){
    var tags = [
        ['高活跃','中活跃','低活跃'],
        ['高号召','中号召','低号召'],
        ['追星','影视','体育','音乐','动漫','文学','科技'],
        ['高魅力','中魅力','低魅力'],
        ['高付费'],
        ['高质用户','普通用户','灌水用户','垃圾用户'],
        ['新手玩家','轻度玩家','重度玩家','流失玩家','回归玩家'],
        ['从不抱怨','经常抱怨','偶尔抱怨'],
        ['吧务'],
        ['广东','江苏','北京','上海','浙江','山东','四川','福建','河南','辽宁','河北','安徽','陕西','湖南','天津','重庆','黑龙江','广西','山西','江西','吉林','云南','贵州','内蒙古','甘肃','新疆','宁夏','海南','台湾','西藏','香港','澳门','青海','湖北']
    ];
    var tagsHot = [
        ['全用户',''],
        ['高活跃','active_class'],
        ['高号召','influence_level'],
        ['高付费','pay_ability'],
        ['高魅力','charm_level'],
        ['经常抱怨','complain_level'],
        ['高质用户','post_quality'],
        ['垃圾用户','post_quality'],
        ['普通用户','post_quality'],
        ['新手玩家','game_lifecycle'],
        ['流失玩家','game_lifecycle'],
        ['重度玩家','game_lifecycle'],
        ['北京','province'],
        ['上海','province'],
        ['江苏','province'],
        ['浙江','province'],
        ['广东','province'],
        ['河南','province'],
        ['河北','province'],
        ['山东','province']
    ];
    layer.closeAll();
    var choosedValue = $('#changeTag'+dom).html();
    switch(type){
        case 'quick':
            var content = '<div class="py_layer py_radius py_bgff"><div class="py_lyarea"><div class="py_lytitle"><h4>快速标签</h4><b onclick="layer.closeAll();">╳</b></div><div class="py_lyfew">';
            $.each(tagsHot,function(i,value){
                content += '<button data-name="'+value[1]+'"';
                if(choosedValue == value[0])content += ' class="btnhover"';
                content += '>'+value[0]+'</button>';
            });
            content += '</div><div class="py_clear"></div><div class="py_lycheck"><button class="py_lylinkbtn py_radius" onclick="openTags(\'detail\',\''+dom+'\')">展开详细标签</button> <button class="py_lycheckbtn py_radius" onclick="checkTags(\'quick\',\''+dom+'\')">确定</button></div></div></div>';
            layer.open({
                type: 1,
                title: false,
                closeBtn: false,
                shadeClose: false,
                area: ['auto', 'auto'],
                content: content
            });
            $('.py_lyfew button').click(function(){
                $(this).addClass('btnhover').siblings().removeClass('btnhover').end();
            });
            break;
        case 'detail':
            var content = '<div class="py_layer py_radius py_bgff"><div class="py_lyarea"><div class="py_lytitle"><h4>详细标签</h4><b onclick="layer.closeAll();">╳</b></div><div class="py_lymore">';
            var choosedCity = '';
            $.each(tagsGroup,function(i,value){
                content += '<dl';
                switch(i){
                    default:
                        content += ' class="py_auto"';
                        content += '><dt>'+value[0]+'</dt>';
                        $.each(tags[i],function(i2,value2){
                            content += '<dd><input type="checkbox" name="'+value[1]+'" value="'+value2+'"';
                            if(choosedValue.indexOf(value2)>-1)content += ' checked'
                            content += '>　'+value2+'</dd>';
                        });
                        break;
                    case 9:
                        content += '><dt>'+value[0]+'</dt>';
                        content += '<dd><div class="py_select py_radius">';
                        content += '<div class="py_selarea"><span name="'+value[1]+'">不限制</span><i></i></div>';
                        content += '<ul>';
                        content += '<li>不限制</li>';
                        $.each(tags[i],function(i2,value2){
                            content += '<li>'+value2+'</li>';
                            if(choosedValue.indexOf(value2)>-1)choosedCity = value2;
                        });
                        content += '</ul>';
                        content += '</div></dd>';
                        break;
                }
                content += '</dl>';
            });
            content += '</div><div class="py_clear"></div><div class="py_lycheck"><button class="py_lylinkbtn py_radius" onclick="openTags(\'quick\',\''+dom+'\')">返回快捷标签</button> <button class="py_lycheckbtn py_radius" onclick="checkTags(\'detail\',\''+dom+'\')">确定</button></div></div></div>';
            layer.open({
                type: 1,
                title: false,
                closeBtn: false,
                shadeClose: false,
                area: ['auto', 'auto'],
                content: content
            });
            if(choosedCity != ''){
                $('.py_selarea span').html(choosedCity);
            }
            $('input').iCheck({
                checkboxClass: 'icheckbox_flat-aero',
                radioClass: 'iradio_flat-aero'
            });
            $('input').on('ifChecked', function(event){
                isCheckedTag(event.target.name,event.target.value);
            });
            $('.py_selarea').click(function(){
                if($('.py_select ul').is(':visible')){
                    $('.py_select ul').hide();
                }else{
                    $('.py_select ul').show();
                }
            });
            $('.py_select ul li').click(function(){
                var val = $(this).html();
                $('.py_select span').html(val);
                $('.py_select ul').hide();
            });
            break;
    }
    return;
}
function isCheckedTag(name,value){
    $('.py_lymore input[type=checkbox][name="'+name+'"]').each(function(){
        var val = $(this).val();
        if(val != value){
            $(this).iCheck('uncheck');
            $(this).prop("checked",false);
        }
    });
}
function checkTags(type,dom){
    var choosed = '';
    var posted = '';
    switch(type){
        case 'quick':
            $('.py_lyfew button').each(function(){
                if($(this).hasClass('btnhover')){
                    choosed = $(this).text();
                    posted = $(this).attr('data-name')+'='+$(this).text();
                }
            });
            break;
        case 'detail':
            var choosedArr = [];
            var postedArr = [];
            var num = 0;
            $.each(tagsGroup,function(i,value){
                switch(i){
                    default:
                        $('.py_lymore input[type=checkbox][name="'+value[1]+'"]').each(function(){
                            if($(this).prop("checked")==true){
                                choosedArr[num] = $(this).val();
                                postedArr[num] = value[1]+'='+$(this).val();
                                num++;
                            }
                        });
                        break;
                    case 9:
                        var val= $('.py_selarea span').html();
                        if(!(val == '不限制' || val == '')){
                            choosedArr[num] = val;
                            postedArr[num] = value[1]+'='+val;
                            num++;
                        }
                        break;
                }
            });
            if(choosedArr.length > 0){
                choosed = choosedArr.join(',');
                posted = postedArr.join(',');
            }
            break;
    }
    if(choosed == ''){
        G_PopWnd.error('您尚未选择任何标签，请选择');
        return false;
    }else{
        layer.closeAll();
        $('#btnChoosed'+dom).val(type);
        $('#changeTag'+dom).html(choosed).attr('title',choosed);
        $('#changePost'+dom).val(posted);

        switch(dom){
            case '1':
                getDataTwo();
                break;
            case '2':
                TryGetDataThreeLeft();
                break;
            case '3':
                TryGetDataThreeRight();
                break;
        }
    }
}

var g_is_login=false;
var g_project_id=0;
// 重新选择游戏的回调函数

function chooseProjectCallback(project_id)
{
    // 简单处理，所有的都g 要重新获取

    var html = window.location.href.split("?")[0];
    window.location.href = html;
}

function renderProject(project_id)
{
    // 简单处理，所有的都g 要重新获取
    $('#tab2').html("");
    $('#tab3').html("");
    $('#changeOld1').val("");
    $('#changeOld2').html("");
    $('#changeOld3').html("");

    if(project_id)
    {
        g_project_id=project_id;
    }

    $(".py_game img").attr("src",G_LOCAL_STORAGE.getProjectImgUrl(g_project_id));

    $(".py_game [name=project_name]").html(G_LOCAL_STORAGE.GetProjectName(g_project_id));

    g_getDataThree_left=null;
    g_getDataThree_right=null;

    $('.py_tab').eq(0).click();

    getDataOne();
}

function LoginDone()
{
    if(IsDemoUser())
    {
        PopLogin();
        return;
    }
    g_choose_game._attach($("[name=btn_choose_game]"), chooseProjectCallback);
    g_is_login=true;
    $('.py_tab').click(function(){
        var index = $(this).index();
        $(this).removeClass('py_taboff').addClass('py_tabon').siblings().removeClass('py_tabon').addClass('py_taboff').end();
        $('.tabcontent').eq(index).show().siblings('.tabcontent').hide();
        $('.py_choose').eq(index).show().siblings('.py_choose').hide();

        switch(index){
            case 1:
                var isInit = $('#tab2').html();
                if(isInit == '')getDataTwo();
                break;
            case 2:
                var isInit = $('#tab3').html();
                if(isInit == '')getDataThree();
                break
        }
    });

    $('.tab_influence span').click(function(){
        var index = $(this).index();
        $('.py_influence'+index).show().siblings('.py_influence').hide();
    });

    $('.tab_active span').click(function(){
        var index = $(this).index();
        $('.py_active'+index).show().siblings('.py_active').hide();
    });

    $('#changeTagZone1').click(function(){
        changeTagOpen(1);
    });
    $('#changeTagZone2').click(function(){
        changeTagOpen(2);
    });
    $('#changeTagZone3').click(function(){
        changeTagOpen(3);
    });
    renderProject();
}
function changeTagOpen(dom){
    var open = $('#btnChoosed'+dom).val();
    openTags(open,dom);
}
$(onLoad);
function tips(id,content,type){
    switch(type){
        case 'link':
            content += '<br><a href="javascript:void(0);" class="py_colorg" onclick="openDetail(\'\',\'\',3)">关注排名</a>？'
            layer.tips('<span class="py_colorb">'+content+'</span>', id, {
                tips: [4, '#FDF3BF']
            });
            break;
        default:
            layer.tips(content, id, {
                tips: [1, '#373737'],
                time:8000
            });
            break;
    }
}
function getDataOne(){

    var cgi_url=G_CGI_URL.profile.ProfileGlobalServlet;

    MyPost(
        cgi_url,
        {
            project_id:g_project_id
        },
        ShowLoading,
        HideLoading,
        function(data)
        {
            $('#num_high_charm').html(dataPackage('number',data['high_charm_num']));
            $('#num_high_pay').html(dataPackage('number',data['high_pay_num']));
            $('#num_trash').html(dataPackage('number',data['trash_num']));
            $('#num_lost').html(dataPackage('number',data['lost_num']));
            var complain_num = dataPackage('number',data['complain_num']);
            var total_num = dataPackage('number',data['total_num']);
            $('#num_total').html(total_num);
            var complain_percent = '0.0'
            $('#num_complain').html(complain_num);
            if(total_num > 0)complain_percent = ((complain_num/total_num)*100).toFixed(1);
            $('#num_complain_percent').html(complain_percent+'%');
            $('#str_sex').html(dataPackage('sex',data['sex_distri']));
            $('#str_interest').html(dataPackage('interest',data['interest_distri']));
            getEchart('map','pymap',dataPackage('map',data['province_distri']),'地域分布');
            getEchart('pie','callupon',dataPackage('influence',[data['influence_distri'],data['influence_be_replied_distri']]),'号召情况',['#77BFE5','#DEE2E7','#5093B7']);
            getEchart('pie','dynamic',dataPackage('active',[data['active_distri'],data['active_post_distri']]),'活跃情况',['#42C7B7','#DEE2E7','#1A9385']);
            getEchart('scatter','pycomplain',dataPackage('complain',data['complain_rate_distri']),'抱怨情况');
        },
        function(data, msg, code)
        {
            G_PopWnd.error(msg);
        }
    )
}
function postDataSave(dom){
    var tagInput = $('#changeTag'+dom).html();
    $('#changeOld'+dom).val(tagInput);
    if(tagInput.length > 6){
        tagInputSplit = tagInput.substr(0,6)+'.';
    }else{
        tagInputSplit = tagInput;
    }
    switch(dom){
        case 2:
            for(var i=1;i<=4;i++){
                $('#leftNotice'+i).html(tagInputSplit).attr('title',tagInput);
            }
            g_getDataThree_left=null;
            break;
        case 3:
            for(var i=1;i<=4;i++){
                $('#rightNotice'+i).html(tagInputSplit).attr('title',tagInput);
            }
            g_getDataThree_right=null;
            break;
    }
}
function postDataPackage(dom){
    var tagOld = $('#changeOld'+dom).val();
    var tagInput = $('#changeTag'+dom).html();
    if(tagInput == tagOld){
        return false;
    }else{
        var data = {};
        data.project_id = g_project_id;
        var tagPost = $('#changePost'+dom).val();
        if(tagPost != ''){
            var tagPostArr = new Array();
            tagPostArr = tagPost.split(",");
            if(tagPostArr.length > 0){
                $.each(tagPostArr,function(i,value){
                    var tagPostValueArr = new Array();
                    tagPostValueArr = value.split("=");
                    if(tagPostValueArr.length > 0){
                        if(tagPostValueArr[0] != ''){
                            data[tagPostValueArr[0]] = tagPostValueArr[1];
                        }
                    }
                });
            }
        }
        switch(dom){
            case 2:
                g_getDataThree_left=null;
                break;
            case 3:
                g_getDataThree_right=null;
                break;
        }
    }
    return data;
}

function getDataTwo(){
    var data = postDataPackage(1);
    if(!data){
        return false;
    }
    var cgi_url=G_CGI_URL.profile.ProfileCustomServlet;
    MyPost(
        cgi_url,
        data,
        ShowLoading,
        HideLoading,
        function(data)
        {
            $('#tab2').html('1');
            postDataSave(1);
            var total_num = dataPackage('number',data['total_num']);
            $('#num_sample_1').html(total_num);
            $('#str_attention_forum').html(dataPackage('attention',[data['attention_forum_distri'],data['total_num']]));
            $('#str_attention_game').html(dataPackage('attention',[data['attention_game_forum_distri'],data['total_num']]));
            $('#str_interest2').html(dataPackage('interest2',data['interest_classify_distri']));
            getEchart('line','chart_hot_value',dataPackage('line',data['hot_value_distri']),'热力指数');
            getEchart('line','chart_title_num',dataPackage('line',data['title_num_distri']),'主帖发言量');
            getEchart('line','chart_content_num',dataPackage('line',data['content_num_distri']),'回复帖发言量');
            getEchart('line','chart_be_replied',dataPackage('line',data['be_replied_num_distri']),'发言响应量');
            getEchart('line','chart_post_hour',dataPackage('line2',data['post_hour_distri']),'活跃时段');
            getEchart('bar','chart_fans_num',dataPackage('bar',data['fans_num_distri']),'粉丝魅力','#D8C26C');
            getEchart('bar','chart_tieba_age',dataPackage('bar',data['tieba_age_distri']),'吧龄分布','#42C6B8');
            $('#str_sex2').html(dataPackage('sex',data['sex_distri']));
            getEchart('map','pymap2',dataPackage('map2',data['province_distri']),'地域分布');
        },
        function(data, msg, code)
        {
            restoreTag(1);
            G_PopWnd.error(msg);
        }
    )
}
function restoreTag(dom){
    var tagOld = $('#changeOld'+dom).val();
    if(tagOld != ''){
        $('#changeTag'+dom).html(tagOld);
    }
}
var g_getDataThree_left=null;
var g_getDataThree_right=null;

// 是否需要从后台请求左边的数据
function needGetDataThreeLeft()
{
    if(!g_getDataThree_left)
        return true;

    // 这里后续也要加上用户标签变化的坚持，如果用户标签变了，也要返回true
    // ???

    return false;
}

// 是否需要从后台请求右边的数据
function needGetDataThreeRight()
{
    if(!g_getDataThree_right)
        return true;

    // 这里后续也要加上用户标签变化的坚持，如果用户标签变了，也要返回true
    // ???

    return false;
}

function getDataThree()
{
    TryGetDataThreeLeft();
    TryGetDataThreeRight();
}

function TryGetDataThreeLeft()
{
    var data = postDataPackage(2);
    if(needGetDataThreeLeft())
    {
        var cgi_url=G_CGI_URL.profile.ProfileCustomServlet;

        MyPost(
            cgi_url,
            data,
            ShowLoading,
            HideLoading,
            function(data)
            {
                postDataSave(2);
                g_getDataThree_left=data;

                getDataThreeCallBack();
            },
            function(data, msg, code)
            {
                restoreTag(2);
                G_PopWnd.error(msg);
            }
        )
    }
    else
    {
        getDataThreeCallBack();
    }

}

function TryGetDataThreeRight()
{
    var data = postDataPackage(3);
    if(needGetDataThreeRight())
    {
        var cgi_url=G_CGI_URL.profile.ProfileCustomServlet;
        // 必须等300毫秒后再请求，否则会报错频率push
        setTimeout(function(){
            MyPost(
                cgi_url,
                data,
                ShowLoading,
                HideLoading,
                function(data)
                {
                    postDataSave(3);
                    g_getDataThree_right=data;

                    getDataThreeCallBack();
                },
                function(data, msg, code)
                {
                    restoreTag(3);
                    G_PopWnd.error(msg);
                }
            )
        },300);
    }
    else
    {
        getDataThreeCallBack();
    }
}

function getDataThreeCallBack(){

    if(g_getDataThree_left==null || g_getDataThree_right==null)
    {
        return;
    }

    $('#tab3').html('1');
    var dataLeft = g_getDataThree_left;
    var dataRight = g_getDataThree_right;

    var total2_num = dataPackage('number',dataLeft['total_num']);
    $('#num_sample_2').html(total2_num);
    var total3_num = dataPackage('number',dataRight['total_num']);
    $('#num_sample_3').html(total3_num);
    $('#str_attention_forum_left').html(dataPackage('attention2',[dataLeft['attention_forum_distri'],dataLeft['total_num']]));
    $('#str_attention_forum_right').html(dataPackage('attention2',[dataRight['attention_forum_distri'],dataRight['total_num']]));
    $('#str_attention_game_left').html(dataPackage('attention2',[dataLeft['attention_game_forum_distri'],dataLeft['total_num']]));
    $('#str_attention_game_right').html(dataPackage('attention2',[dataRight['attention_game_forum_distri'],dataRight['total_num']]));
    $('#str_interestcompare').html(dataPackage('interestcompare',[dataLeft['interest_classify_distri'],dataRight['interest_classify_distri']]));
    $('#str_sexcompare').html(dataPackage('sexcompare',[dataLeft['sex_distri'],dataRight['sex_distri']]));

    var tagInput2 = $('#changeTag2').html();
    var tagInput3 = $('#changeTag3').html();
    if(tagInput2.length > 6){
        tagInput2 = tagInput2.substr(0,6)+'.';
    }
    if(tagInput3.length > 6){
        tagInput3 = tagInput3.substr(0,6)+'.';
    }
    if(tagInput2 == tagInput3){
        tagInput2 += '-左';
        tagInput3 += '-右';
    }
    getEchart('lineTwo','chart_title_num_compare',dataPackage('linecompare',[dataLeft['title_num_distri'],dataRight['title_num_distri']]),[tagInput2,tagInput3]);
    getEchart('lineTwo','chart_content_num_compare',dataPackage('linecompare',[dataLeft['content_num_distri'],dataRight['content_num_distri']]),[tagInput2,tagInput3]);
    getEchart('lineTwo','chart_be_replied_compare',dataPackage('linecompare',[dataLeft['be_replied_num_distri'],dataRight['be_replied_num_distri']]),[tagInput2,tagInput3]);
    getEchart('lineTwo','chart_post_hour_compare',dataPackage('linecompare2',[dataLeft['post_hour_distri'],dataRight['post_hour_distri']]),[tagInput2,tagInput3]);

    getEchart('barTwo','chart_fans_num_compare',dataPackage('barcompare',[dataLeft['fans_num_distri'],dataRight['fans_num_distri']]),[tagInput2,tagInput3]);
    getEchart('barTwo','chart_tieba_age_compare',dataPackage('barcompare',[dataLeft['tieba_age_distri'],dataRight['tieba_age_distri']]),[tagInput2,tagInput3]);
}

function ajaxData(url,data){
    var back;
    $.ajax({
        type: 'post',
        url: url,
        data: data,
        async: false,
        dataType: 'json',
        success: function(receive){
            back = receive.data;
        },
        error:function(){

        },
        timeout:3000
    });
    return back;
}

function dataRank(type,data){
    var back = {};
    switch(type){
        case 'line':
        case 'line2':
            back['xaxis'] = [];
            back['data'] = [];
            $.each(data,function(i,value){

                for(var key in value)
                {
                    back['xaxis'].push(key);
                    switch(type){
                        case 'line2':
                            back['data'].push((value[key]*100).toFixed(2));
                            break;
                        default:
                            back['data'].push(value[key]);
                            break;
                    }
                }
            });
            return back;
            break;
        case 'linecompare':
        case 'linecompare2':
            back['xaxis'] = [];
            back['data1'] = [];
            back['data2'] = [];
            var data1 = [];
            var data2 = [];

            $.each(data[0],function(i,value){
                for(var key in value){
                    if($.inArray(key,back['xaxis']) < 0){
                        back['xaxis'].push(key);
                    }
                    data1[key] = value[key];
                }
            });
            $.each(data[1],function(i,value){
                for(var key in value){
                    if($.inArray(key,back['xaxis']) < 0){
                        back['xaxis'].push(key);
                    }
                    data2[key] = value[key];
                }
            });
            $.each(back['xaxis'],function(i,value){
                if((typeof(data1[value]) == "undefined")){
                    back['data1'].push(0);
                }else{
                    switch(type){
                        case 'linecompare2':
                            back['data1'].push((data1[value]*100).toFixed(2));
                            break;
                        default:
                            back['data1'].push(data1[value]);
                            break;
                    }
                }
                if((typeof(data2[value]) == "undefined")){
                    back['data2'].push(0);
                }else{
                    switch(type){
                        case 'linecompare2':
                            back['data2'].push((data2[value]*100).toFixed(2));
                            break;
                        default:
                            back['data2'].push(data2[value]);
                            break;
                    }
                }
            });
            return back;
            break;
    }
}

function array2Map(arr)
{
    var arr = AntiXss(arr);

    var ret={};

    $.each(arr, function(i, value){
        ret= $.extend(ret, value);
    });

    return ret;
}

function dataPackage(type,data){
    switch(type){
        case 'bar':
            var back = {};
            back['xaxis'] = [];
            back['data'] = [];
            if(typeof(data) == "undefined" || data == ''){
                return back;
            }else{
                var bar = AntiXss(data);
                $.each(data,function(i,value){
                    for(var key in value)
                    {
                        back['xaxis'].push(key);
                        back['data'].push(value[key]);
                    }
                });
                return back;
            }
        case 'barcompare':
            var back = [];
            var data1 = [];
            var data2 = [];
            var total1 = 0;
            var total2 = 0;
            var percent = 0.00;
            back['xaxis'] = [];
            back['data1'] = [];
            back['data2'] = [];
            if(typeof(data) == "undefined" || data == ''){
                return back;
            }else{
                var bar1 = AntiXss(data[0]);
                var bar2 = AntiXss(data[1]);
                $.each(bar1,function(i,value){
                    for(var key in value){
                        if($.inArray(key,back['xaxis']) < 0){
                            back['xaxis'].push(key);
                        }
                        total1 += parseInt(value[key]);
                        data1[key] = value[key];
                    }
                });
                $.each(bar2,function(i,value){
                    for(var key in value){
                        if($.inArray(key,back['xaxis']) < 0){
                            back['xaxis'].push(key);
                        }
                        total2 += parseInt(value[key]);
                        data2[key] = value[key];
                    }
                });
                $.each(back['xaxis'],function(i,value){
                    if((typeof(data1[value]) == "undefined")){
                        back['data1'].push(0);
                    }else{
                        if(total1 > 0){
                            percent = (parseInt(data1[value])/total1*100).toFixed(2);
                            back['data1'].push(percent);
                        }else{
                            back['data1'].push(0);
                        }
                    }
                    if((typeof(data2[value]) == "undefined")){
                        back['data2'].push(0);
                    }else{
                        if(total2 > 0){
                            percent = (parseInt(data2[value])/total2*100).toFixed(2);
                            back['data2'].push(percent);
                        }else{
                            back['data2'].push(0);
                        }
                    }
                });
                return back;
            }
        case 'line':
        case 'line2':
            var back = [];
            back['xaxis'] = [];
            back['data'] = [];
            if(typeof(data) == "undefined" || data == ''){
                return back;
            }else{
                var line = AntiXss(data);
                return dataRank(type,line);
            }
            break;
        case 'linecompare':
        case 'linecompare2':
            var back = [];
            back['xaxis'] = [];
            back['data'] = [];
            if(typeof(data) == "undefined" || data == ''){
                return back;
            }else{
                var line1 = AntiXss(data[0]);
                var line2 = AntiXss(data[1]);
                return dataRank(type,[line1,line2]);
            }
            break;
        case 'attention':
        case 'attention2':
            var back = '';
            if(typeof(data) == "undefined" || data == ''){
                return back;
            }else{
                var i = 1;
                var total = 0;
                var percent = 0;
                var attention = array2Map(data[0]);
                total = parseInt(data[1]);
                switch(type){
                    case 'attention':
                        $.each(attention,function(key,value){
                            if(total > 0)percent = ((parseInt(value)/total)*100).toFixed(1);
                            back += attentionHtml('single',i,key,percent,value);
                            i++;
                        });
                        break;
                    case 'attention2':
                        $.each(attention,function(key,value){
                            if(total > 0)percent = ((parseInt(value)/total)*100).toFixed(1);
                            back += attentionHtml('compare',i,key,percent,value);
                            i++;
                        });
                        break;
                }
                return back;
            }
            break;
        case 'complain':
            var back = {};
            back['data'] = back['markData'] = [];
            back['markName'] = '';
            back['max'] = 'auto';
            var max = 0;
            if(typeof(data) == "undefined" || data == ''){
                return back;
            }else{
                var str = '';
                var complain = AntiXss(data);
                $.each(complain,function(key,value){
                    value.complain_rate = (parseFloat(value.complain_rate)*100).toFixed(0);
                    var arr = [value.rank,value.complain_rate];
                    back['data'].push(arr);
                    if(parseInt(value.complain_rate) > parseInt(max))max = value.complain_rate;
                    if(parseInt(g_project_id) == parseInt(key)){
                        value.rank_rate = (parseFloat(value.rank_rate)*100).toFixed(0);
                        if(value.rank_rate == 0)value.rank_rate = 1;
                        $('#num_active_percent').html(value.rank_rate+'%');
                        back['markName'] = G_LOCAL_STORAGE.GetProjectName(g_project_id)+'\r\n活跃度前'+value.rank_rate+'%'+'\r\n抱怨'+value.complain_rate+'%';
                        back['markData'] = arr;
                    }
                });
                if(max != 0){
                    max = (max*2).toFixed(0);
                    var number = max%10;
                    if(number != 0){
                        max -= number;
                    }
                    if(max>100 && max<120)max = 120;
                    back['max'] = max;
                }
                return back;
            }
            break;
        case 'map':
        case 'map2':
            var back = [];
            if(typeof(data) == "undefined" || data == ''){
                return back;
            }else{
                var i = 1;
                var str = '';
                var map = array2Map(data);
                $.each(map,function(key,value){
                    var arr ={};
                    arr.name = key;
                    value = (parseFloat(value)*100).toFixed(1);
                    arr.value = value;
                    back.push(arr);
                    if(i < 6){
                        str += mapHtml(i,key,value);
                    }
                    i++;
                });
                switch(type){
                    case 'map':
                        $('#pymaplist').html(str);
                        break;
                    default:
                        $('#pymaplist2').html(str);
                        break;
                }
                return back;
            }
            break;
        case 'number':
            if(typeof(data) == "undefined" || data == ''){
                return 0;
            }else{
                return AntiXss(data);
            }
            break;
        case 'interest':
        case 'interest2':
            var back = '';
            var color = ['py_wdblue','py_wdgreen','py_wdyellow','py_wdred','py_wdviolet','py_wdgrape','py_wdpink'];
            if(typeof(data) == "undefined" || data == ''){
                return back;
            }else{
                var interest = array2Map(data);
                var total = 0;
                var percent = 0;
                var i = 0;
                $.each(interest,function(key,value){
                    total += parseInt(value);
                });
                $.each(interest,function(key,value){
                    if(parseInt(total) == 0){
                        percent = 0.0;
                    }else{
                        percent = ((parseInt(value)/total)*100).toFixed(1);
                    }
                    back += interestHtml(type,key,percent,value,color[i]);
                    i++;
                });
                return back;
            }
            break;
        case 'interestcompare':
            var back = '';
            var color1 = ['py_wdblue','py_wdgreen','py_wdyellow','py_wdred','py_wdviolet','py_wdgrape','py_wdpink']
            var color2 = ['py_wdblue2','py_wdgreen2','py_wdyellow2','py_wdred2','py_wdviolet2','py_wdgrape2','py_wdpink2'];
            if(typeof(data) == "undefined" || data == ''){
                return back;
            }else{
                var allData = [];
                var interest1 = array2Map(data[0]);
                var interest2 = array2Map(data[1]);
                var total1 = 0;
                var total2 = 0;
                var percent1 = 0;
                var percent2 = 0;
                var value1 = '';
                var value2 = '';
                var i = 0;
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
                    back += interestcompareHtml(value,percent1,percent2,value1,value2,color1[i],color2[i]);
                    i++;
                });
                return back;
            }
            break;
        case 'sex':
            var back = '';
            if(typeof(data) == "undefined" || data == ''){
                return back;
            }else{
                var sex = array2Map(data);
                var total = 0;
                var male = 0;
                var female = 0;
                $.each(sex,function(key,value){
                    switch(key){
                        case '男':
                            male = parseInt(value);
                            break;
                        case '女':
                            female = parseInt(value);
                            break;
                    }
                });
                total = male+female;
                if(total > 0){
                    male = ((male/total)*100).toFixed(0);
                    female = 100-male;
                }
                back = sexHtml(male+'%',female+'%');
                return back;
            }
            break;
        case 'sexcompare':
            var back = '';
            if(typeof(data) == "undefined" || data == ''){
                return back;
            }else{
                var sex1 = array2Map(data[0]);
                var sex2 = array2Map(data[1]);
                var total1 = 0;
                var total2 = 0;
                var male1 = 0;
                var male2 = 0;
                var female1 = 0;
                var female2 = 0;
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
                back = sexCompareHtml(male1,female1,male2,female2);
                return back;
            }
            break;
        case 'influence':
        case 'active':
            var back = [];
            if(typeof(data) == "undefined" || data == ''){
                return back;
            }else{
                var str = '';
                var remark = '';
                var useData = array2Map(data[0]);
                var infoData = array2Map(data[1]);
                var total = 0;
                var index = 0;
                var percent = 0;
                $.each(useData,function(key,value){
                    total += parseInt(value);
                });
                $.each(useData,function(key,value){
                    if(total > 0){
                        percent = ((parseInt(value)/total)*100).toFixed(1);
                    }
                    var arr ={};
                    arr.name = key+'\r\n('+percent+'%)';
                    arr.value = value;
                    back.push(arr);
                });
                var initValue = '';
                switch(type){
                    case 'influence':
                        var influenceInit = ['高号召','中号召','低号召'];
                        $.each(influenceInit,function(key,value){
                            if(typeof(infoData[value]) == "undefined"){
                                initValue = 0.00;
                            }else{
                                initValue = infoData[value].toFixed(2);
                            }
                            switch(value){
                                case '高号召':
                                    index = 0;
                                    remark = '他们对舆论导向作用明显';
                                    break;
                                case '中号召':
                                    index = 1;
                                    remark = '';
                                    break;
                                case '低号召':
                                    index = 2;
                                    remark = '';
                                    break;
                            }
                            str += influence_activeHtml(type,index,initValue,value,remark);
                        });
                        break;
                    case 'active':
                        var activeInit = ['高活跃','中活跃','低活跃'];
                        $.each(activeInit,function(key,value){
                            if(typeof(infoData[value]) == "undefined"){
                                initValue = 0.00;
                            }else{
                                initValue = infoData[value].toFixed(2);
                            }
                            switch(value){
                                case '高活跃':
                                    index = 0;
                                    remark = '他们直接影响游戏人气';
                                    break;
                                case '中活跃':
                                    index = 1;
                                    remark = '';
                                    break;
                                case '低活跃':
                                    index = 2;
                                    remark = '';
                                    break;
                            }
                            str += influence_activeHtml(type,index,initValue,value,remark);
                        });
                        break;
                }
                $('#'+type+'list').html(str);
                return back;
            }
            break;
    }
}
function interestHtml(type,name,percent,number,color){
    var html = '';
    html += '<div class="py_word"';
    switch(type){
        case 'interest2':
            html += 'onmouseover="tips(this,\'想查看各分类的\',\'link\');"';
            break;
    }
    html += '>';
    html += '<div class="py_wname py_floatl">'+name+' <span class="py_colorg"> ('+percent+'%)</span></div>';
    html += '<div class="py_wnumber py_floatr">'+number+'</div>';
    html += '<div class="py_clear"></div>';
    html += '</div>';
    html += '<div class="py_wdline">';
    percent = parseFloat(percent)*2;
    if(percent > 100)percent = 100;
    html += '<span class="'+color+'" style="width: '+percent+'%"></span>';
    html += '</div>';
    return html;
}
function sexHtml(male,female){
    var html = '';
    html += '<div class="py_rtarea">';
    html += '<div class="py_rtlist py_floatl py_rtboderr">';
    html += '<i class="py_rtimg py_rtmale ma"></i>';
    html += '<span class="py_margt40" id="sex_male">'+male+'</span>';
    html += '</div>';
    html += '<div class="py_rtlist py_floatl">';
    html += '<i class="py_rtimg py_rtfemale ma"></i>';
    html += '<span class="py_margt40" id="sex_female">'+female+'</span>';
    html += '</div>';
    html += '<div class="py_clear"></div>';
    html += '</div>';
    html += '<div class="py_clear"></div>';
    html += '<div class="py_rtline py_margt40">';
    html += '<div class="py_rtblue py_radiusl" style="width: '+male+'"></div>';
    html += '</div>';
    return html;
}
function mapHtml(index,name,percent){
    var html = '';
    if(index == 1){
        html += '<dt class="py_colorg py_mplist20">#</dt><dt class="py_colorg py_mplist40">地域</dt><dt class="py_colorg py_mplist40">占比</dt>';
    }
    if(index == 5){
        html += '<dd class="py_colorg py_rkltbdnone py_mplist20">'+index+'</dd>';
        html += '<dd class="py_mplist40 py_rkltbdnone">'+name+'</dd>';
        html += '<dd class="py_mplist40 py_rkltbdnone">'+percent+'%</dd>';
    }else{
        html += '<dd class="py_colorg py_mplist20">'+index+'</dd>';
        html += '<dd class="py_mplist40">'+name+'</dd>';
        html += '<dd class="py_mplist40">'+percent+'%</dd>';
    }
    return html;
}
function influence_activeHtml(dom,index,percent,name,remark){
    var html = '';
    html += '<div class="py_pidetail py_margt30 py_'+dom+' py_'+dom+index;
    if(!(name == '高活跃' || name == '高号召')){
        html += ' py_hidden';
    }
    html += '">';
    html += '<p class="py_font20">';
    switch(dom){
        case 'active':
            html += '月均'+percent+'发言';
            break;
        case 'influence':
            html += '帖均'+percent+'回复';
            break;
    }
    html += '</p>';
    html += '<p class="py_pdlh">'+name+'用户</p>';
    html += '<p class="py_colorg">'+remark+'</p>';
    html += '</div>';
    return html;
}
function attentionHtml(from,index,name,percent,number){
    var html = '';
    switch(from){
        case 'single':
            if(index == 1){
                html += '<dt class="py_colorg py_tblist10">#</dt><dt class="py_colorg py_tblist50">贴吧</dt><dt class="py_colorg py_tblist40">数量</dt>';
            }
            if(index == 10){
                html += '<dd class="py_colorg py_rkltbdnone py_tblist10">'+index+'</dd>';
                html += '<dd class="py_tblist50 py_rkltbdnone">'+name+'<span class="py_colorg">('+percent+'%)</span></dd>';
                html += '<dd class="py_tblist40 py_rkltbdnone">'+number+'</dd>';
            }else{
                html += '<dd class="py_colorg py_tblist10">';
                if(index < 4){
                    html += '<span class="py_rankimg py_rank'+index+'"></span>';
                }else{
                    html += index;
                }
                html += '</dd>';
                html += '<dd class="py_tblist50">'+name+'<span class="py_colorg">('+percent+'%)</span></dd>';
                html += '<dd class="py_tblist40">'+number+'</dd>';
            }
            break;
        case 'compare':
            if(index == 1){
                html += '<dt class="py_colorg py_cplist10">#</dt><dt class="py_colorg py_cplist60">贴吧</dt><dt class="py_colorg py_cplist30">数量</dt>';
            }
            if(index == 10){
                html += '<dd class="py_colorg py_rkltbdnone py_cplist10">'+index+'</dd>';
                html += '<dd class="py_cplist60 py_rkltbdnone">'+name+'<span class="py_colorg">('+percent+'%)</span></dd>';
                html += '<dd class="py_cplist30 py_rkltbdnone">'+number+'</dd>';
            }else{
                html += '<dd class="py_colorg py_cplist10';
                if(index < 4){
                    html += ' py_colorr';
                }
                html += '">'+index+'</dd>';
                html += '<dd class="py_cplist60">'+name+'<span class="py_colorg">('+percent+'%)</span></dd>';
                html += '<dd class="py_cplist30">'+number+'</dd>';
            }
            break;
    }
    return html;
}
function interestcompareHtml(key,percent1,percent2,value1,value2,color1,color2){
    color1 = 'py_wdblue';
    color2 = 'py_wdyellow';
    var html = '';
    html += '<div class="py_word">';
    html += '<div class="py_wdleft py_floatl">'+value1+'<span class="py_colorg"> ('+percent1+'%)</span></div>';
    html += '<div class="py_wdname py_floatl">'+key+'</div>';
    html += '<div class="py_wdright py_floatr"><span class="py_colorg">('+percent2+'%) </span>'+value2+'</div>';
    html += '<div class="py_clear"></div>';
    html += '</div>';
    percent1 = parseFloat(percent1)*2;
    if(percent1 > 100)percent1 = 100;
    percent2 = parseFloat(percent2)*2;
    if(percent2 > 100)percent2 = 100;
    html += '<div class="py_lineleft py_wdline py_floatl">';
    html += '<div class="py_wlleft py_floatl"></div>';
    html += '<span class="'+color1+'" style="width: '+percent1+'%"></span>';
    html += '</div>';
    html += '<div class="py_lineright py_wdline py_floatl">';
    html += '<div class="py_wlleft py_floatl"></div>';
    html += '<span class="'+color2+'" style="width: '+percent2+'%"></span>';
    html += '</div>';
    html += '<div class="py_clear"></div>';

    return html;
}
function sexCompareHtml(male1,female1,male2,female2){
    var html = '';
    html += '<i class="py_cphmman ma"></i>';
    html += '<div class="py_hmshow py_floatl">';
    html += '<div class="py_hmline1 py_radiusl py_hmbg1" style="width:'+male1+'%"></div><span style="right:'+(parseInt(male1)+2)+'%">'+male1+'%</span>';
    html += '</div>';
    html += '<div class="py_hmshow py_floatl">';
    html += '<div class="py_hmline2 py_radiusr py_hmbg2" style="width:'+male2+'% "></div><span style="left:'+(parseInt(male2)+2)+'%">'+male2+'%</span>';
    html += '</div>';
    html += '<div class="py_clear"></div>';
    html += '<i class="py_cphmfemale ma"></i>';
    html += '<div class="py_hmshow py_floatl">';
    html += '<div class="py_hmline1 py_radiusl py_hmbg3" style="width:'+female1+'% "></div><span style="right:'+(parseInt(female1)+2)+'%">'+female1+'%</span>';
    html += '</div>';
    html += '<div class="py_hmshow py_floatl">';
    html += '<div class="py_hmline2 py_radiusr py_hmbg4" style="width:'+female2+'% "></div><span style="left:'+(parseInt(female2)+2)+'%">'+female2+'%</span>';
    html += '</div>';
    html += '<div class="py_clear"></div>';
    return html;
}
function AntiXss(data){
    if(typeof(data) == "undefined"){
        return '';
    }else if(typeof data === "number"){
        return data;
    }else if(typeof data === "string"){
        return data.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&lt;br&gt;/ig, "<br>").replace(/&lt;br\/&gt;/ig, "<br/>");
    }else if(data instanceof Array){
        for(var i=0; i<data.length; ++i){
            data[i]=AntiXss(data[i]);
        }
        return data;
    }else if(data instanceof Object){
        for(var k in data) {
            data[k] = AntiXss(data[k]);
        }
        return data;
    }
}
function openDetail(val,field,dom){
    GoTop();
    switch(dom){
        case 1:
            $('#changePost1').val(field+'='+val);
            $('#changeTag1').html(val);
            getDataTwo();
            break;
        case 3:
            layer.closeAll();
            break;
    }
    $('.py_tab').eq(dom).removeClass('py_taboff').addClass('py_tabon').siblings().removeClass('py_tabon').addClass('py_taboff').end();
    $('.tabcontent').eq(dom).show().siblings('.tabcontent').hide();
    $('.py_choose').eq(dom).show().siblings('.py_choose').hide();

}


