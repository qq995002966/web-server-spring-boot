package cn.thinkingdata.web.service.core.user.custom.inner;

import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchObj;
import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchOrder;
import cn.thinkingdata.elasticsearch.query.util.ElasticSearchQueryUtil;
import cn.thinkingdata.web.constant.UserType;
import cn.thinkingdata.web.domain.elasticsearch.Do_table_mapping;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.domain.user.custom.inner.Do_game_search_table;
import cn.thinkingdata.web.domain.user.custom.inner.Do_search_column_meta;
import cn.thinkingdata.web.domain.user.custom.inner.game.Do_player_cluster_common_stat;
import cn.thinkingdata.web.domain.user.custom.inner.game.Do_player_cluster_detail_stat;
import cn.thinkingdata.web.domain.user.custom.inner.game.Do_player_cluster_radar_stat;
import cn.thinkingdata.web.domain.user.custom.inner.game.Do_player_lost_pay_stat;
import cn.thinkingdata.web.persistence.elasticsearch.Mapper_table_mapping;
import cn.thinkingdata.web.persistence.user.custom.inner.Mapper_game_search_table;
import cn.thinkingdata.web.persistence.user.custom.inner.Mapper_search_column_meta;
import cn.thinkingdata.web.persistence.user.custom.inner.Mapper_user_game;
import cn.thinkingdata.web.persistence.user.custom.inner.operation.Mapper_player_cluster_common_stat;
import cn.thinkingdata.web.persistence.user.custom.inner.operation.Mapper_player_cluster_detail_stat;
import cn.thinkingdata.web.persistence.user.custom.inner.operation.Mapper_player_cluster_radar_stat;
import cn.thinkingdata.web.persistence.user.custom.inner.operation.Mapper_player_lost_pay_stat;
import cn.thinkingdata.web.util.*;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.collections.map.HashedMap;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author Carpenter
 * @date 2017/3/7 14:17
 * @description PlayerAnalysisService
 */
@Service
public class PlayerAnalysisService {

    @Autowired
    private Mapper_player_cluster_common_stat mapperPlayerClusterCommonStat;
    @Autowired
    private Mapper_search_column_meta mapperSearchColumnMeta;
    @Autowired
    private Mapper_user_game mapperUserGame;
    @Autowired
    private Mapper_player_cluster_detail_stat mapperPlayerClusterDetailStat;
    @Autowired
    private Mapper_player_cluster_radar_stat mapperPlayerClusterRadarStat;
    @Autowired
    private Mapper_game_search_table mapperGameSearchTable;
    @Autowired
    private Mapper_table_mapping mapperTableMapping;
    @Autowired
    private Mapper_player_lost_pay_stat mapperPlayerLostPayStat;

    private static final Integer DEMO_GAME = 0;
    private static final String SEARCH_PREFIX = "s_";
    private static final int SERVICE_TYPE_PROPERTY = 3;
    private static final String TOTAL_CLUSTER_TYPE = "total_cluster_type";
    private static final String ACTIVE_CLUSTER_TYPE = "active_cluster_type";
    private static final String PAY_CLUSTER_TYPE = "pay_cluster_type";
    private static final String LOST_CLUSTER_TYPE = "lost_cluster_type";


    public Boolean gameAccessForbidden(Integer gameId){
        if(gameId.intValue() == DEMO_GAME){
            return false;
        }
        Do_user userDo = WebUtil.getCurrentUser();
        if(userDo == null){
            return false;
        }
        Set<Integer> innerGameSet = userDo.getInnerGameSet();
        if(innerGameSet.contains(gameId)){
            return false;
        }
        return true;
    }

