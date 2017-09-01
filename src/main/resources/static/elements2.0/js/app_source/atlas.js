require(['frontmain'], function () {
    require(['jquery','layer','base','front','store.min','particles','jquery.panzoom','app/outside'], function (){
        store = require('store.min');
        F_Atlas_Entrance._init();
    });
});
var F_Atlas_Entrance = {
    _gameId:0,
    _buff:{},
    _dataCache:{},
    _init:function () {
        B_Login._check();
        S_HeadFoot._getHead();

        var $_GET = B_Common._getUrl('query');
        if ($_GET.g && !isNaN($_GET.g)) {
            F_Atlas_Entrance._gameId = $_GET.g;
            B_Game._setLast(F_Atlas_Entrance._gameId, 'outsideAtlas');
        }else{
            F_Atlas_Entrance._gameId = B_Game._getLast('outsideAtlas');
        }

        B_Game._getCollect(function () {
            F_Atlas_Info._getInfo();
            F_draw._init();
        });

        F_Atlas_Favorite._getData();
    }
}
var F_draw = {
    _init:function () {
        var $section = $('#Wrap');
        // var $section = $(window);
        var $panzoom = $section.find('#canvas').panzoom({
            contain: true
        });
        $panzoom.parent().on('mousewheel.focal', function(e) {
            e.preventDefault();
            var delta = e.delta || e.originalEvent.wheelDelta;
            var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
            $panzoom.panzoom('zoom', zoomOut, {
                increment: 0.1,
                animate: false,
                focal: e
            });
        });
    },
    _line:function(x1, y1, x2, y2, el) {
        var a = x1 - x2,
            b = y1 - y2,
            c = Math.sqrt(a * a + b * b)

        var sx = (x1 + x2) / 2,
            sy = (y1 + y2) / 2

        var x = sx - c / 2,
            y = sy

        var alpha = Math.PI - Math.atan2(-b, a)
        var style = 'width: ' + c + 'px; ' + 'height: 1px; ' + '-moz-transform: rotate(' + alpha + 'rad); ' + '-webkit-transform: rotate(' + alpha + 'rad); ' + '-o-transform: rotate(' + alpha + 'rad); ' + '-ms-transform: rotate(' + alpha + 'rad); '
            // + 'position: fixed; '
            + 'top: ' + y + 'px; ' + 'left: ' + x + 'px; '
        var lineDom = '<div class="line" style="' + style + '"></div>'
        if (el) {
            el.append(lineDom)
        } else {
            $('#canvas').append(lineDom)
        }
    },
    _arc:function (e, x, y, r) {
        e.css({
            top: y - r,
            left: x - r,
            height: r * 2,
            width: r * 2
        })
    }
}
var config = {
    fontFamily: 'Calibri',
    fps: 60,
    box: 20,
    animationTime: 1000,
    center: {
        radius: 60,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        fill: '#404c58',
        font: {
            text: 'center',
            size: 16,
            color: 'rgb(255,255,255)'
        }
    },
    child: {
        radius: 35,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        fill: '#404c58',
        distance: 240,
        line: {
            color: '#f1f1f1',
            width: 0.5
        },
        font: {
            size: 14,
            color: '#FFFFFF'
        },
        child: {
            radius: 35,
            borderColor: '#FFFFFF',
            borderWidth: 1,
            distance: 240,
            fill: '#404c58',
            line: {
                color: '#f1f1f1',
                width: 0.5
            },
            font: {
                size: 14,
                color: '#FFFFFF'
            },
            child: {
                radius: 28,
                borderColor: '#FFFFFF',
                borderWidth: 1,
                distance: 220,
                fill: '#404c58',
                line: {
                    color: '#f1f1f1',
                    width: 0.5
                },
                font: {
                    size: 14,
                    color: '#FFFFFF'
                }
            }
        }
    }
}
var position = {
    center: {
        origin: {
            x: null,
            y: null
        },
        current: {
            x: null,
            y: null
        }
    },
    child: []
}
var getWindowSize = function() {
    var div = document.getElementById('canvas')
    return {
        height: div.clientHeight,
        width: div.clientWidth
    }
}
var F_Atlas_Info = {
    _changeGame:function (gameId) {
        if (gameId + '' != F_Atlas_Entrance._gameId + '') {
            F_Atlas_Entrance._dataCache = {};
            B_Game._setLast(gameId, 'outsideAtlas');
            F_Atlas_Entrance._gameId = gameId;
            F_Atlas_Info._getInfo();
            F_draw._init();
        }
    },
    _goLight:function (gameId) {
        if(B_User._isDemoUser()){
            B_Login._openLogin('l_'+gameId);
        }else{
            if(B_Game._checkAuthGame(gameId)){
                var url = B_Jump._getUrl('gameLight',{gameId:gameId});
                B_Jump._go('openUrl',url);
            }else{
                B_Login._openProbation('game&gameId='+gameId);
            }
        }
    },
    _goAtlas:function (gameId) {
        var url = B_Jump._getUrl('atlas');
        B_Jump._go('base',url+'?g='+gameId);
    },
    _search:function (keywords) {
        B_Jump._go('openUrl', B_Jump._getUrl('search')+'?k='+B_Common._encodeUrl(keywords));
    },
    _getInfo:function(){
        if (F_Atlas_Entrance._dataCache['data'] && F_Atlas_Entrance._dataCache['tag']) {
            F_Atlas_Info._htmlFormat(F_Atlas_Entrance._dataCache['data'],F_Atlas_Entrance._dataCache['tag']);
        } else {
            var dom = $('#canvas');

            var postData = {};
            postData['project_id'] = F_Atlas_Entrance._gameId;
            postData = B_Common._postData(postData);

            B_Port._ajax('atlasProjectGraphList', 'get', true, postData , function() {
                dom.html(B_Pre._loading());
            }, function() {
                dom.html('');
            }, function(data, msg) {
                if (data && !B_Common._checkObjectIsEmpty(data)) {
                    F_Atlas_Entrance._dataCache['data'] = data.child;
                    F_Atlas_Entrance._dataCache['tag'] = data.tag_list;
                    F_Atlas_Info._htmlFormat(data.child,data.tag_list);
                }
            }, function(data, msg, code) {
                dom.html(B_Pre._empty(msg));
            })
        }
    },
    _htmlFormat: function(data,tag) {
        var dataUnion = [];
        var gameInfo = [];
        $.each(data, function(key, value) {
            var list = { 'tag_list': value.tag_list, 'gameId': value.project_id, 'text': B_Game._getGame([value.project_id],1)[value.project_id][1], 'ralationship': value.relation_name, 'image': B_Game._imgUrl(value.project_id), 'child': [] };
            if (value.relate_project && value.relate_project.length > 0) {
                for (var i = 0; i < value.relate_project.length; i++) {
                    list.child.push({ 'tag_list': value.relate_project[i].tag_list, 'gameId': value.relate_project[i].project_id, 'text': B_Game._getGame([value.relate_project[i].project_id],1)[value.relate_project[i].project_id][1], 'ralationship': value.relate_project[i].relation_name, 'image': B_Game._imgUrl(value.relate_project[i].project_id),'child':[] });
                    if(value.relate_project[i].relate_project && value.relate_project[i].relate_project.length > 0){
                        for (var s = 0; s < value.relate_project[i].relate_project.length; s++) {
                            if(s>1)break;
                            gameInfo = B_Game._getGame([value.relate_project[i].relate_project[s].project_id],1);
                            list.child[i]['child'].push({
                                'tag_list': value.relate_project[i].relate_project[s].tag_list,
                                'gameId': value.relate_project[i].relate_project[s].project_id,
                                'text': ((gameInfo && gameInfo[value.relate_project[i].relate_project[s].project_id] && gameInfo[value.relate_project[i].relate_project[s].project_id][1]) ? gameInfo[value.relate_project[i].relate_project[s].project_id][1] : ''),
                                'ralationship': value.relate_project[i].relate_project[s].relation_name,
                                'image': B_Game._imgUrl(value.relate_project[i].relate_project[s].project_id)
                            });
                        }
                    }
                }
            }
            dataUnion.push(list);
        });
        F_Atlas_Info._htmlCenter(tag);
        F_Atlas_Info._htmlDraw(dataUnion);

        // 第一圈游戏间关系鼠标悬停效果
        $('.relationship-text').hover(function() {
            $('.ball-scale-multiple').css('opacity', '0')
            $(this).next('.ball-scale-multiple').css('opacity', '1')
            $(this).addClass('animated pulse relationship-text-hover')
            $(this).next().next('.line').addClass('line-change-color')
        })

        $('.relationship-text').mouseleave(function() {
            $('.ball-scale-multiple').css('opacity', '0')
            $(this).removeClass('animated pulse relationship-text-hover')
            $(this).next().next('.line').removeClass('line-change-color')
        })

        // 第二圈游戏间关系鼠标悬停效果
        $('.child2-rt').hover(function() {
            $('.child2-ball').css('opacity', '0')
            $(this).next('.child2-ball').css('opacity', '1')
            $(this).addClass('animated pulse relationship-text-hover')
            $(this).next().next('.line').addClass('line-change-color')
        })

        $('.child2-rt').mouseleave(function() {
            $('.child2-ball').css('opacity', '0')
            $(this).removeClass('animated pulse relationship-text-hover')
            $(this).next().next('.line').removeClass('line-change-color')
        })

        // 第三圈游戏间关系鼠标悬停效果
        $('.child3-rt').hover(function() {
            $('.child3-ball').css('opacity', '0')
            $(this).next('.child3-ball').css('opacity', '1')
            $(this).addClass('animated pulse relationship-text-hover')
            $(this).next().next('.line').addClass('line-change-color')
        })

        $('.child3-rt').mouseleave(function() {
            $('.child3-ball').css('opacity', '0')
            $(this).removeClass('animated pulse relationship-text-hover')
            $(this).next().next('.line').removeClass('line-change-color')
        })

        // 鼠标悬停显示第二圈
        $('.child-pic').hover(function() {
            if ($(this).parent().hasClass('child2')){
                var textClass = 'child-2-' + $(this).parents('.child1').attr('class').slice(25) + $(this).parent().attr('class').slice(25)
            } else {
                var textClass = $(this).parent().attr('class').slice(17)
            }
            $('.' +　textClass+ 'text').css('display', 'block')
            $(this).parent().children('.line, .arc').css({
                transition: 'all  0.8s ease-in-out',
                display: 'block'
            })
        })
        // $('#canvas').pep();
    },
    _htmlCenter: function(tag) {
        var str = '';
        var tagStr = F_Atlas_Info._htmlTag(F_Atlas_Entrance._gameId, tag);
        str += '<div class="pop" data-i="' + F_Atlas_Entrance._gameId + '">';
        str += '<ul class="inner-circle">';
        str += '<li><a onclick="F_Atlas_Info._changeGame('+ F_Atlas_Entrance._gameId + ');">' + '查看图谱' + '</a></li>';
        str += '<li><a onclick="F_Atlas_Info._goLight('+ F_Atlas_Entrance._gameId + ');">' + '灯塔透视' + '</a></li>';
        str += '</ul>';
        str += '<ul class="style-list" id="tag' + F_Atlas_Entrance._gameId + '">' + tagStr;
        str += '</ul>';
        str += '</div>';

        $('#canvas').append('<div id="center" class="arc"><b class="img-title">' + B_Game._getGame([F_Atlas_Entrance._gameId],1)[F_Atlas_Entrance._gameId][1] + '</b><img src="' + B_Game._imgUrl(F_Atlas_Entrance._gameId) + '">'+str+'</div>');
        var center = $('#center');
        F_draw._arc(center, getWindowSize().width / 2, getWindowSize().height / 2, config.center.radius);
        var tagcdig = Math.PI * 2 / $('#center .circle-tag').length;
        $('#center .circle-tag').each(function(index, element) {
            $(this).css({
                position: 'absolute',
                left: Math.sin((tagcdig * index)) * 83 + 85,
                top: Math.cos((tagcdig * index)) * 83 + 85
            })
        });
    },
    _htmlDraw: function(data) {
        var ox = getWindowSize().width / 2
        var oy = getWindowSize().height / 2
        var d = Math.PI * 2 / data.length
        var r = config.child.distance + config.center.radius
        for (var i = 0; i < data.length; i++) {
            var x = ox + Math.sin(i * d) * r;
            var tx = ox + Math.sin(i * d) * r / 2;
            var y = oy + Math.cos(i * d) * r;
            var ty = oy + Math.cos(i * d) * r / 2;

            var str = F_Atlas_Info._htmlGame(1, { 'tag': data[i].tag_list, 'one': i, 'two': '', 'image': data[i].image, 'title': data[i].text, 'gameId': data[i].gameId });
            $(str).appendTo('#canvas');
            var tagdig = Math.PI * 2 / $('.child-1-' + i + '  .circle-tag').length;
            $('.child-1-' + i + '  .circle-tag').each(function(index, element) {
                $(this).css({
                    position: 'absolute',
                    left: Math.sin((tagdig * index)) * 80 + 85,
                    top: Math.cos((tagdig * index)) * 80 + 85
                })
            });

            $('#canvas').append('<p class="relationship-text" style="top:' + ty + 'px;left:' + tx + 'px" onclick="F_Atlas_Info._search(\''+data[i].ralationship+'\')">' + data[i].ralationship + '</p>') // 关系添加
            $('#canvas').append('<div class="ball-scale-multiple" style="top:' + (oy + Math.cos(i * d) * (r - 80) / 2) + 'px;left:' + (ox + Math.sin(i * d) * (r - 80) / 2) + 'px"><div></div><div></div><div></div></div>') // 关系闪烁小点添加
            F_draw._arc($('.child-1-' + i), x, y, config.child.radius)
            F_draw._line(ox, oy, x, y)

            // 第二圈开始
            if (data[i].child) {
                var childR = config.child.child.distance
                for (var c = 0; c < data[i].child.length; c++) {
                    // var childD = Math.PI * 2 / data.length * (i - 1) + Math.PI * 1.5 / data.length * c
                    var childD = Math.PI * 2 / data.length * (i - 0.8) + Math.PI * 1.3 / data.length * c
                    var childX = x + Math.sin(childD) * childR
                    var childTX = x + Math.sin(childD) * childR / 2
                    var childY = y + Math.cos(childD) * childR
                    var childTY = y + Math.cos(childD) * childR / 2
                    var tagdigg = Math.PI * 2 / $('.child-1-' + i + '>.child-2-' + c + '  .circle-tag').length // 每一个li对应的角度
                    $('.child-2-' + c + '  .circle-tag').each(function(index, element) {
                        $(this).css({
                            position: 'absolute',
                            left: Math.sin((tagdigg * index)) * 80 + 85,
                            top: Math.cos((tagdigg * index)) * 80 + 85
                        })
                    })

                    var str2 = F_Atlas_Info._htmlGame(2, { 'tag': data[i].child[c].tag_list, 'one': i, 'two': c, 'image': data[i].child[c].image, 'title': data[i].child[c].text, 'gameId': data[i].child[c].gameId });
                    $(str2).appendTo('.child-1-' + i);
                    var tagdigg = Math.PI * 2 / $('.child-1-' + i + '>.child-2-' + c + '  .circle-tag').length; // 每一个li对应的角度
                    $('.child-1-' + i + '>.child-2-' + c + '  .circle-tag').each(function(index, element) {
                        $(this).css({
                            position: 'absolute',
                            left: Math.sin((tagdigg * index)) * 80 + 85,
                            top: Math.cos((tagdigg * index)) * 80 + 85
                        })
                    })

                    F_draw._arc($('.child-1-' + i + '>.child-2-' + c), childX + 32 - x, childY + 32 - y, config.child.child.radius)
                    F_draw._line(36, 36, childX - x + 36, childY - y + 36, $('.child-1-' + i))
                    $('#canvas').append('<p class="child2-rt child-1-' + i + 'text" style="top:' + childTY + 'px;left:' + childTX + 'px" onclick="F_Atlas_Info._search(\''+data[i].child[c].ralationship+'\')">' + data[i].child[c].ralationship + '</p>') // 关系添加
                    $('#canvas').append('<div class="ball-scale-multiple child2-ball" style="top:' + (y + Math.cos(childD) * (childR + 60) / 2) + 'px;left:' + (x + Math.sin(childD) * (childR + 60) / 2) + 'px"><div></div><div></div><div></div></div>') // 关系闪烁小点添加

                    // 第三圈开始
                    if (data[i].child[c].child) {
                        var childRR = config.child.child.child.distance
                        for (var cc = 0; cc < data[i].child[c].child.length; cc++) {
                            var childDD = Math.PI * 2 / data.length * (i - 1.3) + Math.PI * 1 / data.length * (c)+Math.PI/4/data[i].child[c].child.length*(cc+0.8);
                            var childDDD = Math.PI * 2 / data.length * (i - 1.15) + Math.PI * 1 / data.length * (c)+Math.PI/5.66/data[i].child[c].child.length*(cc+0.8);
                            var childXX = Math.sin(childDD) * childRR
                            var childTTX =childTX+ Math.sin(childDD) * (childRR+250) / 2
                            var childYY = Math.cos(childDD) * childRR
                            var childTTY = childTY+Math.cos(childDD) * (childRR +250)/ 2
                            // dom添加
                            var str3 = F_Atlas_Info._htmlGame(3, { 'tag': data[i].child[c].child[cc].tag_list, 'one': i, 'two': cc, 'image': data[i].child[c].child[cc].image, 'title': data[i].child[c].child[cc].text, 'gameId': data[i].child[c].child[cc].gameId });
                            $(str3).appendTo('.child-1-' + i + '> .child-2-' + c);

                            var tagdigg3 = Math.PI * 2 / $('.child-1-' + i + '> .child-2-' + c + '> .child-3-' + cc + '  .circle-tag').length // 每一个li对应的角度
                            $('.child-1-' + i + '> .child-2-' + c + '> .child-3-' + cc + '  .circle-tag').each(function (index, element) {
                                $(this).css({
                                    position: 'absolute',
                                    left: Math.sin((tagdigg3 * index)) * 80 + 85,
                                    top: Math.cos((tagdigg3 * index)) * 80 + 85
                                })
                            })

                            F_draw._arc($('.child-1-' + i + '> .child-2-' + c + '> .child-3-' + cc), childXX + 32, childYY + 32, config.child.child.child.radius)
                            F_draw._line(36, 36, childXX + 36, childYY + 36, $('.child-1-' + i + '> .child-2-' + c))
                            $('#canvas').append('<p onclick="F_Game._search(\''+data[i].child[c].child[cc].ralationship+'\')" class="child3-rt child-2-'+ i + c + 'text" style="top:' +  (y + (Math.cos(childD) +Math.cos(childDDD)) * (childRR +150) / 2)  + 'px;left:' + (x + (Math.sin(childD)+Math.sin(childDDD)) * (childRR+150) / 2) + 'px">' + data[i].child[c].child[cc].ralationship + '</p>') // 关系添加
                            $('#canvas').append('<div class="ball-scale-multiple child3-ball" style="top:' + (y + (Math.cos(childD) +Math.cos(childDDD)) * (childRR +180) / 2) + 'px;left:' + (x + (Math.sin(childD)+Math.sin(childDDD)) * (childRR+180) / 2) + 'px"><div></div><div></div><div></div></div>') // 关系闪烁小点添加
                        }
                    }
                }
            }
        }
    },
    _htmlGame: function(cycle, data) {
        var str = ''
        switch (cycle + '') {
            case '1':
                str += '<div class="arc child child1 child-1-' + data.one + '">';
                str += '<span class="game-pic child-pic">';
                break;
            case '2':
                str += '<div class="arc child child2 child-2-' + data.two + '">';
                str += '<span class="game-pic child2-pic child-pic">';
                break;
            case '3':
                str += '<div class="arc child child3 child-3-' + data.two + '">';
                str += '<span class="game-pic child3-pic child-pic">';
                break;
        }
        var tagStr = F_Atlas_Info._htmlTag(data.gameId, data.tag);

        str += '<img src="' + data.image + '" />';
        str += '</span>';
        str += '<div class="pop" data-c="' + cycle + '" data-o="' + data.one + '" data-t="' + data.two + '" data-i="' + data.gameId + '">';
        str += '<ul class="inner-circle">';
        str += '<li><a onclick="F_Atlas_Info._changeGame('+ data.gameId + ');">' + '查看图谱' + '</a></li>';
        str += '<li><a onclick="F_Atlas_Info._goLight('+ data.gameId + ');">' + '灯塔透视' + '</a></li>';
        str += '</ul>';
        str += '<ul class="style-list" id="tag' + data.gameId + '">' + tagStr;
        str += '</ul>';
        str += '</div>';
        str += '<b class="img-title">' + data.title + '</b>';
        str += '</div>';

        return str;
    },
    _htmlTag: function(id, data) {
        var str = '';
        if(data && data.length>0){
            for(var i=0;i<data.length;i++){
                data[i] = parseInt(data[i]);
            }
        }
        var tag = B_Game._tag(data);
        var collectClass = B_Game._checkCollect(parseInt(id)) ? 'collectOn' : 'collectOff';
        str += '<li id="gmCollect' + id + '" class="circle-tag c_img collect ' + collectClass + '" onclick="B_Game._setCollect(' + id + ',\'gmCollect' + id + '\',\'collect\')"></li>';
        if (tag) {
            $.each(tag, function(key, value) {
                str += '<li class="circle-tag"><a onclick="F_Atlas_Info._search(\''+value+'\')">' + value + '</a></li>';
            })
        }
        return str;
    }
}
var F_Atlas_Favorite = {
    _gameReload:'',
    _getData: function() {
        var dom = $('#bs_favorit');

        var postData = {};
        postData['project_id'] = F_Atlas_Entrance._gameId;
        postData = B_Common._postData(postData);

        B_Port._ajax('guessLike', 'get', true, postData, function() {
            dom.html(B_Pre._loading());
        }, function() {
            dom.html('');
        }, function(data, msg) {
            if (data && data.get.length > 0) {
                var str = '';
                var gameId = [];
                for (var i = 0; i < data.get.length; i++) {
                    gameId.push(data.get[i].project_id);
                }
                F_Atlas_Entrance._buff.game = gameId;
                F_Atlas_Favorite._dataRank();
                $('.bottom-right').click(function() {
                    F_Atlas_Favorite._dataRank();
                });
            }
        }, function(data, msg, code) {
            dom.html(B_Pre._empty(msg));
        })
    },
    _dataRank: function() {
        if (F_Atlas_Entrance._buff.game) {
            var dom = $('#bs_favorit');
            var game = B_Game._getGame(F_Atlas_Entrance._buff.game)
            var total = F_Atlas_Entrance._buff.game.length;
            if (total > 10) {
                var rand = (total % 10 == 0) ? (total / 10) - 1 : Math.floor(total / 10);
                rand = Math.round(Math.random() * rand);
                if (rand == F_Atlas_Favorite._gameReload) {
                    if (rand > 0) {
                        rand -= 1;
                    } else {
                        rand += 1;
                    }
                }
                F_Atlas_Favorite._gameReload = rand;
                rand = rand * 10;
                dom.html(F_Atlas_Favorite._html(game, rand));
            } else {
                dom.html(F_Atlas_Favorite._html(game, 0));
            }
        }
        B_Tab._maskShow($('.bottompart ul li'), $('.bottompart ul li'), 'liOn', $('.bottompart .lt_shade'));
    },
    _html: function(data, begin) {
        var str = '';
        var i = 0;
        var b = 0;
        $.each(data, function(key, value) {
            if (b >= begin) {
                if (i < 10) {
                    var gameName = (value[1].length > 15) ? value[1].substr(0, 15) + '.' : value[1];
                    var gameCompany = value[2] ? ((value[2].length > 15) ? value[2].substr(0, 15) + '.' : value[2]) : '';
                    var collectClass = 'lt_gmCtOff';
                    if (B_Game._checkCollect(parseInt(key))) collectClass = 'lt_gmCtOn';
                    str += '\
                        <li>\
                            <img src="' + value[0] + '" alt="' + value[1] + '">\
                            <span class="game-name">' + gameName + '</span>\
                            <span class="game-company">' + gameCompany + '</span>\
                            <div class="lt_shade" style="display: none;">\
                                <div id="forum_gmCollect' + key + '" onclick="B_Game._setCollect(' + key + ',\'forum_gmCollect' + key + '\',\'lt_gmCt\')" class="lt_gmCollect c_img ' + collectClass + '"></div>\
                                <a onclick="F_Atlas_Info._goLight(' + key + ')">查看灯塔&gt;</a>\
                                <a onclick="F_Atlas_Info._goAtlas(' + key + ')">查看图谱&gt;</a>\
                            </div>\
                        </li>';
                }
                i++;
            }
            b++;
        });
        return str;
    }
}