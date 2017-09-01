package cn.thinkingdata.web.service.core.order;

import cn.thinkingdata.web.domain.order.Do_item;
import cn.thinkingdata.web.domain.order.Do_item_unit;
import cn.thinkingdata.web.persistence.order.Mapper_item;
import cn.thinkingdata.web.persistence.order.Mapper_item_unit;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.PrintWriter;
import java.util.*;

/**
 * Created by Xiaowu on 2016/8/10.
 */
@Service
public class ItemService {

    @Autowired
    private Mapper_item mapper_item;

    @Autowired
    Mapper_item_unit mapper_item_unit;

    public DataResult findItemList() {
        List<Do_item> itemList = mapper_item.getItemList();
        Map<String, Object> dataMap = new LinkedHashMap<>();
        Map<String, List<Do_item>> itemClassifyMap = new LinkedHashMap<>();
        for(Do_item do_item : itemList){
            List<Do_item> list = itemClassifyMap.get(do_item.getItem_classify());
            if(list == null){
                list = new ArrayList<>();
            }
            list.add(do_item);
            itemClassifyMap.put(do_item.getItem_classify(), list);
        }
        Map<String, List<Map<String,Object>>> itemClassifyRefineMap = new LinkedHashMap<>();
        for(Map.Entry<String, List<Do_item>> entry : itemClassifyMap.entrySet()){
            String itemClassify = entry.getKey();
            List<Do_item> list = entry.getValue();
            List<Map<String,Object>> mapList = new ArrayList<>();
            for(Do_item do_item : list){
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("item_id", do_item.getItem_id());
                map.put("item_name", do_item.getItem_name());
                map.put("item_slogan", do_item.getItem_slogan());
                map.put("cover_pic", do_item.getCover_pic());
                map.put("is_package", do_item.getIs_package());
                map.put("show_pic", do_item.getShow_pic());
                mapList.add(map);
            }
            itemClassifyRefineMap.put(itemClassify, mapList);
        }
        dataMap.put("item_map", itemClassifyRefineMap);

        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult findItemShow(Integer itemId) {
        List<Do_item_unit> do_item_units = mapper_item_unit.getItemUnitById(itemId);
        List<Map<String,Object>> item_units = new ArrayList<>();
        for(Do_item_unit do_item_unit : do_item_units){
            Map<String,Object> map = new HashMap<>();
            map.put("item_unit_id",do_item_unit.getItem_unit_id());
            map.put("item_unit",do_item_unit.getItem_unit());
            map.put("price",do_item_unit.getPrice());
            map.put("unit_name",do_item_unit.getUnit_name());
            map.put("unit_num",do_item_unit.getUnit_num());
            item_units.add(map);
        }
        Do_item do_item = mapper_item.getItemById(itemId);
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("item_id",do_item.getItem_id());
        dataMap.put("item_name",do_item.getItem_name());
        dataMap.put("item_desc",do_item.getItem_desc());
        dataMap.put("service_list",item_units);
        dataMap.put("game_scope",do_item.getGame_scope());
        //dataMap.put("is_on_sale",do_item.getIs_on_sale());
        //dataMap.put("create_time",do_item.getCreate_time());
        dataMap.put("item_pics",do_item.getItem_pics());
        dataMap.put("item_slogan", do_item.getItem_slogan());
        dataMap.put("item_classify", do_item.getItem_classify());
        dataMap.put("cover_pic", do_item.getCover_pic());
        dataMap.put("procedure_pics", do_item.getProcedure_pics());
        dataMap.put("is_package", do_item.getIs_package());
        dataMap.put("refer_price", do_item.getRefer_price());
        List<Map<String,Object>> recomItemMapList = new ArrayList<>();

        String recommendItemIDStr = do_item.getRecommend_items();
        if(recommendItemIDStr.length() > 0){
            String[] recomItemIds = recommendItemIDStr.split(",");
            List<Integer> itemIdList = new ArrayList<>();
            for(String recomItemId : recomItemIds){
                itemIdList.add(Integer.parseInt(recomItemId));
            }
            List<Do_item> recomItemList = mapper_item.getRecommendItemList(itemIdList);

            for(Do_item recomItem : recomItemList){
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("item_id", recomItem.getItem_id());
                map.put("item_name", recomItem.getItem_name());
                map.put("item_slogan", recomItem.getItem_slogan());
                map.put("cover_pic", recomItem.getCover_pic());
                map.put("refer_price", recomItem.getRefer_price());
                recomItemMapList.add(map);
            }
        }

        dataMap.put("recommend_item_list", recomItemMapList);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }
}
