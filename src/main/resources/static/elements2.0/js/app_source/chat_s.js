requirejs.config({
    shim: {
        'layer': ['jquery'],
        'store.min': ['jquery'],
        'background':{
            deps:['base']
        }
    },
    baseUrl: 'elements2.0/js/lib',
    paths: {
        'jquery' : './jquery-1.9.1.min',
        'app': '../app',
        'base': '../app/base',
        'background': '../app/background'
    }
});
require(['jquery','layer','store.min','dateRange','base','background','app/inside','app/outside'], function(){
    store = require('store.min');
    B_Login._checkUpdate();
    if(B_User._isDemoUser()){
        parent.B_Login._openLogin('background');
    }else{
        M_Init._clean();
        var $_GET = B_Common._getUrl('query');
        if(isNaN($_GET.i)){
            parent.B_Pop._init('close');
            parent.B_Pop._init('msg',{'content':'选择的数据不存在，请刷新页面重试'});
        }else{
            M_Init._dataCache['infoId'] = $_GET.i;
        }
        if(!$_GET.b){
            M_Init._dataCache['begin'] = M_Init._dateChoose['begin'];
        }else{
            M_Init._dataCache['begin'] = B_Common._decodeUrl($_GET.b);
        }
        if(!$_GET.e){
            M_Init._dataCache['end'] = M_Init._dateChoose['end'];
        }else{
            M_Init._dataCache['end'] = B_Common._decodeUrl($_GET.e);
        }
        F_Chat_Date._htmlInit();
    }
});
var F_Chat_Date = {
    _quickChoose:function () {
        $('.tk_fast_choose span').each(function(){
            $(this).click(function(){
                var type = $(this).attr('data-t');
                var begin = '';
                var end = B_Date._getDiffDate('',0);
                switch(type+''){
                    case '1':
                        begin = B_Date._getDiffDate('',-365);
                        break;
                    case '2':
                        begin = B_Date._getDiffDate('',-180);
                        break;
                    case '3':
                        begin = B_Date._getDiffDate('',-90);
                        break;
                    case '4':
                        begin = B_Date._getDiffDate('',-30);
                        break;
                    case '5':
                        begin = B_Date._getDiffDate('',-7);
                        break;
                    case '6':
                        begin = B_Date._getDiffDate('',0);
                        break;
                }
                $('#dc1').html(begin+' 至 '+end);
                $('#db1').val(begin);
                $('#de1').val(end);
            });
        });
    },
    _dateChoose:function(begin,end){
        B_Date._chooseSection({'autoCommit':true,'todayValid':true},1,begin,end);
    },
    _workUpdate:function(postData){
        B_Port._ajax('talkUpdate','post',true,postData,function(){
            B_Common._btnTextStatus('disable',$('#btn_replace_confirm'),{'disable':'提交中...'});
        },function(){
            B_Common._btnTextStatus('normal',$('#btn_replace_confirm'),{'normal':'确认'});
        },function(data,msg){
            parent.F_Chat_Info._pageRefresh();
            parent.B_Pop._init('msg',{'content':msg});
            B_Pop._init('closeFrame');
        },function(data,msg,code){
            B_Pop._init('alert',{content:B_Pre._empty(msg)});
        })
    },
    _htmlInit:function () {
        F_Chat_Date._dateChoose(M_Init._dataCache['begin'],M_Init._dataCache['end']);
        F_Chat_Date._quickChoose();

        $('#btn_replace_cancel').click(function () {
            parent.B_Pop._init('close');
        });
        $('#btn_replace_confirm').click(function(){
            var beginDate = $('#db1').val()+' 00:00:00';
            var endDate = $('#de1').val()+' 23:59:59';
            var postData = {};
            postData['info_id'] = M_Init._dataCache['infoId'];
            postData['start_date'] = beginDate;
            postData['end_date'] = endDate;
            postData = B_Common._postData(postData);
            F_Chat_Date._workUpdate(postData);
        });
    }
}


