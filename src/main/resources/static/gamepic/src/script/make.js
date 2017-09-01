// var getWindowSize = function () {
//   return {
//     height: window.innerHeight,
//     width: window.innerWidth

//   }
// }

var getWindowSize = function () {
  var div = document.getElementById('canvas')
  return {
    //  // height: 1500,
    //  // width: 2000
    height: div.clientHeight,
    width: div.clientWidth
  }
}

var makeCenter = function () {
  $('#canvas').append('<div id="center" class="arc"><p></p></div>')
  var center = $('#center')
  center.children('p').text(config.center.font.text)
  arc(center, getWindowSize().width / 2, getWindowSize().height / 2, config.center.radius)
}

var child = function () {
  var ox = getWindowSize().width / 2
  var oy = getWindowSize().height / 2
  var d = Math.PI * 2 / data.length
  var r = config.child.distance + config.center.radius
  for (var i = 0; i < data.length; i++) {
    var x = ox + Math.sin(i * d) * r
    var tx = ox + Math.sin(i * d) * r / 2
    var y = oy + Math.cos(i * d) * r
    var ty = oy + Math.cos(i * d) * r / 2
    // $('#canvas').append('<div class="arc child child-1-' + i + '"></div>')
    // dom添加
    var arcDom = ''
    arcDom += '<div class="arc child child1 child-1-' + i + '">'
    arcDom += '<span class="game-pic child-pic">'
    arcDom += '<img src="assets/images/' + data[i].image + '" />'
    arcDom += '</span>'
    arcDom += '<div class="pop">'
    arcDom += '<ul class="inner-circle">'
    arcDom += '<li><a>' + '查看图谱' + '</a></li>'
    arcDom += '<li><a>' + '灯塔透视' + '</a></li>'
    arcDom += '</ul>'
    arcDom += '<ul class="style-list">'
    arcDom += '<li class="circle-tag">'
    arcDom += '<img class="star"/ src="assets/images/collect.png">'
    arcDom += '</li>'
    arcDom += '<li class="circle-tag">'
    arcDom += '<a>' + '卡牌' + '</a>'
    arcDom += '</li>'
    arcDom += '<li class="circle-tag">'
    arcDom += '<a>' + '卡牌卡牌卡牌' + '</a>'
    arcDom += '</li>'
    arcDom += '<li class="circle-tag">'
    arcDom += '<a>' + '卡牌' + '</a>'
    arcDom += '</li>'
    arcDom += '<li class="circle-tag">'
    arcDom += '<a>' + '卡牌' + '</a>'
    arcDom += '</li>'
    arcDom += '<li class="circle-tag">'
    arcDom += '<a>' + '卡牌' + '</a>'
    arcDom += '</li>'
    arcDom += '</ul>'
    arcDom += '</div>'
    arcDom += '<b class="img-title">' + data[i].text + '</b>'
    arcDom += '</div>'
    $(arcDom).appendTo('#canvas')

    // $('.child-1-' + i).append('<image src="assets/images/' + data[i].image + '"/>')
    var tagdig = Math.PI * 2 / $('.child-1-' + i + '  .circle-tag').length // 每一个li对应的角度
    $('.child-1-' + i + '  .circle-tag').each(function (index, element) {
      $(this).css({
        position: 'absolute',
        left: Math.sin((tagdig * index)) * 80 + 85,
        top: Math.cos((tagdig * index)) * 80 + 85
      })
    })
    $('#canvas').append('<p class="relationship-text" style="top:' + ty + 'px;left:' + tx + 'px">' + data[i].ralationship + '</p>') // 关系添加
    $('#canvas').append('<div class="ball-scale-multiple" style="top:' + (oy + Math.cos(i * d) * (r - 80) / 2) + 'px;left:' + (ox + Math.sin(i * d) * (r - 80) / 2) + 'px"><div></div><div></div><div></div></div>') // 关系闪烁小点添加
    arc($('.child-1-' + i), x, y, config.child.radius)
    line(ox, oy, x, y)

    // 第二圈开始
    if (data[i].child) {
      var childR = config.child.child.distance
      for (var c = 0; c < data[i].child.length; c++) {
        // var childD = Math.PI * 2 / data.length * (i - 1.3) + Math.PI * 1 / data.length * c
        var childD = Math.PI * 2 / data.length * (i - 0.8) + Math.PI * 1.3 / data.length * c
        var childX = x + Math.sin(childD) * childR
        var childTX = x + Math.sin(childD) * childR / 2
        var childY = y + Math.cos(childD) * childR
        var childTY = y + Math.cos(childD) * childR / 2

        // $('.child-1-' + i).append('<div class="arc child2 child-2-' + c + '"></div>')

        // dom添加
        var arccDom = ''
        // arcDom += '<div class="arc child child1 child-1-' + i + '">'
        arccDom += '<div class="arc child child2 child-2-' + c + '">'
        arccDom += '<span class="game-pic child2-pic child-pic">'
        arccDom += '<img src="assets/images/' + data[i].child[c].image + '" />'
        arccDom += '</span>'
        arccDom += '<div class="pop">'
        arccDom += '<ul class="inner-circle">'
        arccDom += '<li><a>' + '查看图谱' + '</a></li>'
        arccDom += '<li><a>' + '灯塔透视' + '</a></li>'
        arccDom += '</ul>'
        arccDom += '<ul class="style-list">'
        arccDom += '<li class="circle-tag">'
        arccDom += '<img class="star"/ src="assets/images/collect.png">'
        arccDom += '</li>'
        arccDom += '<li class="circle-tag">'
        arccDom += '<a>' + '卡牌' + '</a>'
        arccDom += '</li>'
        arccDom += '<li class="circle-tag">'
        arccDom += '<a>' + '卡牌卡牌卡牌' + '</a>'
        arccDom += '</li>'
        arccDom += '<li class="circle-tag">'
        arccDom += '<a>' + '卡牌' + '</a>'
        arccDom += '</li>'
        arccDom += '<li class="circle-tag">'
        arccDom += '<a>' + '卡牌' + '</a>'
        arccDom += '</li>'
        arccDom += '<li class="circle-tag">'
        arccDom += '<a>' + '卡牌' + '</a>'
        arccDom += '</li>'
        arccDom += '</ul>'
        arccDom += '</div>'
        arccDom += '<b class="img-title">' + data[i].child[c].text + '</b>'
        arccDom += '</div>'
        $(arccDom).appendTo('.child-1-' + i)

        var tagdigg = Math.PI * 2 / $('.child-1-' + i + '>.child-2-' + c + '  .circle-tag').length // 每一个li对应的角度
        $('.child-2-' + c + '  .circle-tag').each(function (index, element) {
          $(this).css({
            position: 'absolute',
            left: Math.sin((tagdigg * index)) * 80 + 85,
            top: Math.cos((tagdigg * index)) * 80 + 85
          })
        })

        arc($('.child-1-' + i + '>.child-2-' + c), childX + 32 - x, childY + 32 - y, config.child.child.radius)
        line(36, 36, childX - x + 36, childY - y + 36, $('.child-1-' + i))
        $('#canvas').append('<p class="child2-rt child-1-' + i + 'text" style="top:' + childTY + 'px;left:' + childTX + 'px">' + data[i].child[c].ralationship + '</p>') // 关系添加
        $('#canvas').append('<div class="ball-scale-multiple child2-ball" style="top:' + (y + Math.cos(childD) * (childR + 60) / 2) + 'px;left:' + (x + Math.sin(childD) * (childR + 60) / 2) + 'px"><div></div><div></div><div></div></div>') // 关系闪烁小点添加

        // 第三圈开始
        if (data[i].child[c].child) {
          var childRR = config.child.child.child.distance
          // console.log(data[i].child[c].child.length)
          for (var cc = 0; cc < data[i].child[c].child.length; cc++) {
            // var childDD = (childD - Math.PI / 4 + Math.PI / 8 / data[i].child[c].child.length * (c + 1)) + Math.PI / 4 / data[i].child[c].child.length * (cc + 1)
            var childDD = Math.PI * 2 / data.length * (i - 1.3) + Math.PI * 1 / data.length * (c)+Math.PI/4/data[i].child[c].child.length*(cc+0.8);
            var childDDD = Math.PI * 2 / data.length * (i - 1.15) + Math.PI * 1 / data.length * (c)+Math.PI/5.66/data[i].child[c].child.length*(cc+0.8);
            var childXX = Math.sin(childDD) * childRR
            var childTTX =childTX+ Math.sin(childDD) * (childRR+250) / 2
            var childYY = Math.cos(childDD) * childRR
            var childTTY = childTY+Math.cos(childDD) * (childRR +250)/ 2
            // dom添加
            var arc3Dom = ''
            arc3Dom += '<div class="arc child3 child-3-' + cc + '">'
            arc3Dom += '<span class="game-pic child3-pic">'
            arc3Dom += '<img src="assets/images/' + data[i].child[c].child[cc].image + '" />'
            arc3Dom += '</span>'
            arc3Dom += '<div class="pop">'
            arc3Dom += '<ul class="inner-circle">'
            arc3Dom += '<li><a>' + '查看图谱' + '</a></li>'
            arc3Dom += '<li><a>' + '灯塔透视' + '</a></li>'
            arc3Dom += '</ul>'
            arc3Dom += '<ul class="style-list">'
            arc3Dom += '<li class="circle-tag">'
            arc3Dom += '<img class="star"/ src="assets/images/collect.png">'
            arc3Dom += '</li>'
            arc3Dom += '<li class="circle-tag">'
            arc3Dom += '<a>' + '卡牌' + '</a>'
            arc3Dom += '</li>'
            arc3Dom += '<li class="circle-tag">'
            arc3Dom += '<a>' + '卡牌卡牌卡牌' + '</a>'
            arc3Dom += '</li>'
            arc3Dom += '<li class="circle-tag">'
            arc3Dom += '<a>' + '卡牌' + '</a>'
            arc3Dom += '</li>'
            arc3Dom += '<li class="circle-tag">'
            arc3Dom += '<a>' + '卡牌' + '</a>'
            arc3Dom += '</li>'
            arc3Dom += '<li class="circle-tag">'
            arc3Dom += '<a>' + '卡牌' + '</a>'
            arc3Dom += '</li>'
            arc3Dom += '</ul>'
            arc3Dom += '</div>'
            arc3Dom += '<b class="img-title">' + data[i].child[c].child[cc].text + '</b>'
            arc3Dom += '</div>'
            $(arc3Dom).appendTo('.child-1-' + i + '> .child-2-' + c)

            var tagdigg3 = Math.PI * 2 / $('.child-1-' + i + '> .child-2-' + c + '> .child-3-' + cc + '  .circle-tag').length // 每一个li对应的角度
            $('.child-1-' + i + '> .child-2-' + c + '> .child-3-' + cc + '  .circle-tag').each(function (index, element) {
              $(this).css({
                position: 'absolute',
                left: Math.sin((tagdigg3 * index)) * 80 + 85,
                top: Math.cos((tagdigg3 * index)) * 80 + 85
              })
            })

            arc($('.child-1-' + i + '> .child-2-' + c + '> .child-3-' + cc), childXX + 32, childYY + 32, config.child.child.child.radius)
            line(36, 36, childXX + 36, childYY + 36, $('.child-1-' + i + '> .child-2-' + c))
            $('#canvas').append('<p class="child3-rt child-2-'+ i + c + 'text" style="top:' +  (y + (Math.cos(childD) +Math.cos(childDDD)) * (childRR +150) / 2)  + 'px;left:' + (x + (Math.sin(childD)+Math.sin(childDDD)) * (childRR+150) / 2) + 'px">' + data[i].child[c].ralationship + '</p>') // 关系添加
            $('#canvas').append('<div class="ball-scale-multiple child3-ball" style="top:' + (y + (Math.cos(childD) +Math.cos(childDDD)) * (childRR +180) / 2) + 'px;left:' + (x + (Math.sin(childD)+Math.sin(childDDD)) * (childRR+180) / 2) + 'px"><div></div><div></div><div></div></div>') // 关系闪烁小点添加
          }
        }
      }
    }
  }
}

makeCenter()
child()

$(window).resize(function () {
  // $('#canvas *').remove()
  // makeCenter()
  // child()
self.location.reload() //自动刷新页面
})
