var F_Uploader;
var F_Page = 1;
var F_Total = 0;
$(function () {
    G_Login._check();
    U_Dom._menu('1-4-2');
    U_Service._checkStatus('talk');
    F_Info._getList(1);
    $('.m_sIntro span').click(function(){
        G_Open._notice('如何导出QQ聊天记录','950px','600px',G_Jump._getUrl('notices')+'?t=chat')
    });
    $('.tk_fast_choose span').each(function(){
        $(this).click(function(){
            var type = $(this).attr('data-t');
            var begin = '';
            var end = G_Date._get(0);
            switch(type+''){
                case '1':
                    begin = G_Date._get(-365);
                    break;
                case '2':
                    begin = G_Date._get(-180);
                    break;
                case '3':
                    begin = G_Date._get(-90);
                    break;
                case '4':
                    begin = G_Date._get(-30);
                    break;
                case '5':
                    begin = G_Date._get(-7);
                    break;
                case '6':
                    begin = G_Date._get(0);
                    break;
            }
            F_Common._dateChoose(begin,end);
        });
    });
    $('.tk_setup .btn-default').click(function(){
        G_Pop._init('close');
    });
    $('.tk_setup .btn-info').click(function(){
        var postData = '';
        var infoId = $(this).attr('data-i');
        var beginDate = $('#db1').val()+' 00:00:00';
        var endDate = $('#de1').val()+' 23:59:59';
        if(infoId != '')F_Info._workUpdate('info_id='+infoId+'&start_date='+beginDate+'&end_date='+endDate);
    });
    G_Login._status('user');
});
var F_Info = {
    _buff:{},
    _workUpdate:function(postData){
        G_Port._ajax('talkUpdate','post',true,postData,function(){
            btnStatus('set','disable',$('.btn-info'));
            $('.btn-default').attr('disabled',true);
        },function(){
            btnStatus('set','normal',$('.btn-info'));
            $('.btn-default').attr('disabled',false);
        },function(data,msg){
            G_Pop._init('close');
            G_Pop._init('msg',{'content':msg});
            setTimeout(function(){
                F_Info._pageRefresh();
            },1000);
        },function(data,msg,code){
            G_Pop._init('alert',{content:G_Pre._empty(msg)});
        })
    },
    _workDel:function(id){
        G_Port._ajax('talkDel','post',true,'info_id='+id,function(){
            G_Pop._init('load',{'type':1,'time':10});
        },function(){
            G_Pop._init('close');
        },function(data,msg){
            G_Pop._init('msg',{'content':'删除成功'});
            setTimeout(function(){
                F_Info._pageRefresh('del');
            },1000);
        },function(data,msg,code){
            G_Pop._init('alert',{content:G_Pre._empty(msg)});
        })
    },
    _pageRefresh:function(type){
        var page = F_Page;
        switch(type){
            case 'del':
                F_Total = F_Total > 0 ? (F_Total-1) : 0;
                page = Math.ceil(F_Total/G_Page._size);
                page = F_Page <= page ? F_Page : page;
                break;
        }
        F_Info._getList(page);
    },
    _getList:function(page){
        F_Page = page;
        var index = (page-1)*G_Page._size;
        G_Port._ajax('talkInfo','get',true,'index='+index+'&limit='+G_Page._size,function(){
                $('#bs_list').html(G_Pre._loading('c_padding30'));
                $('.page-list').html('');
            },function(){
                $('#bs_list').html('');
                $('.page-list').html('');
            },
            function(data, msg){
                if(data.get && data.get.length > 0){
                    F_Info._buff.hotwordData = data.get;
                    $('#bs_list').html(F_Info._htmlList(data.get,index));
                    $('.bs_reupload').each(function(){
                        var infoId = $(this).attr('data-i');
                        F_Common._reUpload(infoId);
                    });
                    F_Total = data.total;
                    $('.page-list').html(G_Page._show({total:data.total,page:page},'number'));
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
                                F_Info._getList(page);
                                GoToTop();
                            }
                        });
                    });
                }else{
                    $('#bs_list').html(G_Pre._empty('暂无数据'));
                }
            },
            function(data, msg, code){
                switch(code+''){
                    case '-1017':
                        msg += ' <span class="c_cursor c_colorG" onclick="G_Jump._go(\'open\',\''+G_Jump._getUrl('item')+'?k='+U_Service._init.talk[1]+'\')">【点击购买】</span>';
                        break;
                }
                $('#bs_list').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlList:function(data,numberBegin){
        var str = '<table>\
            <tr>\
            <th>来源</th>\
            <th>文件名</th>\
            <th>上传时间</th>\
            <th>解析状态</th>\
            <th>操作</th>\
        </tr>';
        //'-1: 文件上传成功；1：文件解析中；2：文件解析成功；3：文件解析失败；4：生成分析挖掘任务成功；5：文件分析挖掘中；6：文件分析挖掘成功；7：文件分析挖掘失败'；8：解析成功，但是是空的'
        for(var i=0;i<data.length;i++){
            var fileName = decodeURIComponent(data[i].file_name);
            var workBtn = [];
            var status = '';
            var sourceImg = '';
            switch(data[i].source_type+''){
                case '10':
                    sourceImg = '<div class="tk_qq_icon c_img c_marginAuto"></div>';
                    break;
            }
            var workBtnSet = '<i title="解析设置" class="glyphicon glyphicon-edit c_cursor" onclick="F_Common._openAdd('+data[i].info_id+',\''+fileName+'\',\''+data[i].start_date+'\',\''+data[i].end_date+'\')"></i>';
            var workBtnDel = '<i title="删除解析" class="glyphicon glyphicon-trash c_cursor" onclick="F_Common._delConfirm('+data[i].info_id+',\''+fileName+'\')"></i>'
            var workBtnRefresh = '<i title="更新状态" class="glyphicon glyphicon-refresh c_cursor" onclick="F_Info._pageRefresh()"></i>';
            switch(data[i].status+''){
                case '-1':
                    status = '<span class="c_colorB">未解析</span>';
                    workBtn.push('<i title="开始解析" class="glyphicon glyphicon-play-circle c_cursor c_colorB" onclick="F_Common._openAdd('+data[i].info_id+',\''+fileName+'\')"></i>');
                    workBtn.push(workBtnDel);
                    break;
                case '3':
                case '7':
                    status = '<span class="c_colorR">解析失败</span>';
                    workBtn.push('<button id="tk_reupload_btn_'+data[i].info_id+'" data-i="'+data[i].info_id+'" title="重新上传" class="bs_reupload"><i class="glyphicon glyphicon-open c_cursor"></i></button>');
                    workBtn.push(workBtnDel);
                    break;
                case '6':
                case '8':
                    status = '<span class="c_colorG">解析成功</span>';
                    workBtn.push('<i title="查看分析报告" class="glyphicon glyphicon-list-alt c_cursor" onclick="G_Jump._go(\'open\',\''+G_Jump._getUrl('chatresult')+'?id='+data[i].info_id+'\')"></i>');
                    workBtn.push(workBtnSet);
                    workBtn.push(workBtnDel);
                    break;
                default:
                    status = '<span>解析中..</span>';
                    workBtn.push(workBtnRefresh);
                    break;
            }
            workBtn = workBtn.length > 0 ? workBtn.join('　') : '';
            str += '<tr>';
            str += '<td>'+sourceImg+'</td>';
            str += '<td>'+fileName+'</td>';
            str += '<td>'+data[i].dt_create_time+'</td>';
            str += '<td>'+status+'</td>';
            str += '<td>';
            str += workBtn;
            str += '</td></tr>';
        }
        str += '</table>';
        return str;
    }
}
var F_Common = {
    _reUpload:function(id){
        F_Common._upload('#tk_reupload_btn_'+id,id);
    },
    _dateChoose:function(begin,end){
        dataChoose._section({'autoCommit':true,'todayValid':true},1,begin,end);
    },
    _buy:function(){
        $('.tk_upload_btn').click(function(){
            var currentData = U_Service._init.talk;
            U_Service._confirm(currentData[2],currentData[0]+'服务上传次数已用尽，请购买 ！');
        });
    },
    _upload:function(dom,id){
        var option = {
            auto: true,
            swf: 'plugins/webuploader/Uploader.swf',
            server: G_Port._init('talkAdd'),
            pick: dom,
            accept:{
                title: 'intoTypes',
                extensions: 'txt',
                mimeTypes: '.txt'
            },
            formData:{
                source_type:10
            }
        };
        if(id)option.formData.info_id = id;
        F_Uploader = WebUploader.create(option);
        F_Uploader.on('beforeFileQueued', function(file){
            if(isDemoUser()){
                openLogin();
                return false;
            }
            if(file.size==0){
                G_Pop._init('msg',{content:'不能上传空文件！'});
                return false;
            }else if(file.size>=150*1024*1024){
                G_Pop._init('msg',{content:'文件大小不能超过150M！'});
                return false;
            }
            this.options.formData["file_name"]=encodeURI(file.name);
        }).on('uploadSuccess',function(file ,data) {
            F_Common._progressClose();
            if(data.return_code!=0){
                G_Pop._init('msg',{content:file.name+"上传失败！"+data.return_message});
                return false;
            }else{
                if(id){
                    F_Info._getList(F_Page);
                }else{
                    top.window.location.reload();
                }
            }
        }).on( 'uploadError', function( file ) {
            G_Pop._init('msg',{content:file.name+"上传失败！"});
        }).on( 'uploadProgress', function(file, percentage){
            F_Common._progressShow(percentage*100);
        }).on( 'uploadComplete', function(file) {
            this.reset();
        });
    },
    _progressShow:function(percentage){
        percentage=(percentage+'').split(".")[0];
        $(".up_progress .up_percent").html(percentage+'%');
        $(".up_progress-bar .qq").css({width:percentage+'%'});
        if($(".up_progress").is(":hidden")){
            $(".up_progress-bar .qq").css({width:'0%'});
            G_Pop._init('open',{
                type: 1,
                shift:-1,
                title: false,
                closeBtn: false,
                shadeClose: false,
                area: ['auto', 'auto'],
                content: $(".up_progress")
            });
        }
    },
    _progressClose:function(){
        G_Pop._init('close');
    },
    _openAdd:function(id,title,dateBegin,dateEnd){
        G_Pop._init('close');
        dateBegin = typeof(dateBegin) == "undefined" ? G_Date._get(-30) : dateBegin.split(' ')[0];
        dateEnd = typeof(dateEnd) == "undefined" ? G_Date._get(0) : dateEnd.split(' ')[0];
        F_Common._dateChoose(dateBegin,dateEnd);
        $(".tk_setup .btn-info").attr('data-i',id);
        G_Pop._init('open',{
            type: 1,
            shift:-1,
            title: '开始解析：'+title,
            shadeClose: false,
            area: ['auto', 'auto'],
            content: $(".tk_setup")
        });
    },
    _delConfirm:function(id,name){
        G_Pop._init('confirm',{skin:'layerCheck-class',content:'确实要删除当前记录【'+name+'】么？',btn:['确认','取消'],title:'操作提示'},function(){
            F_Info._workDel(id);
        },function(){
            G_Pop._init('close');
        });
    }
}