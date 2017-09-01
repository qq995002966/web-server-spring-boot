var F_Chat_Entrance = {
    _init:function () {
        B_Login._checkUpdate();
        M_HeadFoot._headShow(2);
        M_Dom._menuList('舆情分析','3-1-4');
        if(B_User._isDemoUser()){
            B_Login._openLogin('background');
        }else {
            M_Init._clean();
            if(!B_Game._checkAuthChat()){
                $('#headerTop').html('');
                M_Game._htmlGameVisitHide('outsideChat');
                F_Chat_Info._domDemo();
            }else{
                M_Game._htmlGameVisitHide('outsideChat');
                F_Chat_Info._domInit();
                $('#nt_qq_show').click(function(){
                    B_Pop._init('close');
                    B_Pop._init('open',{'type':2,'scroll':true,'title':'如何导出QQ聊天记录','width':'950px','height':'600px','shift':2,'content':B_Jump._getUrl('notices')+'?t=chat'},'');
                });
                F_Chat_Common._upload('#tk_upload_btn');
                F_Chat_Info._getList(1);
            }
        }
    }
}
var F_Chat_Info = {
    _domDemo:function () {
        var str = '\
                    <img src="'+B_Common._cdnImgUrl()+'2.0/userlimit/talk.png" alt="" class="adver-bg">\
                    <div class="adver-des">\
                        <h3>聊天分析</h3>\
                        <p>基于自然语言处理技术，离线解析玩家QQ聊天记录，帮助项目组的运营人员在维护游戏的玩家官方群时，及时跟进玩家的讨论内容，正负面反馈和讨论话题。此外，聊天分析还能分析出活跃玩家的发言偏好，大大降低了运营人员的人力成本。</p>\
                        <button class="tg-main-btn" onclick="B_Jump._go(\'target\',\'login\')">登录后使用</button>\
                    </div>';

        $('#contentPart').html(str);
    },
    _domInit:function () {
        var str = '';
        str += '\
            <div class="tg-table-layout blockpart col-lg-12 col-md-12 col-sm-12 col-xs-12 talk">\
                <h3>聊天分析任务</h3>\
                <div class="boxshadow tg-table-content" id="talk">\
                    <div class="tg-table-wrap tg-table-no-padding tg-height-hight">\
                        <div class="table-out-wrap" id="lt_item_list"></div>\
                        <ul class="tg-page-list" id="lt_forum_page"></ul>\
                    </div>\
                    <div class="up_progress b_none">\
                        <div class="up_percent">0%</div>\
                        <div class="up_progress-bar">\
                            <div class="qq"></div>\
                        </div>\
                        <div class="up_notice">正在上传中...</div>\
                    </div>\
                    <div class="tk_setup b_none">\
                        <div class="b_marginB30 tk_setup_title">请选择您希望解析聊天记录的时间段：</div>\
                        <div class="b_marginB20 b_relative tk_date_area">\
                            <i class="glyphicon glyphicon-calendar"></i>\
                            <span class="date-range b_borderRadius" id="dc1"></span>\
                            <input id="db1" type="hidden"><input id="de1" type="hidden">\
                        </div>\
                        <div class="tk_fast_choose b_marginB30">\
                            快速选择：　<span data-t="1">近一年</span>　|　<span data-t="2">近六月</span>　|　<span data-t="3">近三月</span>　|　<span data-t="4">近一月</span>　|　<span data-t="5">近一周</span>　|　<span data-t="6">今天</span>\
                        </div>\
                        <div class="text-center">\
                            <button type="button" class="tg-main-btn" id="btn_replace_confirm">确认</button>　<button type="button" class="tg-assist-btn" id="btn_replace_cancel">取消</button>\
                        </div>\
                    </div>\
                </div>\
            </div>';

        $('#headerTop').html('<span>提示：我们仅对聊天结果做分析和展示，不会截取任何隐私内容，请放心使用。<a id="nt_qq_show">如何导出QQ聊天记录？</a></span><button class="tg-main-btn" id="tk_upload_btn">上传QQ聊天记录</button>');
        $('#mainContent').addClass('alert-task-part');
        $('#ct_main_area').html(str);

    },
    _cache:{},
    _workDel:function(id){
        var postData = {};
        postData['info_id'] = id;
        postData = B_Common._postData(postData);
        B_Port._ajax('talkDel','post',true,postData,function(){
            B_Pop._init('load',{'type':1,'time':10});
        },function(){
            B_Pop._init('close');
        },function(data,msg){
            B_Pop._init('msg',{'content':'删除成功'});
            setTimeout(function(){
                F_Chat_Info._pageRefresh('del');
            },1000);
        },function(data,msg,code){
            B_Pop._init('alert',{content:B_Pre._empty(msg)});
        })
    },
    _pageRefresh:function(type){
        var page = F_Chat_Info._cache['page'];
        switch(type){
            case 'del':
                F_Chat_Info._cache['total'] = F_Chat_Info._cache['total'] > 0 ? (F_Chat_Info._cache['total']-1) : 0;
                page = Math.ceil(F_Chat_Info._cache['total']/B_Page._size);
                page = F_Chat_Info._cache['page'] <= page ? F_Chat_Info._cache['page'] : page;
                break;
        }
        F_Chat_Info._getList(page);
    },
    _getList:function(page){
        F_Chat_Info._cache['page'] = page;
        var index = (page-1)*B_Page._size;
        var domItemList = $('#lt_item_list');
        var domForumPage =  $('#lt_forum_page');
        var postData = {};
        postData['index'] = index;
        postData['limit'] = B_Page._size;
        postData = B_Common._postData(postData);
        B_Port._ajax('talkInfo','get',true,postData,function(){
                domItemList.html(B_Pre._loading('b_padding30'));
                domForumPage.html('');
            },function(){
                domItemList.html('');
                domForumPage.html('');
            },
            function(data, msg){
                if(data.get && data.get.length > 0){
                    domItemList.html(F_Chat_Info._htmlList(data.get,index));
                    $('.bs_reupload').each(function(){
                        var infoId = $(this).attr('data-i');
                        F_Chat_Common._reUpload(infoId);
                    });
                    F_Chat_Info._cache['total'] = data.total;
                    domForumPage.html(B_Page._show({total:data.total,page:page},'number'));
                    B_Page._click(page,function (page) {
                        F_Chat_Info._getList(page);
                        B_Jump._top();
                    });
                }else{
                    domItemList.html(B_Pre._empty('请上传聊天记录'));
                }
            },
            function(data, msg, code){
                domItemList.html(B_Pre._empty(msg));
            }
        )
    },
    _htmlList:function(data,numberBegin){
        var str = '<table class="tg-table table table-bordered">\
            <thead class="boxshadow">\
            <tr>\
            <th>来源</th>\
            <th>文件名</th>\
            <th>上传时间</th>\
            <th>解析状态</th>\
            <th>操作</th>\
        </tr></thead><tbody>';
        //'-1: 文件上传成功；1：文件解析中；2：文件解析成功；3：文件解析失败；4：生成分析挖掘任务成功；5：文件分析挖掘中；6：文件分析挖掘成功；7：文件分析挖掘失败'；8：解析成功，但是是空的'
        for(var i=0;i<data.length;i++){
            var fileName = decodeURIComponent(data[i].file_name);
            var workBtn = [];
            var status = '<td></td>';
            var sourceImg = '';
            switch(data[i].source_type+''){
                case '10':
                    sourceImg = '<i class="tg-icon tg-talk-qq"></i>QQ';
                    break;
            }
            var workBtnSet = '<button class="tg-main-btn" onclick="F_Chat_Common._openAdd('+data[i].info_id+',\''+fileName+'\',\''+data[i].start_date+'\',\''+data[i].end_date+'\')">解析设置</button>';
            var workBtnDel = '<button class="tg-assist-btn" onclick="F_Chat_Common._delConfirm('+data[i].info_id+',\''+fileName+'\')">删除解析</button>'
            var workBtnRefresh = '<button class="tg-main-btn" onclick="F_Chat_Info._pageRefresh()">更新状态</button>';
            switch(data[i].status+''){
                case '-1':
                    status = '<td class="doc no-resolve"><span>未解析</span></td>';
                    workBtn.push('<button class="tg-main-btn" onclick="F_Chat_Common._openAdd('+data[i].info_id+',\''+fileName+'\')">开始解析</button>');
                    workBtn.push(workBtnDel);
                    break;
                case '3':
                case '7':
                    status = '<td class="doc failed"><i class="tg-icon tg-talk-resolve"></i> <span>解析失败</span></td>';
                    workBtn.push('<button id="tk_reupload_btn_'+data[i].info_id+'" data-i="'+data[i].info_id+'" title="重新上传" class="tg-main-btn bs_reupload">重新上传</button>');
                    workBtn.push(workBtnDel);
                    break;
                case '6':
                case '8':
                    status = '<td class="doc"><i class="tg-icon tg-talk-doc"></i> <a href="'+B_Jump._getUrl('outsideChatResult',{'gameId':data[i].info_id})+'">查看分析报告</a></span></td>';
                    workBtn.push(workBtnSet);
                    workBtn.push(workBtnDel);
                    break;
                default:
                    status = '<td class="doc resolving"><i class="tg-icon tg-talk-resolve"></i> <span>解析中..</span></td>';
                    workBtn.push(workBtnRefresh);
                    break;
            }
            workBtn = workBtn.length > 0 ? workBtn.join('　') : '';
            str += '<tr>';
            str += '<td>'+sourceImg+'</td>';
            str += '<td>'+fileName+'</td>';
            str += '<td>'+data[i].dt_create_time+'</td>';
            str += status;
            str += '<td>';
            str += workBtn;
            str += '</td></tr>';
        }
        str += '</tbody></table>';
        return str;
    }
}
var F_Uploader = {};
var F_Chat_Common = {
    _uploadConstruct:function (dom) {
        var option = {
            auto: true,
            swf: 'elements2.0/js/lib/Uploader.swf',
            server: '',
            accept: {
                title: 'intoTypes',
                extensions: 'txt,csv',
                mimeTypes: '.txt,.csv'
            },
            pick: dom,
            formData: {}
        };
        F_Uploader[dom] = WebUploader.create(option);
    },
    _getParam:function (obj,postData,dom) {
        B_Port._ajax('ossChatPolicy','get',false,postData,function () {
            F_Chat_Common._progressShow();
        },null,function(data,msg){
            if (data) {
                var ossData = {};
                ossData["key"] = data['upload_file_name'];
                ossData["policy"] = data['policy'];
                ossData["OSSAccessKeyId"] = data['accessid'];
                ossData["success_action_status"] = '200';
                ossData["callback"] = data['callback'];
                ossData["signature"] = data['signature'];
                obj.options.formData = ossData;
                obj.options.server = data['host'];
                F_Chat_Common._uploading(dom);
            }else{
                B_Pop._init('msg', {content: '获取数据失败，请刷新重试！'});
                return false;
            }
        },function(data,msg,code){
            B_Pop._init('alert',{content:B_Pre._empty(msg)});
            return false;
        })
    },
    _reUpload:function(id){
        F_Chat_Common._upload('#tk_reupload_btn_'+id,id);
    },
    _upload:function(dom,id) {
        var infoId = 0;
        if (id)infoId = id;
        F_Chat_Common._uploadConstruct(dom);
        F_Uploader[dom].on('beforeFileQueued', function (file) {
            if (B_User._isDemoUser()) {
                B_Login._openLogin('background');
                return false;
            }
            if (file.size == 0) {
                B_Pop._init('msg', {content: '不能上传空文件！'});
                return false;
            } else if (file.size >= 150 * 1024 * 1024) {
                B_Pop._init('msg', {content: '文件大小不能超过150M！'});
                return false;
            }
            var postData = {};
            postData['file_name'] = file.name;
            postData['info_id'] = infoId;
            postData['source_type'] = 10;
            postData = B_Common._postData(postData);
            F_Chat_Common._getParam(this,postData,dom);
        })
    },
    _uploading:function(dom){
        F_Uploader[dom].on('uploadSuccess',function(file ,data) {
            if(data.return_code!=0){
                B_Pop._init('msg',{content:file.name+"上传失败！"+data.return_message});
                return false;
            }else{
                F_Chat_Info._pageRefresh();
            }
        }).on( 'fileQueued', function( file ) {

        }).on( 'uploadError', function( file ) {
            B_Pop._init('msg',{content:file.name+"上传失败！"});
        }).on( 'uploadProgress', function(file, percentage){
            F_Chat_Common._progressing(percentage*100);
        }).on( 'uploadComplete', function(file) {
            setTimeout(function () {
                F_Chat_Common._progressClose();
                $('.layui-layer-shade').remove();
            },1000);
            this.reset();
        });
    },
    _progressShow:function () {
        $(".up_progress-bar .qq").css({width:'0%'});
        B_Pop._init('open',{
            type: 1,
            shift:-1,
            title: false,
            closeBtn: false,
            shadeClose: false,
            area: ['auto', 'auto'],
            content: $(".up_progress")
        });
    },
    _progressing:function(percentage){
        percentage=(percentage+'').split(".")[0];
        $(".up_progress .up_percent").html(percentage+'%');
        $(".up_progress-bar .qq").css({width:percentage+'%'});
    },
    _progressClose:function(){
        B_Pop._init('close');
    },
    _openAdd:function(id,title,dateBegin,dateEnd){
        B_Pop._init('close');
        dateBegin = typeof(dateBegin) == "undefined" ? B_Date._getDiffDate('',-30) : dateBegin.split(' ')[0];
        dateEnd = typeof(dateEnd) == "undefined" ? B_Date._getDiffDate('',0) : dateEnd.split(' ')[0];
        B_Pop._init('open',{'type':2,'scroll':true,'title':'解析文件'+title,'width':'630px','height':'450px','shift':2,'content':'outsidechat_s.html?i='+id+'&b='+B_Common._encodeUrl(dateBegin)+'&e='+B_Common._encodeUrl(dateEnd)},'');
    },
    _delConfirm:function(id,name){
        B_Pop._init('confirm',{skin:'layerCheck-class',content:'确实要删除当前记录【'+name+'】么？',btn:['确认','取消'],title:'操作提示'},function(){
            F_Chat_Info._workDel(id);
        },function(){
            B_Pop._init('close');
        });
    }
}
