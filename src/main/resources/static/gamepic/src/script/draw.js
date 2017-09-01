function line (x1, y1, x2, y2, el) {
  var a = x1 - x2,
    b = y1 - y2,
    c = Math.sqrt(a * a + b * b)

  var sx = (x1 + x2) / 2,
    sy = (y1 + y2) / 2

  var x = sx - c / 2,
    y = sy

  var alpha = Math.PI - Math.atan2(-b, a)
  var style = 'width: ' + c + 'px; '
    + 'height: 1px; '
    + '-moz-transform: rotate(' + alpha + 'rad); '
    + '-webkit-transform: rotate(' + alpha + 'rad); '
    + '-o-transform: rotate(' + alpha + 'rad); '
    + '-ms-transform: rotate(' + alpha + 'rad); '
    + 'top: ' + y + 'px; '
    + 'left: ' + x + 'px; '
  var lineDom = '<div class="line" style="' + style + '"></div>'
  if (el) {
    el.append(lineDom)
  }else {
    $('#canvas').append(lineDom)
  }
}

function arc (e, x, y, r) {
  e.css({
    top: y - r,
    left: x - r,
    height: r * 2,
    width: r * 2
  })
}
