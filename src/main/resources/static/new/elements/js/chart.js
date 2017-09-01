function getEChart(type,dom,data){
    switch(type){
        case 'line':
        case 'pie':
            option = {
                color:['#AEDD8C','#72C4FF', '#FFA6A5', '#BFA4F1', '#FFDE5D','#EE9ABC',  '#4ECDC4', '#73D7F7','#F9FF91', '#FDB96A', '#FF9900'],
                title: !data.title ? '': data.title,
                tooltip : {
                    formatter:!data.tooltip.formatter ? '': data.tooltip.formatter,
                    trigger: data.tooltip.trigger,
                    backgroundColor:"#ffffff",
                    borderColor:'#E5E5E5',
                    borderWidth:1,
                    padding:5,
                    textStyle:{
                        color:'#A9A9A9',
                        fontSize:'11px'
                    },
                    axisPointer:{
                        lineStyle:{
                            color:'#DBDBDB'
                        }
                    }
                },
                dataZoom: !data.dataZoom ? '': data.dataZoom,
                legend: data.legend,
                grid: data.grid,
                xAxis : data.xAxis,
                yAxis : data.yAxis,
                series : data.series
            };
            break;
    }
    var myChart = echarts.init(document.getElementById(dom));
    myChart.setOption(option);

    switch(dom){
        case 'bs_qdpl':
            var name = '';
            var seriesName = '';
            myChart.on('click',function (params) {
                if(params.name != name || params.seriesName != seriesName){
                    name = params.name;
                    seriesName = params.seriesName;
                    F_Word._getDayDate(params.seriesName,params.name);
                }
            });
            break;
        case 'bs_ltfx':
            switch(type){
                case 'pie':
                    myChart.on('click',function (params) {
                        switch(params.seriesIndex){
                            case 0:
                                if(F_Forum._buffData.useless_name != params.name){
                                    var type = params.name.split(' ');
                                    type = type[0];
                                    F_Forum._getUseless(type);
                                }
                                break;
                            case 1:

                                break;
                        }
                    });
                    break;
            }
            break;
    }
}