package cn.thinkingdata.web.service.core.project;

import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchObj;
import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchOrder;
import cn.thinkingdata.elasticsearch.query.util.ElasticSearchQueryUtil;
import cn.thinkingdata.web.domain.project.channel.Do_proj_channel_info_mid;
import cn.thinkingdata.web.domain.project.channel.Do_proj_channel_rating_distri;
import cn.thinkingdata.web.domain.project.channel.Do_proj_channel_senti_topwords;
import cn.thinkingdata.web.persistence.project.channel.Mapper_proj_channel_info_mid;
import cn.thinkingdata.web.persistence.project.channel.Mapper_proj_channel_rating_distri;
import cn.thinkingdata.web.persistence.project.channel.Mapper_proj_channel_senti_topwords;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import com.alibaba.fastjson.JSONObject;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by Xiaowu on 2016/8/9.
 */
@Service
public class ChannelService {

    @Autowired
    private Mapper_proj_channel_senti_topwords mapper_proj_channel_senti_topwords;

    @Autowired
    private Mapper_proj_channel_rating_distri m_mapper_proj_channel_rating_distri;

    @Autowired
    private Mapper_proj_channel_info_mid m_mapper_proj_channel_info_mid;

    public DataResult findChannelSentiWordDistri(String dataDateStart, String dataDateEnd, String data_date, String senti_type, Integer projectId) {
        Map<String, Object> dataMap = new LinkedHashMap<>();
        if(data_date != null && senti_type != null){
            List<Do_proj_channel_senti_topwords> do_words_list = mapper_proj_channel_senti_topwords.getSentiWordOneDayDistriList(projectId, data_date, senti_type);
            List<Map<String, Object>> dataList = new ArrayList<>();
            for(Do_proj_channel_senti_topwords do_word : do_words_list){
                String keyword = do_word.getKeyword();
                Integer num = do_word.getNum();
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("keyword", keyword);
                map.put("num", num);
                dataList.add(map);
            }
            dataMap.put("day_word_distri", dataList);
        }else{
            List<Do_proj_channel_senti_topwords> date_distri_list = mapper_proj_channel_senti_topwords.getSentiDateDistriList(projectId, dataDateStart, dataDateEnd);
            List<Do_proj_channel_senti_topwords> word_distri_list = mapper_proj_channel_senti_topwords.getSentiWordDistriList(projectId, dataDateStart, dataDateEnd);
            Map<String, Map<String, Object>> dateDistriMap = new LinkedHashMap<>();
            for(Do_proj_channel_senti_topwords date_distri : date_distri_list){
                String dataDate = date_distri.getData_date();
                Map<String, Object> map = dateDistriMap.get(dataDate);
                if(map == null){
                    map = new LinkedHashMap<>();
                }
                String sentiType = date_distri.getSenti_type();
                Integer num = date_distri.getNum();
                if(sentiType.equalsIgnoreCase("neg")){
                    map.put("neg_num", num);
                }else{
                    map.put("pos_num", num);
                }
                dateDistriMap.put(dataDate, map);
            }
            List<Map<String, Object>> dateDistriMapList = new ArrayList<>();
            for(Map.Entry<String, Map<String, Object>> entry : dateDistriMap.entrySet()){
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("data_date", entry.getKey());
                Integer posNum = (Integer) entry.getValue().get("pos_num");
                if(posNum == null){
                    posNum = 0;
                }
                Integer negNum = (Integer) entry.getValue().get("neg_num");
                if(negNum == null){
                    negNum = 0;
                }
                map.put("pos_num", posNum);
                map.put("neg_num", negNum);
                dateDistriMapList.add(map);
            }
            List<Map<String, Object>> wordDistriMapList = new ArrayList<>();
            for(Do_proj_channel_senti_topwords word_distri : word_distri_list){
                String sentiType = word_distri.getSenti_type();
                String keyword = word_distri.getKeyword();
                Integer num = word_distri.getNum();
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("senti_type", sentiType);
                map.put("keyword", keyword);
                map.put("num", num);
                wordDistriMapList.add(map);
            }
            dataMap.put("senti_date_distri", dateDistriMapList);
            dataMap.put("senti_word_distri", wordDistriMapList);
        }
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult findChannelProjChannelRatingDistri(String dataDateStart, String dataDateEnd, Integer projectId) {

        List<Do_proj_channel_rating_distri> do_distri_list = m_mapper_proj_channel_rating_distri.getRatingDistriByProjectDateSpan(projectId, dataDateStart, dataDateEnd);

        List<Map<String, Object>> dataList = new ArrayList<>();
        for(Do_proj_channel_rating_distri do_distri : do_distri_list){
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("source_type", do_distri.getSource_type());
            map.put("source_name", do_distri.getSource_name());
            map.put("num", do_distri.getNum());
            map.put("rating_names", do_distri.getRating_names());
            map.put("rating_name", do_distri.getRating_name());
            map.put("es_field_name", do_distri.getEs_field_name());
            map.put("es_field_val", do_distri.getEs_field_val());
            dataList.add(map);
        }
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("channel_rating_distri", dataList);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult findChannelProjChannelInfoMid(Integer projectId) {
        List<Do_proj_channel_info_mid> _list=m_mapper_proj_channel_info_mid.get(projectId);
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("get", _list);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult findChannelQueryComments(String keywords, String ratingStageList, String sourceTypeList, String esFieldName, String esFieldVal, String sentimentKeywords, String queryOrTerm, String lighttowerClassify, String classifySentiment, String lighttowerTags,  String dataDateStart, String dataDateEnd, Integer index, Integer limit, String projectId) {
        if(dataDateStart.length() < 19){
            dataDateStart+=" 00:00:00";
        }
        if(dataDateEnd.length() < 19){
            dataDateEnd+=" 23:59:59";
        }
        ArrayList<ElasticSearchObj> searchList = new ArrayList<>();
        ElasticSearchObj searchObj;
        if(!CommonUtil.IsEmpty(esFieldName) && !CommonUtil.IsEmpty(esFieldVal) ){
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.IN,
                    esFieldName, esFieldVal);
            searchList.add(searchObj);
        }
        // 根据时间跨度查询
        searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.RANGE, "publish_time", dataDateStart+"\t"+dataDateEnd);
        searchList.add(searchObj);
        if(!CommonUtil.IsEmpty(lighttowerClassify) && !CommonUtil.IsEmpty(classifySentiment)){
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.QUERY,
                    "lighttower_class", lighttowerClassify+"/"+classifySentiment);
            searchList.add(searchObj);
        }
        if(! CommonUtil.IsEmpty(keywords)){
            // 根据关键词查询
            searchObj = new ElasticSearchObj(queryOrTerm.equalsIgnoreCase("query") ? ElasticSearchObj.ESearchType.QUERY : ElasticSearchObj.ESearchType.QUERY,
                    "title\tcontent", keywords);
            searchList.add(searchObj);
        }
        if(! CommonUtil.IsEmpty(lighttowerTags)){
            String tags[] = lighttowerTags.split(",");
            StringBuilder sb = new StringBuilder();
            for(String tag : tags){
                sb.append(lighttowerClassify).append(":").append(tag).append("\t");
            }
            if(sb.length() > 0){
                sb.deleteCharAt(sb.length() - 1);
            }
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.IN, "lighttower_tags", sb.toString());
            searchList.add(searchObj);
        }
        if(! CommonUtil.IsEmpty(sentimentKeywords)){
            // 根据关键词查询
            searchObj = new ElasticSearchObj(queryOrTerm.equalsIgnoreCase("query") ? ElasticSearchObj.ESearchType.QUERY : ElasticSearchObj.ESearchType.QUERY,
                    "sentiment_keyword_list", sentimentKeywords);
            searchList.add(searchObj);
        }
        if(! CommonUtil.IsEmpty(sourceTypeList)){
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.IN, "source_type", sourceTypeList.replaceAll(",", "\t"));
            searchList.add(searchObj);
        }
        if(! CommonUtil.IsEmpty(ratingStageList) && ratingStageList.equals("好评,中评,差评")){
            ratingStageList="";
        }
        if(! CommonUtil.IsEmpty(ratingStageList)){
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.IN, "rating_stage", ratingStageList.replaceAll(",", "\t"));
            searchList.add(searchObj);
        }
        searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "project_id", String.valueOf(projectId));
        searchList.add(searchObj);
        ElasticSearchQueryUtil util = ElasticSearchQueryUtil.getInstance();
        JSONObject resultObj = null;
        ArrayList<ElasticSearchOrder> orderList = new ArrayList<>();
        ElasticSearchOrder searchOrder = new ElasticSearchOrder("publish_time", SortOrder.DESC);
        orderList.add(searchOrder);
        try {
            resultObj = util.searchData("gas_channel_content", index, limit, searchList, orderList);
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR);
        }
        return new DataResult(ReturnCodeDim.SUCCESS, resultObj);
    }
}
