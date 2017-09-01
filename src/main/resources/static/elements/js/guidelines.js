var dateBegin = G_Date._get(-6);
var dateMonth = G_Date._get(-29);
var dateEnd = G_Date._get(0);
var dateYesterday = G_Date._get(-1);
var date1Begin = '';
var date1End = '';
var date2Begin = '';
var date2End = '';
var C_Number = 0;
var C_Rand = 0;
$(function(){

    G_Login._check();
    C_Dom._header(0);
    C_Dom._quicker();
    C_Dom._footer();
    G_Login._status();
    G_Game._getCollect();

    $('.lt_fmNotice i').click(function(){
        $(this).parent('.lt_fmNotice').fadeOut("slow");
    });
    $('.title-tip').each(function(index){
        $(this).click(function(){
            var dom = $('.lt_fmNotice').eq(index);
            dom.is(":hidden") ? dom.fadeIn("slow") : dom.fadeOut("slow");
        });
    });
    tabChoose($('.bs_summary li'),$('.t_slider'),230,0,'liOn','guideSummary',null,$('.bs_summary_content'));
    tabChoose($('.bs_game_type li'),null,null,null,'change-tab-selected',null,null,$('.bs_game_type_show'));
    tabChoose($('.bs_user_complain_type li'),null,null,null,'change-tab-selected',null,null,$('.bs_user_complain_list'),$('.bs_user_complain_chart'));

    F_General._getData();
    F_General._formatCho();

    setInterval('F_General._getData()',60000);
    setTimeout("F_Hot._getHotToday()",600);
    setTimeout("F_Hot._getHotRecent();",1200);

    F_GameActivity._getData();
    F_GameMap._getData();
    F_Distribute._getData();
    F_Complain._getData();

    dataChoose._single({'autoCommit':true,'todayValid':false},2,dateYesterday,dateYesterday,function(begin,end){
        if(begin !=date2Begin || date2End != end){
            date2Begin = begin;
            date2End = end;
            F_AppStore._getData();
        }
    });
    F_AppStore._formatTab();

    $('.right .check-more').each(function(index){
        $(this).click(function(){
            var url = G_Jump._getUrl('article');
            switch(index){
                case 0:
                    url += '?t=top'
                    break;
                case 1:
                    url += '?t=hot';
                    break;
            }
            G_Jump._go('article',url);
            return;
        })
    });

    $('.nav-tab-change span').each(function(index){
        $(this).click(function(){
            var contentUrl = $(this).attr('href');
            $('.nav-tab-change span').removeClass('nav-tab-selected');
            $('.nav-tab-change span i').removeClass('triganle-icon');
            $(this).addClass('nav-tab-selected');
            $(this).find('i').addClass('triganle-icon');
            $('.guide-tab-content').css('display', 'none');
            $(contentUrl).css('display', 'block');
            switch(index){
                case 1:
                    if($('#bs_ins_article_pie').html() == ''){
                        F_MediaArticle._getData('公司');
                        dataChoose._section({'autoCommit':true,'todayValid':true},1,dateMonth,dateEnd,function(begin,end){
                            if(begin !=date1Begin || date1End != end){
                                date1Begin = begin;
                                date1End = end;
                                F_MediaArticle._getTopic();
                            }
                        });
                        F_HotWords._getData();
                    }
                    break;
                case 2:
                    if($('#bs_game_rank').html() == ''){
                        F_Rank._formatTab();
                        F_Rank._getData('手游');
                    }
                    break;
            }
        });
    });
});
var F_Common = {
    _number:function(){
        C_Number = parseInt(C_Number);
        C_Rand = parseInt(C_Rand);
        var numberChange = $(".bs_change_number").numberAnimate({num:C_Number, speed:2000});
        if(C_Rand > 0){
            var randNumber = Math.ceil(C_Rand/2);
            var perRand = Math.floor(randNumber/60);
            var randTotal = C_Rand - randNumber;
            var randLast = randTotal;
            setInterval(function(){
                var rand = Math.ceil(Math.random()*randLast);
                randLast -= rand;
                C_Number += (perRand + rand);
                numberChange.resetData(C_Number);
            },5000);
        }
    }
}
var F_AppStore = {
    _buff:{},
    _init:G_Game._appClassify(),
    _more:function(name){
        window.open('rank.html?p='+F_AppStore._getPlat()+'&t='+F_AppStore._getType()+'&d='+F_AppStore._getDate()+'&c='+encodeURIComponent(name));
        return;
    },
    _formatTab:function(){
        $('.left-tabs li').each(function(){
            $(this).click(function(){
                var tabName = $(this).html();
                if(!(F_AppStore._buff.type && tabName == F_AppStore._buff.type)){
                    $(this).addClass('change-tab-selected').siblings('li').removeClass('change-tab-selected');
                    F_AppStore._getData();
                }
            });
        });
        $('.right-tabs li').each(function(){
            $(this).click(function(){
                var tabName = $(this).html();
                if(!(F_AppStore._buff.plat && tabName == F_AppStore._buff.plat)){
                    $(this).addClass('change-tab-selected').siblings('li').removeClass('change-tab-selected');
                    F_AppStore._getData();
                }
            });
        });
    },
    _getDate:function(){
        return $('#db2').val();
    },
    _getPlat:function(){
        var plat = '';
        $('.right-tabs li').each(function(){
            if($(this).hasClass('change-tab-selected')){
                plat = $(this).attr('data-w');
            }
        });
        return plat;
    },
    _getType:function(){
        var type = '';
        $('.left-tabs li').each(function(){
            if($(this).hasClass('change-tab-selected')){
                type = $(this).attr('data-w');
            }
        });
        return type;
    },
    _getData:function(){
        var date = F_AppStore._getDate();
        var plat = F_AppStore._getPlat();
        var type = F_AppStore._getType();
        if(F_AppStore._buff.date != date || F_AppStore._buff.plat != plat || F_AppStore._buff.type != type){
            F_AppStore._buff.date = date;
            F_AppStore._buff.plat = plat;
            F_AppStore._buff.type = type;
            G_Port._ajax('industryAppStore','get',true,'data_date='+date+'&device_type='+plat+'&list_type='+type,function(){
                    $('#bs_app_sotre').html(G_Pre._loading());
                },function(){
                    $('#bs_app_sotre').html('');
                },function(data,msg){
                    if(data.appstore_type_distri && data.appstore_type_distri.length>0){
                        F_AppStore._chart(data.appstore_type_distri)
                    }
                },function(data,msg,code){
                    $('#bs_app_sotre').html(G_Pre._empty(msg));
                }
            )
        }
    },
    _chart:function(data){
        var chartDataPre = {xAxis:[],data:[]};
        for(var i=0;i<data.length;i++){
            if(F_AppStore._init[data[i].app_type]){
                //var chartXName = F_AppStore._init[data[i].app_type] != '小游戏' ? F_AppStore._init[data[i].app_type].replace('游戏','') : '小游戏';
                var chartXName = F_AppStore._init[data[i].app_type];
                chartDataPre.xAxis.push(chartXName);
                chartDataPre.data.push(data[i].app_num);
            }
        }
        var chartData = {};
        chartData.tooltip = {trigger:'axis'};
        chartData.legend = null;
        chartData.grid = {
            top:5,
            left: 2,
            bottom: 5,
            right: 15,
            containLabel: true
        };
        chartData.xAxis = [
            {
                splitLine : {
                    show:false
                },
                type : 'category',
                data : chartDataPre.xAxis,
                axisLine:{
                    show : false
                },
                axisTick:{
                    show : false
                },
                axisLabel:{
                    textStyle:{
                        color:'#C2C2C2',
                        fontSize : '11px'
                    },
                    interval:'0'
                }
            }
        ];
        chartData.yAxis = [
            {
                splitLine : {
                    lineStyle:{
                        color:'#EEEEEE'
                    }
                },
                type : 'value',
                nameLocation : 'middle',
                nameTextStyle : {
                    color:'#C2C2C2',
                    fontSize : '11px'
                },
                axisLine:{
                    show : false
                },
                axisTick:{
                    show : false
                },
                axisLabel:{
                    textStyle:{
                        color:'#C2C2C2',
                        fontSize : '11px'
                    }
                }
            }
        ];
        chartData.series = [
            {
                barMaxWidth:30,
                type: 'bar',
                name: '数量',
                data: chartDataPre.data
            }
        ];
        getEChart('line','bs_app_sotre',chartData);
    }
}
var F_Rank = {
    _buff:{},
    _formatTab:function(){
        $('#thinkinggameTl li').each(function(){
            $(this).click(function(){
                var tabName = $(this).html();
                if(!(F_Rank._buff.tabChoose && tabName == F_Rank._buff.tabChoose)){
                    $(this).addClass('change-tab-selected').siblings('li').removeClass('change-tab-selected');
                    F_Rank._getData(tabName);
                }
            });
        });
    },
    _getData:function(type){
        var buffName = '';
        F_Rank._buff.tabChoose = type;
        switch(type){
            case '手游':
                buffName = 'handData';
                break;
            case '页游':
                buffName = 'pageData';
                break;
            case '端游':
                buffName = 'clientData';
                break;
            case '单机':
                buffName = 'pcData';
                break;
        }
        if(F_Rank._buff[buffName]){
            $('#bs_game_rank').html(F_Rank._htmlList(F_Rank._buff[buffName]));
        }else{
            G_Port._ajax('industryGameRank','get',true,'platform='+encodeURIComponent(type),function(){
                    $('#bs_game_rank').html(G_Pre._loading());
                },function(){
                    $('#bs_game_rank').html('');
                },function(data,msg){
                    F_Rank._buff[buffName] = data.game_rank_distri;
                    $('#bs_game_rank').html(F_Rank._htmlList(data.game_rank_distri));
                },function(data,msg,code){
                    $('#bs_game_rank').html(G_Pre._empty(msg));
                }
            )
        }
    },
    _htmlList:function(data){
        var str = '';
        if(data && data.length>0){
            for(var i=0;i<data.length;i++){
                var gameInfo = G_Game._getGame(data[i].project_list);
                if(gameInfo){
                    var num = 1;
                    var typeName = data[i].detail_type == '休闲益智' ? '益智': data[i].detail_type;
                    str += '<ul class="top-list"><span class="top-list-title">'+typeName+'排行榜</span>';
                    for(var d=0;d<data[i].project_list.length;d++){
                        if(gameInfo[data[i].project_list[d]]){
                            if(d>4)break;
                            var key = data[i].project_list[d];
                            var value = gameInfo[data[i].project_list[d]];
                            var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                            var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                            var gameRankImg = '';
                            if(num < 4){
                                gameRankImg = '<b class="lt_fmCxLtTop'+num+' c_img"></b>';
                            }else{
                                gameRankImg = '<b>'+num+'</b>';
                            }
                            num++;
                            var collectClass = 'lt_gmCtOff';
                            if(G_Game._checkCollect(parseInt(key)))collectClass = 'lt_gmCtOn';
                            str += '\
                            <li>\
                                '+gameRankImg+'\
                                <img src="'+value[0]+'">\
                                <p title="'+value[1]+'">'+gameName+'<br><span title="'+value[2]+'" class="c_colorH">'+gameCompany+'</span></p>\
                                <div class="lt_shade">\
                                    <div id="rank_gmCollect'+key+'" onclick="G_Game._setCollect('+key+',\'rank_gmCollect'+key+'\',\'lt_gmCt\')" class="lt_gmCollect c_img '+collectClass+'"></div>\
                                    <a onclick="G_Jump._url(\'light\','+key+')">查看游戏灯塔&gt;</a>\
                                    <a onclick="G_Jump._url(\'atlas\','+key+')">查看游戏图谱&gt;</a>\
                                </div>\
                            </li>';
                        }

                    };
                    str += '</ul>';
                }
            }
        }
        return str;
    }
}
var F_HotWords = {
    _buff:{},
    _getRelation:function(word,data){
        var relation = [];
        for(var i=0;i<data.length;i++){
            if(data[i].keyword == word){
                relation = data[i].related_word_list;
                break;
            }
        }
        F_HotWords._htmlWord(relation);
    },
    _getDetail:function(word){
        if(F_HotWords._buff.wordData){
            F_HotWords._getRelation(word,F_HotWords._buff.wordData);
        }
        F_HotWords._getArticle(word,1);
    },
    _getArticle:function(word,page){
        G_Port._ajax('articleList','get',true,'ignore_bad=1&title_only=1&keyword='+encodeURIComponent(word)+'&index='+(page-1)*G_Page._size+'&limit='+G_Page._size+'&need_preview=0',function(){
                $('#bs_hot_word_articles').html(G_Pre._loading());
                $('.page-list').html('');
            },function(){
                $('#bs_hot_word_articles').html('');
                $('.page-list').html('');
            },function(data,msg){
                if(data.data && data.data.list.length > 0){
                    $('#bs_hot_word_articles').html(F_HotWords._htmlArticle(data.data,word));
                    $('.page-list').html(G_Page._show({total:data.data.total,page:page},'number'));
                    $('.page-list span').each(function(){
                        var isJump = false;
                        $(this).click(function(){
                            if($(this).hasClass('prev')){
                                isJump = true;
                                page = parseInt(page)-1;
                            }else if($(this).hasClass('next')){
                                isJump = true;
                                page = parseInt(page)+1;
                            }else if($(this).hasClass('page-num')){
                                if($(this).html() != '…' && page != $(this).html()){
                                    isJump = true;
                                    page = $(this).html();
                                }
                            }
                            if(isJump){
                                F_HotWords._getArticle(word,page);
                            }
                        });
                    });
                }
            },function(data,msg,code){
                $('#bs_hot_word_articles').html(G_Pre._empty(msg));
                $('.page-list').html('');
            }
        )
    },
    _getData:function(){
        if(F_HotWords._buff.wordData){
            F_HotWords._htmlList(F_HotWords._buff.wordData);
        }else{
            G_Port._ajax('industryArticleHotWords','get',true,null,function(){
                    $('#bs_hot_words_list').html(G_Pre._loading());
                },function(){
                    $('#bs_hot_words_list').html('');
                },function(data,msg){
                    F_HotWords._buff.wordData = data.article_hot_word_distri;
                    var word = F_HotWords._htmlList(data.article_hot_word_distri);
                    F_HotWords._getDetail(word);
                },function(data,msg,code){
                    $('#bs_hot_words_list').html(G_Pre._empty(msg));
                }
            )
        }
    },
    _formatCount:function(data){
        if(F_HotWords._buff.count){
            return F_HotWords._buff.count;
        }else{
            var number = 0;
            for(var i=0;i<data.length;i++){
                number += parseInt(data[i].hot_score);
            }
            return number;
        }
    },
    _formatTr:function(){
        $('#bs_hot_words_list tr').each(function(){
            $(this).click(function(){
                $(this).addClass('mediakeyword-tr-selected').siblings('tr').removeClass('mediakeyword-tr-selected');
                var words = $(this).find('td').eq(1).html();
                F_HotWords._getDetail(words);
            });
        });
    },
    _htmlList:function(data){
        var str = '';
        var word = '';
        if(data && data.length >0){
            var total = F_HotWords._formatCount(data);
            str += '<table>';
            for(var i=0;i<data.length;i++){
                var percent = ((parseInt(data[i].hot_score)/total)*100).toFixed(1);
                percent *= 10;
                percent = percent>100 ? 100 : percent;
                if(i==0){
                    word = data[i].keyword;
                    str +=  '<tr class="mediakeyword-tr-selected">';
                }else{
                    str +=  '<tr>';
                }
                str += '<td>'+(i+1)+'</td><td>'+data[i].keyword+'</td>';
                str += '<td><div class="percent-pic"><div class="percent-line" style="width: '+percent+'%"></div></div></td>';
                str += '</tr>';
            }
            str += '</table>';

        }
        $('#bs_hot_words_list').html(str);
        F_HotWords._formatTr();
        $('.mediakeyword .left .percent-table').perfectScrollbar();
        return word;
    },
    _htmlArticle:function(data,word){
        var str = '';
        str += '\
            <table>\
                <tbody  class="no-overscroll">\
                    <tr>\
                        <th class="style" style="width: 445px;">标题</th>\
                        <th class="user-percent" style="width: 148px;">来源</th>\
                        <th class="game-percent" style="width: 148px;">时间</th>\
                    </tr>\
                </tbody>';

        for(var i=0;i<data.list.length;i++){
            str += '<tr>';
            str += '<td><a href="'+G_Jump._getUrl('detail')+'?t='+encodeURIComponent(data.list[i].id)+'" target="_blank" title="'+data.list[i].source.title+'">'+(G_Common._focusKeywords(word,data.list[i].source.title))+'</a></td>';
            str += '<td>'+G_Article._getSource(data.list[i].source.source)+'</td><td>'+data.list[i].source.post_date+'</td>';
            str += '</tr>';
        }
        return str;
    },
    _htmlWord:function(data){
        var str = '<div class="pre-btn"><button type=""> < </button></div><div class="keyword-mid"><ul id="bs_hot_word_relation">';
        for(var i=0;i<data.length;i++){
            str += i < 3 ? '<li class="item-a">' : '<li>';
            str += '<span>'+(i+1)+'</span><span class="tag">'+data[i]+'</span>';
            str += '</li>';
        }
        str += '</ul></div><div class="next-btn selected-btn"><button type=""> > </button></div>';
        $('.keyword-hot').html(str);

        clickScroll._init($('.keyword-hot .pre-btn'),$('.keyword-hot .next-btn'),$('#bs_hot_word_relation'),'',125,5,5,'selected-btn');
    }
}
var F_MediaArticle = {
    _buff:{},
    _getDateBegin:function(){
        return $('#db1').val();
    },
    _getDateEnd:function(){
        return $('#de1').val();
    },
    _getTopic:function(){
        var begin = F_MediaArticle._getDateBegin();
        var end = F_MediaArticle._getDateEnd();
        G_Port._ajax('industryArticleTopic','get',true,'data_date_start='+begin+'&data_date_end='+end,function(){
                $('#bs_ins_game_user').html(G_Pre._loading());
            },function(){
                $('#bs_ins_game_user').html('');
            },function(data,msg){
                F_MediaArticle._htmlTopic(data.article_topic_distri);
            },function(data,msg,code){
                $('#bs_ins_game_user').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlTopic:function(data){
        var str = '';
        var diff = 0;
        str += '<div class="lt_ltfxArrow c_floatLeft c_img"></div> ';
        str += '<div class="lt_ltfxRect c_floatLeft">';
        for(var i=0;i<data.length;i++){
            if(i>14)break;
            diff = parseInt(i/3)+1;
            str += '<div data-w="'+data[i].topic_id+'" class="c_cursor lt_ltfxR'+diff+' lt_ltfxRP'+(i+1)+'" onclick="G_Jump._go(\'open\',\''+G_Jump._getUrl('article')+'?t=topic&n='+encodeURIComponent(data[i].topic_keywords)+'&d='+data[i].topic_id+'&b='+F_MediaArticle._getDateBegin()+'&e='+F_MediaArticle._getDateEnd()+'\')">';
            str += data[i].topic_keywords;
            str += '</div>';
        }
        str += '</div><div class="clearfix"></div>';
        $('#bs_ins_game_user').html(str);
    },
    _getData:function(type){
        if(F_MediaArticle._buff.articleDisData){
            F_MediaArticle._formatData(F_MediaArticle._buff.articleDisData,type)
        }else{
            G_Port._ajax('industryArticleDistri','get',true,null,function(){
                    $('#bs_ins_article_pie').html(G_Pre._loading());
                },function(){
                    $('#bs_ins_article_pie').html('');
                },function(data,msg){
                    F_MediaArticle._buff.articleDisData = data.article_classify_distri;
                    F_MediaArticle._formatData(data.article_classify_distri,type);
                },function(data,msg,code){
                    $('#bs_ins_article_pie').html(G_Pre._empty(msg));
                }
            )
        }
    },
    _formatData:function(data,type){
        var chartDataPre = {inside:[],outside:[]};
        for(var i=0;i<data.length;i++){
            if(data[i].main_class == type){
                chartDataPre.inside.push({value:data[i].article_num, name:data[i].main_class,selected:true});
                for(var d=0;d<data[i].sub_class_list.length;d++){
                    chartDataPre.outside.push({value:data[i].sub_class_list[d].article_num, name:'('+data[i].main_class+')'+data[i].sub_class_list[d].sub_class});
                }
            }else{
                chartDataPre.inside.push({value:data[i].article_num, name:data[i].main_class});
            }
        }
        F_MediaArticle._chart(chartDataPre);
    },
    _chart:function(data){
        var chartData = {};
        chartData.tooltip = {trigger:'item',formatter:'{b}:{c}({d}%)'};
        chartData.legend = null;
        chartData.grid = {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            containLabel: true
        };
        chartData.xAxis = [];
        chartData.yAxis = [],
        chartData.series = [
            {
                type:'pie',
                hoverAnimation:false,
                selectedMode: 'single',
                radius: [0, '50%'],
                label: {
                    normal: {
                        position: 'inner'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:data.inside
            },
            {
                type:'pie',
                hoverAnimation:false,
                radius: ['70%', '100%'],
                label: {
                    normal: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:data.outside
            }
        ];
        getEChart('pie','bs_ins_article_pie',chartData);
    }
}
var F_Complain = {
    _buff:{chartData:[]},
    _init:{type:['手游','页游','端游','单机']},
    _formatTr:function(){
        $('.bs_user_complain_list').each(function(){
            $(this).find('tr').each(function(index){
                if(index > 0){
                    $(this).click(function(){
                        $(this).addClass('table-selected').siblings('tr').removeClass('table-selected');
                        var type = $(this).find('td').eq(0).html();
                        if(type == '益智')type = '休闲益智';
                        var plat = F_Complain._getPlat();
                        F_Complain._getChartData(plat.name,type,plat.index);
                    });
                }
            });
        });
    },
    _getPlat:function(){
        var plat = {name:'',index:''};
        $('.bs_user_complain_type li').each(function(index){
            if($(this).hasClass('change-tab-selected')){
                plat.name = $(this).html();
                plat.index = index;
            }
        });
        return plat;
    },
    _getData:function(){
        G_Port._ajax('industryComplain','get',true,'scope=all',function(){
                $('.bs_user_complain_list').each(function(){
                    $(this).html(G_Pre._loading());
                });
            },function(){
                $('.bs_user_complain_list').each(function(){
                    $(this).html('');
                });
            },function(data,msg){
                if(data.negtive_distri_all){
                    for(var i=0;i<F_Complain._init.type.length;i++){
                        $('.bs_user_complain_list').eq(i).html(F_Complain._htmlList(data.negtive_distri_all[F_Complain._init.type[i]]));
                        F_Complain._getChartData(F_Complain._init.type[i],'全用户',i);
                    }
                    F_Complain._formatTr();
                }
            },function(data,msg,code){
                $('.bs_user_complain_list').each(function(){
                    $(this).html(G_Pre._empty(msg));
                });
            }
        )
    },
    _getChartData:function(plat,type,index){
        G_Port._ajax('industryComplain','get',true,'scope=detail&platform='+encodeURIComponent(plat)+'&detail_type='+encodeURIComponent(type),function(){
                for(var i=0;i<4;i++){
                    $('#bs_user_complain_chart'+index).html(G_Pre._loading());
                }
            },function(){
                for(var i=0;i<4;i++){
                    $('#bs_user_complain_chart'+index).html('');
                }
            },function(data,msg){
                if(data.negtive_distri_detail){
                    F_Complain._buff.chartData[index] = data.negtive_distri_detail;
                    var chartPreData = {data:[]};
                    var YMax = 0;
                    for(var i=0;i<data.negtive_distri_detail.length;i++){
                        var complainRate = (data.negtive_distri_detail[i].complain_rate*100).toFixed(1);
                        YMax = YMax > parseFloat(complainRate) ? YMax : parseFloat(complainRate);
                        chartPreData.data.push([data.negtive_distri_detail[i].hot_index,complainRate]);
                    }
                    if(!F_Complain._buff['chartDataYMaxNumber'+index]){
                        YMax = (YMax*1.5).toFixed(0);
                        YMax = parseInt(YMax) + parseInt(10-(parseInt(YMax)%10));
                        if(YMax > 100)YMax = 100;
                        F_Complain._buff['chartDataYMaxNumber'+index] = YMax;
                    }
                    F_Complain._chart(chartPreData.data,index);
                }
            },function(data,msg,code){
                for(var i=0;i<4;i++){
                    $('#bs_user_complain_chart'+index).html(G_Pre._empty(msg));
                }
            }
        )
    },
    _chart:function(data,index){
        var chartData = {};
        chartData.tooltip = {
            trigger: 'item',
            formatter: function (params){
                if(params.value){
                    var typeIndex = 0;
                    $('.bs_user_complain_type li').each(function(index){
                        if($(this).hasClass('change-tab-selected')){
                            typeIndex = index;
                        }
                    });
                    if(F_Complain._buff.chartData[typeIndex]){
                        var gameName = '';
                        for(var i=0;i<=F_Complain._buff.chartData[typeIndex].length;i++){
                            if(F_Complain._buff.chartData[typeIndex][i].hot_index == params.value[0]){
                                gameName = G_Game._name(F_Complain._buff.chartData[typeIndex][i].project_id);
                                break;
                            }
                        }
                        return gameName;
                    }else{
                        return '抱怨度：'+params.value[1]+'%';
                    }
                }
            }
        };
        chartData.legend = null;
        chartData.grid = {
            top:5,
            left: 2,
            bottom: 0,
            right: 15,
            containLabel: true
        };
        chartData.xAxis = {
            splitLine: {
                show: false
            },
            type : 'value',
            scale:true,
            axisLine:{
                show : false
            },
            axisTick:{
                show : false
            },
            axisLabel:{
                show:false
            }
        };
        chartData.yAxis = {
            max:F_Complain._buff['chartDataYMaxNumber'+index] ? F_Complain._buff['chartDataYMaxNumber'+index] : 'auto',
            min:0,
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#E5E5E5'
                }
            },
            type : 'value',
            scale:true,
            axisLine:{
                show : false
            },
            axisLabel:{
                textStyle:{
                    color:'#C2C2C2',
                    fontSize : '11px'
                },
                formatter: '{value}%'
            }
        };
        chartData.series = [
            {
                name:'',
                type:'scatter',
                data: data
            }
        ];
        getEChart('scatter','bs_user_complain_chart'+index,chartData);
    },
    _htmlList:function(data){
        var str = '';
        if(data){
            str = '<table><tr><th class="style">游戏类别</th><th class="user-percent" style="width: 100px;">抱怨用户(%)</th><th class="game-percent" style="width: 100px;">负面反馈(%)</th></tr>';
            for(var i=0;i<data.length;i++){
                var typeName = data[i].detail_type == '休闲益智' ? '益智': data[i].detail_type;
                str += i==0 ? '<tr class="table-selected">' : '<tr>';
                str += '<td>'+typeName+'</td><td>'+(data[i].complain_rate*100).toFixed(1)+'</td><td>'+(data[i].negative_post_rate*100).toFixed(1)+'</td>';
                str += '</tr>';
            }
            str += '</table>';
        }
        return str;
    }
}
var F_Distribute = {
    _buff:{},
    _init:{type:['单机','端游','页游','手游'],classify:['休闲益智','体育','冒险','动作','射击','模拟','竞技游戏','竞速','策略','角色扮演','音乐游戏'],classifyShow:['益智','体育','冒险','动作','射击','模拟','竞技游戏','竞速','策略','角色扮演','音乐游戏']},
    _getData:function(){
        G_Port._ajax('industryTypeDistri','get',true,null,function(){
                $('#bs_game_distribute').html(G_Pre._loading());
                $('#bs_game_dis_list').html(G_Pre._loading());
            },function(){
                $('#bs_game_distribute').html('');
                $('#bs_game_dis_list').html('');
            },function(data,msg){
                if(data.type_num_distri){
                    F_Distribute._buff.gameData = data.type_num_distri;
                    var chartData = [];
                    var chartGame = {x_index:0,y_index:3};
                    var color = {'单机':'#AEDD8C','手游':'#72C4FF','端游':'#FFA6A5','页游':'#BFA4F1'}
                    $.each(data.type_num_distri,function(key,value){
                        var y_index = $.inArray(key,F_Distribute._init.type);
                        if(y_index > -1){
                            for(var i=0;i<value.length;i++){
                                var x_index = $.inArray(value[i].detail_type,F_Distribute._init.classify);
                                if(x_index > -1){
                                    chartData.push(
                                        {
                                            value:[x_index,y_index,parseInt(value[i].game_rate*100).toFixed(0)],
                                            itemStyle:{
                                                normal:{
                                                    color:color[key]
                                                }
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    });
                    F_Distribute._chart(chartData);
                    F_Distribute._gameList(chartGame.x_index,chartGame.y_index);
                }
            },function(data,msg,code){
                $('#bs_game_distribute').html(G_Pre._empty(msg));
                $('#bs_game_dis_list').html(G_Pre._empty(msg));
            }
        )
    },
    _gameList:function(x_index,y_index){
        var games = [];
        if(F_Distribute._buff.gameData && F_Distribute._init.classify[x_index] && F_Distribute._init.type[y_index]){
            var x_name = F_Distribute._init.classify[x_index];
            var y_name = F_Distribute._init.type[y_index];
            $.each(F_Distribute._buff.gameData,function(key,value){
                if(key == y_name){
                    for(var i=0;i<value.length;i++){
                        if(value[i].detail_type == x_name){
                            games = value[i].talent_game_list;
                            break;
                        }
                    }
                }
            })
        }
        if(games.length > 0){
            var gameInfo = G_Game._getGame(games);
            if(gameInfo){
                if(x_name == '休闲益智')x_name = '益智';
                var str = '<span class="top-list-title">'+y_name+'('+x_name+')排行榜</span>';
                var i = 1;
                for(var d=0;d<games.length;d++){
                    if(gameInfo[games[d]]){
                        var key = games[d];
                        var value = gameInfo[games[d]];
                        var gameName = (value[1].length > 15) ? value[1].substr(0,15)+'.' : value[1];
                        var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0,15)+'.' : value[2]):'';
                        var gameRankImg = '';
                        if(i < 4){
                            gameRankImg = '<b class="lt_fmCxLtTop'+i+' c_img"></b>';
                        }else{
                            gameRankImg = '<b>'+i+'</b>';
                        }
                        i++;
                        var collectClass = 'lt_gmCtOff';
                        if(G_Game._checkCollect(parseInt(key)))collectClass = 'lt_gmCtOn';
                        str += '\
                            <li>\
                                '+gameRankImg+'\
                                <img src="'+value[0]+'">\
                                <p title="'+value[1]+'">'+gameName+'<br><span title="'+value[2]+'" class="c_colorH">'+gameCompany+'</span></p>\
                                <div class="lt_shade">\
                                    <div id="rank_gmCollect'+key+'" onclick="G_Game._setCollect('+key+',\'rank_gmCollect'+key+'\',\'lt_gmCt\')" class="lt_gmCollect c_img '+collectClass+'"></div>\
                                    <a onclick="G_Jump._url(\'light\','+key+')">查看游戏灯塔&gt;</a>\
                                    <a onclick="G_Jump._url(\'atlas\','+key+')">查看游戏图谱&gt;</a>\
                                </div>\
                            </li>';
                    }
                };
                $('#bs_game_dis_list').html(str);
            }
        }
    },
    _chart:function(data){
        var chartData = {};
        chartData.tooltip = {
            trigger: 'item',
            formatter: function (params) {
                if(params.value){
                    var xName = F_Distribute._init.classify[params.value[0]] == '休闲益智' ? '益智' : F_Distribute._init.classify[params.value[0]];
                    return F_Distribute._init.type[params.value[1]]+'('+xName+')：'+params.value[2]+'%';
                }
            }
        };
        chartData.legend = {};
        chartData.grid = {
            top:5,
            left: 80,
            left: 80,
            bottom: 20,
            right: 25,
            containLabel: true
        };
        chartData.xAxis = {
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#E5E5E5'
                }
            },
            type : 'category',
            boundaryGap : false,
            data : F_Distribute._init.classifyShow,
            axisLine:{
                show : false
            },
            axisLabel:{
                textStyle:{
                    color:'#C2C2C2',
                    fontSize : '11px'
                },
                interval:'0'
            }
        };
        chartData.yAxis = {
            splitLine: {
                show: false
            },
            type : 'category',
            data: F_Distribute._init.type,
            axisLine:{
                show : false
            },
            axisLabel:{
                textStyle:{
                    color:'#C2C2C2',
                    fontSize : '11px'
                }
            }
        };
        chartData.series = [
            {
                name:'占比(%)',
                type:'scatter',
                symbolSize: function (val) {
                    return val[2] * 2;
                },
                data: data
            }
        ];
        getEChart('scatter','bs_game_distribute',chartData);
    }
}
var F_GameActivity = {
    _getData:function(){
        G_Port._ajax('industryGameType','get',true,null,function(){
                $('.bs_game_type_show').each(function(){
                    $(this).html(G_Pre._loading());
                });
            },function(){
                $('.bs_game_type_show').each(function(){
                    $(this).html('');
                });
            },function(data,msg){
                if(data.game_type_distri){
                    $.each(data.game_type_distri,function(key,value){
                        var dom;
                        switch(key){
                            case '单机':
                                dom = $('.bs_game_type_show').eq(3);
                                break;
                            case '手游':
                                dom = $('.bs_game_type_show').eq(0);
                                break;
                            case '端游':
                                dom = $('.bs_game_type_show').eq(2);
                                break;
                            case '页游':
                                dom = $('.bs_game_type_show').eq(1);
                                break;
                        }
                        dom.html(F_GameActivity._html(value));
                    })
                }
            },function(data,msg,code){
                $('.bs_game_type_show').each(function(){
                    $(this).html(G_Pre._empty(msg));
                });
            }
        )
    },
    _html:function(data){
        var str = '<table><tr><th class="style">游戏类别</th><th class="game-percent">游戏数占比(%)</th><th class="user-percent">用户占比(%)</th><th>较昨日</th><th class="hot-post">活跃帖子数</th><th>较昨日</th></tr>';
        for(var i=0;i<data.length;i++){
            var user = F_GameActivity._format((data[i].user_rate_growth*100).toFixed(1));
            var game = F_GameActivity._format((data[i].game_rate_growth*100).toFixed(1));
            var title = F_GameActivity._format((data[i].post_num_growth*100).toFixed(1));
            var typeName = data[i].detail_type == '休闲益智' ? '益智' : data[i].detail_type;
            str += '\
                <tr>\
                    <td>'+typeName+'</td>\
                    <td>'+(data[i].game_rate*100).toFixed(1)+'</td>\
                    <td>'+(data[i].user_rate*100).toFixed(1)+'</td>\
                    <td>'+user+'</td>\
                    <td>'+data[i].post_num+'</td>\
                    <td>'+title+'</td>\
                </tr>';
        }
        str += '</table>';
        return str;
    },
    _format:function(number){
        if(number > 0){
            number = '<b class="up-hot">+'+number+'%</b>';
        }else if(number < 0){
            number = '<b class="down-hot">'+number+'%</b>';
        }else{
            number = '<b>'+number+'%</b>';
        }
        return number;
    }
}
var F_GameMap = {
    _getData:function(){
        G_Port._ajax('industryUserProvince','get',true,null,function(){
                $('#bs_game_map').html(G_Pre._loading());
            },function(){
                $('#bs_game_map').html('');
            },function(data,msg){
                if(data.province_distri && data.province_distri.length > 0){
                    var proviceData = [];
                    var bigNumber = 0;
                    for(var i=0;i<data.province_distri.length;i++){
                        var number = ((data.province_distri[i].active_rate)*100).toFixed(1);
                        proviceData.push({name:data.province_distri[i].province,value:number});
                        if(parseFloat(number) > parseFloat(bigNumber))bigNumber = number;
                    }
                    bigNumber = Math.ceil(bigNumber);
                    F_GameMap._chart(proviceData,bigNumber);
                }
            },function(data,msg,code){
                $('#bs_game_map').html(G_Pre._empty(msg));
            }
        )
    },
    _chart:function(data,bigNumber){
        var chartData = {};
        chartData.tooltip = {trigger:'item'};
        chartData.legend = null;
        chartData.visualMap = {
            min: 0,
            max:bigNumber,
            left: 'right',
            top: 'bottom',
            text: ['高(%)','低(%)'],
            calculable: true,
            color:['#51c7ef','#91cfe4','#dde7ea']
        }
        chartData.series = [
            {
                name: '活跃玩家占比(%)',
                type: 'map',
                mapType: 'china',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                roam: false,
                itemStyle:{
                    normal:{
                        label:{show:false},
                        borderWidth:1,
                        borderColor:'#ffffff'
                    },
                    emphasis:{label:{show:true}}
                },
                data:data
            }
        ];
        getEChart('map','bs_game_map',chartData);
    }
}
var F_General = {
    _buff:{},
    _formatCho:function(){
        $('.bs_summary_change li').each(function(index){
            $(this).click(function(){
                $(this).addClass('change-tab-selected').siblings().removeClass('change-tab-selected');
                $('.bs_summary_chart').eq(index).show().siblings('.bs_summary_chart').hide();
                switch(index){
                    case 1:
                        if($('.bs_summary_chart').eq(index).html() == ''){
                            F_General._getThread();
                        }
                        break;
                }
            });
        });
    },
    _getData:function(){
        G_Port._ajax('industryGeneral','get',true,'scope=realtime',null,null,function(data,msg){
                if(data){
                    C_Rand = (data.title_distri_realtime && data.title_distri_realtime.length>0) ? data.title_distri_realtime[data.title_distri_realtime.length-1].title_num : 0;
                    C_Number = (data.title_num_today_total-C_Rand) < 0 ? C_Rand : (data.title_num_today_total-C_Rand);
                    F_General._html(data);
                    F_Common._number();
                    if(data.title_distri_realtime && data.title_distri_realtime.length > 0){
                        var chartDataPre = {xAxis:[],data:[],xData:[],xDate:[],allDate:[],allData:[]};
                        var baseData = data.title_distri_realtime;
                        var maxNumber = 0;
                        var minNumber = 1000000000;
                        for(var i=0;i<baseData.length;i++){
                            var dateTime = baseData[i].data_time.toString().replace(':00','');
                            if(i<30){
                                chartDataPre.xAxis.push(dateTime);
                                chartDataPre.data.push(baseData[i].title_num);
                            }
                            maxNumber = maxNumber>parseInt(baseData[i].title_num) ? maxNumber : baseData[i].title_num;
                            minNumber = minNumber<parseInt(baseData[i].title_num) ? minNumber : baseData[i].title_num;
                            chartDataPre.allDate.push(dateTime);
                            chartDataPre.allData.push(baseData[i].title_num);
                        }
                        F_General._chartActivity(chartDataPre,maxNumber,minNumber);
                    }
                }
            },null
        )
    },
    _getThread:function(){
        if(F_General._buff.threadData){
            F_General._getChart(F_General._buff.threadData);
        }else{
            G_Port._ajax('industryGeneral','get',true,'scope=day',function(){
                    $('#bs_summary_forum').html(G_Pre._loading());
                    $('#bs_summary_channel').html(G_Pre._loading());
                    $('#bs_summary_article').html(G_Pre._loading());
                },function(){
                    $('#bs_summary_forum').html('');
                    $('#bs_summary_channel').html('');
                    $('#bs_summary_article').html('');
                },function(data,msg){
                    F_General._buff.threadData = data.industry_distri_day;
                    F_General._getChart(data.industry_distri_day);
                },function(data,msg,code){
                    $('#bs_summary_forum').html(G_Pre._empty(msg));
                    $('#bs_summary_channel').html(G_Pre._empty(msg));
                    $('#bs_summary_article').html(G_Pre._empty(msg));
                }
            )
        }
    },
    _getChart:function(data){
        if(data && data.length>0){
            var chartDataPre = {'xAxis':[],'dataF':[],'dataC':[],'dataA':[],'dataFMax':0};
            for(var i=0;i<data.length;i++){
                chartDataPre.xAxis.push(data[i].data_date);
                chartDataPre.dataF.push(data[i].forum_post_num);
                chartDataPre.dataFMax = chartDataPre.dataFMax > parseInt(data[i].forum_post_num) ? chartDataPre.dataFMax : data[i].forum_post_num;
                chartDataPre.dataC.push(data[i].chan_post_num);
                chartDataPre.dataA.push(data[i].article_post_num);
            }
            F_General._setChart({data:chartDataPre.dataA,xAxis:chartDataPre.xAxis},'article');
            F_General._setChart({data:chartDataPre.dataC,xAxis:chartDataPre.xAxis},'channel');
            F_General._setChart({data:chartDataPre.dataF,xAxis:chartDataPre.xAxis,dataFMax:chartDataPre.dataFMax},'forum');
        }
    },
    _setChart:function(data,type){
        var chartData = {};
        var dom = '';
        var lineName = '';
        switch(type){
            case 'forum':
                lineName = '帖子数';
                dom = 'bs_summary_forum';
                break;
            case 'channel':
                lineName = '发布数';
                dom = 'bs_summary_channel';
                break;
            case 'article':
                lineName = '发布数';
                dom = 'bs_summary_article';
                break;
        }
        chartData.tooltip = {trigger:'axis'};
        chartData.legend = {};
        chartData.grid = {
            left: '2%',
            right: '2%',
            bottom: '2%',
            top: '2%',
            containLabel: true
        }
        chartData.xAxis = [
            {
                splitLine : {
                    show:false
                },
                type : 'category',
                boundaryGap : false,
                data : data.xAxis,
                axisLine:{
                    show : false
                },
                axisTick:{
                    show : false
                },
                axisLabel:{
                    textStyle:{
                        color:'#C2C2C2',
                        fontSize : '11px'
                    },
                    formatter: function (value, index) {
                        return G_Date._dateChart(value);
                    }
                }
            }
        ];
        chartData.yAxis = [
            {
                max:data.dataFMax ? (data.dataFMax*2) : null,
                splitLine : {
                    lineStyle:{
                        color:'#EEEEEE'
                    }
                },
                type : 'value',
                nameLocation : 'middle',
                nameTextStyle : {
                    color:'#C2C2C2',
                    fontSize : '11px'
                },
                nameGap:25,
                axisLine:{
                    show : false
                },
                axisTick:{
                    show : false
                },
                axisLabel:{
                    textStyle:{
                        color:'#C2C2C2',
                        fontSize : '11px'
                    }
                }
            }
        ];
        chartData.series = [
            {
                showSymbol:false,
                name:lineName,
                type:'line',
                data:data.data
            }
        ];
        getEChart('line',dom,chartData);
    },
    _chartActivity:function(data,maxNumber,minNumber){
        var chartData = {allData:data.allData,allDate:data.allDate,xData:data.data,xDate:data.xAxis};
        chartData.tooltip = {trigger:'axis'};
        chartData.legend = null;
        chartData.grid = {
            left: '2%',
            right: '2%',
            bottom: '2%',
            top: '2%',
            containLabel: true
        }
        chartData.xAxis = [
            {
                splitLine : {
                    show:false
                },
                type : 'category',
                boundaryGap : false,
                data : data.xAxis,
                axisLine:{
                    show : false
                },
                axisTick:{
                    show : false
                },
                axisLabel:{
                    textStyle:{
                        color:'#C2C2C2',
                        fontSize : '11px'
                    }
                }
            }
        ];
        chartData.yAxis = [
            {
                max:(maxNumber*1.2).toFixed(0),
                min:(minNumber/1.5).toFixed(0),
                splitLine : {
                    show:false
                },
                type : 'value',
                nameLocation : 'middle',
                nameTextStyle : {
                    color:'#C2C2C2',
                    fontSize : '11px'
                },
                nameGap:25,
                axisLine:{
                    show : false
                },
                axisTick:{
                    show : false
                },
                axisLabel:{
                    textStyle:{
                        color:'#C2C2C2',
                        fontSize : '11px'
                    }
                }
            }
        ];
        chartData.series = [
            {
                showSymbol:false,
                hoverAnimation: false,
                areaStyle: {normal: {}},
                name:'发帖数',
                type:'line',
                data:data.data
            }
        ];
        getEChart('activity','bs_summary_activity',chartData);
    },
    _percent:function(today,yesterday){
        today = parseInt(today);
        yesterday = parseInt(yesterday);
        var percent = (((today/yesterday)-1)*100).toFixed(2);
        return today>=yesterday ? '+'+percent+'%' : percent+'%';
    },
    _html:function(data){
        $('.bs_summary li').each(function(index){
            var percent = 0;
            var today_a = 0;
            var yesterday_c = 0;
            var yesterday_a = 0;
            switch(index){
                case 0:
                    percent = F_General._percent(data.title_num_today_total,data.title_num_yesterday_basis);
                    yesterday_c = data.title_num_yesterday_basis;
                    yesterday_a = data.title_num_yesterday_total;
                    break;
                case 1:
                    percent = F_General._percent(data.channel_num_today_total,data.channel_num_yesterday_basis);
                    today_a = data.channel_num_today_total;
                    yesterday_c = data.channel_num_yesterday_basis;
                    yesterday_a = data.channel_num_yesterday_total;
                    break;
                case 2:
                    percent = F_General._percent(data.article_num_today_total,data.article_num_yesterday_basis);
                    today_a = data.article_num_today_total;
                    yesterday_c = data.article_num_yesterday_basis;
                    yesterday_a = data.article_num_yesterday_total;
                    break;
            }
            index == 0 ? $(this).find('b').html(percent) : $(this).find('.post-num').html(today_a+'<b>'+percent+'</b>');
            $(this).find('.post-num-compare').html('昨日同比发布数:<b>'+yesterday_c+'</b>');
            $(this).find('.post-num-all').html('昨日全天发布数:<b>'+yesterday_a+'</b>');
        });
    }
}
var F_Hot = {
    _getHotToday:function(){
        G_Port._ajax('articleList','get',true,'data_date_start='+dateEnd+'&data_date_end='+dateEnd+'&order_by_field=score&order_type=desc&index=0&limit=6',function(){
                $('#bs_hot_today').html(G_Pre._loading());
            },function(){
                $('#bs_hot_today').html('');
            },function(data,msg){
                if(data.data && data.data.list.length>0){
                    $('#bs_hot_today').html(F_Hot._htmlList(data.data.list));
                }
            },function(data,msg,code){
                $('#bs_hot_today').html(G_Pre._empty(msg));
            }
        )
    },
    _getHotRecent:function(){
        G_Port._ajax('articleList','get',true,'data_date_start='+dateBegin+'&data_date_end='+dateEnd+'&order_by_field=score&order_type=desc&index=0&limit=6',function(){
                $('#bs_hot_recet').html(G_Pre._loading());
            },function(){
                $('#bs_hot_recet').html('');
            },function(data,msg){
                if(data.data && data.data.list.length>0){
                    $('#bs_hot_recet').html(F_Hot._htmlList(data.data.list));
                }
            },function(data,msg,code){
                $('#bs_hot_recet').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlList:function(data){
        var str = '';
        for(var i=0;i<data.length;i++){
            if(i>5)break;
            var articleTitle = data[i].source.title;
            str += '<li class="article_list" title="'+data[i].source.title+'"><a href="'+G_Jump._getUrl('detail')+'?t='+encodeURIComponent(data[i].id)+'" target="_blank"><span class="guidelines-date">'+data[i].source.post_date+'</span><span class="guide-title">'+articleTitle+'</span></a></li>';
        }
        return str;
    }
}


