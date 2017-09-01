package cn.thinkingdata.web.service.core.user.custom;

import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchObj;
import cn.thinkingdata.elasticsearch.query.util.ElasticSearchQueryUtil;
import cn.thinkingdata.web.domain.gas.Do_gas_crawler_info;
import cn.thinkingdata.web.domain.sigma.Do_sigma_lt_warn;
import cn.thinkingdata.web.domain.sigma.Do_sigma_lt_warn_config;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.persistence.sigma.Mapper_sigma_lt_warn;
import cn.thinkingdata.web.persistence.sigma.Mapper_sigma_lt_warn_config;
import cn.thinkingdata.web.service.cache.ProjectInfoCacheService;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.DateUtil;
import cn.thinkingdata.web.util.ReturnCodeDim;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class SigmaItWarnService {

    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private Mapper_sigma_lt_warn mapper_sigma_lt_warn;

    @Autowired
    private Mapper_sigma_lt_warn_config mapper_sigma_lt_warn_config;

    @Autowired
    private ProjectInfoCacheService projectInfoCacheService;

    private static Integer GAME_EMAIL_MAX = 10;

    public DataResult getSigmaItWarnResult(Integer projectId){
        Date currentDate = new Date();
        List<Do_sigma_lt_warn> sigmaLtWarns = mapper_sigma_lt_warn.getSigmaItWarnByProjectId(projectId);
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:00:00");
        List<Map<String,Object>> devMap = new ArrayList<>();
        List<Map<String,Object>> verMap = new ArrayList<>();
        List<Map<String,Object>> actMap = new ArrayList<>();

        List<Map<String,Object>> devMapTemp = new ArrayList<>();
        List<Map<String,Object>> verMapTemp = new ArrayList<>();
        List<Map<String,Object>> actMapTemp = new ArrayList<>();
        for(Do_sigma_lt_warn sigmaLtWarn : sigmaLtWarns){
            Map<String,Object> map = new HashMap<>();
            map.put("data_date",dateFormat.format(sigmaLtWarn.getData_date()));
            map.put("sub_type",sigmaLtWarn.getSub_type());
            map.put("warn_level",sigmaLtWarn.getWarn_level());
            if(sigmaLtWarn.getMain_type().equals("开发")){
                devMapTemp.add(map);
            }else if(sigmaLtWarn.getMain_type().equals("活动")){
                actMapTemp.add(map);
            }else if(sigmaLtWarn.getMain_type().equals("版本")){
                verMapTemp.add(map);
            }
        }
        for(int i = -24; i < 1;i++ ){
            String tempDateStr = dateFormat.format(DateUtil.getOffsetHour(currentDate,i));
            devMap.add(checkDateTimeAndUpdateList(tempDateStr,devMapTemp));
            actMap.add(checkDateTimeAndUpdateList(tempDateStr,actMapTemp));
            verMap.add(checkDateTimeAndUpdateList(tempDateStr,verMapTemp));
        }
        Map dataMap = new HashMap();
        dataMap.put("develop",devMap);
        dataMap.put("activity",actMap);
        dataMap.put("version",verMap);
        DataResult dataResult = new DataResult(ReturnCodeDim.SUCCESS, dataMap);
        return dataResult;
    }

    private Map<String,Object> checkDateTimeAndUpdateList(String tempDateStr,List<Map<String,Object>>  mapListTemp){
        for(Map map : mapListTemp){
            if(map.get("data_date").equals(tempDateStr)){
                return map;
            }
        }
        Map<String,Object> tempMap = new HashMap<>();
        tempMap.put("data_date",tempDateStr);
        tempMap.put("sub_type","");
        tempMap.put("warn_level",0);
        return tempMap;
    }

    public DataResult getSigmaItWarnConfig(Integer projectId, Integer userId){
        Do_sigma_lt_warn_config sigmaLtWarnConfig = mapper_sigma_lt_warn_config.getSigmaItWarnConfig(projectId,userId);
        Map dataMap = new HashMap();
        if(sigmaLtWarnConfig != null) {
            dataMap.put("task_name", sigmaLtWarnConfig.getTask_name());
            dataMap.put("email_addr", sigmaLtWarnConfig.getEmail_addr());
            dataMap.put("status", sigmaLtWarnConfig.getStatus());
            dataMap.put("lt_warn_class", sigmaLtWarnConfig.getLt_warn_class());
            dataMap.put("warn_level", sigmaLtWarnConfig.getWarn_level());
        }else {
            dataMap.put("status",0);
        }
        DataResult dataResult = new DataResult(ReturnCodeDim.SUCCESS, dataMap);
        return dataResult;
    }

    public DataResult setSigmaItWarnConfig(Do_sigma_lt_warn_config doSigmaLtWarnConfig){
        Do_sigma_lt_warn_config sigmaLtWarnConfig = mapper_sigma_lt_warn_config.getSigmaItWarnConfig(doSigmaLtWarnConfig.getProject_id(),doSigmaLtWarnConfig.getUser_id());
        if(sigmaLtWarnConfig != null) {
            sigmaLtWarnConfig.setTask_name(doSigmaLtWarnConfig.getTask_name());
            sigmaLtWarnConfig.setWarn_level(doSigmaLtWarnConfig.getWarn_level());
            sigmaLtWarnConfig.setStatus(doSigmaLtWarnConfig.getStatus());
            sigmaLtWarnConfig.setLt_warn_class(doSigmaLtWarnConfig.getLt_warn_class());
            sigmaLtWarnConfig.setEmail_addr(doSigmaLtWarnConfig.getEmail_addr());
            sigmaLtWarnConfig.setDelete_flag(0);
            mapper_sigma_lt_warn_config.updateSigmaItWarnConfig(sigmaLtWarnConfig);
        }else {
            Integer countConfig = mapper_sigma_lt_warn_config.findCountByUser(doSigmaLtWarnConfig.getUser_id());
            if( GAME_EMAIL_MAX <= countConfig){
                DataResult dataResult = new DataResult(ReturnCodeDim.GAME_EMAIL_MAX, "");
                return dataResult;
            }
            mapper_sigma_lt_warn_config.insertSigmaItWarnConfig(doSigmaLtWarnConfig);
        }

        DataResult dataResult = new DataResult(ReturnCodeDim.SUCCESS, "");
        return dataResult;
    }

    public JSONObject getDetailContent(int projectId,String subType,Date date,int index,int limit) throws Exception{
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:00:00");
        String dataBeginDateStr = dateFormat.format(date);
        String dataEndDateStr = dateFormat.format(DateUtil.getOffsetHour(date,1));
        ElasticSearchQueryUtil esUtil = ElasticSearchQueryUtil.getInstance();
        ArrayList<ElasticSearchObj> searchObjList = new ArrayList<>();
        ElasticSearchObj searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "project_id", projectId + "");
        searchObjList.add(searchObj);
        searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.RANGE, "publish_time", dataBeginDateStr + "\t" + dataEndDateStr);
        searchObjList.add(searchObj);
        String[] subTypes = subType.split(",");
        subType = "";
        for(String str : subTypes){
            subType += str.split(":")[0]+"\t";
        }
        searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.IN, "lighttower_class", subType);
        searchObjList.add(searchObj);
        JSONObject jsonObj= null;
        try {
            logger.info(searchObjList);
            jsonObj = esUtil.searchData("gas_title", index, limit, searchObjList);
            if(jsonObj!=null){
                JSONArray array = jsonObj.getJSONObject("data").getJSONArray("list");
                for(int i = 0; i < array.size(); i++){
                    JSONObject obj = array.getJSONObject(i);
                    JSONObject source = obj.getJSONObject("source");
                    Do_gas_crawler_info crawlerInfo = projectInfoCacheService.getGasCrawlerInfoByInfoId(source.getString("info_id"));
                    String crawlerName = "";
                    if(crawlerInfo != null){
                        crawlerName = crawlerInfo.getCrawler_name();
                    }
                    source.put("crawler_name", crawlerName);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return jsonObj;
    }

    public DataResult getSigmaItWarnConfigByUser(Do_user currentUser,Integer index,Integer limit) {
        List<Do_sigma_lt_warn_config> sigmaLtWarnConfigList = mapper_sigma_lt_warn_config.getSigmaItWarnConfigByUser(currentUser.getUser_id(),index,limit);
        Integer count = mapper_sigma_lt_warn_config.findCountByUser(currentUser.getUser_id());
        Map map = new HashMap();
        map.put("total",count);
        map.put("data",sigmaLtWarnConfigList);
        return new DataResult(ReturnCodeDim.SUCCESS,map);
    }
}
