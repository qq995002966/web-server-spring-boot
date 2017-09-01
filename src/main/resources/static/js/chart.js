function drawChartStackBar(container,
                           y_title,
                           x_title,
                           title,
                           arr_x,
                           series,
                           click_callback,colors, type, no_xy
)
{

    y_title=y_title.split("").join("<br>");

    var opt={
        chart: {
            type: !type ? 'column' :  type,

            backgroundColor: 'rgba(0,0,0,0)'
        },
        exporting:{
            enabled:false
        },
        credits: {
            enabled: false
        },
        title: {
            text: title,
            style:{
                "font-weight":"bold",
                "font-size":"14px",
                "color":"#596776",
                "font-family":"Microsoft YaHei,微软雅黑,MicrosoftJhengHei,华文细黑,STHeiti,MingLiu"
            }
        },
        xAxis: {
            categories: arr_x,
            lineColor:'#abafb0',
            title:{
                text:x_title
            },labels: {
                enabled: true
            }
        },


    colors:[ '#aede8c','#71c4ff','#ffa5a5','#bfa5f1','#ffdf62',
             '#ef9dbf','#fdb96a','#4ecdc4','#73d7f7','#f9ff91',
             '#cdfda7','#df93ff','#f1956e','#ebd376','#c3c3e3',
             '#ad9785','#ffd7fd','#b1cfff','#cdcdcd','#bfe1e3'],
        yAxis: {
            allowDecimals:false,
            min: 0,
            gridLineColor:'#eeeeee',
            title: {
                text: y_title,
                margin:30,
                rotation:0
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            },labels: {
                enabled: true
            }
        },
        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth:'1.0',
            borderRadius:'5.0',
            itemHoverStyle:{
                'color':'#878787'
            }
        },
        tooltip: {
            formatter: function () {
                return this.x+'<br/>'+this.series.name + ': ' + this.y + '<br/>';
            }/*,
             style:{
             display:'none' //通过样式表控制不显示tooltip数据提示框
             }*/
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                borderColor:"",
                pointWidth: 40,
                minPointLength:5,
                dataLabels: {
                    enabled: false,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                },
                cursor: 'pointer',
                events: {
                    click: function(e) {
                        click_callback && click_callback(e);
                    }
                }
            },
            spline: {
                dataLabels: {
                    enabled: false,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                },
                cursor: 'pointer',
                events: {
                    click: function(e) {
                        click_callback && click_callback(e);
                    }
                }
            }
        },
        series: series
    };

    if(type=='spline')
    {
        opt.xAxis.gridLineColor='#eeeeee';
        opt.xAxis.gridLineWidth=1;
    }

    if(colors)
        opt.colors=colors;

    if(no_xy)
    {
        opt.xAxis.labels.enabled=false;
        opt.yAxis.labels.enabled=false;
        opt.legend.borderWidth='0';
    }

    container.highcharts(opt);
}

function drawChartMultiSerieColumn(container,y_title, x_title, title, arr_x, arr_y,click_callback)
{

    y_title=y_title.split("").join("<br>");

    var _arr_y_with_color=[];

    var colors=[
        "#71c4ff"
    ];


    for(var i=0; i<arr_y.length; ++i)
    {
        _arr_y_with_color.push({
            color:colors[i%colors.length],
            y:arr_y[i]});
    }

 //   var max_y=arr_y.sort(function(a,b){return a-b;}).pop();

    var opt={
        chart: {
            type: 'column',
            backgroundColor: 'rgba(0,0,0,0)'
        },

        exporting:{
            enabled:false
        },
        credits: {
            enabled: false
        },
        title: {
            text: title,
            style:{
                "font-weight":"bold",
                "font-size":"14px",
                "color":"#596776",
                "font-family":"Microsoft YaHei,微软雅黑,MicrosoftJhengHei,华文细黑,STHeiti,MingLiu"
            }
        },
        xAxis: {
            title: {
                text: x_title
            },
            categories: [""],
            lineColor:'#abafb0',
            tickColor:'#abafb0',
            tickWidth:2,
            tickPosition:'outside'
        },
        colors: [
            '#84c341',
        ],
        yAxis: {
            title: {
                text: y_title,
                margin:30,
                rotation:0
            },
            gridLineColor:'#eeeeee',
            plotLines: [{
                value: 0,
                width: 1
            }]
        },
        series:[],
        tooltip: {
            shadow: true,
            formatter: function() { //格式化提示信息
                return this.x+tootip+":"+this.y;
            }
        },
        legend: {
            enabled:false
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            },
            column:{

                dataLabels:{

                    enabled:true //是否显示数据标签

                },
                cursor:'pointer',
                events: {
                    click: function(e) {
                        click_callback && click_callback(e);
                    }
                }

            }
        }
    };

    for(var i=0;i<arr_y.length; ++i)
    {
        opt.series.push({
            name:arr_x[i],
            data:[arr_y[i]]
        });
    }

    container.highcharts(opt);
}