    public DataResult getKeyPlayer(Integer gameId) {
        Optional<Do_player_cluster_common_stat> playerClusterCommonStatOpt = Optional.of(mapperPlayerClusterCommonStat.getPlayerClusterCommonStatListByGameId(gameId));
        if(playerClusterCommonStatOpt.isPresent()){
            Do_player_cluster_common_stat playerClusterCommonStat = playerClusterCommonStatOpt.get();
            List<Map> clusterTypeList = mapperPlayerClusterRadarStat.findPlayerClusterTypeAndCountByGameId(gameId);
            Map data = new HashMap();
            for(Map map:clusterTypeList){
                data.put(map.get("user_type")+"_group",map.get("num"));
            }
            data.put("active_high_lost_rate",playerClusterCommonStat.getActive_high_lost_rate());
            data.put("active_high_pay_rate",playerClusterCommonStat.getActive_high_pay_rate());
            data.put("active_num",playerClusterCommonStat.getActive_num());
            data.put("lost_num",playerClusterCommonStat.getLost_num());
            data.put("lost_paid_rate",playerClusterCommonStat.getLost_paid_rate());
            data.put("paid_high_lost_rate",playerClusterCommonStat.getPaid_high_lost_rate());
            data.put("paid_num",playerClusterCommonStat.getPaid_num());
            data.put("game_id",playerClusterCommonStat.getGame_id());
            return new DataResult(ReturnCodeDim.SUCCESS,data);
        }else {
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"该游戏数据正在准备");
        }

    }

    public DataResult findSearchMetaByService(Integer gameId) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        List<Do_search_column_meta> searchColumnMetas = mapperSearchColumnMeta.findSearchMetaByServiceAndGame(SERVICE_TYPE_PROPERTY,gameId);

        List<Do_search_column_meta> search_column_metas = new ArrayList<>();
        for(Do_search_column_meta doSearchColumnMeta: searchColumnMetas){
            doSearchColumnMeta.setColumn_name(SEARCH_PREFIX+doSearchColumnMeta.getColumn_name());
            search_column_metas.add(doSearchColumnMeta);
        }

        Map group = new HashedMap();
        List<Do_search_column_meta> primary = new ArrayList<>();
        List groupTitle = new ArrayList();
        for(Do_search_column_meta searchColumnMeta : search_column_metas){
            if(searchColumnMeta.getIs_primary() == 1){
                primary.add(searchColumnMeta);
                continue;
            }
            List groupList = (List) group.get(searchColumnMeta.getColumn_group());
            if(groupList == null){
                groupList = new ArrayList<>();
                groupTitle.add(searchColumnMeta.getColumn_group());
            }
            groupList.add(searchColumnMeta);
            group.put(searchColumnMeta.getColumn_group(),groupList);
        }
        Map result = new HashedMap();
        result.put("primary",primary);
        result.put("group",group);
        result.put("groupTitle",groupTitle);
        List searchColumnMetaList = new ArrayList();
        searchColumnMetaList.add(result);

        return new DataResult(ReturnCodeDim.SUCCESS,searchColumnMetaList);
    }

    public DataResult findPlayerClusterByGameId(String user_type, String cluster_type, Integer gameId) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        Integer aggCode = 1;
        if(cluster_type.equals("")){
            aggCode = 0;
        }
        List<Do_search_column_meta> searchColumnMetaList = mapperSearchColumnMeta.findSearchMetaByServiceAndGame(SERVICE_TYPE_PROPERTY,gameId);
        Map<String,Do_search_column_meta> metaMap = new HashMap();
        List<String> metaOrder = new ArrayList();
        List<String> metaGroupOrder = new ArrayList();
        for(Do_search_column_meta searchColumnMeta:searchColumnMetaList){
            if(searchColumnMeta.getColumn_group().length()>1){
                metaMap.put(searchColumnMeta.getColumn_name(),searchColumnMeta);
                if(!metaGroupOrder.contains(searchColumnMeta.getColumn_group())) {
                    metaGroupOrder.add(searchColumnMeta.getColumn_group());
                }
            }
            metaOrder.add(searchColumnMeta.getColumn_name());
        }
        List<Do_player_cluster_detail_stat> playerClusterDetailStatList = mapperPlayerClusterDetailStat.findPlayerClusterDetailStatByGameIdAndType(gameId,aggCode,user_type,cluster_type);
        Map<String,Object> playerClusterDetailStatMap = new HashMap();
        for(Do_player_cluster_detail_stat playerClusterDetailStat : playerClusterDetailStatList){
            Do_search_column_meta searchColumnMeta = metaMap.get(playerClusterDetailStat.getColumn_name());
            List list = CommonUtil.Object2List(playerClusterDetailStatMap.get(searchColumnMeta.getColumn_group()));
            Map data = new HashMap();
            data.put("name",searchColumnMeta.getColumn_desc());
            data.put("value",playerClusterDetailStat.getColumn_value());
            data.put("desc",searchColumnMeta.getColumn_explain());
            list.add(data);
            playerClusterDetailStatMap.put(searchColumnMeta.getColumn_group(),list);
        }
        List resultList = new ArrayList();
        for (String key : metaGroupOrder){
            if(null != playerClusterDetailStatMap.get(key)) {
                Map data = new HashMap();
                data.put("name",key);
                data.put("data",playerClusterDetailStatMap.get(key));
                resultList.add(data);
            }
        }
        return new DataResult(ReturnCodeDim.SUCCESS,resultList);
    }

    public DataResult findPlayerTagByGameId(String user_type, Integer gameId) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        List<Do_player_cluster_radar_stat> playerClusterRadarStatList = mapperPlayerClusterRadarStat.findPlayerClusterRadarStatByGameIdAndType(gameId,user_type);
        Map<String,Object> resultMap = new HashMap();
        List tagOrder = new ArrayList();
        for(Do_player_cluster_radar_stat playerClusterRadarStat : playerClusterRadarStatList){
            Map<String,Object> map = CommonUtil.Object2Map(resultMap.get(playerClusterRadarStat.getCluster_type()));
            map.put(playerClusterRadarStat.getColumn_name(),playerClusterRadarStat.getColumn_value());
            if(null == map.get("user_num")){
                map.put("user_num",playerClusterRadarStat.getUser_num());
                tagOrder.add(playerClusterRadarStat.getCluster_type());
            }
            resultMap.put(playerClusterRadarStat.getCluster_type(),map);
        }
        List resultList = new ArrayList();
        for(Object object:tagOrder){
            Map map = new HashMap();
            map.put("data",resultMap.get(object));
            map.put("name",object);
            resultList.add(map);
        }
        return new DataResult(ReturnCodeDim.SUCCESS,resultList);
    }

    public DataResult findPlayerBySearch(Integer gameId,String keyword,String group,String columnName, Map<String, Object> params) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        Do_game_search_table gameSearchTable = mapperGameSearchTable.findGameSearchTableByServiceAndGame(SERVICE_TYPE_PROPERTY,gameId);
        List<Do_search_column_meta> searchColumnMetas = mapperSearchColumnMeta.findSearchMetaByServiceAndGame(SERVICE_TYPE_PROPERTY,gameId);
        Integer histogramInterval = 0;
        Optional<Integer> histogramIntervalOpt = searchColumnMetas.stream().filter(searchColumnMeta -> searchColumnMeta.getColumn_group().equals(group)).filter(searchColumnMeta -> searchColumnMeta.getColumn_name().equals(columnName)).map(searchColumnMeta -> searchColumnMeta.getHistogram_interval()).findFirst();
        if(histogramIntervalOpt.isPresent()){
            histogramInterval = histogramIntervalOpt.get();
        }
        if(null == gameSearchTable){
            return new DataResult(ReturnCodeDim.DATA_NOT_PREPARED,"");
        }
        String TABLE_NAME = gameSearchTable.getTable_name();
        ArrayList<ElasticSearchObj> searchList = new ArrayList<>();
        ElasticSearchQueryUtil esUtil = ElasticSearchQueryUtil.getInstance();

        ElasticSearchObj searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "game_id", gameId + "");
        searchList.add(searchObj);

        if(null != keyword && keyword.length() > 0){
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.QUERY, "user_id\tcharacter_name", keyword);
            searchList.add(searchObj);
        }
        Boolean isSpan = false;
        Integer columnSpan = 0;
        for (Do_search_column_meta searchColumnMeta : searchColumnMetas) {
            String key = searchColumnMeta.getColumn_name();
            String type = searchColumnMeta.getSearch_type().split(":")[0];
            ElasticSearchObj.ESearchType eSearchType = ElasticSearchObj.ESearchType.QUERY;
            String value = "";
            if(key.equals(columnName)){
                if("span".equals(type)){
                    if(searchColumnMeta.getHistogram_interval() > 1){
                        isSpan = true;
                        columnSpan = searchColumnMeta.getHistogram_interval();
                    }
                }
            }
            if ("enum".equals(type)) {
                eSearchType = ElasticSearchObj.ESearchType.EQUAL;
                value = (String) params.get(SEARCH_PREFIX + key);
            } else if ("span".equals(type)) {
                String min = (String) params.get(SEARCH_PREFIX + key + "_min");
                String max = (String) params.get(SEARCH_PREFIX + key + "_max");
                if((CommonUtil.checkStringToDouble(min) || CommonUtil.checkStringToDouble(max))&&(searchColumnMeta.getSearch_type().equals("span"))){
                    return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"");
                }
                if (null != min && null != max) {
                    if((!CommonUtil.checkStringToDouble(min))&&(!CommonUtil.checkStringToDouble(min)) && (Double.valueOf(max) < Double.valueOf(min))){
                        return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"");
                    }
                    eSearchType = ElasticSearchObj.ESearchType.RANGE;
                    value = params.get(SEARCH_PREFIX + key + "_min") + "\t" + params.get(SEARCH_PREFIX + key + "_max");
                }
                if (null != min && null == max) {
                    eSearchType = ElasticSearchObj.ESearchType.GTE;
                    value = (String) params.get(SEARCH_PREFIX + key + "_min");
                }
                if (null == min && null != max) {
                    eSearchType = ElasticSearchObj.ESearchType.LTE;
                    value = (String) params.get(SEARCH_PREFIX + key + "_max");
                }
            } else {
                value = (String) params.get(SEARCH_PREFIX + key);
            }
            if (!CommonUtil.IsEmpty(value)) {
                searchObj = new ElasticSearchObj(eSearchType, key, value);
                searchList.add(searchObj);
            }
        }
        try {
            Map<String,Integer> resObj = esUtil.getFieldHistogramAgg(TABLE_NAME,searchList,columnName,histogramInterval);
            List x_axis = new ArrayList();
            List y_axis = new ArrayList();
            for(Map.Entry<String,Integer> entry : resObj.entrySet()) {
                x_axis.add(entry.getKey());
                y_axis.add(entry.getValue());
            }
            if(isSpan){
                Integer finalColumnSpan = columnSpan;
                x_axis = (List) x_axis.stream().map(o -> {
                    Integer num = Integer.parseInt(o.toString()) + finalColumnSpan;
                    return  o.toString()+ "~"+num;
                }).collect(Collectors.toList());
            }
            Map resultMap = new HashMap();
            resultMap.put("x_axis",x_axis);
            resultMap.put("y_axis",y_axis);
            return new DataResult(ReturnCodeDim.SUCCESS,resultMap);
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
        }
    }

    private String getUserTypeMeta(String userType){
        switch (UserType.fromString(userType)){
            case ACTIVE:
                return ACTIVE_CLUSTER_TYPE;
            case PAID:
                return PAY_CLUSTER_TYPE;
            case LOST:
                return LOST_CLUSTER_TYPE;
            case TOTAL:
                return TOTAL_CLUSTER_TYPE;
            default:
                return ACTIVE_CLUSTER_TYPE;
        }
    }

    public DataResult findPlayerGroup(Integer gameId) {
        List<Do_search_column_meta> searchColumnMetaList = mapperSearchColumnMeta.findSearchMetaByServiceAndGame(SERVICE_TYPE_PROPERTY,gameId);
        List searchColumnMetaGroupList = searchColumnMetaList
                .stream()
                .filter(searchColumnMeta -> searchColumnMeta.getHistogram_interval() != null)
                .map(searchColumnMeta -> searchColumnMeta.getColumn_group())
                .distinct()
                .collect(Collectors.toList());
        return new DataResult(ReturnCodeDim.SUCCESS,searchColumnMetaGroupList);
    }

    public DataResult findPlayerClusterTypeByGameId(Integer gameId) {
        List clusterTypeList = mapperPlayerClusterRadarStat.findPlayerClusterTypeByGameId(gameId);
        return new DataResult(ReturnCodeDim.SUCCESS,clusterTypeList);
    }

    public DataResult findPlayerGroupTag(Integer gameId, String group) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        List<Do_search_column_meta> searchColumnMetaList = mapperSearchColumnMeta.findSearchMetaByServiceAndGame(SERVICE_TYPE_PROPERTY,gameId);
        List searchColumnMetaGroupTagList = searchColumnMetaList
                .stream()
                .filter(searchColumnMeta -> searchColumnMeta.getHistogram_interval() != null)
                .filter(searchColumnMeta -> searchColumnMeta.getColumn_group().equals(group))
                .map(searchColumnMeta -> {
                    Map map = new HashMap();
                    map.put(searchColumnMeta.getColumn_name(),searchColumnMeta.getColumn_desc());
                    return map;
                })
                .distinct()
                .collect(Collectors.toList());
        return new DataResult(ReturnCodeDim.SUCCESS,searchColumnMetaGroupTagList);
    }

    public DataResult findPlayerData(Integer gameId,String keyword,String userType,String columnType,Integer index, Integer limit, Map<String, Object> params, String orderField, String orderType) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        Do_game_search_table gameSearchTable = mapperGameSearchTable.findGameSearchTableByServiceAndGame(SERVICE_TYPE_PROPERTY,gameId);
        List<Do_search_column_meta> searchColumnMetas = mapperSearchColumnMeta.findSearchMetaByServiceAndGame(SERVICE_TYPE_PROPERTY,gameId);
        if(null == gameSearchTable){
            return new DataResult(ReturnCodeDim.DATA_NOT_PREPARED,"");
        }
        String TABLE_NAMES[] = {gameSearchTable.getTable_name()};
        String INCLUDE_FIELDS_QUERY[] = new String[searchColumnMetas.size()];
        ArrayList<ElasticSearchObj> searchList = new ArrayList<>();
        ArrayList<ElasticSearchOrder> orderList = null;
        ElasticSearchQueryUtil esUtil = ElasticSearchQueryUtil.getInstance();
        ElasticSearchObj searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "game_id", gameId + "");
        searchList.add(searchObj);
        if(null != userType && userType.length() > 0){
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, getUserTypeMeta(userType), columnType);
            searchList.add(searchObj);
        }
        if(null != keyword && keyword.length() > 0){
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.QUERY, "user_id\tcharacter_name", keyword);
            searchList.add(searchObj);
        }
        orderList = new ArrayList<>();
        int i = 0;
        for (Do_search_column_meta searchColumnMeta : searchColumnMetas) {
            String key = searchColumnMeta.getColumn_name();
            INCLUDE_FIELDS_QUERY[i++] = key;
            String type = searchColumnMeta.getSearch_type().split(":")[0];
            ElasticSearchObj.ESearchType eSearchType = ElasticSearchObj.ESearchType.QUERY;
            String value = "";
            if ("enum".equals(type)) {
                eSearchType = ElasticSearchObj.ESearchType.EQUAL;
                value = (String) params.get(SEARCH_PREFIX + key);
            } else if ("span".equals(type)) {
                String min = (String) params.get(SEARCH_PREFIX + key + "_min");
                String max = (String) params.get(SEARCH_PREFIX + key + "_max");
                if((CommonUtil.checkStringToDouble(min) || CommonUtil.checkStringToDouble(max))&&(searchColumnMeta.getSearch_type().equals("span"))){
                    return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"");
                }
                if (null != min && null != max) {
                    if((!CommonUtil.checkStringToDouble(min))&&(!CommonUtil.checkStringToDouble(min)) && (Double.valueOf(max) < Double.valueOf(min))){
                        return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"");
                    }
                    eSearchType = ElasticSearchObj.ESearchType.RANGE;
                    value = params.get(SEARCH_PREFIX + key + "_min") + "\t" + params.get(SEARCH_PREFIX + key + "_max");
                }
                if (null != min && null == max) {
                    eSearchType = ElasticSearchObj.ESearchType.GTE;
                    value = (String) params.get(SEARCH_PREFIX + key + "_min");
                }
                if (null == min && null != max) {
                    eSearchType = ElasticSearchObj.ESearchType.LTE;
                    value = (String) params.get(SEARCH_PREFIX + key + "_max");
                }
                if (null != orderField && orderField.equals(SEARCH_PREFIX + key)) {
                    SortOrder sortOrder = SortOrder.ASC;
                    if (orderType.equals("desc")) {
                        sortOrder = SortOrder.DESC;
                    }
                    ElasticSearchOrder elasticSearchOrder = new ElasticSearchOrder(key, sortOrder);
                    orderList.add(elasticSearchOrder);
                }
            } else {
                value = (String) params.get(SEARCH_PREFIX + key);
            }
            if (!CommonUtil.IsEmpty(value)) {
                searchObj = new ElasticSearchObj(eSearchType, key, value);
                searchList.add(searchObj);
            }
        }
        Float minScore = null;
        String excludeFields[] = null;
        try {
            JSONObject resObj = esUtil.searchDataWithFieldFilter(TABLE_NAMES, index, limit, searchList, orderList, INCLUDE_FIELDS_QUERY, excludeFields,minScore);
            JSONObject dataJsonObject = resObj.getJSONObject("data");
            JSONArray jsonArray = (JSONArray) dataJsonObject.get("list");
            JSONArray newJsonArray = new JSONArray();
            for (Object object : jsonArray){
                JSONObject jsonObject = (JSONObject)object;
                JSONObject jsonSource = jsonObject.getJSONObject("source");
                JSONObject newJson = new JSONObject();
                Set<String> keys = jsonSource.keySet();
                for(String key : keys){
                    newJson.put(SEARCH_PREFIX+key,jsonSource.get(key));
                }
                jsonObject.put("source",newJson);
                newJsonArray.add(jsonObject);
            }
            dataJsonObject.put("list",newJsonArray);
            return new DataResult(ReturnCodeDim.SUCCESS,dataJsonObject);
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
        }
    }

    public void searchDataExcel(Integer gameId, String keyword, String userType, String columnType, Integer index, Integer limit, OutputStream outputStream, Map<String, Object> params) {
        if(gameAccessForbidden(gameId)){
            return ;
        }
        limit = 10000;
        List<Do_search_column_meta> searchColumnMetas = mapperSearchColumnMeta.findSearchMetaByServiceAndGame(SERVICE_TYPE_PROPERTY,gameId);
        Integer searcheTableId = 0;
        List<String> columOrder = new ArrayList<>();
        List<String> columName = new ArrayList<>();
        for(Do_search_column_meta searchColumnMeta : searchColumnMetas){
            columOrder.add(SEARCH_PREFIX+searchColumnMeta.getColumn_name());
            columName.add(searchColumnMeta.getColumn_desc());
            searcheTableId = searchColumnMeta.getGt_id();
        }
        Do_game_search_table gameSearchTable = mapperGameSearchTable.findGameSearchTableById(searcheTableId);
        List<Do_table_mapping>  tableMappings = mapperTableMapping.findTableMappingByTableName(gameSearchTable.getTable_name());
        Map<String,String> colum = new HashedMap();
        for(Do_table_mapping tableMapping : tableMappings){
            String fieldType = tableMapping.getField_type();
            if("date".equals(fieldType)){
                fieldType += "|"+ tableMapping.getField_format();
            }
            colum.put(SEARCH_PREFIX+tableMapping.getField_name(),fieldType);
        }
        DataResult dataResult = this.findPlayerData(gameId,keyword,userType,columnType,index,limit,params,null,null);
        JSONObject data = (JSONObject) dataResult.getData();
        JSONArray jsonArray = JSON.parseArray(data.get("list").toString());
        try {
            Object[] titles = columName.toArray();
            List<Object[]> rowList = new ArrayList<>();
            for (Object object : jsonArray) {
                JSONObject jsonObject = (JSONObject) object;
                JSONObject sourceObject = (JSONObject) jsonObject.get("source");
                List valueList = new ArrayList();
                for (String key : columOrder){
                    String columValueType = colum.get(key);
                    Object columValue = sourceObject.get(key);
                    if(null != columValueType){
                        if("integer".equals(columValueType)){
                            columValue = Integer.valueOf(columValue.toString());
                        }else if("long".equals(columValueType)){
                            columValue = Long.valueOf(columValue.toString());
                        }else if("float".equals(columValueType) ||"double".equals(columValueType)){
                            columValue = Double.valueOf(columValue.toString());
                        }else if(columValueType.contains("date")){
                            String[] str = columValueType.split("\\|");
                            String dataFormat = str[1];
                            SimpleDateFormat sdf = new SimpleDateFormat(dataFormat);
                            Date date = DateUtil.parseDateString(columValue.toString());
                            columValue = sdf.format(date);
                        }
                    }
                    valueList.add(columValue);
                }
                rowList.add(valueList.toArray());
            }
            //ExcelUtil.genRawExcelFile(titles,rowList,outputStream);
            ExcelUtil.genRawCsvFile(titles,rowList,outputStream);

        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public DataResult findPlayerPlayerLostPayStat(Integer gameId, String classifyName, String userType) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        Optional<List<Do_player_lost_pay_stat>> playerLostPayStatListOpt = Optional.ofNullable(mapperPlayerLostPayStat.findPlayerPlayerLostPayStatByGameIdAndClassify(gameId,classifyName,userType));
        Optional<List<Do_player_lost_pay_stat>> potentialPlayerLostPayStatListOpt = Optional.ofNullable(mapperPlayerLostPayStat.findPlayerPlayerLostPayStatByGameIdAndClassify(gameId,"潜在"+classifyName,userType));
        Map<String,Do_player_lost_pay_stat> potentialPlayerLostPayStatMap = null;
        if(potentialPlayerLostPayStatListOpt.isPresent()) {
            List<Do_player_lost_pay_stat> potentialPlayerLostPayStatList = potentialPlayerLostPayStatListOpt.get();
            potentialPlayerLostPayStatMap = new HashMap<>();
            for(Do_player_lost_pay_stat playerLostPayStat : potentialPlayerLostPayStatList){
                potentialPlayerLostPayStatMap.put(playerLostPayStat.getGroup_name() + playerLostPayStat.getSub_group_name(),playerLostPayStat);
            }
        }
        if(playerLostPayStatListOpt.isPresent()){
            List<Do_player_lost_pay_stat> playerLostPayStatList = playerLostPayStatListOpt.get();
            Map<String,Map> resultMap = new LinkedHashMap();
            for(Do_player_lost_pay_stat playerLostPayStat:playerLostPayStatList){
                Set set = resultMap.keySet();
                Map playerLostPayStatMap = null;
                if (set.contains(playerLostPayStat.getGroup_name())){
                    playerLostPayStatMap = resultMap.get(playerLostPayStat.getGroup_name());
                }else {
                    playerLostPayStatMap = new HashMap();
                    playerLostPayStatMap.put("group_name",playerLostPayStat.getGroup_name());
                    playerLostPayStatMap.put("group_user_num",playerLostPayStat.getGroup_user_num());
                    playerLostPayStatMap.put("group_user_rate",playerLostPayStat.getGroup_user_rate());
                    playerLostPayStatMap.put("user_rate", playerLostPayStat.getUser_rate());
                    playerLostPayStatMap.put("user_info",playerLostPayStat.getGroup_desc());
                }
                List<Map> subList = CommonUtil.Object2List(playerLostPayStatMap.get("sub_group"));
                Map subGoup = new HashMap();
                subGoup.put("name",playerLostPayStat.getSub_group_name());
                subGoup.put("value",playerLostPayStat.getSub_group_value());
                subGoup.put("value_rate",CommonUtil.calculateRate(playerLostPayStat.getSub_group_value(),playerLostPayStat.getSub_group_value_avg()));

                Do_player_lost_pay_stat potentialPlayerLostPayStat = potentialPlayerLostPayStatMap.get(playerLostPayStat.getGroup_name() + playerLostPayStat.getSub_group_name());
                if(null != potentialPlayerLostPayStat){
                    subGoup.put("potential",potentialPlayerLostPayStat.getSub_group_value());
                    subGoup.put("potential_rate",CommonUtil.calculateRate(potentialPlayerLostPayStat.getSub_group_value(),potentialPlayerLostPayStat.getSub_group_value_avg()));
                    Set playerLostPayStatMapSet = resultMap.keySet();
                    if(!playerLostPayStatMapSet.contains("potential_user_rate")){
                        playerLostPayStatMap.put("potential_user_rate",potentialPlayerLostPayStat.getUser_rate());
                        playerLostPayStatMap.put("potential_user_info",potentialPlayerLostPayStat.getGroup_desc());
                    }
                }
                subList.add(subGoup);
                playerLostPayStatMap.put("sub_group",subList);
                resultMap.put(playerLostPayStat.getGroup_name(),playerLostPayStatMap);
            }
            List resultList = new ArrayList();
            for (Map.Entry<String, Map> entry : resultMap.entrySet()) {
                resultList.add(entry.getValue());
            }
            return new DataResult(ReturnCodeDim.SUCCESS,resultList);
        }else {
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
        }
    }

    public DataResult findPlayerPlayerLostPayStatClassifyByUserType(Integer gameId, String userType) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        Optional<List<Map>> classifyListOpt = Optional.ofNullable(mapperPlayerLostPayStat.findPlayerPlayerLostPayStatClassifyByUserType(gameId,userType));
        if(classifyListOpt.isPresent()){
            return new DataResult(ReturnCodeDim.SUCCESS,classifyListOpt.get().stream().distinct().filter(o -> !o.get("classify_name").toString().contains("潜在")).collect(Collectors.toList()));
        }
        return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
    }
}
