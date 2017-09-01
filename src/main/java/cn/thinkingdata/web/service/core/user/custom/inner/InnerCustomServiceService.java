package cn.thinkingdata.web.service.core.user.custom.inner;

import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchObj;
import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchOrder;
import cn.thinkingdata.elasticsearch.query.util.ElasticSearchQueryUtil;
import cn.thinkingdata.web.domain.elasticsearch.Do_table_mapping;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.domain.user.custom.inner.*;
import cn.thinkingdata.web.persistence.elasticsearch.Mapper_table_mapping;
import cn.thinkingdata.web.persistence.user.custom.inner.*;
import cn.thinkingdata.web.util.*;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Xiaowu on 2016/8/24.
 */
@Service
public class InnerCustomServiceService {

    protected static final Logger logger = LogManager.getLogger();

    @Autowired
    private Mapper_game_form_config mapper_game_form_config;

    @Autowired
    private Mapper_user_game mapper_user_game;

    @Autowired
    private Mapper_game mapper_game;

    @Autowired
    private Mapper_search_column_meta mapper_search_column_meta;

    @Autowired
    private Mapper_game_search_table mapper_game_search_table;

    @Autowired
    private Mapper_user_game_form mapper_user_game_form;

    @Autowired
    private Mapper_service_dim mapper_service_dim;

    @Autowired
    private Mapper_game_log_stat mapper_game_log_stat;

    @Autowired
    private Mapper_table_mapping mapper_table_mapping;

    private static final int DEMO_GAME = 0;

    private static final String SEARCH_PREFIX = "s_";
    private static final int SERVICE_TYPE_OUTFLOW = 1;
    private static final int SERVICE_TYPE_PAY = 2;
    private static final int SERVICE_TYPE_PROPERTY = 3;
    private static final int SERVICE_TYPE_LOG = 4;

    public DataResult findChartByInnerServiceAndGame(Integer serviceId, Integer gameId, Integer chartType) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        if(chartType != 0){
            chartType = 1;
        }
        Map<String,Object> resultMap = new HashedMap();
        List<Do_game_form_config> gameFormConfigs = mapper_game_form_config.findConfigByServiceAndGame(serviceId,gameId,chartType);
        List<Map<String,Object>> resultList = new ArrayList<>();
        List formIds = new ArrayList();
        for(Do_game_form_config doGameFormConfig : gameFormConfigs){
            formIds.add(doGameFormConfig.getForm_id());
            Map<String,Object> map = new HashMap<>();
            map.put("form_id",doGameFormConfig.getForm_id());
            map.put("form_name",doGameFormConfig.getForm_name());
            map.put("form_type",doGameFormConfig.getForm_type());
            map.put("form_data",this.getDataBySQL(doGameFormConfig.getSql_template(),null,doGameFormConfig.getForm_type()));
            map.put("form_param",StringUtil.getSQLParams(doGameFormConfig.getSql_template()));
            resultList.add(map);
        }

