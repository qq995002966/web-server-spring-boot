package cn.thinkingdata.web.service.core.project;

import cn.thinkingdata.web.domain.custom.Custom_do_lt_class_distri;
import cn.thinkingdata.web.domain.project.lt.Do_proj_lt_common_stat;
import cn.thinkingdata.web.domain.project.lt.Do_proj_lt_detail_stat;
import cn.thinkingdata.web.persistence.project.lt.Mapper_proj_lt_common_stat;
import cn.thinkingdata.web.persistence.project.lt.Mapper_proj_lt_detail_stat;
import cn.thinkingdata.web.service.cache.ProjectInfoCacheService;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.MathCaculateUtil;
import cn.thinkingdata.web.util.ReturnCodeDim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by Xiaowu on 2016/8/9.
 */
@Service
public class LtService {

    @Autowired
    private Mapper_proj_lt_common_stat mapper_proj_lt_common_stat;
    @Autowired
    private Mapper_proj_lt_detail_stat mapper_proj_lt_detail_stat;

    @Autowired
    private ProjectInfoCacheService projectInfoCacheService;

    private static final int SHOW_TAG_NUM = 9;

    public DataResult findLtInsightCommon(String dataDateStart, String dataSateEnd, Integer projectId) {
        List<Do_proj_lt_common_stat> ltCommonStatList = mapper_proj_lt_common_stat.getLtCommonStatDataList(projectId, dataDateStart, dataSateEnd);
        if(ltCommonStatList == null){
            ltCommonStatList = new ArrayList<>();
        }
        List<Custom_do_lt_class_distri> ltClassDistriList = mapper_proj_lt_detail_stat.getLtClassDistriList(projectId, dataDateStart, dataSateEnd);
        if(ltClassDistriList == null){
            ltClassDistriList = new ArrayList<>();
        }

        int totalFeedbackNum = 0;
        int negativeFeedbackNum = 0;
        int positiveFeedbackNum = 0;
        int otherFeedbackNum = 0;
        List<Map<String, Object>> feedbackNumDistriList = new ArrayList<>();

        for(Do_proj_lt_common_stat do_stat : ltCommonStatList){
            totalFeedbackNum += do_stat.getTotal_num();
            negativeFeedbackNum += do_stat.getNegative_num();
            positiveFeedbackNum += do_stat.getPositive_num();
            otherFeedbackNum += do_stat.getOther_num();
            Map<String, Object> feedbackNumMap = new TreeMap<>();
            feedbackNumMap.put("data_date", do_stat.getData_date());
            feedbackNumMap.put("positive_num", do_stat.getPositive_num());
            feedbackNumMap.put("negative_num", do_stat.getNegative_num());
            feedbackNumDistriList.add(feedbackNumMap);
        }
        double negativeRate = CommonUtil.setScale((double) negativeFeedbackNum / (totalFeedbackNum + 0.00000000001),4);
        double positiveRate = CommonUtil.setScale((double) positiveFeedbackNum / (totalFeedbackNum + 0.00000000001),4);
        double otherRate = CommonUtil.setScale((1 - negativeRate - positiveRate),4);

        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("total_num", totalFeedbackNum);
        dataMap.put("negative_num", negativeFeedbackNum);
        dataMap.put("positive_num", positiveFeedbackNum);
        dataMap.put("feedback_trend", feedbackNumDistriList);
        dataMap.put("negative_rate", negativeRate);
        dataMap.put("positive_rate", positiveRate);
        dataMap.put("other_rate", otherRate);

        Map<String, Object> ltClassResMap = new TreeMap<>();
        for(Custom_do_lt_class_distri do_class : ltClassDistriList){
            String classify_sentiment = do_class.getClassify_sentiment() + "";
            String lighttower_classify = do_class.getLighttower_classify();
            int post_num = do_class.getPost_num();
            List<Map<String, Object>> ltClassDetailList = (List<Map<String, Object>>) ltClassResMap.get(classify_sentiment);
            if(ltClassDetailList == null){
                ltClassDetailList = new ArrayList<>();
            }
            Map<String, Object> ltClassDetailMap = new TreeMap<>();
            if(do_class.getClassify_sentiment().intValue() < 0){
                ltClassDetailMap.put("feedback_type", "game");
                if(projectInfoCacheService.getLtCommonTypeSet().contains(lighttower_classify)){
                    ltClassDetailMap.put("feedback_type", "common");
                }
            }

            ltClassDetailMap.put("lighttower_classify", lighttower_classify);
            ltClassDetailMap.put("post_num", post_num);
            ltClassDetailList.add(ltClassDetailMap);
            ltClassResMap.put(classify_sentiment, ltClassDetailList);
        }

        dataMap.put("feedback_class_distri", ltClassResMap);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult findLtInsightDetail(String dataDateStart, String dataSateEnd, Integer classifySentiment, String lighttowerClassify, Integer projectId) {
        List<Do_proj_lt_detail_stat> ltDetailStatList = mapper_proj_lt_detail_stat.getLtDetailStatList(projectId, dataDateStart, dataSateEnd, classifySentiment, lighttowerClassify);

        List<Map<String, Object>> feedbackDateDistriList = new ArrayList<>();
        Map<String, Double> feedbackTagMap = new HashMap<>();

        for(Do_proj_lt_detail_stat do_stat : ltDetailStatList){
            Map<String, Object> map = new TreeMap<>();
            map.put("data_date", do_stat.getData_date());
            map.put("post_num", do_stat.getPost_num());
            feedbackDateDistriList.add(map);

            String tagsStr = do_stat.getLighttower_tags();
            if(tagsStr.length() == 0){
                continue;
            }
            String tags[] = tagsStr.split(",");
            for(String tagInfo : tags){
                String tokens[] = tagInfo.split(":");
                String tag = tokens[0];
                if(tag.equals("其它")){
                    continue;
                }
                double weight = Double.parseDouble(tokens[1]);
                Double mapWeight = feedbackTagMap.get(tag);
                if(mapWeight == null){
                    mapWeight = 0d;
                }
                mapWeight += weight;
                feedbackTagMap.put(tag, mapWeight);
            }
        }

        feedbackTagMap = MathCaculateUtil.getPercentValueMap(feedbackTagMap);
        feedbackTagMap = MathCaculateUtil.sortMapByValue(feedbackTagMap, "desc");

        List<Map<String, Object>> feedbackTagDistriList = new ArrayList<>();

        int index = 0;
        StringBuilder otherTagSb = new StringBuilder();
        double otherTagRate = 0;
        for(Map.Entry<String, Double> entry : feedbackTagMap.entrySet()){
            index++;
            String tagName = entry.getKey();
            Double percentVal = entry.getValue();
            if(index <= SHOW_TAG_NUM){
                Map<String, Object> map = new TreeMap<>();
                map.put("show_tag", tagName);
                map.put("real_tag", tagName);
                map.put("tag_rate", percentVal);
                feedbackTagDistriList.add(map);
            }else{
                otherTagSb.append(tagName).append(",");
                otherTagRate += percentVal;
            }
        }
        if(otherTagSb.length() > 0){
            otherTagSb.deleteCharAt(otherTagSb.length() - 1);
            Map<String, Object> map = new TreeMap<>();
            map.put("show_tag", "其它");
            map.put("real_tag", otherTagSb.toString());
            map.put("tag_rate", CommonUtil.setScale(otherTagRate,4));
            feedbackTagDistriList.add(map);
        }
        if(feedbackTagDistriList.size() == 0){
            Map<String, Object> map = new TreeMap<>();
            map.put("show_tag", "其它");
            map.put("real_tag", "其它");
            map.put("tag_rate", 1.0);
            feedbackTagDistriList.add(map);
        }

        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("feedback_date_distri", feedbackDateDistriList);
        dataMap.put("feedback_tag_distri", feedbackTagDistriList);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }
}
