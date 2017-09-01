function getEchart(type,dom,data,name,color){
    switch(type){
        case 'map':
            data= $.map(data, function(d){
                return {
                    name:d.name,
                    value: parseFloat(d.value)
                };
            });
            var max=0;
            for(var i=0; i<data.length; ++i)
            {
                if(data[i].value>max)
                {
                    max=data[i].value;
                }
            }
            option = {
                backgroundColor: '#ffffff',
                title: {},
                mapLocation: {
                    x : 'left',
                    y : 'top',
                    height : 500
                },
                tooltip : {
                    trigger: 'item',
                    formatter : function (params){
                        var content = '';
                        if(params.value)
                            content = params.name+' '+params.value+'%';
                        else
                            content = params.name+'-';

                        switch(dom){
                            case 'pymap':
                                content += '\r\n点击可查看详情';
                                break;
                        }
                        return content;
                    }
                },
                visualMap: {
                    show:true,
                    min: 0,
                    max: max,
                    left: 'right',
                    itemHeight:60,
                    bottom: 60,
                    text: ['高','低'],           // 文本，默认为数值文本
                    calculable: true,
                    color:['#51c7ef','#91cfe4','#dde7ea']
                },
                series : [
                    {
                        name: name,
                        type: 'map',
                        mapType: 'china',
                        data: data,
                        roam: false,
                        itemStyle:{
                            normal:{
                                label:{show:false},
                                borderWidth:1,//省份的边框宽度
                                borderColor:'#ffffff'//省份的边框颜色
                            },
                            emphasis:{label:{show:true}}
                        },
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        zlevel: 1
                    }
                ]
            };
            break;
        case 'pie':
            option = {
                title : {
                    text: '',
                    subtext: '',
                    x:''
                },
                tooltip : {
                    trigger: '',
                    formatter: "{b} {c}\r\n点击可查看详情"
                },
                legend: {
                    orient: '',
                    left: '',
                    data: []
                },
                color:color,
                series : [
                    {
                        hoverAnimation :false,
                        name: name,
                        type: 'pie',
                        radius : '60%',
                        center: ['50%', '50%'],
                        label: {
                            normal: {
                                show: true
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                length:15,
                                length2:1
                            }
                        },
                        data:data,
                        itemStyle: {
                            normal: {
                                show: false
                            }
                        }
                    }
                ]
            };
            break;
        case 'scatter':
            option = {
                title : {},
                grid: {
                    z:100,
                    top: '3%',
                    left: '1%',
                    right: '3%',
                    bottom: '1%',
                    containLabel: true
                },
                tooltip : {
                    trigger: 'item',
                    formatter : function (params){
                        //return '用户活跃：'+params.value[0]+' 抱怨程度：'+params.value[1]+'%';
                        return '抱怨程度：'+params.value[1]+'%';
                    }
                },
                legend: {},
                xAxis : [
                    {
                        type : 'value',
                        scale:true,
                        axisLine:{
                            show : false
                        },
                        axisLabel : {
                            show : false,
                            formatter: '{value} '
                        },
                        splitLine: {
                            show : false
                        }
                    }
                ],
                yAxis : [
                    {
                        max:data.max,
                        type : 'value',
                        scale:true,
                        axisLine:{
                            show : false
                        },
                        axisLabel : {
                            formatter: '{value}% '
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'solid'
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:name,
                        type:'scatter',
                        symbolSize:5,
                        data: data.data,
                        lineStyle :{
                            color : '#B2D5E8'
                        },
                        markPoint: {
                            data: [
                                {
                                    coord: data.markData,
                                    symbol:'pin',
                                    symbolSize:120,
                                    label: {
                                        normal: {
                                            show: true,
                                            formatter: data.markName
                                        }

                                    }
                                }
                            ]
                        }
                    }
                ]
            };
            break;
        case 'bar':
            option = {
                title: {},
                tooltip: {
                    trigger: 'item',
                    formatter : function (params){
                        return params.name+"<br>"+params.value;
                    }
                },
                legend: {},
                grid: {
                    top: '1%',
                    left: '4%',
                    right: '1%',
                    bottom: '1%',
                    containLabel: true
                },
                xAxis: {
                    axisLine:{
                        show : false
                    },
                    splitLine: {show: false},
                    type: 'category',
                    data: data['xaxis']
                },
                yAxis: {
                    axisLine:{
                        show : false
                    },
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                series: [
                    {
                        itemStyle: {
                            normal: {
                                color: color
                            }
                        },
                        name: name,
                        type: 'bar',
                        data: data['data']
                    }
                ]
            };
            break;
        case 'line':
            option = {
                title: {},
                tooltip : {
                    trigger: 'item',
                    formatter : function (params){
                        switch(dom){
                            case 'chart_post_hour':
                                return params.name+"<br>"+params.value+'%';
                                break;
                            default:
                                return params.name+"<br>"+params.value;
                                break;
                        }
                    }
                },
                legend: {
                    left: 'right',
                    data: []
                },
                xAxis: {
                    axisLine:{
                        show : false
                    },
                    type: 'category',
                    name: '',
                    splitLine: {show: false},
                    data: data['xaxis']
                },
                grid: {
                    top: '3%',
                    left: '1%',
                    right: '1%',
                    bottom: '1%',
                    containLabel: true
                },
                yAxis: {
                    axisLine:{
                        show : false
                    },
                    type: 'value',
                    name: ''
                },
                series: [
                    {
                        name: name,
                        type: 'line',
                        symbol:'circle',
                        symbolSize:8,
                        showAllSymbol: true,
                        data: data['data'],
                        lineStyle:{
                            normal:{
                                color:'#B2D5E8',
                                width:4
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#65ABCF'
                            }
                        }
                    }
                ]
            };
            switch(dom){
                case 'chart_post_hour':
                    option.yAxis.axisLabel ={formatter: '{value}% '};
                    break;
            }
            break;
        case 'barTwo':
            option = {
                title: {},
                tooltip: {
                    trigger: 'item',
                    formatter : function (params){
                        return params.name+"<br>"+params.value+"%";
                    }
                },
                legend: {
                    left: 'right',
                    data:[
                        {
                            name:name[0],
                            icon: 'circle'
                        },
                        {
                            name:name[1],
                            icon: 'circle'
                        }]
                },
                grid: {
                    top: '10%',
                    left: '4%',
                    right: '1%',
                    bottom: '1%',
                    containLabel: true
                },
                xAxis: {
                    axisLine:{
                        show : false
                    },
                    splitLine: {show: false},
                    type: 'category',
                    data: data['xaxis']
                },
                yAxis: {
                    axisLine:{
                        show : false
                    },
                    axisLabel:{formatter: '{value}% '},
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                series: [
                    {
                        itemStyle: {
                            normal: {
                                color: '#65ABCF'
                            }
                        },
                        name: name[0],
                        type: 'bar',
                        data: data['data1']
                    },
                    {
                        itemStyle: {
                            normal: {
                                color: '#D9C16B'
                            }
                        },
                        name: name[1],
                        type: 'bar',
                        data: data['data2']
                    }
                ]
            };
            break;
        case 'lineTwo':
            option = {
                title: {},
                tooltip : {
                    trigger: 'item',
                    formatter : function (params){
                        switch(dom){
                            case 'chart_post_hour_compare':
                                return params.name+"<br>"+params.value+'%';
                                break;
                            default:
                                return params.name+"<br>"+params.value;
                                break;
                        }
                    }
                },
                legend: {
                    left: 'right',
                    data:[
                        {
                            name:name[0],
                            icon: 'circle'
                        },
                        {
                            name:name[1],
                            icon: 'circle'
                        }]
                },
                xAxis: {
                    axisLine:{
                        show : false
                    },
                    type: 'category',
                    name: '',
                    splitLine: {show: false},
                    data: data['xaxis']
                },
                grid: {
                    top: '10%',
                    left: '1%',
                    right: '1%',
                    bottom: '1%',
                    containLabel: true
                },
                yAxis: {
                    axisLine:{
                        show : false
                    },
                    type: 'value',
                    name: ''
                },
                series: [
                    {
                        name: name[0],
                        type: 'line',
                        symbol:'circle',
                        symbolSize:8,
                        showAllSymbol: true,
                        data: data['data1'],
                        lineStyle:{
                            normal:{
                                color:'#B2D5E8',
                                width:4
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#65ABCF'
                            }
                        }
                    },
                    {
                        name: name[1],
                        type: 'line',
                        symbol:'circle',
                        symbolSize:8,
                        showAllSymbol: true,
                        data: data['data2'],
                        lineStyle:{
                            normal:{
                                color:'#ECE1B6',
                                width:4
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#D9C16B'
                            }
                        }
                    }
                ]
            };

            switch(dom){
                case 'chart_post_hour_compare':
                    option.yAxis.axisLabel ={formatter: '{value}% '};
                    break;
            }
            break;

    }

    var myChart = echarts.init(document.getElementById(dom));
    myChart.setOption(option);
    switch(dom){
        case 'pymap':
            myChart.on('click', function (params) {
                openDetail(params.name,'province',1);
            });
            break;
        case 'callupon':
            myChart.on('click', function (params) {
                var keyword = params.name;
                keyword = keyword.substr(0,3);
                openDetail(keyword,'influence_level',1);
            });
            break;
        case 'dynamic':
            myChart.on('click', function (params) {
                var keyword = params.name;
                keyword = keyword.substr(0,3);
                openDetail(keyword,'active_class',1);
            });
            break;
    }

}