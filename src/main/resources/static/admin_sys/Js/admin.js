/*==============================
@DESC:    admin.js
@AUTHOR:  bruce@thinkingdata.cn
@DATA:    2016-1-14
================================
*/




//请求地址
var G_ACTION_ADDRESS = {
    getProjet: "AdminGasProjectsServlet"
};

//MyPost()函数扩展
function MyAdminPost(url, postdata, req_start, req_end, onsucc, onfail) {
    MyPost(url, postdata, req_start, req_end, onsucc, function(data, msg, code) {

        if (code == -1015) {
            G_PopWnd.error("您不是管理员");
            return;
        }

        onfail && onfail();
    })
};


$(document).ready(function() {


    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                            添加顶部BANNER                                         //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    G_MENU.AddMenu();
    $(".t_about .chosen > div").html('管理平台');


    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //                         Login FAILURE ? PopLogin(): AdminDrawCharts()                             //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    G_LOGIN.CheckLoginServlet(AdminDrawCharts, PopLogin);



    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                            元素及变量                                             //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    var oBody = $('body');
    var oMenu = $('#menu');
    var oBtn = $('#btn');
    var oAdd = $(".btn_add");
    var oBtnSearch = $('#btn_search');
    var oCreate = $('.btn_create');
    var oSave = $('.btn_save');
    var oTableContainer = $('#table_container');
    var oTable = $('table');
    var oThread = $('thead');
    var oTh = oThread.find('th');
    var oTbody = $('#ss_tbody');
    var oTr = oTbody.find('tr');

    var url = G_CGI_DIR + G_ACTION_ADDRESS.getProjet;


    var p = {
        index: 6,
        limit: 47
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                           弹框和弹层                                              //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //弹框
    // G_PopWnd.confirm("确实要删除xx吗？", function(){
    //     console.log("弹窗了！~");
    // });

    //弹层
    //G_PopWnd.dialog("标题", $("#pop_content"));



    /*******************************************************************************************************/

    var loadData = function(pageIndex, pageSize) {
        //抓取数据
        var myData = []; //AJAX来的数据


        MyAdminPost(url, p, ShowLoading, HideLoading, function(data) { //AJAX


                var jsonObj = eval(data.get);

                for (var key = 0; key < jsonObj.length; key++) {

                    (function(index) {

                        myData.push({

                            "project_id": jsonObj[index].project_id,

                            "project_name": jsonObj[index].project_name,

                            "pinyin": jsonObj[index].pinyin,

                            "game_type": jsonObj[index].game_type,

                            "hot_score": jsonObj[index].hot_score
                        });

                    })(key);

                }
            },

            function() {

                G_PopWnd.error("系统异常");
            });


        setPagingInfo() //更新分页信息

        bindData(myData);
    };



    var setPagingInfo = function() { //设置分页

        var pageSize = 10; //每页显示的记录条数
        var curPage = 0;
        var lastPage;
        var direct = 0;
        var len;
        var page;

        len = $("#ss_table tr").length;

        page = len % pageSize == 0 ? len / pageSize : Math.floor(len / pageSize) + 1; //根据记录条数，计算页数
        //  alert("page==="+page);
        curPage = 1;

        displayPage(1); //显示第一页

        $("#paging_first").click(function() { //首页

            curPage = 1;

            displayPage();
        });

        $("#paging_prev").click(function() { //上页

            direct = -1;

            displayPage();
        });

        $("#paging_next").click(function() { //下页

            direct = 1;

            displayPage();
        });

        $("#paging_last").click(function() { //尾页

            curPage = page;

            displayPage();
        });


        function displayPage() {

            if ((curPage <= 1 && direct == -1) || (curPage >= page && direct == 1)) {

                direct = 0;

                alert("已经是第一页或者最后一页了");

                return;
            }

            lastPage = curPage;
            curPage = (curPage + direct + len) % len;

            var begin = (curPage - 1) * pageSize; //起始记录号
            var end = begin + pageSize;

            if (end > len) end = len;

            $("#ss_table tr").hide();
            $("#ss_table tr").each(function(i) {

                if (i >= begin && i < end) //显示第page页的记录
                    $(this).show();
            });

        }
    };



    var bindData = function() {

        oTbody.html("");

        var oHTML = "";


        for (var key = 0; key < len; key++) { //FOR循环直接遍历“项”

            (function(index) {

                oHTML += "<tr class='contentlist'>";
                oHTML += "<td>" + data.get[index].project_id + "</td>";
                oHTML += "<td>" + data.get[index].project_name + "</td>";
                oHTML += "<td>" + data.get[index].pinyin + "</td>";
                oHTML += "<td>" + data.get[index].game_type + "</td>";
                oHTML += "<td>" + data.get[index].hot_score + "</td>";
                oHTML += "<td class='td_btn'>" + "<button type='button' class='del' name='del' value='删除'>删除</button><button type='button' class='mod' name='mod' value='修改'>修改</button>" + "</td>";
                oHTML += "</tr>";

            })(key);

            oTbody.html(oHTML);

        };

    };

    //分页点击事件
    loadData(pageIndex, pageSize);


    /*******************************************************************************************************/


    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                            搜索                                                   //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    oBtnSearch.on("click", function() {


        //点击搜索按钮事件
        var filterText = $('#input_search').val();

        if (typeof(filterText) == 'undefined') {
            alert('请检查关键字');
        } else {


            $("#ss_tbody tr").hide().filter(":contains('" + filterText + "')").show();
        };



        //输入框ENTER事件
        var ee = jQuery.Event("keydown");
        ee.keyCode = 13;
        $('#input_search').trigger(ee);

    });





    //删除事件
    oTable.on("click", "button[name='del']", function() {

        if (confirm("*********确定删除？*********")) {

            //console.log('你点击了删除~');
            $(this).closest('tr').remove();
        }
        return
    });


    //增加事件
    oAdd.click(function(e) {
        e.preventDefault();
        //TODO
        G_PopWnd.dialog("标题", $("#pop_content_new"));

        return
    });


    //修改事件
    oTable.on("click", "button[name='mod']", function() {
        G_PopWnd.dialog("标题", $("#pop_content_edit"));

        var trData = {};
        var d1 = $(this).parents("tr").find("td").eq(0).text();
        var d2 = $(this).parents("tr").find("td").eq(1).text();
        var d3 = $(this).parents("tr").find("td").eq(2).text();
        var d4 = $(this).parents("tr").find("td").eq(3).text();
        var d5 = $(this).parents("tr").find("td").eq(4).text();
        //console.log('\n' + d1 + '\n' + d2 + '\n' + d3 + '\n' + d4 + '\n' + d5);

        //弹出框值清空
        $('.ipt_edit').val("");

        //赋值
        $('.ipt_edit').eq(0).val(d2);
        $('.ipt_edit').eq(1).val(d3);
        $('.selc_edit :selected').text(d4);
        $('.ipt_edit').eq(2).val(d5);

    });




    //新建->提交
    oCreate.on('click', function() {
        console.log('Create按钮点击了');
        layer.closeAll();
    });


    //修改->保存
    oSave.on('click', function() {
        console.log('保存');
        layer.closeAll();
        //console.log('弹出框"保存"点击了！');

    });





    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                            菜单                                                   //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //菜单设置
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: zTreeOnClick,
            beforeClick: zTreeBeforeClick
        }

    };

    //菜单JSON数据
    var zNodes = [{
        id: 1,
        pId: 0,
        name: "管理平台",
        open: true
    }, {
        id: 11,
        pId: 1,
        name: "get_project",
        open: true
    }];

    //菜单Tree初始化            
    $.fn.zTree.init(oMenu, setting, zNodes);

    //Tree点击之前事件
    function zTreeBeforeClick() {
        //TODO LOGIN
    };

    //Menu点击之后事件
    //treeId-包含zTree的容器ID
    //treeNode-当前zTree的节点
    //clickFlag-节点被点击后的选中操作类型
    function zTreeOnClick(event, treeId, treeNode, clickFlag) {
        if (treeNode.name === '游戏-1') {
            console.log('点中了');
            return
        } else {
            console.log(treeNode.name);
        }

    };



});







function AdminDrawCharts() {
    $('#btn_search').trigger('click');
    for (var i = 0; i < 3; i++) {
        setTimeout(function() {
            $('#paging_first').trigger('click');
        }, 300);
    };
};