function drawChart1SerieColumn(container, y_title, x_title, title, arr_x, arr_y, tootip, click_callback, enable_scroll, _colors)
{

    y_title=y_title.split("").join("<br>");

    var _arr_y_with_color=[];

    var colors=[
        "#71c4ff"
    ];

    if(_colors)
    {
        colors=_colors;
    }


    for(var i=0; i<arr_y.length; ++i)
    {
        if(isNaN(arr_y[i]))
        {
            arr_y[i].color=colors[i % colors.length];
            _arr_y_with_color.push(arr_y[i]);
        }
        else
        {
            _arr_y_with_color.push({
                color: colors[i % colors.length],
                y: arr_y[i].y,
                dataLabel:arr_y[i].dataLabel
            });
        }
    }



    var max_y=0;

    if(arr_y.length)
    {
        max_y=arr_y.sort(function(a,b){return a.y - b.y;}).pop().y;
    }


    var opt={
        chart: {
            type: 'column',
            backgroundColor: 'rgba(0,0,0,0)'
        },

        exporting:{
            enabled:false
        },
        credits: {
            enabled: false
        },
        title: {
            text: title,
            style:{
                "font-weight":"bold",
                "font-size":"14px",
                "color":"#596776",
                "font-family":"Microsoft YaHei,微软雅黑,MicrosoftJhengHei,华文细黑,STHeiti,MingLiu"
            }
        },
        xAxis: {
            title: {
                text: x_title
            },
            categories: arr_x,
            lineColor:'#abafb0',
            tickColor:'#abafb0',
            tickWidth:2,
            tickPosition:'outside'
        },
        colors: [
            '#84c341',
        ],
        yAxis: {
            allowDecimals:false,
            title: {
                text: y_title,
                margin:30,
                rotation:0
            },
            gridLineColor:'#eeeeee',
            plotLines: [{
                value: 0,
                width: 1
            }]
        },
        tooltip: {
            shadow: true,
            formatter: function() { //格式化提示信息
                return (this.point._data_label ? this.point._data_label : "")+tootip+":"+this.y;
            }
        },
        legend: {
            enabled:false
        },
        series: [{
            name: '',
            data: _arr_y_with_color
        }],
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            },
            column:{
                pointPadding: 60,//数据点之间的距离值
                pointWidth: 40,
                borderRadius: 0,
                dataLabels:{

                    enabled : true, //是否显示数据标签

                    formatter: function () {

                        return this.point._data_label;

                    }

                },
                cursor:'pointer',
                events: {
                    click: function(e) {
                        click_callback && click_callback(e);
                    }
                }

            }
        }
    };

    if(enable_scroll)
    {
        opt.scrollbar={
            enabled:true
        };

        opt.xAxis.max=10;

        opt.yAxis.maxTickInterval=50;
        opt.yAxis.minTickInterval=50;

        if(max_y<=100)
            max_y*=1.5;
        else
            max_y*=1.2;


        if(max_y<=50)
        {
            opt.yAxis.maxTickInterval=max_y+5;
            opt.yAxis.minTickInterval=max_y+5;
        }

        opt.yAxis.max=max_y;

    }


    container.highcharts(opt);
}

function drawTreeMap(container, data, tooltip_func, click_callback)
{

    var colors=['#fe6f6b','#22cb22','#009ee6','#ff9999','#8fd160','#48b3ff'];

    for(var i=0; i<data.length; ++i)
    {
        data[i].color=colors[i%colors.length];
    }

    container.highcharts({
        colors:colors,
        exporting:{
            enabled:false
        },
        credits: {
            enabled: false
        },
        plotOptions:{
            'treemap':{
                borderWidth:"5",
                borderColor:"#ffffff",
                cursor:'pointer',
                events: {
                    click: function(e) {
                        click_callback && click_callback(e);
                    }
                }
            }
        },
        tooltip: {
            shadow: true,
            formatter: function() { //格式化提示信息
                if(tooltip_func)
                {
                    return tooltip_func(this);
                }
                else
                    return this.point.name+":"+this.point.value;
            }
        },
        series: [{
            type: "treemap",
            layoutAlgorithm: 'strip',//'squarified',
            data: data
        }],
        title: {
            text: ''
        }
    });
}

function drawChartPie(container, data, tooltip_func, click_callback, colors, not_donut, showInLegend, show_percent_label)
{
    var opt={

        chart: {

            type: 'pie' //图表类型还是pie图

        },

        colors: [
            '#2ec7c9',
            '#b6a2de',
            '#34abff',
            '#ffb980',
            '#d87a80',
            '#8d98b3',
            '#fcce10',
            '#b5c334',
            '#95706d',
            '#dc69aa',
        ],
        tooltip: {
            shadow: true,
            formatter: function() { //格式化提示信息
                if(tooltip_func)
                {
                    return tooltip_func(this);
                }
                else
                    return this.y;
            }
        },
        title: {
            text: "",

            style:{
                "font-weight":"bold",
                "font-size":"14px",
                "color":"#596776",
                "font-family":"Microsoft YaHei,微软雅黑,MicrosoftJhengHei,华文细黑,STHeiti,MingLiu"
            }
        },

        plotOptions: {

            pie: {

                innerSize: '30%', //也可以配置为10%的百分比形式

                size:'90%',

                borderColor:"",

                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    style: {
                        color: '#596776'
                    }
                },
                events: {
                    click: function(e) {
                        click_callback && click_callback(e);
                    }
                },
                showInLegend: false
            }

        },

        credits: {
            enabled: false
        },
        series: [{
            data: data/*[
             ['1',   20],
             ['2',       19],
             ['3',       18],
             ['4',    17],
             ['5',    16],
             ['6',   15],
             ['7',       14],
             ['8',       13],
             ['9',    12],
             ['10',    11]
             ]*/
        }]
    };

    if(colors)
    {
        opt.colors=colors;
    }

    if(not_donut)
    {
        opt.plotOptions.pie.innerSize=0;
    }

    if(showInLegend)
    {
        opt.plotOptions.pie.showInLegend=true;
    }

    if(show_percent_label)
    {
        opt.plotOptions.pie.dataLabels.distance=5;
        opt.plotOptions.pie.dataLabels.format='';
        opt.plotOptions.pie.dataLabels.formatter=function(){
            return this.point._percentage;
        }
    }

    container.highcharts(opt);
}
