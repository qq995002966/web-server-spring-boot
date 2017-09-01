package cn.thinkingdata.web.util;

import cn.thinkingdata.web.constant.ChartConstant;
import cn.thinkingdata.web.constant.ChartForm;
import org.apache.commons.collections.map.HashedMap;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.*;

/**
 * @author Carpenter
 * @date 2017/3/6 16:01
 * @description SQLDataFormatUtil
 */
public class SQLDataFormatUtil {

    public static Object formatSQLData(List data,ChartForm chartForm){
        Object resultData = null;
        switch (chartForm){
            case PIE_CHART:
                resultData = transform2PieChart(data);
                break;
            case ORIENTATION_BAR_GRAPH:
                resultData = transform2OrientationBarGraph(data);
                break;
            case LINE_CHART:
                resultData = transform2LineChart(data);
                break;
            case PORTRAIT_BAR_GRAPH:
                resultData = transform2PortraitBarGraph(data);
                break;
            case STACKED_LINE_CHART:
                resultData = transform2StackedLineChart(data);
                break;
            case DATA_TABLE:
                resultData = transform2DataTable(data);
                break;
            case LINE_BAR_GRAPH:
                resultData = transform2LineBarGraph(data);
                break;
            case OPTIONS_BAR_GRAPH:
                resultData = transform2OptionsBarGraph(data);
                break;
            case OPTIONS_DATA_TABLE:
                resultData = transform2OptionsDataTable(data);
                break;
            default:
                resultData = data;
                break;
        }
        return resultData;
    }

    private static List transform2PieChart(List<Map<String,Object>> data){
        return data;
    }

    private static List transform2OrientationBarGraph(List<Map<String,Object>> data){
        return data;
    }

    private static Object transform2LineChart(List<Map<String,Object>> data){
        Map<String,Object> resultMap = new LinkedHashMap<>();
        Map<String,LinkedList<String>> x_map = new LinkedHashMap();

        for (Map<String,Object> map:data){
                LinkedList<String> x_list = x_map.get(map.get("item"));
                if (null == x_list) {
                    x_list = new LinkedList();
                }
                Object x_data_obj = map.get("x_axis");
                String x_data = null;
                if (x_data_obj == null) {
                    x_data_obj = map.get("data_date");
                    x_data = x_data_obj.toString();
                }else {
                    x_data = x_data_obj.toString();
                }
                x_list.addLast(x_data);
                x_map.put(map.get("item").toString(), x_list);
        }
        Set itemSet = x_map.keySet();
        LinkedList x_axisList = new LinkedList();
        for(Object item : itemSet){
            x_axisList =  x_map.get(item);
            break;
        }
        for (Map<String,Object> map:data){
            Map<String, Object> itemMap = CommonUtil.Object2Map(resultMap.get(map.get("item")));
            List itemList = CommonUtil.Object2List(resultMap.get("item"));
            List y_axis = CommonUtil.Object2List(itemMap.get("y_axis"));

            Object x_data_obj = map.get("x_axis");
            String x_data = null;
            if (x_data_obj == null) {
                x_data_obj = map.get("data_date");
                x_data = x_data_obj.toString();
                resultMap.put("x_name","日期");
            }else {
                x_data = x_data_obj.toString();
                resultMap.put("x_name",map.getOrDefault("x_name","X轴"));
            }
            int y_size = y_axis.size();
            int x_index = x_axisList.indexOf(x_data);
            if (y_size > x_index && x_index >= 0) {
                y_axis.set(x_index, map.get("y_axis"));
            } else {
                for (int i = y_size; i < x_index; i++) {
                    y_axis.add("-");
                }
                y_axis.add(map.get("y_axis"));
            }
            itemMap.put("y_axis", y_axis);
            itemMap.put("y_unit", map.get("y_unit"));
            String yNameStr = map.get("item").toString() + "-" + map.getOrDefault("y_name","Y轴");
            itemMap.put("y_name",yNameStr);
            if (!itemList.contains(map.get("item"))) {
                itemList.add(map.get("item"));
                resultMap.put("item", itemList);
            }
            resultMap.put(map.get("item").toString(), itemMap);
        }

        List itemList = CommonUtil.Object2List(resultMap.get("item"));
        for(Object item : itemList){
            Map<String,Object> itemMap = CommonUtil.Object2Map(resultMap.get(item));
            List y_axis = CommonUtil.Object2List(itemMap.get("y_axis"));
            int y_size = y_axis.size();
            int x_size = x_axisList.size();
            if(y_size<(x_size-1)){
                for(int i = y_size;i<x_size;i++){
                    y_axis.add("-");
                }
            }
            itemMap.put("y_axis",y_axis);
            resultMap.put(item.toString(),itemMap);
        }
        resultMap.put("x_axis",x_axisList);
        return resultMap;
    }

