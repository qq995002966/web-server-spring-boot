$(function () {
    G_Login._check();
    U_Dom._menu('3-2');
    G_Login._status('user');
    F_Info._getList(1);
    $('.m_soWork button').click(function(){
        G_Jump._go('service');
    });
});
var F_Info = {
    _getList:function(page){
        var index = (page-1)*G_Page._size;
        G_Port._ajax('serviceStatus','get',true,'index='+index+'&limit='+G_Page._size,function(){
                $('#bs_list').html(G_Pre._loading('c_padding30'));
                $('.page-list').html('');
            },function(){
                $('#bs_list').html('');
                $('.page-list').html('');
            },
            function(data, msg){
                if(data.get && data.get.length > 0){
                    $('#bs_list').html(F_Info._htmlList(data.get,index));
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
                    $('#bs_list').html('<div class="c_empty">暂无数据</div>');
                }
            },
            function(data, msg, code){
                $('#bs_list').html(G_Pre._empty(msg));
            }
        )
    },
    _htmlList:function(data,numberBegin){
        var str = '<table>\
            <tr>\
            <th>产品名称</th>\
            <th>开通游戏</th>\
            <th>产品到期日期</th>\
            <th>剩余期限</th>\
            <th style="width: 120px">操作</th>\
        </tr>';
        for(var i=0;i<data.length;i++){
            var final = '';
            var times = '';
            var urlQuery = '';
            var project = data[i].project_id+'' == '0' ? '无限制' : G_Game._name(data[i].project_id);
            var service = U_Service._name(data[i].service_type);
            if(data[i].project_id+'' != '0'){
                urlQuery = '&g='+data[i].project_id;
            }
            switch(data[i].service_type+''){
                case '3':
                    final = '-';
                    times = data[i].remain_times+'次';
                    break;
                default:
                    final = data[i].final_date;
                    times = data[i].remaining_days+'天到期';
                    break;
            }
            switch(data[i].service_status+''){
                case '3':
                case '4':
                    times = '<span class="c_colorR">已过期</span>';
                    break;
                case '5':
                    times = '<span class="c_colorR">已用尽</span>';
                    break;
            }
            str += '<tr>';
            str += '<td>'+service[0]+'</td>';
            str += '<td>'+project+'</td>';
            str += '<td>'+final+'</td>';
            str += '<td>'+times+'</td>';
            str += '<td><span class="rn_buy c_cursor" onclick="G_Jump._go(\'base\',\''+G_Jump._getUrl('item')+'?k='+service[1]+urlQuery+'\')">快速续费</span></td>';
            str += '</tr>';
        }
        str += '</table>';
        return str;
    }
}