        Do_user doUser = WebUtil.getCurrentUser();
        Do_user_game_form userGameForm = mapper_user_game_form.findUserGameFormByUserAndService(doUser.getUser_id(),serviceId,gameId);
        String formSequence = "";
        if( null != userGameForm){
            formSequence = userGameForm.getForm_id();
        }else {
            formSequence = StringUtils.join(formIds.toArray(),",");
        }
        resultMap.put("order",formSequence);
        resultMap.put("form",resultList);
        return new DataResult(ReturnCodeDim.SUCCESS,resultMap);
    }

    private Object getDataBySQL(String sql,Map<String,Object> params,Integer formType){
        String sqlParamStr = StringUtil.getSQLParams(sql).trim();
        if(sqlParamStr.length() > 0){
            String[] sqlParams = sqlParamStr.split(",");
            if(sqlParams.length > 0){
                for(String param : sqlParams){
                    String value = null;
                    if(params != null){
                        value = (String) params.get(param);
                    }
                    if(value == null && param.equals("start_date")){
                        value = DateUtil.getOffsetDatePartitionString(new Date(),-30);
                    }
                    if(value == null && param.equals("end_date")){
                        value = DateUtil.getPartitionString(new Date());
                    }
                    sql = sql.replace("#{"+param+"}",value);
                }
            }
        }
        List<Map> data =  mapper_game_form_config.findDataBySQL(sql);
        Map<String,Object> resultMap = new LinkedHashMap<>();
        if(formType == 4||formType == 2){
            for(Map map:data){
                Map axis = CommonUtil.Object2Map(map.get("item"));
                Set set = map.keySet();
                for (Object o : set){
                    if(!o.toString().equals("item")) {
                        List axisList = CommonUtil.Object2List(axis.get(o.toString()));
                        String value = map.get(o.toString()).toString();
                        if (o.toString().equals("data_date")) {
                            value = DateUtil.getPartitionString((Date) map.get(o.toString()));
                        }
                        axisList.add(value);
                        axis.put(o.toString(), axisList);
                        resultMap.put(map.get("item").toString(), axis);
                    }
                }
            }
            data = new ArrayList<>();
            Set set = resultMap.keySet();
            for(Object o:set){
                Map map = new HashMap();
                map.put("name",o.toString());
                map.put("data",resultMap.get(o));
                data.add(map);
            }
        }
        if(formType == 5 ||formType == 3){
            List x_axis = new ArrayList();
            Boolean isInteger = true;
            Map<String,Object> axisMap = new LinkedHashMap<>();
            for(Map map:data){
                Object x_axis_temp = null;
                Object y_axis_temp = map.get("y_axis");
                if(null != map.get("x_axis")){
                    if(!StringUtils.isNumeric(map.get("x_axis").toString())){
                        isInteger = false;
                    }
                    x_axis_temp = map.get("x_axis");
                }else {
                    x_axis_temp = DateUtil.getPartitionString((Date) map.get("data_date"));
                    isInteger = false;
                }
                if(!x_axis.contains(x_axis_temp)){
                    x_axis.add(x_axis_temp);
                }
                if(null == y_axis_temp){
                    y_axis_temp = map.get("ratio");
                }
                Map axis = null;
                if(null == axisMap.get(map.get("item").toString())){
                    axis = new HashMap();
                }else {
                    axis = (Map) axisMap.get(map.get("item").toString());
                }
                axis.put(x_axis_temp,y_axis_temp);
                axisMap.put(map.get("item").toString(),axis);
            }
            if(isInteger){
                List x_axis_int = new ArrayList();
                for(Object o : x_axis){
                    x_axis_int.add(Integer.valueOf(o.toString()));
                }
                x_axis = x_axis_int;
            }
            Collections.sort(x_axis);
            Map<String,Object> y_axis_map = new HashMap<>();
            for (Object x : x_axis){
                Set<String> name_set = axisMap.keySet();
                for(String name : name_set){
                    Map y_map = (Map) axisMap.get(name);
                    Object y_axis = (null==y_map.get(x))?"-":y_map.get(x).toString();
                    List y_axis_list = (List) y_axis_map.get(name);
                    if(null == y_axis_list){
                        y_axis_list = new ArrayList();
                    }
                    y_axis_list.add(y_axis);
                    y_axis_map.put(name,y_axis_list);
                }
            }
            data = new ArrayList<>();
            Map axis_map = new HashMap();
            Set set = y_axis_map.keySet();
            axis_map.put("x_axis",x_axis);
            List axis_list = new ArrayList();
            for(Object o:set){
                Map map = new HashMap();
                map.put("name",o.toString());
                map.put("data",y_axis_map.get(o));
                axis_list.add(map);
            }
            axis_map.put("y_axis",axis_list);
            data.add(axis_map);
        }
        if(formType == 6||formType == 7){
            for(Map map:data){
                List list = null;
                Set set = map.keySet();
                for (Object o : set){
                    if(null == resultMap.get(o.toString())){
                        list = new ArrayList();
                    }else {
                        list = (List) resultMap.get(o.toString());
                    }
                    String value = map.get(o.toString()).toString();
                    if(o.toString().equals("data_date")){
                        value = DateUtil.getPartitionString((Date)map.get(o.toString()));
                    }
                    list.add(value);
                    resultMap.put(o.toString(),list);
                }
            }
            data = new ArrayList<>();
            data.add(resultMap);
        }
        return data;
    }

    public Boolean gameAccessForbidden(Integer gameId){
        if(gameId.intValue() == DEMO_GAME){
            return false;
        }
        Do_user userDo = WebUtil.getCurrentUser();
        if(userDo == null){
            return false;
        }
        Set<Integer> innerGameList = userDo.getInnerGameSet();
        if(innerGameList.contains(gameId)){
            return false;
        }
        return true;
    }

    public DataResult findGame(Integer serviceId) {
        Do_user userDo = WebUtil.getCurrentUser();
        List<Map> dataMap = null;
        if(0 != serviceId){
            Map<String,Object> paramMap = new HashMap<>();
            paramMap.put("game_id_list",new ArrayList<>(userDo.getInnerGameSet()));
            paramMap.put("service_id",serviceId);
            dataMap = mapper_user_game.findGameByUserAndService(paramMap);
        }else {
            dataMap = mapper_user_game.findGameByUser(new ArrayList<>(userDo.getInnerGameSet()));
        }
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult findChartByGame(Integer formId,Map<String,Object> params) {
        Do_game_form_config gameFormConfig = mapper_game_form_config.getGameFormConfigById(formId);
        if(gameAccessForbidden(gameFormConfig.getGame_id())){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        Object data = this.getDataBySQL(gameFormConfig.getSql_template(),params,gameFormConfig.getForm_type());
        return new DataResult(ReturnCodeDim.SUCCESS,data);
    }

    public DataResult findSearchMetaByService(Integer serviceId, Integer gameId,String type) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        List searchColumnMetas = null;
        if(null == type ){
            searchColumnMetas = mapper_search_column_meta.findSearchMetaByServiceAndGame(serviceId,gameId);
        }else {
            searchColumnMetas = mapper_search_column_meta.findSearchMetaByServiceAndGameAndType(serviceId,gameId,type);
        }
        List<Do_search_column_meta> search_column_metas = new ArrayList<>();
        for(Object object : searchColumnMetas){
            Do_search_column_meta doSearchColumnMeta = (Do_search_column_meta)object;
            doSearchColumnMeta.setColumn_name(SEARCH_PREFIX+doSearchColumnMeta.getColumn_name());
            search_column_metas.add(doSearchColumnMeta);
        }
        if( serviceId == SERVICE_TYPE_PROPERTY){
            Map group = new HashedMap();
            List<Do_search_column_meta> primary = new ArrayList<>();
            List groupTitle = new ArrayList();
            for(Do_search_column_meta searchColumnMeta : search_column_metas){
//                searchColumnMeta.setColumn_name("s_"+searchColumnMeta.getColumn_name());
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
            searchColumnMetas = new ArrayList();
            searchColumnMetas.add(result);
        }
        return new DataResult(ReturnCodeDim.SUCCESS,searchColumnMetas);
    }

    public DataResult searchData(Integer serviceId, Integer gameId,String dataId, Map<String, Object> params,String orderField,String orderType,Integer index, Integer limit,String tableDesc) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        Do_game_search_table gameSearchTable = null;
        List<Do_search_column_meta> searchColumnMetas = null;
        if(null == tableDesc || "all".equals(tableDesc)){
            gameSearchTable = mapper_game_search_table.findGameSearchTableByServiceAndGame(serviceId,gameId);
            searchColumnMetas = mapper_search_column_meta.findSearchMetaByServiceAndGame(serviceId,gameId);
        }else {
            gameSearchTable = mapper_game_search_table.findGameSearchTableByServiceAndGameAndType(serviceId,gameId,tableDesc);
            searchColumnMetas = mapper_search_column_meta.findSearchMetaByServiceAndGameAndType(serviceId,gameId,tableDesc);
        }
        if(null == gameSearchTable){
            return new DataResult(ReturnCodeDim.DATA_NOT_PREPARED,"");
        }
        String TABLE_NAMES[] = {gameSearchTable.getTable_name()};
        String INCLUDE_FIELDS_QUERY[] = new String[searchColumnMetas.size()];
        ArrayList<ElasticSearchObj> searchList = new ArrayList<>();
        ArrayList<ElasticSearchOrder> orderList = null;
        ElasticSearchQueryUtil esUtil = ElasticSearchQueryUtil.getInstance();
        if(null != dataId){
            ElasticSearchObj searchObj;
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.ID, "", dataId);
            searchList.add(searchObj);
            try {
                JSONObject resObj = esUtil.searchData(TABLE_NAMES, index, limit, searchList);
                JSONObject dataJsonObject = resObj.getJSONObject("data");
                return new DataResult(ReturnCodeDim.SUCCESS,dataJsonObject);
            } catch (Exception e) {
                e.printStackTrace();
                return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
            }
        }else {

            ElasticSearchObj searchObj;
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "game_id", gameId + "");
            searchList.add(searchObj);
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
    }



    public File ReadFile(Integer serviceId,Integer gameId) {
        if(gameAccessForbidden(gameId)){
            logger.info("User ("+WebUtil.getCurrentUser().getUser_id()+") has no authority where gameId :"+gameId);
            return null;
        }
        Do_game_dim gameDim = mapper_game.getGameById(gameId);
        if(null == gameDim){
            logger.info("Do_game_dim is null where gameId :"+gameId);
            return null;
        }
        Do_game_search_table gameSearchTable = mapper_game_search_table.findGameSearchTableByServiceAndGame(serviceId,gameId);
        if(null == gameSearchTable){
            logger.info("Do_game_search_table is null where gameId :"+gameId + "and serviceId :"+serviceId);
            return null;
        }
        String fileName = gameSearchTable.getTable_name();
        String filePath = "/data/crawl_data/inner_game/"+ gameDim.getGame_abbr();
        return new File(filePath + File.separator +fileName+ ".csv");
    }

    public DataResult setFormSequence(Integer serviceId,Integer gameId,String formIds) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        Integer userId = WebUtil.getCurrentUser().getUser_id();
        Do_user_game_form userGameForm = mapper_user_game_form.findUserGameFormByUserAndService(userId,serviceId,gameId);
        if( null == userGameForm ){
            userGameForm = new Do_user_game_form();
            userGameForm.setUser_id(userId);
            userGameForm.setService_id(serviceId);
            userGameForm.setGame_id(gameId);
        }
        userGameForm.setForm_id(formIds);
        mapper_user_game_form.insertUpdateUserGameForm(userGameForm);
        return new DataResult(ReturnCodeDim.SUCCESS,"");
    }

    public File findReportByGame(Integer serviceId, Integer gameId) {
        if(gameAccessForbidden(gameId)){
            logger.info("User ("+WebUtil.getCurrentUser().getUser_id()+") has no authority where gameId :"+gameId);
            return null;
        }
        Do_game_dim gameDim = mapper_game.getGameById(gameId);
        if(null == gameDim){
            logger.info("Do_game_dim is null where gameId :"+gameId);
            return null;
        }
        Do_service_dim service = mapper_service_dim.getGameServiceById(serviceId);
        String fileName = service.getService_name()+"报告";
        String filePath = "/data/crawl_data/inner_game/"+ gameDim.getGame_abbr()+"/";
        return new File(filePath + File.separator +fileName+ ".pdf");
    }

    public DataResult findGameLogType(Integer gameId) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        List gameSearchTableType = mapper_game_search_table.findLogSearchTableTypeByGame(gameId);
        return new DataResult(ReturnCodeDim.SUCCESS,gameSearchTableType);
    }

    public DataResult findGameLogMeta(Integer gameId, String type) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        if(null == type ){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"");
        }
        return this.findSearchMetaByService(SERVICE_TYPE_LOG,gameId,type);
    }

    public DataResult gameLogSearchData(String type, Integer gameId, Map<String, Object> params, String orderField, String orderType, Integer index, Integer limit) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        if(null == type ){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"");
        }
        return this.searchData(SERVICE_TYPE_LOG,gameId,null,params,orderField,orderType,index,limit,type);
    }

    public DataResult gameLogSearchChart(String type, Integer gameId, String startDate, String endDate) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        List<Do_game_log_stat> gameLogStats = mapper_game_log_stat.getGameLogByIdAndType(gameId,type,startDate,endDate);
        return new DataResult(ReturnCodeDim.SUCCESS,gameLogStats);
    }

    public DataResult gamePropertySearchDetail(Integer gameId, Map<String, Object> params,String dataId) {
        if(gameAccessForbidden(gameId)){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        DataResult dataResult = this.searchData(SERVICE_TYPE_PROPERTY,gameId,dataId,params,null,null,0,1,"all");
        JSONObject data = (JSONObject) dataResult.getData();
        JSONArray jsonArray = JSON.parseArray(data.get("list").toString());
        JSONObject jsonObject = ((JSONObject) jsonArray.get(0)).getJSONObject("source");
        List<String> group = mapper_search_column_meta.findSearchMetaGroupByServiceAndGame(SERVICE_TYPE_PROPERTY,gameId);
        List<Do_search_column_meta> searchColumnMetas = mapper_search_column_meta.findSearchMetaByServiceAndGame(SERVICE_TYPE_PROPERTY,gameId);
        Map<String,Object> reusltMap = new HashedMap();
        for(Do_search_column_meta searchColumnMeta : searchColumnMetas){
            Map groupMap = (Map) reusltMap.get(searchColumnMeta.getColumn_group());
            if(groupMap == null){
                groupMap = new HashedMap();
            }
            groupMap.put(searchColumnMeta.getColumn_desc(),jsonObject.get(searchColumnMeta.getColumn_name()));
            reusltMap.put(searchColumnMeta.getColumn_group(),groupMap);
        }
        Map result = new HashedMap();
        result.put("data",reusltMap);
        result.put("groupTitle",group);
        return new DataResult(ReturnCodeDim.SUCCESS,result);
    }

    public void searchDataCSV(Integer serviceId, Integer gameId, String dataId, Map<String, Object> params, String orderField, String orderType, Integer index, Integer limit,String type,OutputStream outputStream) {
        if(gameAccessForbidden(gameId)){
            logger.info("User ("+WebUtil.getCurrentUser().getUser_id()+") has no authority where gameId :"+gameId);
            return ;
        }
        limit = 10000;
        List<Do_search_column_meta> searchColumnMetas = null;
        if(null == type ){
            searchColumnMetas = mapper_search_column_meta.findSearchMetaByServiceAndGame(serviceId,gameId);
        }else {
            searchColumnMetas = mapper_search_column_meta.findSearchMetaByServiceAndGameAndType(serviceId,gameId,type);
        }
        List<String> columOrder = new ArrayList<>();
        List<String> columName = new ArrayList<>();
        for(Do_search_column_meta searchColumnMeta : searchColumnMetas){
            columOrder.add(SEARCH_PREFIX+searchColumnMeta.getColumn_name());
            columName.add(searchColumnMeta.getColumn_desc());
        }
        DataResult dataResult = this.searchData(serviceId,gameId,dataId,params,orderField,orderType,index,limit,type);
        JSONObject data = (JSONObject) dataResult.getData();
        JSONArray jsonArray = JSON.parseArray(data.get("list").toString());
        CSVPrinter csvPrinter = null;
        CSVFormat csvFormat = CSVFormat.DEFAULT.withRecordSeparator("\n");
        try {
            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(outputStream,"GBK");
            csvPrinter = new CSVPrinter(outputStreamWriter, csvFormat);
            csvPrinter.printRecord(columName.toArray());
            for (Object object : jsonArray) {
                JSONObject jsonObject = (JSONObject) object;
                JSONObject sourceObject = (JSONObject) jsonObject.get("source");
                List valueList = new ArrayList();
                for (String key : columOrder){
                    valueList.add(sourceObject.get(key));
                }
                csvPrinter.printRecord(valueList);
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            try {
                if (csvPrinter != null) {
                    csvPrinter.flush();
                    csvPrinter.close();
                }
                outputStream.flush();
                outputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void searchDataExcel(Integer serviceId, Integer gameId, String dataId, Map<String, Object> params, String orderField, String orderType, Integer index, Integer limit, String type, OutputStream outputStream) {
        if(gameAccessForbidden(gameId)){
            logger.info("User ("+WebUtil.getCurrentUser().getUser_id()+") has no authority where gameId :"+gameId);
            return ;
        }
        limit = 10000;
        List<Do_search_column_meta> searchColumnMetas = null;
        if(null == type ){
            searchColumnMetas = mapper_search_column_meta.findSearchMetaByServiceAndGame(serviceId,gameId);
        }else {
            searchColumnMetas = mapper_search_column_meta.findSearchMetaByServiceAndGameAndType(serviceId,gameId,type);
        }
        Integer searcheTableId = 0;
        List<String> columOrder = new ArrayList<>();
        List<String> columName = new ArrayList<>();
        for(Do_search_column_meta searchColumnMeta : searchColumnMetas){
            columOrder.add(SEARCH_PREFIX+searchColumnMeta.getColumn_name());
            columName.add(searchColumnMeta.getColumn_desc());
            searcheTableId = searchColumnMeta.getGt_id();
        }
        Do_game_search_table gameSearchTable = mapper_game_search_table.findGameSearchTableById(searcheTableId);
        List<Do_table_mapping>  tableMappings = mapper_table_mapping.findTableMappingByTableName(gameSearchTable.getTable_name());
        Map<String,String> colum = new HashedMap();
        for(Do_table_mapping tableMapping : tableMappings){
            String fieldType = tableMapping.getField_type();
            if("date".equals(fieldType)){
                fieldType += "|"+ tableMapping.getField_format();
            }
            colum.put(SEARCH_PREFIX+tableMapping.getField_name(),fieldType);
        }
        DataResult dataResult = this.searchData(serviceId,gameId,dataId,params,orderField,orderType,index,limit,type);
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
                    valueList.add(columValue);
                }
                rowList.add(valueList.toArray());
            }
            ExcelUtil.genRawCsvFile(titles,rowList,outputStream);

        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