    private static Object transform2PortraitBarGraph(List<Map<String,Object>> data){
        return transform2LineChart(data);
    }

    private static List transform2StackedLineChart(List<Map<String,Object>> data){
        return data;
    }

    private static Object transform2DataTable(List<Map<String,Object>> data){
        Map<String,Object> resultMap = new LinkedHashMap<>();
        List resultList = new ArrayList();
        List itemList = new ArrayList();
        for(Object object:data){
            if(object instanceof Map) {
                Map map = (Map) object;
                Set set = map.keySet();
                Map tempMap = new HashedMap();
                for (Object o : set) {
                    String key = o.toString();
                    Object itemData = map.get(key);
                    if (itemData instanceof Double) {
                        itemData = BigDecimal.valueOf(Double.valueOf(itemData.toString())).stripTrailingZeros().toPlainString();
                    }
                    tempMap.put(key, itemData);
                    if (!itemList.contains(key)) {
                        itemList.add(key);
                    }
                }
                resultList.add(tempMap);
            }
        }
        resultMap.put("data",resultList);
        resultMap.put("item",itemList);
        return resultMap;
    }

    private static List transform2LineBarGraph(List<Map<String,Object>> data){
        return data;
    }

    private static Object transform2OptionsBarGraph(List<Map<String,Object>> data){
        Map<String,Object> resultMap = new LinkedHashMap<>();
        for(Map<String,Object> map:data){
                String xName = (String) map.getOrDefault("x_name","X轴");
                String yName = (String) map.getOrDefault("y_name","Y轴");
                String select = map.get(ChartConstant.SELECT_LIST) + "";
                if (null != map.get(ChartConstant.SELECT_NAME)) {
                    select += ":" + map.get(ChartConstant.SELECT_NAME);
                }
                Map dataMap = CommonUtil.Object2Map(resultMap.get(select));
                Map<String, Object> itemMap = CommonUtil.Object2Map(dataMap.get(map.get(ChartConstant.ITEM)));
                List x_axis = CommonUtil.Object2List(dataMap.get(ChartConstant.X_AXIS));
                List y_axis = CommonUtil.Object2List(itemMap.get(ChartConstant.Y_AXIS));
                x_axis.add(map.get(ChartConstant.X_AXIS));
                NumberFormat nf = new DecimalFormat("#.0");
                y_axis.add(nf.format(map.get(ChartConstant.Y_AXIS)));
                dataMap.put(ChartConstant.X_AXIS, x_axis);
                dataMap.put("x_name",xName);
                itemMap.put(ChartConstant.Y_AXIS, y_axis);
                itemMap.put(ChartConstant.Y_UNIT, map.get(ChartConstant.Y_UNIT));
                itemMap.put("y_name",yName);
                List itemList = CommonUtil.Object2List(dataMap.get(ChartConstant.ITEM));
                if (!itemList.contains(map.get(ChartConstant.ITEM))) {
                    itemList.add(map.get(ChartConstant.ITEM));
                    itemMap.put(ChartConstant.ITEM, itemList);
                }
                dataMap.put(map.get(ChartConstant.ITEM), itemMap);
                resultMap.put(select, dataMap);
        }
        return resultMap;
    }

    private static List transform2OptionsDataTable(List<Map<String,Object>> data){
        return data;
    }
}
