package cn.thinkingdata.web.service.core.project;

import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchObj;
import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchOrder;
import cn.thinkingdata.elasticsearch.query.util.ElasticSearchQueryUtil;
import cn.thinkingdata.web.domain.gas.Do_gas_crawler_info;
import cn.thinkingdata.web.domain.project.forum.*;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.domain.user.custom.Do_user_custom_keywords;
import cn.thinkingdata.web.persistence.project.forum.*;
import cn.thinkingdata.web.persistence.user.custom.Mapper_user_custom_keywords;
import cn.thinkingdata.web.service.cache.ProjectInfoCacheService;
import cn.thinkingdata.web.util.*;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

/**
 * Created by Xiaowu on 2016/8/9.
 */
@Service
public class ForumService {

    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private ProjectInfoCacheService projectInfoCacheService;

    @Autowired
    Mapper_user_custom_keywords m_user_custom_keywords;

    @Autowired
    private Mapper_proj_forum_common_stat mapper_proj_forum_common_stat;

    @Autowired
    private Mapper_proj_forum_stat m_mapper_proj_forum_stat;

    @Autowired
    private Mapper_proj_forum_attitude_distri m_mapper_proj_forum_attitude_distri;

    @Autowired
    private Mapper_proj_forum_useless_classify mapper_proj_forum_useless_classify;

    @Autowired
    private Mapper_proj_forum_topwords_common m_mapper_proj_forum_topwords_common;

    @Autowired
    private Mapper_proj_forum_top_topic_day mapper_proj_forum_top_topic_day;

    private static final String DEFAULT_KEYWORDS = "交易 奖励 活动 充值 礼包";

    private static final double MAX_GROWTH = 1000;

    private static final int SHOW_FORUM_NUM = 3;

    private static final int TOPIC_WORD_NUM = 3;

    public DataResult findForumTermsDateHistogramAgg(String dataDateStart, String dataDateEnd, Integer projectId) {
        dataDateStart +=" 00:00:00";
        dataDateEnd +=" 23:59:59";
        Do_user userDo = WebUtil.getCurrentUser();
        String keywords = DEFAULT_KEYWORDS;
        if(userDo != null){
            List<Do_user_custom_keywords> customKeywordsList = m_user_custom_keywords.getByUserIdProjectId(userDo.getUser_id(), projectId);
            if(customKeywordsList != null && customKeywordsList.size() > 0 && !CommonUtil.IsEmpty(customKeywordsList.get(0).getCustom_keywords())){
                keywords = customKeywordsList.get(0).getCustom_keywords().trim();
            }
        }else{
            keywords = DEFAULT_KEYWORDS;
        }
        ArrayList<ElasticSearchObj> searchList = new ArrayList<>();
        ElasticSearchObj searchObj;
        // 根据时间跨度查询
        searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.RANGE, "publish_time", dataDateStart+"\t"+dataDateEnd);
        searchList.add(searchObj);
        // 根据论坛的project_id来查询
        searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "project_id", String.valueOf(projectId));
        searchList.add(searchObj);
        ElasticSearchQueryUtil util = ElasticSearchQueryUtil.getInstance();
        Map<String, List<Object[]>> resultObj = null;
        try {
            resultObj = util.forumTermsDateHistogramAgg(searchList, keywords.split(" "),dataDateStart, dataDateEnd);
            return new DataResult(ReturnCodeDim.SUCCESS, resultObj);
        } catch (IOException e) {
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR);
        }
    }


    public DataResult findForumCommonData(String dataDateStart, String dataDateEnd, Integer projectId) {
        Date startDate = DateUtil.parseDateString(dataDateStart);
        Date endDate = DateUtil.parseDateString(dataDateEnd);
        int betweenDays = DateUtil.daysBetween(startDate, endDate);
        int daysOffset = betweenDays + 1;
        Calendar cal = Calendar.getInstance();
        cal.setTime(startDate);
        cal.add(Calendar.DATE, -daysOffset);
        String lastCycleStartDateStr = DateUtil.getPartitionString(cal.getTime());
        cal.setTime(endDate);
        cal.add(Calendar.DATE, -daysOffset);
        String lastCycleEndDateStr = DateUtil.getPartitionString(cal.getTime());
        logger.info("last cycle start date: " + lastCycleStartDateStr + ", end date: " + lastCycleEndDateStr);

        Do_proj_forum_common_stat stat = mapper_proj_forum_common_stat.getForumCommonStatBydateSpan(projectId, dataDateStart, dataDateEnd);
        if(stat == null){
            stat = new Do_proj_forum_common_stat();
        }
        Do_proj_forum_common_stat lastCycleStat = mapper_proj_forum_common_stat.getForumCommonStatBydateSpan(projectId, lastCycleStartDateStr, lastCycleEndDateStr);
        if(lastCycleStat == null){
            lastCycleStat = stat;
        }

        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("title_num", stat.getTitle_num());
        double titleNumGrowth = CommonUtil.setScale((double)(stat.getTitle_num() - lastCycleStat.getTitle_num()) / (lastCycleStat.getTitle_num() + 0.00000000001),4);
        if(titleNumGrowth > MAX_GROWTH){
            titleNumGrowth = 0;
        }
        dataMap.put("title_num_growth", titleNumGrowth);
        dataMap.put("title_avg_num", stat.getTitle_avg_num());
        double titleAvgNumGrowth = CommonUtil.setScale((double)(stat.getTitle_avg_num() - lastCycleStat.getTitle_avg_num()) / (lastCycleStat.getTitle_avg_num() + 0.00000000001),4);
        if(titleAvgNumGrowth > MAX_GROWTH){
            titleAvgNumGrowth = 0;
        }
        dataMap.put("title_avg_num_growth", titleAvgNumGrowth);
        dataMap.put("title_talent_num", stat.getTitle_talent_num());
        double titleTalentNumGrowth = CommonUtil.setScale((double)(stat.getTitle_talent_num() - lastCycleStat.getTitle_talent_num()) / (lastCycleStat.getTitle_talent_num() + 0.00000000001),4);
        if(titleTalentNumGrowth > MAX_GROWTH){
            titleTalentNumGrowth = 0;
        }
        dataMap.put("title_talent_num_growth", titleTalentNumGrowth);

        dataMap.put("positive_rate", stat.getPositive_rate());
        double positiveRateGrowth = CommonUtil.setScale((double)(stat.getPositive_rate() - lastCycleStat.getPositive_rate()) / (lastCycleStat.getPositive_rate() + 0.00000000001),4);
        if(positiveRateGrowth > MAX_GROWTH){
            positiveRateGrowth = 0;
        }
        dataMap.put("positive_rate_growth", positiveRateGrowth);
        dataMap.put("positive_avg_rate", stat.getPositive_avg_rate());
        double positiveAvgRateGrowth = CommonUtil.setScale((double)(stat.getPositive_avg_rate() - lastCycleStat.getPositive_avg_rate()) / (lastCycleStat.getPositive_avg_rate() + 0.00000000001),4);
        if(positiveAvgRateGrowth > MAX_GROWTH){
            positiveAvgRateGrowth = 0;
        }
        dataMap.put("positive_avg_rate_growth", positiveAvgRateGrowth);
        dataMap.put("positive_talent_rate", stat.getPositive_talent_rate());
        double positiveTalentRateGrowth = CommonUtil.setScale((double)(stat.getPositive_talent_rate() - lastCycleStat.getPositive_talent_rate()) / (lastCycleStat.getPositive_talent_rate() + 0.00000000001),4);
        if(positiveTalentRateGrowth > MAX_GROWTH){
            positiveTalentRateGrowth = 0;
        }
        dataMap.put("positive_talent_rate_growth", positiveTalentRateGrowth);

        dataMap.put("negative_rate", stat.getNegative_rate());
        double negativeRateGrowth = CommonUtil.setScale((double)(stat.getNegative_rate() - lastCycleStat.getNegative_rate()) / (lastCycleStat.getNegative_rate() + 0.00000000001),4);
        if(negativeRateGrowth > MAX_GROWTH){
            negativeRateGrowth = 0;
        }
        dataMap.put("negative_rate_growth", negativeRateGrowth);
        dataMap.put("negative_avg_rate", stat.getNegative_avg_rate());
        double negativeAvgRateGrowth = CommonUtil.setScale((double)(stat.getNegative_avg_rate() - lastCycleStat.getNegative_avg_rate()) / (lastCycleStat.getNegative_avg_rate() + 0.00000000001),4);
        if(negativeAvgRateGrowth > MAX_GROWTH){
            negativeAvgRateGrowth = 0;
        }

        dataMap.put("negative_avg_rate_growth", negativeAvgRateGrowth);
        dataMap.put("negative_talent_rate", stat.getNegative_talent_rate());
        double negativeTalentRateGrowth = CommonUtil.setScale((double)(stat.getNegative_talent_rate() - lastCycleStat.getNegative_talent_rate()) / (lastCycleStat.getNegative_talent_rate() + 0.00000000001),4);
        if(negativeTalentRateGrowth > MAX_GROWTH){
            negativeTalentRateGrowth = 0;
        }
        dataMap.put("negative_talent_rate_growth", negativeTalentRateGrowth);

        dataMap.put("useless_rate", stat.getUseless_rate());
        double uselessRateGrowth = CommonUtil.setScale((double)(stat.getUseless_rate() - lastCycleStat.getUseless_rate()) / (lastCycleStat.getUseless_rate() + 0.00000000001),4);
        if(uselessRateGrowth > MAX_GROWTH){
            uselessRateGrowth = 0;
        }
        dataMap.put("useless_rate_growth", uselessRateGrowth);
        dataMap.put("useless_avg_rate", stat.getUseless_avg_rate());
        double uselessAvgRateGrowth = CommonUtil.setScale((double)(stat.getUseless_avg_rate() - lastCycleStat.getUseless_avg_rate()) / (lastCycleStat.getUseless_avg_rate() + 0.00000000001),4);
        if(uselessAvgRateGrowth > MAX_GROWTH){
            uselessAvgRateGrowth = 0;
        }
        dataMap.put("useless_avg_rate_growth", uselessAvgRateGrowth);
        dataMap.put("useless_talent_rate", stat.getUseless_talent_rate());
        double uselessTalentRateGrowth = CommonUtil.setScale((double)(stat.getUseless_talent_rate() - lastCycleStat.getUseless_talent_rate()) / (lastCycleStat.getUseless_talent_rate() + 0.00000000001),4);
        if(uselessTalentRateGrowth > MAX_GROWTH){
            uselessTalentRateGrowth = 0;
        }
        dataMap.put("useless_talent_rate_growth", uselessTalentRateGrowth);

        dataMap.put("hotword_num", stat.getHotword_num());
        double hotwordNumGrowth = CommonUtil.setScale((double)(stat.getHotword_num() - lastCycleStat.getHotword_num()) / (lastCycleStat.getHotword_num() + 0.00000000001),4);
        if(hotwordNumGrowth > MAX_GROWTH){
            hotwordNumGrowth = 0;
        }
        dataMap.put("hotword_num_growth",hotwordNumGrowth);
        dataMap.put("hotword_avg_num", stat.getHotword_avg_num());
        double hotwordAvgNumGrowth = CommonUtil.setScale((double)(stat.getHotword_avg_num() - lastCycleStat.getHotword_avg_num()) / (lastCycleStat.getHotword_avg_num() + 0.00000000001),4);
        if(hotwordAvgNumGrowth > MAX_GROWTH){
            hotwordAvgNumGrowth = 0;
        }
        dataMap.put("hotword_avg_num_growth", hotwordAvgNumGrowth);
        dataMap.put("hotword_talent_num", stat.getHotword_talent_num());
        double hotwordTalentNumGrowth = CommonUtil.setScale((double)(stat.getHotword_talent_num() - lastCycleStat.getHotword_talent_num()) / (lastCycleStat.getHotword_talent_num() + 0.00000000001),4);
        if(hotwordTalentNumGrowth > MAX_GROWTH){
            hotwordTalentNumGrowth = 0;
        }
        dataMap.put("hotword_talent_num_growth", hotwordTalentNumGrowth);

        dataMap.put("topic_num", stat.getTopic_num());
        double topicNumGrowth = CommonUtil.setScale((double)(stat.getTopic_num() - lastCycleStat.getTopic_num()) / (lastCycleStat.getTopic_num() + 0.00000000001),4);
        if(topicNumGrowth > MAX_GROWTH){
            topicNumGrowth = 0;
        }
        dataMap.put("topic_num_growth", topicNumGrowth);
        dataMap.put("topic_avg_num", stat.getTopic_avg_num());
        double topicAvgNumGrowth = CommonUtil.setScale((double)(stat.getTopic_avg_num() - lastCycleStat.getTopic_avg_num()) / (lastCycleStat.getTopic_avg_num() + 0.00000000001),4);
        if(topicAvgNumGrowth > MAX_GROWTH){
            topicAvgNumGrowth = 0;
        }
        dataMap.put("topic_avg_num_growth", topicAvgNumGrowth);
        dataMap.put("topic_talent_num", stat.getTopic_talent_num());
        double topicTalentNumGrowth = CommonUtil.setScale((double)(stat.getTopic_talent_num() - lastCycleStat.getTopic_talent_num()) / (lastCycleStat.getTopic_talent_num() + 0.00000000001),4);
        if(topicTalentNumGrowth > MAX_GROWTH){
            topicTalentNumGrowth = 0;
        }
        dataMap.put("topic_talent_num_growth", topicTalentNumGrowth);

        String talentGames[] = stat.getTalent_games().split(",");
        dataMap.put("talent_games", Arrays.asList(talentGames));
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult findForumPostNumDistribute(String dataDateStart, String dataSateEnd, Integer projectId) {
        List<Do_proj_forum_stat> _list= m_mapper_proj_forum_stat.getDistribute(projectId, dataDateStart, dataSateEnd);

        ArrayList<Do_proj_forum_stat> _rlist=new ArrayList<Do_proj_forum_stat>();

        for(Do_proj_forum_stat _do:_list)
        {
            if( projectInfoCacheService.isInfoidValid(projectId.toString(),_do.getInfo_id().toString()) )
            {
                _rlist.add(_do);
            }
        }

        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("get", _rlist);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult findForumAttitudesGroupDistribute(String dataDateStart, String dataSateEnd, Integer projectId) {
        List<Do_proj_forum_attitude_distri> _list = m_mapper_proj_forum_attitude_distri.getDetailDistribute(projectId, dataDateStart, dataSateEnd);
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("get", _list);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult findForumUselessClassifyDistribute(String dataDateStart, String dataSateEnd, Integer projectId) {
        List<Do_proj_forum_useless_classify> do_classify_list = mapper_proj_forum_useless_classify.getFourmUselessClassifyListByProjectDateSpan(projectId, dataDateStart, dataSateEnd);

        Map<String, String> infoNameMap = new HashMap<>();

        Map<String, Double> forumUselessMap = new HashMap<>();
        Map<String, Map<String, Double>> forumUselessClassifyMap = new HashMap<>();

        for(Do_proj_forum_useless_classify do_classify : do_classify_list){
            String infoId = do_classify.getInfo_id() + "";
            String uselessClassify = do_classify.getUseless_classify();
            int num = do_classify.getUseless_num();
            infoNameMap.put(infoId, do_classify.getForum_name());

            Double mapForumNum = forumUselessMap.get(infoId);
            if(mapForumNum == null){
                mapForumNum = 0d;
            }
            mapForumNum += num;
            forumUselessMap.put(infoId, mapForumNum);
            Map<String, Double> uselessClassifyMap = forumUselessClassifyMap.get(infoId);
            if(uselessClassifyMap == null){
                uselessClassifyMap = new HashMap<>();
            }
            uselessClassifyMap.put(uselessClassify, Double.valueOf(num));
            forumUselessClassifyMap.put(infoId, uselessClassifyMap);
        }
        forumUselessMap = MathCaculateUtil.getPercentValueMap(forumUselessMap);
        forumUselessMap = MathCaculateUtil.sortMapByValue(forumUselessMap, "desc");

        List<Map<String, Object>> forumUselessDistriList = new ArrayList<>();
        int index = 0;
        StringBuilder otherForumInfosSb = new StringBuilder();
        double otherForumRate = 0;

        Map<String, Double> otherUselessClassifyMap = new HashMap<>();

        for(Map.Entry<String, Double> entry : forumUselessMap.entrySet()){
            index++;
            String fourmInfoId = entry.getKey();
            Double forumUselessRate = entry.getValue();
            if(index <= SHOW_FORUM_NUM){
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("info_id_list", fourmInfoId);
                map.put("show_forum_name", infoNameMap.get(fourmInfoId));
                map.put("useless_rate", forumUselessRate);

                Map<String, Double> uselessClassifyMap = forumUselessClassifyMap.get(fourmInfoId);
                uselessClassifyMap = MathCaculateUtil.getPercentValueMap(uselessClassifyMap);
                uselessClassifyMap = MathCaculateUtil.sortMapByValue(uselessClassifyMap, "desc");
                List<Map<String, Object>> UselessClassifyDistriList = new ArrayList<>();
                for(Map.Entry<String, Double> uselessClassifyEntry : uselessClassifyMap.entrySet()){
                    String uselessClassify = uselessClassifyEntry.getKey();
                    Double classifyUselessRate = uselessClassifyEntry.getValue();
                    Map<String, Object> map2 = new LinkedHashMap<>();
                    map2.put("useless_classify", uselessClassify);
                    map2.put("useless_rate", classifyUselessRate);
                    UselessClassifyDistriList.add(map2);
                }
                map.put("detail_classify_distri", UselessClassifyDistriList);
                forumUselessDistriList.add(map);
            }else{
                otherForumInfosSb.append(fourmInfoId).append(",");
                otherForumRate += forumUselessRate;
                Map<String, Double> uselessClassifyMap = forumUselessClassifyMap.get(fourmInfoId);
                for(Map.Entry<String, Double> uselessClassifyEntry : uselessClassifyMap.entrySet()){
                    String uselessClassify = uselessClassifyEntry.getKey();
                    Double classifyUselessRate = uselessClassifyEntry.getValue();
                    Double otherRate = otherUselessClassifyMap.get(uselessClassify);
                    if(otherRate == null){
                        otherRate = 0d;
                    }
                    otherRate += classifyUselessRate;
                    otherUselessClassifyMap.put(uselessClassify, otherRate);
                }

            }

        }

        if(otherForumInfosSb.length() > 0){
            otherForumInfosSb.deleteCharAt(otherForumInfosSb.length() - 1);
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("info_id_list", otherForumInfosSb.toString());
            map.put("show_forum_name","其它");
            map.put("useless_rate", otherForumRate);

            otherUselessClassifyMap = MathCaculateUtil.getPercentValueMap(otherUselessClassifyMap);
            otherUselessClassifyMap = MathCaculateUtil.sortMapByValue(otherUselessClassifyMap, "desc");

            List<Map<String, Object>> UselessClassifyDistriList = new ArrayList<>();
            for(Map.Entry<String, Double> uselessClassifyEntry : otherUselessClassifyMap.entrySet()){
                String uselessClassify = uselessClassifyEntry.getKey();
                Double classifyUselessRate = uselessClassifyEntry.getValue();
                Map<String, Object> map2 = new LinkedHashMap<>();
                map2.put("useless_classify", uselessClassify);
                map2.put("useless_rate", classifyUselessRate);
                UselessClassifyDistriList.add(map2);
            }
            map.put("detail_classify_distri", UselessClassifyDistriList);
            forumUselessDistriList.add(map);
        }

        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("useless_distri", forumUselessDistriList);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult findForumKeywordsDistribute(String dataDateStart, String dataSateEnd, Integer projectId) {
        List<Do_proj_forum_topwords_common> _list=m_mapper_proj_forum_topwords_common.getKeywordsDistribute(projectId, dataDateStart, dataSateEnd);
        Do_proj_forum_common_stat stat = mapper_proj_forum_common_stat.getForumCommonStatBydateSpan(projectId, dataDateStart, dataSateEnd);
        if(stat == null){
            stat = new Do_proj_forum_common_stat();
        }
        if(stat.getHotword_num().intValue() == 0){
            _list = new ArrayList<>();
        }
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("get", _list);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult findForumTopicDistribute(String dataDateStart, String dataSateEnd, Integer projectId) {
        List<Do_proj_forum_top_topic_day> do_topic_list = mapper_proj_forum_top_topic_day.getTopicDistriListByProjectDateSpan(projectId, dataDateStart, dataSateEnd,0,15);

        List<Map<String, Object>> dataList = new ArrayList<>();
        for(Do_proj_forum_top_topic_day do_topic : do_topic_list){
            String topicId = do_topic.getTopic_id();
            String topicWordListStr = do_topic.getTopic_word_list();
            Integer postNum = do_topic.getPost_num();
            String realTopicWords = getCutTopicWords(topicWordListStr);

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("topic_id", topicId);
            map.put("topic_word_list", realTopicWords);
            map.put("post_num", postNum);
            if(postNum >= 5) {
                dataList.add(map);
            }
        }
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("topic_distri", dataList);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    private String getCutTopicWords(String topicWordListStr){
        String topicWords[] = topicWordListStr.split(" ");
        Map<String, Double> topicWordNumMap = new HashMap<>();
        for(String topicWord : topicWords){
            String[] topicWordTokens = topicWord.split(":");
            String keyword = topicWordTokens[0];
            int keywordWeight = 0;
            if(topicWordTokens.length == 2){
                keywordWeight = Integer.parseInt(topicWordTokens[1]);
            }

            Double mapNum = topicWordNumMap.get(keyword);
            if(mapNum == null){
                mapNum = 0d;
            }
            mapNum += keywordWeight;
            topicWordNumMap.put(keyword, mapNum);
        }
        topicWordNumMap = MathCaculateUtil.sortMapByValue(topicWordNumMap, "desc");
        int index = 0;
        StringBuilder sb = new StringBuilder();
        for(Map.Entry<String, Double> entry : topicWordNumMap.entrySet()){
            index++;
            if(index <= TOPIC_WORD_NUM){
                sb.append(entry.getKey()).append(" ");
            }
        }
        if(sb.length() > 0){
            sb.deleteCharAt(sb.length() - 1);
        }
        return sb.toString();
    }

    public DataResult findForumQueryPosts(String keywords, String data_date_start, String data_date_end, String info_id_list, String order_by_field, String order_type, String topic_id, String sentiment_score, String lighttower_classify, String classify_sentiment, String useless_classify, Integer index, Integer limit, String query_or_term, String lighttower_tags, String real_tag, Integer only_query_title, Integer projectId) {



        if(!CommonUtil.IsEmpty(useless_classify)){
            data_date_start = DateUtil.getOffsetDatePartitionString(DateUtil.parseDateString(data_date_start), -1);
            data_date_end = DateUtil.getOffsetDatePartitionString(DateUtil.parseDateString(data_date_end), -1);
        }
        if(data_date_start.length() < 19){
            data_date_start+=" 00:00:00";
        }
        if(data_date_end.length() < 19){
            data_date_end+=" 23:59:59";
        }
        if(CommonUtil.IsEmpty(lighttower_tags)){
            lighttower_tags = real_tag;
        }

        keywords=keywords.trim();
        info_id_list=info_id_list.trim();
        if(info_id_list==""){
            info_id_list=projectInfoCacheService.getValidInfoidList(projectId.toString());
        }
        ArrayList<ElasticSearchObj> searchList = new ArrayList<>();
        ElasticSearchObj searchObj;
        // 根据时间跨度查询
        searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.RANGE, "publish_time", data_date_start+"\t"+data_date_end);
        searchList.add(searchObj);
        if(!CommonUtil.IsEmpty(keywords)){
            // 根据关键词查询
            searchObj = new ElasticSearchObj(
                    ElasticSearchObj.ESearchType.KEYWORD_QUERY,
                    "title\tcontent", keywords);
            searchList.add(searchObj);
        }
        if(!CommonUtil.IsEmpty(lighttower_tags)){
            String tags[] = lighttower_tags.split(",");
            StringBuilder sb = new StringBuilder();
            for(String tag : tags){
                sb.append(lighttower_classify).append(":").append(tag).append("\t");
            }
            if(sb.length() > 0){
                sb.deleteCharAt(sb.length() - 1);
            }
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.IN, "lighttower_tags", sb.toString());
            searchList.add(searchObj);
        }
        if(!CommonUtil.IsEmpty(lighttower_classify) && !CommonUtil.IsEmpty(classify_sentiment)){
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.QUERY,
                    "lighttower_class", lighttower_classify+"/"+classify_sentiment);
            searchList.add(searchObj);
        }else if (!CommonUtil.IsEmpty(classify_sentiment)){
            int sentimentScore = Integer.parseInt(classify_sentiment);
            String queryStr = "";
            if(sentimentScore < 0){
                queryStr = "-2\t-1";
            }else if(sentimentScore == 0){
                queryStr = "0";
            }else{
                queryStr = "1\t2";
            }
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.IN,
                    "sentiment_score", queryStr);
            searchList.add(searchObj);
        }else if(!CommonUtil.IsEmpty(lighttower_classify)){
            String queryStr = lighttower_classify+"/1\t"+lighttower_classify+"/0\t"+lighttower_classify+"/-1";
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.IN,
                    "lighttower_class", queryStr);
            searchList.add(searchObj);
        }
        // 根据论坛的project_id来查询
        searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "project_id", String.valueOf(projectId));
        searchList.add(searchObj);
        if(!CommonUtil.IsEmpty(info_id_list)){
            // 根据论坛的info_id来查询
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.IN, "info_id", info_id_list.replaceAll(",", "\t"));
            searchList.add(searchObj);
        }
        if(!CommonUtil.IsEmpty(topic_id)){
            // 根据论坛的topic_id来查询
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.IN, "topic_id", topic_id.replaceAll(",", "\t"));
            searchList.add(searchObj);
        }
        if(!CommonUtil.IsEmpty(useless_classify)){
            // 根据论坛的topic_id来查询
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.IN, "useless_classify", useless_classify.replaceAll(",", "\t"));
            searchList.add(searchObj);
        }
        if(!CommonUtil.IsEmpty(sentiment_score)){
            // 根据论坛的topic_id来查询
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.IN, "sentiment_score", sentiment_score.replaceAll(",", "\t"));
            searchList.add(searchObj);
        }
        ElasticSearchQueryUtil util = ElasticSearchQueryUtil.getInstance();
        JSONObject resultObj = null;
        logger.info("ForumQueryPostsServlet req params :"+searchList.toString());
        try{
            if(order_by_field!=null && !order_by_field.equals("")){
                SortOrder order = SortOrder.DESC;
                if(order_type.equals("asc")){
                    order=SortOrder.ASC;
                }
                ArrayList<ElasticSearchOrder> orderList = new ArrayList<>();
                ElasticSearchOrder searchOrder = new ElasticSearchOrder(order_by_field, order);
                orderList.add(searchOrder);
                if(!CommonUtil.IsEmpty(keywords) && only_query_title == 0){
                    try{
                        resultObj = util.searchDataWithComment("gas_title", index, limit, searchList, orderList);
                    }catch(Exception e){
                        Thread.sleep(200);
                        resultObj = util.searchDataWithComment("gas_title", index, limit, searchList, orderList);
                    }
                }
                else{
                    resultObj = util.searchData("gas_title", index, limit, searchList, orderList);
                }
            }
            else{
                if(!CommonUtil.IsEmpty(keywords) && only_query_title == 0){
                    resultObj = util.searchDataWithComment("gas_title", index, limit, searchList);

                }
                else{
                    resultObj = util.searchData("gas_title", index, limit, searchList);
                }
            }
        }catch (Exception e){
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR);
        }
        if(resultObj!=null){
            JSONArray array = resultObj.getJSONObject("data").getJSONArray("list");
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
        return new DataResult(ReturnCodeDim.SUCCESS,resultObj);
    }

    public DataResult findForumQueryReplyPosts(String infoId, String titleId, Integer index, Integer limit, String projectId) {
        ArrayList<ElasticSearchObj> searchList = new ArrayList<>();
        ElasticSearchObj searchObj;
        ArrayList<ElasticSearchOrder> orderList = new ArrayList<>();
        ElasticSearchOrder searchOrder = new ElasticSearchOrder("publish_time", SortOrder.ASC);
        orderList.add(searchOrder);
        searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "project_id", projectId);
        searchList.add(searchObj);
        searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "info_id", infoId);
        searchList.add(searchObj);
        searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "title_id", titleId);
        searchList.add(searchObj);
        ElasticSearchQueryUtil util = ElasticSearchQueryUtil.getInstance();
        try {
            JSONObject resultObj = util.searchData("gas_content", index, limit, searchList, orderList);
            return new DataResult(ReturnCodeDim.SUCCESS,resultObj);
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR);
        }
    }

}
