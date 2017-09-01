package cn.thinkingdata.web.service.core.user.custom.outer;

import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchObj;
import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchOrder;
import cn.thinkingdata.elasticsearch.query.util.ElasticSearchQueryUtil;
import cn.thinkingdata.web.constant.GameConstant;
import cn.thinkingdata.web.constant.SessionAttr;
import cn.thinkingdata.web.domain.appstore.Do_gas_apps_history_ratings;
import cn.thinkingdata.web.domain.appstore.Do_gas_rating_info;
import cn.thinkingdata.web.domain.custom.Custom_do_lt_class_distri;
import cn.thinkingdata.web.domain.gas.Do_gas_apps_info;
import cn.thinkingdata.web.domain.gas.Do_gas_projects;
import cn.thinkingdata.web.domain.industry.Do_industry_game_hot_rank;
import cn.thinkingdata.web.domain.project.Do_project_hot_list;
import cn.thinkingdata.web.domain.project.Do_project_opinion_rank_distri;
import cn.thinkingdata.web.domain.project.Do_project_radar_stat;
import cn.thinkingdata.web.domain.project.Do_project_tag_dim;
import cn.thinkingdata.web.domain.project.channel.Do_proj_channel_info_mid;
import cn.thinkingdata.web.domain.project.channel.Do_proj_channel_rating_distri;
import cn.thinkingdata.web.domain.project.channel.Do_proj_channel_senti_topwords;
import cn.thinkingdata.web.domain.project.forum.*;
import cn.thinkingdata.web.domain.project.lt.Do_proj_lt_common_stat;
import cn.thinkingdata.web.domain.project.lt.Do_proj_lt_detail_stat;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.domain.user.Do_user_recommend_projects;
import cn.thinkingdata.web.persistence.appstore.Mapper_gas_apps_history_ratings;
import cn.thinkingdata.web.persistence.appstore.Mapper_gas_rating_info;
import cn.thinkingdata.web.persistence.gas.Mapper_gas_apps_info;
import cn.thinkingdata.web.persistence.gas.Mapper_gas_project_tag;
import cn.thinkingdata.web.persistence.gas.Mapper_gas_projects;
import cn.thinkingdata.web.persistence.industry.Mapper_industry_game_hot_rank;
import cn.thinkingdata.web.persistence.project.Mapper_project_competing_products;
import cn.thinkingdata.web.persistence.project.Mapper_project_hot_list;
import cn.thinkingdata.web.persistence.project.Mapper_project_opinion_rank_distri;
import cn.thinkingdata.web.persistence.project.Mapper_project_radar_stat;
import cn.thinkingdata.web.persistence.project.channel.Mapper_proj_channel_info_mid;
import cn.thinkingdata.web.persistence.project.channel.Mapper_proj_channel_rating_distri;
import cn.thinkingdata.web.persistence.project.channel.Mapper_proj_channel_rating_distri_new;
import cn.thinkingdata.web.persistence.project.channel.Mapper_proj_channel_senti_topwords;
import cn.thinkingdata.web.persistence.project.forum.*;
import cn.thinkingdata.web.persistence.project.lt.Mapper_proj_lt_common_stat;
import cn.thinkingdata.web.persistence.project.lt.Mapper_proj_lt_detail_stat;
import cn.thinkingdata.web.persistence.user.Mapper_user_project_collection;
import cn.thinkingdata.web.persistence.user.Mapper_user_recommend_projects;
import cn.thinkingdata.web.service.cache.ProjectInfoCacheService;
import cn.thinkingdata.web.service.cache.ReputationCacheService;
import cn.thinkingdata.web.service.core.project.ProjectService;
import cn.thinkingdata.web.util.*;
import cn.thinkingdata.web.vo.project.forum.Vo_proj_forum_attitude;
import com.alibaba.fastjson.JSONObject;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * @author Carpenter
 * @date 2016/12/19 10:05
 * @description ReputationService
 */
@Service
public class ReputationService {

    @Autowired
    private Mapper_gas_projects mapperGasProjects;

    @Autowired
    private Mapper_gas_project_tag mapperGasProjectTag;

    @Autowired
    private Mapper_project_competing_products mapperProjectCompetingProducts;

    @Autowired
    private Mapper_proj_channel_rating_distri mapperProjChannelRatingDistri;

    @Autowired
    private Mapper_proj_channel_rating_distri_new mapperProjChannelRatingDistriNew;

    @Autowired
    private Mapper_proj_channel_info_mid mapperProjChannelInfoMid;

    @Autowired
    private Mapper_project_opinion_rank_distri mapperProjectOpinionRankDistri;

    @Autowired
    private Mapper_proj_lt_common_stat mapperProjLtCommonStat;

    @Autowired
    private Mapper_project_radar_stat mapperProjectRadarStat;

    @Autowired
    private Mapper_proj_forum_common_stat mapperProjForumCommonStat;

    @Autowired
    private Mapper_gas_apps_history_ratings mapperGasAppsHistoryRatings;

    @Autowired
    private Mapper_proj_lt_common_stat mapper_proj_lt_common_stat;

    @Autowired
    private Mapper_proj_lt_detail_stat mapper_proj_lt_detail_stat;

    @Autowired
    private Mapper_proj_forum_topwords_common mapperProjForumTopwordsCommon;

    @Autowired
    private Mapper_proj_forum_top_topic_day mapperProjForumTopTopicDay;

    @Autowired
    private Mapper_gas_rating_info mapperGasRatingInfo;

    @Autowired
    private Mapper_industry_game_hot_rank mapperIndustryGameHotRank;

    @Autowired
    private Mapper_proj_forum_attitude_distri mapperProjForumAttitudeDistri;

    @Autowired
    private Mapper_proj_channel_senti_topwords mapperProjChannelSentiTopwords;

    @Autowired
    private Mapper_proj_forum_stat mapperProjForumStat;

    @Autowired
    private Mapper_proj_forum_useless_classify mapperProjForumUselessClassify;

    @Autowired
    private Mapper_proj_lt_detail_stat mapperProjLtDetailStat;

    @Autowired
    private Mapper_gas_apps_info mapperGasAppsInfo;

    @Autowired
    private Mapper_user_project_collection mapperUserProjectCollection;

    @Autowired
    private Mapper_project_hot_list mapperProjectHotList;

    @Autowired
    private Mapper_user_recommend_projects mapperUserRecommendProjects;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectInfoCacheService projectInfoCacheService;

    @Autowired
    private ReputationCacheService reputationCacheService;

    private static final int SHOW_TAG_NUM = 9;
    private static final int MAX_COMPETING_GAME_NUM = 8;
    private static final int MONTH_DAY = -29;
    private static final int YESTERDAY_DAY = -1;
    private static final double MAX_GROWTH = 1000;
    private static final double TOPIC_WORD_NUM = 3;

    public DataResult getReputationIntroduce(Integer projectId) {
        projectService.refreshViewHistoryProjects(projectId);

        Map<String,Object> resultData = new HashMap<>();
        //游戏简介
        Do_gas_projects projectInfo = projectInfoCacheService.getProjectsByProjectId(projectId.toString());
        List projectTagList = projectInfoCacheService.getTagListByProjectId(projectId.toString());
        if(projectTagList == null){
            projectTagList = new ArrayList<>();
        }
        String competingProjectsStr = mapperProjectCompetingProducts.getCompetingProjects(projectId);
        Map<String, Object> resultMap = new LinkedHashMap<>();
        //游戏开发商、作者
        resultMap.put("author", projectInfo.getAuthor());
        //发行商
        resultMap.put("distributor", projectInfo.getDistributor());
        //游戏类型：Y 页游、D 端游、S 手游、W 单机&电玩。默认第一位的是主类型
        resultMap.put("game_type", projectInfo.getGame_type());
        //发行日期
        resultMap.put("release_date", projectInfo.getRelease_date());
        //游戏概述
        resultMap.put("overview", projectInfo.getOverview());
        resultMap.put("hot_rank", projectInfo.getHot_rank());
        resultMap.put("hot_rank_yesterday", projectInfo.getHot_rank_yesterday());
        resultMap.put("forum_content_num", projectInfo.getForum_content_num());
        resultMap.put("tag_list", projectTagList);
        resultMap.put("opinion_score", projectInfo.getOpinion_score());

        //--Thinkinggame舆情榜
        Map tgRankMap = reputationCacheService.getTGRank(projectId.toString());
        resultMap.putAll(tgRankMap);
        //--近30天论坛帖子总量

        Optional<Do_proj_forum_common_stat> latestProjForumCommonStatOpt = Optional.ofNullable(mapperProjForumCommonStat.getForumCommonStatLatest(projectId));
        Do_proj_forum_common_stat latestProjForumCommonStat = null;
        if(latestProjForumCommonStatOpt.isPresent()){
            latestProjForumCommonStat = latestProjForumCommonStatOpt.get();
            String dateStart = DateUtil.getPartitionString(DateUtil.getOffsetDate(DateUtil.parseDateString(latestProjForumCommonStat.getData_date()),MONTH_DAY));
            String dateEnd = DateUtil.getPartitionString(DateUtil.parseDateString(latestProjForumCommonStat.getData_date()));
            Optional<Do_proj_forum_common_stat> statOpt = Optional.ofNullable(mapperProjForumCommonStat.getForumCommonStatBydateSpan(projectId, dateStart, dateEnd));
            Do_proj_forum_common_stat stat = null;
            if(statOpt.isPresent()){
                stat = statOpt.get();
            }else {
                stat = new Do_proj_forum_common_stat();
            }
            String lastCycleStartDateStr = DateUtil.getPartitionString(DateUtil.getOffsetDate(DateUtil.parseDateString(dateStart),MONTH_DAY));
            String lastCycleEndDateStr = dateStart;
            Optional<Do_proj_forum_common_stat> lastCycleStatOpt = Optional.ofNullable(mapperProjForumCommonStat.getForumCommonStatBydateSpan(projectId, lastCycleStartDateStr, lastCycleEndDateStr));
            Do_proj_forum_common_stat lastCycleStat = null;
            if(lastCycleStatOpt.isPresent()){
                lastCycleStat = lastCycleStatOpt.get();
            }else {
                lastCycleStat = stat;
            }
            resultMap.put("title_num", stat.getTitle_num());
            Float titleNumGrowth = CommonUtil.calculateRate(Double.valueOf((stat.getTitle_num() - lastCycleStat.getTitle_num())+"") ,Double.valueOf(lastCycleStat.getTitle_num()+""));
            if(titleNumGrowth > MAX_GROWTH){
                titleNumGrowth = 0.0f;
            }
            resultMap.put("title_num_growth", titleNumGrowth);
            //--近30天论坛正面情感贴
            resultMap.put("positive_num", stat.getPositive_num().intValue());
            Float positiveNumGrowth = CommonUtil.calculateRate((stat.getPositive_num() - lastCycleStat.getPositive_num()) , lastCycleStat.getPositive_num());
            if(positiveNumGrowth > MAX_GROWTH){
                positiveNumGrowth = 0.0f;
            }
            resultMap.put("positive_num_growth", positiveNumGrowth);
            //--近30天论坛负面情感贴
            resultMap.put("negative_num_num", stat.getNegative_num().intValue());
            Float negativeNumGrowth = CommonUtil.calculateRate((stat.getNegative_num() - lastCycleStat.getNegative_num()), lastCycleStat.getNegative_num());
            if(negativeNumGrowth > MAX_GROWTH){
                negativeNumGrowth = 0.0f;
            }
            resultMap.put("negative_num_growth", negativeNumGrowth);

            Optional<String> latestProjChannelRatingDistriNewDate = Optional.ofNullable(mapperProjChannelRatingDistriNew.getLatestProjChannelRatingDistriNew());
            if(latestProjChannelRatingDistriNewDate.isPresent()) {
                Map channelRatingMap = reputationCacheService.getChannelRatingRank(projectId.toString(),latestProjChannelRatingDistriNewDate.get());
                resultMap.putAll(channelRatingMap);
            }
        }else {
            resultMap.put("title_num", "-");
            resultMap.put("title_num_growth", "-");
            resultMap.put("positive_num", "-");
            resultMap.put("positive_num_growth", "-");
            resultMap.put("negative_num_num", "-");
            resultMap.put("negative_num_growth", "-");
        }

        resultData.put("game_info",resultMap);

        //竞品推荐
        List<Map> competingProjectList = new ArrayList<>();
        if(competingProjectsStr != null){
            String competingProjects[] = competingProjectsStr.split(",");
            int competingNum = Math.min(MAX_COMPETING_GAME_NUM, competingProjects.length);
            for(int i = 0; i < competingNum; i++){
                Map competingProject = reputationCacheService.getTGRank(competingProjects[i]);
                competingProject.put("project_id",competingProjects[i]);
                competingProject.put("project_tags",projectInfoCacheService.getTagListByProjectId(competingProjects[i]));
                competingProjectList.add(competingProject);
            }
        }
        resultData.put("competing_list", competingProjectList);
        //玩家情感概览

        //舆情雷达
        Map<String, Object> radarResult = new LinkedHashMap<>();
        Map<String, Object> radarData = new LinkedHashMap<>();
        Do_project_radar_stat do_project_radar_stat = mapperProjectRadarStat.getGameRadar(projectId);
        if(do_project_radar_stat == null){
            return new DataResult(ReturnCodeDim.DATA_NOT_PREPARED,"");
        }
        Map map = mapperProjectRadarStat.getGameAvg(projectId);
        int total = Integer.parseInt(map.get("total").toString());
        String type = map.get("game_type").toString();
        radarResult.put("avg",transforMap(total,map));
        radarData.put("user_weight",getRadarValue(total,do_project_radar_stat.getUser_rank()));
        radarData.put("post_weight",getRadarValue(total,do_project_radar_stat.getPost_rank()));
        radarData.put("negative_weight",getRadarValue(total,do_project_radar_stat.getNegative_rank()));
        radarData.put("stable_weight",getRadarValue(total,do_project_radar_stat.getStable_rank()));
        radarData.put("useless_weight",getRadarValue(total,do_project_radar_stat.getUser_rank()));
        if(type.equals("S")){
            radarData.put("appstore_weight",getRadarValue(total,do_project_radar_stat.getAppstore_rank()));
        }
        radarResult.put("real",radarData);
        resultData.put("radar_data",radarResult);

        //榜单排名

        //渠道信息
        List<Do_proj_channel_info_mid> projChannelInfoMidList = mapperProjChannelInfoMid.get(projectId);
        resultData.put("channel_info",projChannelInfoMidList);

        return new DataResult(ReturnCodeDim.SUCCESS, resultData);
    }

    /**
     *（1-当前位置/总数）*0.8+0.2
     */
    private Double getRadarValue(int total,Object value){
        return (1-Double.parseDouble(value.toString())/total)*0.8+0.2;
    }

    private Map transforMap(int total,Map map){
        Map result = new HashMap();
        result.put("user_weight",getRadarValue(total,map.get("user_rank")));
        result.put("post_weight",getRadarValue(total,map.get("post_rank")));
        result.put("negative_weight",getRadarValue(total,map.get("negative_rank")));
        result.put("stable_weight",getRadarValue(total,map.get("stable_rank")));
        result.put("useless_weight",getRadarValue(total,map.get("useless_rank")));
        if(map.get("game_type").toString().equals("S")){
            result.put("appstore_weight",getRadarValue(total,map.get("appstore_rank")));
        }
        return result;
    }

    public DataResult getReputationIntroduceFeedback(Integer projectId, String startDate, String endDate) {
        List<Do_proj_lt_common_stat> ltCommonStatList = mapperProjLtCommonStat.getLtCommonStatDataList(projectId, startDate, endDate);
        List<Map<String, Object>> feedbackNumDistriList = new ArrayList<>();

        for(Do_proj_lt_common_stat do_stat : ltCommonStatList){
            Map<String, Object> feedbackNumMap = new TreeMap<>();
            feedbackNumMap.put("data_date", do_stat.getData_date());
            feedbackNumMap.put("positive_num", do_stat.getPositive_num());
            feedbackNumMap.put("negative_num", do_stat.getNegative_num());
            feedbackNumDistriList.add(feedbackNumMap);
        }
        return new DataResult(ReturnCodeDim.SUCCESS,feedbackNumDistriList);
    }

    public DataResult getReputationIntroduceOpinion(Integer projectId, String startDate, String endDate,Integer appType, Integer listType, Integer deviceType) {
        Map<String,Object> projectRank = new HashMap<>();
        List<Do_project_opinion_rank_distri> projectOpinionRankDistriList  = mapperProjectOpinionRankDistri.getProjectOpinionRankList(projectId, startDate, endDate);
        projectRank.put("project_rank",projectOpinionRankDistriList);
        List<Do_gas_apps_history_ratings> projectDateRatingList = mapperGasAppsHistoryRatings.getProjectAppstoreRatingList(projectId, startDate, endDate, appType, listType, deviceType);
        List appStoreRating = new ArrayList();
        for(Do_gas_apps_history_ratings do_date_distri : projectDateRatingList){
            String dataDate = do_date_distri.getData_date();
            int rank = do_date_distri.getRank();
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("data_date", dataDate);
            map.put("rank", rank);
            appStoreRating.add(map);
        }
        projectRank.put("app_store",appStoreRating);
        return new DataResult(ReturnCodeDim.SUCCESS,projectRank);
    }

    public DataResult getReputationFeedbackAnalyse(String dataDateStart, String dataDateEnd, Integer projectId) {
        List<Do_proj_lt_common_stat> ltCommonStatList = mapper_proj_lt_common_stat.getLtCommonStatDataList(projectId, dataDateStart, dataDateEnd);
        if(ltCommonStatList == null){
            ltCommonStatList = new ArrayList<>();
        }
        List<Custom_do_lt_class_distri> ltClassDistriList = mapper_proj_lt_detail_stat.getLtClassDistriList(projectId, dataDateStart, dataDateEnd);
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
        if(1 == otherRate){
            otherRate = 0;
        }

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

    public DataResult getReputationFeedbackAnalyseDetail(String dataDateStart, String dataDateEnd, Integer classifySentiment, String lighttowerClassify, Integer projectId) {
        List<Do_proj_lt_detail_stat> ltDetailStatList = mapper_proj_lt_detail_stat.getLtDetailStatList(projectId, dataDateStart, dataDateEnd, classifySentiment, lighttowerClassify);

        List<Map<String, Object>> feedbackDateDistriList = new ArrayList<>();
        Map<String, Double> feedbackTagMap = new HashMap<>();
        if(ltDetailStatList.size() < 1 ){
            Map<String, Object> map = new TreeMap<>();
            map.put("data_date", dataDateEnd);
            map.put("post_num", 0);
            feedbackDateDistriList.add(map);
        }else {
            for (Do_proj_lt_detail_stat do_stat : ltDetailStatList) {
                Map<String, Object> map = new TreeMap<>();
                map.put("data_date", do_stat.getData_date());
                map.put("post_num", do_stat.getPost_num());
                feedbackDateDistriList.add(map);

                String tagsStr = do_stat.getLighttower_tags();
                if (tagsStr.length() == 0) {
                    continue;
                }
                String tags[] = tagsStr.split(",");
                for (String tagInfo : tags) {
                    String tokens[] = tagInfo.split(":");
                    String tag = tokens[0];
                    if (tag.equals("其它")) {
                        continue;
                    }
                    double weight = Double.parseDouble(tokens[1]);
                    Double mapWeight = feedbackTagMap.get(tag);
                    if (mapWeight == null) {
                        mapWeight = 0d;
                    }
                    mapWeight += weight;
                    feedbackTagMap.put(tag, mapWeight);
                }
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
            map.put("tag_rate", 0);
            feedbackTagDistriList.add(map);
        }

        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("feedback_date_distri", feedbackDateDistriList);
        dataMap.put("feedback_tag_distri", feedbackTagDistriList);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult getReputationFeedbackHotwords(String dataDateStart, String dataDateEnd, Integer projectId) {
        List<Do_proj_forum_topwords_common> projForumTopwordsCommonList = mapperProjForumTopwordsCommon.getKeywordClassifyCountByProjectId(projectId,dataDateStart,dataDateEnd);
        List<Map<String,Object>> projForumTopwordsList = new LinkedList<>();
        Map<String,Object> other = new HashMap<>();
        other.put("keyword_classify","其他");
        other.put("cnt",0);
        for(Do_proj_forum_topwords_common projForumTopwordsCommon : projForumTopwordsCommonList){
            if(null == projForumTopwordsCommon.getKeyword_classify() || projForumTopwordsCommon.getKeyword_classify().length() <= 0){
                Integer cnt = Integer.valueOf(other.get("cnt").toString()) + projForumTopwordsCommon.getCnt();
                other.put("cnt",cnt);
                other.put("keywords",getKeyWordListByKeywordClassify(dataDateStart,dataDateEnd,projectId,projForumTopwordsCommon.getKeyword_classify()));
            }else {
                Map projForumTopwords = new HashMap();
                projForumTopwords.put("keyword_classify",projForumTopwordsCommon.getKeyword_classify());
                projForumTopwords.put("cnt",projForumTopwordsCommon.getCnt());

                projForumTopwords.put("keywords",getKeyWordListByKeywordClassify(dataDateStart,dataDateEnd,projectId,projForumTopwordsCommon.getKeyword_classify()));
                projForumTopwordsList.add(projForumTopwords);
            }
        }
        Collections.sort(projForumTopwordsList, new Comparator<Map<String, Object>>() {
            public int compare(Map<String, Object> o1, Map<String, Object> o2) {
                int map1value = (Integer) o1.get("cnt");
                int map2value = (Integer) o2.get("cnt");
                return map2value - map1value;
            }
        });
        projForumTopwordsList.add(other);
        return new DataResult(ReturnCodeDim.SUCCESS,projForumTopwordsList);
    }

    private List<Map<String,Object>> getKeyWordListByKeywordClassify(String dataDateStart, String dataDateEnd, Integer projectId,String keyword_classify){
        List<Do_proj_forum_topwords_common> keyWordsList = mapperProjForumTopwordsCommon.getKeywordByKeywordClassify(projectId,dataDateStart,dataDateEnd,keyword_classify);
        List<Map<String,Object>> keywordList = new ArrayList<>();
        Integer index = 0;
        for (Do_proj_forum_topwords_common keyWord:keyWordsList){
            if(50<=index){
                continue;
            }
            Map<String,Object> keyWordTemp = new HashMap<>();
            keyWordTemp.put("keyword",keyWord.getKeyword());
            keyWordTemp.put("cnt",keyWord.getCnt());
            keywordList.add(keyWordTemp);
            index++;
        }
        return keywordList;
    }

    public DataResult getReputationFeedbackKeywords(String dataDateStart, String dataDateEnd, Integer projectId, String keyword) {
        List<Do_proj_forum_topwords_common> keyWordsList = mapperProjForumTopwordsCommon.getProjForumDataByKeyword(projectId,dataDateStart,dataDateEnd,keyword);
        Map<String,Object> dateProjForumMap = new HashMap<>();
        for(Do_proj_forum_topwords_common projForumTopwordsCommon:keyWordsList){
            dateProjForumMap.put(projForumTopwordsCommon.getData_date(),projForumTopwordsCommon.getCnt());
        }
        Date dateStart = DateUtil.parseDateString(dataDateStart);
        Date dateEnd = DateUtil.parseDateString(dataDateEnd);
        List x_axis = CommonUtil.getDatesBetweenTwoDate(dateStart,dateEnd);
        List y_axis = new ArrayList();
        for(Object key:x_axis){
            Object value = dateProjForumMap.get(key);
            if(null != value){
                y_axis.add(value);
            }else {
                y_axis.add(0);
            }
        }
        Map resultData = new HashMap();
        resultData.put("x_axis",x_axis);
        resultData.put("y_axis",y_axis);
        return new DataResult(ReturnCodeDim.SUCCESS,resultData);
    }

    public DataResult getReputationFeedbackRank(String dataDateStart, String dataDateEnd, Integer projectId, Integer index, Integer limit) {
        List<Do_proj_forum_top_topic_day> do_topic_list = mapperProjForumTopTopicDay.getTopicDistriListByProjectDateSpan(projectId, dataDateStart, dataDateEnd,index,limit);
        Double total = mapperProjForumTopTopicDay.getTopicDistriTotalByProjectDateSpan(projectId, dataDateStart, dataDateEnd);
        List<Map<String, Object>> dataList = new ArrayList<>();
        for(Do_proj_forum_top_topic_day do_topic : do_topic_list){
            String topicId = do_topic.getTopic_id();
            String topicWordListStr = do_topic.getTopic_word_list();
            Integer postNum = do_topic.getPost_num();
            String realTopicWords = getCutTopicWords(topicWordListStr);
            Integer positiveNum = do_topic.getPositive_num();
            Integer negativeNum = do_topic.getNegative_num();

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("topic_id", topicId);
            map.put("topic_word_list", realTopicWords);
            map.put("hot_num", CommonUtil.calculateRate(postNum+0.0d,total));
            map.put("post_num", postNum);
            map.put("positive_num", positiveNum);
            map.put("negative_num", negativeNum);
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

    public DataResult getReputationAppstoreRank(String dataDate, Integer deviceType, Integer listType, Integer appType, Integer index, Integer limit) {
        List<Do_gas_rating_info> appstoreRatingList = mapperGasRatingInfo.getAppstoreTopRatingByDetailType(dataDate, appType, deviceType, listType, index, limit);
        Integer total = mapperGasRatingInfo.getAppstoreTopRatingByDetailTypeCount(dataDate,appType,deviceType,listType);
        List appstoreRankList = new ArrayList();
        String lastDay = DateUtil.getPartitionString(DateUtil.getOffsetDate(DateUtil.parseDateString(dataDate),YESTERDAY_DAY));
        for(Do_gas_rating_info gasRatingInfo:appstoreRatingList){
            Map app = new HashMap();
            Do_gas_rating_info lastGasRatingInfo = reputationCacheService.getGasRatingInfoByDateAndAppId(lastDay,gasRatingInfo.getApp_id(),appType.toString(),deviceType.toString(),listType.toString());
            app.put("rank", gasRatingInfo.getRank());
            app.put("app_name", gasRatingInfo.getApp_name());
            app.put("app_img", gasRatingInfo.getApp_img());
            app.put("app_author", gasRatingInfo.getApp_author());
            app.put("app_score", gasRatingInfo.getApp_total_average_rating());
            Object ratingCount = gasRatingInfo.getApp_total_rating_count();
            if( null == ratingCount){
                ratingCount = "-";
            }
            app.put("comment_num", ratingCount);
            Integer projectId = projectInfoCacheService.getProjectByAppId(gasRatingInfo.getApp_id());
            app.put("project_id",projectId!=null?projectId:"-");
            if(-1 == gasRatingInfo.getV1_count()){
                app.put("positive_num", "-");
                app.put("negative_num", "-");
            }else {
                Integer negativeNum = gasRatingInfo.getV1_count()+gasRatingInfo.getV2_count();
                Integer positiveNum = gasRatingInfo.getV3_count()+gasRatingInfo.getV4_count()+gasRatingInfo.getV5_count();
                app.put("positive_num", positiveNum);
                app.put("negative_num", negativeNum);
            }

            if(null != lastGasRatingInfo && gasRatingInfo.getV1_count() != -1 && lastGasRatingInfo.getV1_count() != -1){
                Integer negativeNum = lastGasRatingInfo.getV1_count()+lastGasRatingInfo.getV2_count();
                Integer positiveNum = lastGasRatingInfo.getV3_count()+lastGasRatingInfo.getV4_count()+lastGasRatingInfo.getV5_count();
                Integer commentNum = lastGasRatingInfo.getApp_total_rating_count();
                Float positiveRate = CommonUtil.calculateRate((Float.valueOf(app.get("positive_num").toString())-positiveNum),(positiveNum+0.0F));
                Float negativeRate = CommonUtil.calculateRate((Float.valueOf(app.get("negative_num").toString())-negativeNum),(negativeNum+0.0F));
                Float commentRate = CommonUtil.calculateRate((Float.valueOf(app.get("comment_num").toString())-commentNum),(commentNum+0.0F));

                app.put("comment_rate", commentRate);
                app.put("positive_rate", positiveRate);
                app.put("negative_rate", negativeRate);
            }else {
                if((null != lastGasRatingInfo)&&(gasRatingInfo.getV1_count() == -1 || lastGasRatingInfo.getV1_count() == -1)){
                    Integer rankSpan = lastGasRatingInfo.getRank() - gasRatingInfo.getRank();
                    app.put("rank_span", rankSpan);
                }else {
                    app.put("rank_span", "-");
                }
                app.put("comment_rate", "-");
                app.put("positive_rate", "-");
                app.put("negative_rate", "-");
            }
            if(null != lastGasRatingInfo){
                app.put("rank_span", lastGasRatingInfo.getRank() - gasRatingInfo.getRank());
            }else {
                app.put("rank_span","-");
            }
            appstoreRankList.add(app);
        }

        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("data", appstoreRankList);
        dataMap.put("total", total);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult getReputationIntroduceOpinionAppstore(Integer projectId) {
        List<Integer> gameTypeDimList = mapperGasAppsHistoryRatings.getGameTypeDimList(projectId);
        List<Integer> listTypeDimList = mapperGasAppsHistoryRatings.getListTypeDimList(projectId);
        List<Integer> deviceTypeDimList = mapperGasAppsHistoryRatings.getDeviceTypeDimList(projectId);
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("game_type_dim", gameTypeDimList);
        dataMap.put("list_type_dim", listTypeDimList);
        dataMap.put("device_type_dim", deviceTypeDimList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult getReputatinOpinionRank(String platform,String detailType, Integer index, Integer limit) {
        Integer total = mapperIndustryGameHotRank.getGameHotRankByPlatformAndDetailTypeCount(platform,detailType);
        List<Do_industry_game_hot_rank> hotRankList = mapperIndustryGameHotRank.getGameHotRankByPlatformAndDetailType(platform,detailType,index,limit);
        List gameRankList = new ArrayList();
        String latestDate = reputationCacheService.getProjForumAttitudeLatestDate();
        for (Do_industry_game_hot_rank industryGameHotRank:hotRankList){
            Map game = reputationCacheService.getProjForumAttitude(industryGameHotRank.getProject_id().toString(),latestDate);

            Optional<Do_gas_projects> gasProjectsOpt = Optional.ofNullable(projectInfoCacheService.getProjectsByProjectId(industryGameHotRank.getProject_id().toString()));
            if(gasProjectsOpt.isPresent()) {
                Do_gas_projects gasProjects = gasProjectsOpt.get();
                game.put("project_name", gasProjects.getProject_name());
                game.put("author", gasProjects.getAuthor());
                game.put("distributor", gasProjects.getDistributor());
                game.put("game_type", gasProjects.getGame_type());
                game.put("detail_type",detailType);
                game.put("game_tag", projectInfoCacheService.getTagListByProjectId(industryGameHotRank.getProject_id().toString()));
                game.put("rank", industryGameHotRank.getRank());
                game.put("rank_span", industryGameHotRank.getRank_yesterday() - industryGameHotRank.getRank());
                gameRankList.add(game);
            }else {
                return new DataResult(ReturnCodeDim.SYSTEM_ERROR, "数据出错！");
            }
        }
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("game_rank_data", gameRankList);
        dataMap.put("game_rank_total", total);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult getReputationChannelCount(String dataDateStart, String dataDateEnd, Integer projectId) {
        List<Do_proj_channel_rating_distri> do_distri_list = mapperProjChannelRatingDistri.getRatingDistriByProjectDateSpan(projectId, dataDateStart, dataDateEnd);

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

    public DataResult getReputationChannelAnalyse(String dataDateStart, String dataDateEnd, Integer projectId) {
        Map<String, Object> dataMap = new LinkedHashMap<>();
        List<Do_proj_channel_senti_topwords> date_distri_list = mapperProjChannelSentiTopwords.getSentiDateDistriList(projectId, dataDateStart, dataDateEnd);
        List<Do_proj_channel_senti_topwords> word_distri_list = mapperProjChannelSentiTopwords.getSentiWordDistriList(projectId, dataDateStart, dataDateEnd);
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

        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult getReputationForumSearch(String keywords, String ratingStageList, String sourceTypeList, String esFieldName, String esFieldVal, String sentimentKeywords, String queryOrTerm, String lighttowerClassify, String classifySentiment, String lighttowerTags, String dataDateStart, String dataDateEnd, Integer index, Integer limit, String projectId) {
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

    public DataResult getReputationForumAnalyse(String dataDateStart, String dataDateEnd, Integer projectId) {
        List<Do_proj_forum_stat> _list= mapperProjForumStat.getDistribute(projectId, dataDateStart, dataDateEnd);
        Set<String> y_axis_key = new HashSet<>();
        Set<Map> y_axis_desc = new HashSet<>();
        Map<String,Integer> data = new HashMap<>();
        for(Do_proj_forum_stat projForumStat:_list) {
            if( projectInfoCacheService.isInfoidValid(projectId.toString(),projForumStat.getInfo_id().toString()) ) {
                if(!y_axis_key.contains(projForumStat.getForum_name())){
                    y_axis_key.add(projForumStat.getForum_name());
                    Map y_axis_map = new HashMap();
                    y_axis_map.put(projForumStat.getForum_name(),projForumStat.getInfo_id());
                    y_axis_desc.add(y_axis_map);
                }
                data.put(projForumStat.getForum_name()+"$"+projForumStat.getData_date(),projForumStat.getForum_post_num());
            }
        }
        List<String> x_axis = CommonUtil.getDatesBetweenTwoDate(DateUtil.parseDateString(dataDateStart),DateUtil.parseDateString(dataDateEnd));
        Map<String,Object> y_axis = new HashMap<>();
        for(String x : x_axis){
            for(String key : y_axis_key){
                List y_key = CommonUtil.Object2List(y_axis.get(key));
                Integer value = data.get(key+"$"+x);;
                if(null == value){
                    value = 0;
                }
                y_key.add(value);
                y_axis.put(key,y_key);
            }
        }
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("x_axis", x_axis);
        dataMap.put("y_axis", y_axis);
        dataMap.put("y_axis_desc", y_axis_desc);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }


    public DataResult getReputationForumAnalyseRate(String dataDateStart, String dataDateEnd, Integer projectId) {
        List<Do_proj_forum_attitude_distri> _list = mapperProjForumAttitudeDistri.getDetailDistribute(projectId, dataDateStart, dataDateEnd);
        Map<String,Map<String,Integer>> data = new HashMap<>();
        for(Do_proj_forum_attitude_distri projForumAttitudeDistri:_list){
            String attitude = "positive";
            String date = projForumAttitudeDistri.getData_date();
            Integer score = Integer.valueOf(projForumAttitudeDistri.getAttitude_score());
            if(0 != score){
                if(score < 0){
                    attitude = "negative";
                }
                Map<String,Integer> y_axis = CommonUtil.Object2Map(data.get(attitude));
                Optional<Integer> value = Optional.ofNullable(y_axis.get(date));
                if(!value.isPresent()){
                    value = Optional.of(0);
                }
                y_axis.put(date,value.get() + projForumAttitudeDistri.getPost_num());
                data.put(attitude,y_axis);
            }
        }
        List<String> x_axis = CommonUtil.getDatesBetweenTwoDate(DateUtil.parseDateString(dataDateStart),DateUtil.parseDateString(dataDateEnd));
        List y_axis_positive = new ArrayList();
        List y_axis_negative = new ArrayList();
        for(String date : x_axis){
            Integer positiveNum = 0;
            Integer negativeNum = 0;

            if(null != data.get("positive") && null != data.get("positive").get(date)){
                positiveNum = data.get("positive").get(date);
            }
            if(null != data.get("negative") && null != data.get("negative").get(date)){
                negativeNum = data.get("negative").get(date);
            }
            y_axis_negative.add(negativeNum);
            y_axis_positive.add(positiveNum);
        }
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("x_axis", x_axis);
        dataMap.put("y_axis_positive", y_axis_positive);
        dataMap.put("y_axis_negative", y_axis_negative);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult getReputationForumAualityAnalyse(String dataDateStart, String dataDateEnd, Integer projectId) {
        List<Do_proj_forum_useless_classify> do_classify_list = mapperProjForumUselessClassify.getFourmUselessClassifyListByProjectDateSpan(projectId, dataDateStart, dataDateEnd);
        Map<String, String> infoNameMap = new HashMap<>();
        Map<String, Double> forumUselessMap = new HashMap<>();
        Map<String, Map<String, Double>> forumUselessClassifyMap = new HashMap<>();
        Long t2 = new Date().getTime();
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
        Map projForumAttitudeMap = reputationCacheService.getProjForumAttitudeByProjectId(projectId.toString(),dataDateStart,dataDateEnd);
        Set<Integer> infoIdSet = projForumAttitudeMap.keySet();

        for(Map.Entry<String, Double> entry : forumUselessMap.entrySet()){
            String fourmInfoId = entry.getKey();
            Double forumUselessRate = entry.getValue();
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

            Object obj = projForumAttitudeMap.get(Integer.valueOf(fourmInfoId));
            if(null == obj){
                Vo_proj_forum_attitude projForumAttitude = new Vo_proj_forum_attitude();
                projForumAttitude.setNegative(0);
                projForumAttitude.setPositive(0);
                projForumAttitude.setTotal(0);
                obj = projForumAttitude;
            }
            map.put("forum_num",obj);
            map.put("detail_classify_distri", UselessClassifyDistriList);
            forumUselessDistriList.add(map);
            infoIdSet.remove(Integer.valueOf(fourmInfoId));
        }
        for(Integer infoId : infoIdSet){
            Map<String, Object> map = new LinkedHashMap<>();
            String forumName = mapperProjForumAttitudeDistri.getProjForumName(infoId);
            map.put("info_id_list", infoId);
            map.put("show_forum_name", forumName);
            map.put("useless_rate", "-");
            map.put("forum_num",projForumAttitudeMap.get(infoId));
            List<Map> detailClassifyDistriList = new ArrayList<>();
            Map classify = new HashMap();
            classify.put("useless_classify","其他");
            classify.put("useless_rate","1");
            detailClassifyDistriList.add(classify);

            map.put("detail_classify_distri", detailClassifyDistriList);
            forumUselessDistriList.add(map);
        }

        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("useless_distri", forumUselessDistriList);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult getReputationForumClassify(Integer projectId) {
        List classifyList = mapperProjLtDetailStat.getClassifyList(projectId);
        return new DataResult(ReturnCodeDim.SUCCESS,classifyList);
    }

    public DataResult getReputationForumReply(String infoId, String titleId, Integer index, Integer limit, String projectId) {
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

    public DataResult getReputationSearch(String keyword, Integer index, Integer limit) {
        int fromIndex = index;
        List<Do_gas_projects> projectTotalList = getAllProjectsBySearchKeyword(keyword);
        int endIndex = Math.min(index + limit, projectTotalList.size());
        List<Do_gas_projects> subProjectList = projectTotalList.subList(fromIndex, endIndex);
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("total", projectTotalList.size());
        List<Map<String, Object>> projectDataList = new ArrayList<>();
        //TODO:最近时间
        String latestAppDate = reputationCacheService.getLatestAppstoreRankDate();
        String latestForumDate = reputationCacheService.getProjForumAttitudeLatestDate();
        String latestChannelDate = reputationCacheService.getLatestProjChannelRatingDistriNewDate();
        for(Do_gas_projects projectDo : subProjectList){
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("app_rank","-");
            String appId = projectInfoCacheService.getAppIdByProjectId(projectDo.getProject_id().toString());
            if(null != appId){
                Do_gas_rating_info gasRatingInfo = reputationCacheService.getGasRatingInfoByDateAndAppId(latestAppDate,appId,"1","1","3");
                if(null != gasRatingInfo){
                    map.put("app_rank",gasRatingInfo.getRank());
                }
            }
            Map game = reputationCacheService.getProjForumAttitude(projectDo.getProject_id().toString(),latestForumDate);
            Map gameChannel = reputationCacheService.getProjChannelRatingDistriNew(projectDo.getProject_id().toString(),latestChannelDate);
            if(null == gameChannel){
                gameChannel = new HashMap();
                gameChannel.put("channel_total",0);
            }
            map.put("project_id", projectDo.getProject_id());
            map.put("project_name", projectDo.getProject_name());
            map.put("author", projectDo.getAuthor());
            map.put("distributor", projectDo.getDistributor());
            map.put("release_date",projectDo.getRelease_date());
            map.put("game_type", getGameType(projectDo));
            map.put("hot_rank", projectDo.getHot_rank());
            map.put("article_num", projectDo.getArticle_num());
            map.put("forum_content_num", game.get("total"));
            map.put("channel_content_num", gameChannel.get("channel_total"));
            map.put("tag_list", projectInfoCacheService.getTagListByProjectId(projectDo.getProject_id().toString()));
            projectDataList.add(map);
        }
        dataMap.put("project_list", projectDataList);

        List<Do_gas_apps_info> gasAppsInfoList = mapperGasAppsInfo.getGasAppsInfoByKeyword("%"+keyword+"%",index,limit);
        dataMap.put("other_list",gasAppsInfoList);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    private String getGameType(Do_gas_projects projectDo){
        String platformPinYins[] = projectDo.getGame_type().split(",");
        StringBuilder platformBuilder = new StringBuilder();
        for(String platformPinYin : platformPinYins){
            String platform = "";
            if(platformPinYin.equalsIgnoreCase("S")){
                platform = "手游";
            }else if(platformPinYin.equalsIgnoreCase("D")){
                platform = "端游";
            }else if(platformPinYin.equalsIgnoreCase("Y")){
                platform = "页游";
            }else if(platformPinYin.equalsIgnoreCase("W")){
                platform = "单机 电玩";
            }
            platformBuilder.append(platform).append(",");
        }
        if(platformBuilder.length() > 0){
            platformBuilder.deleteCharAt(platformBuilder.length() - 1);
        }

        String gameType = projectDo.getDetail_type_desc() + "/" + platformBuilder.toString();
        return gameType;
    }

    private List<Do_gas_projects> searchProjectByName(String keyword){
        List<Do_gas_projects> resultList = new ArrayList<>();
        List<Do_gas_projects> authorProjectList = new ArrayList<>();
        for(Do_gas_projects projectDo : projectInfoCacheService.getGasProjectsList()){
            String projectName = projectDo.getProject_name().toLowerCase();
            String authorName = projectDo.getAuthor().toLowerCase();
            String distributorName = projectDo.getDistributor().toLowerCase();
            if(projectName.contains(keyword.toLowerCase())){
                resultList.add(projectDo);
            }else if(authorName.contains(keyword.toLowerCase())){
                authorProjectList.add(projectDo);
            }else if(distributorName.contains(keyword.toLowerCase())){
                authorProjectList.add(projectDo);
            }
        }
        resultList.addAll(authorProjectList);
        return resultList;
    }

    private List<Do_gas_projects> getAllProjectsBySearchKeyword(String keywordStr){
        LinkedHashSet<Do_gas_projects> projectResultSet = new LinkedHashSet<>();
        String[] keywords = keywordStr.split(",");
        if(keywords.length>1){
            LinkedHashSet<Do_gas_projects> projectSet = new LinkedHashSet<>();
            for(String keyword : keywords){
                projectSet.addAll(searchProjectByTag(keyword));
                projectSet.addAll(searchProjectByName(keyword));
            }
            for(Do_gas_projects gasProjects : projectSet){
                String tags =  gasProjects.getProject_name()+ "/t"+gasProjects.getAuthor() + "/t"+gasProjects.getGame_type()+"/"+gasProjects.getDistributor();
                List<Integer> tagIds = projectInfoCacheService.getTagListByProjectId(gasProjects.getProject_id().toString());
                List<Do_project_tag_dim> project_tag_dims = projectInfoCacheService.getAllProjectTagList();
                for(Do_project_tag_dim gasProjectTag : project_tag_dims){
                    if(tagIds.contains(gasProjectTag.getTag_id())){
                        tags += "/t" + gasProjectTag.getTag_name();
                    }
                }
                if(tags.contains(keywords[0])&&tags.contains(keywords[1])){
                    projectResultSet.add(gasProjects);
                }
            }
        }else {
            projectResultSet.addAll(searchProjectByTag(keywordStr));
            projectResultSet.addAll(searchProjectByName(keywordStr));
        }
        List<Do_gas_projects> resultList = new ArrayList<>();
        resultList.addAll(projectResultSet);
        return resultList;
    }

    private List<Do_gas_projects> searchProjectByTag(String keyword){
        List<Do_gas_projects> resultList = mapperGasProjectTag.getProjectIdListByTagName(keyword);
        return resultList;
    }

    public DataResult getUserCollectionProject(Integer index, Integer limit) {
        Do_user userDo = WebUtil.getCurrentUser();
        Map<String, Object> dataMap = new HashMap<>();
        List collectionProjList = new ArrayList<>();
        Set<Integer> collectionProjSet = new LinkedHashSet<>();

        if(userDo != null){
            collectionProjSet.addAll(userDo.getOutterGameSet());
        }
        collectionProjSet.addAll(GameConstant.OUTTER_DEMO_PROJECT_SET);
        int endIndex = Math.min(index + limit, collectionProjSet.size());
        List<Integer> selectedProjectList = new ArrayList<>(collectionProjSet).subList(index,endIndex);

        String latestDate = reputationCacheService.getProjForumAttitudeLatestDate();
        for(Integer projectId : selectedProjectList){
            Map game = reputationCacheService.getProjForumAttitude(projectId.toString(),latestDate);
            Do_industry_game_hot_rank industryGameHotRank = mapperIndustryGameHotRank.getGameHotRankByProjectId(projectId);
            if(null != industryGameHotRank){
                game.put("rank",industryGameHotRank.getRank());
                game.put("rank_yesterday",industryGameHotRank.getRank_yesterday());
                game.put("rank_span",industryGameHotRank.getRank_yesterday()-industryGameHotRank.getRank());
            }else {
                game.put("rank","-");
                game.put("rank_yesterday","-");
                game.put("rank_span","-");
            }
            collectionProjList.add(game);
        }

        dataMap.put("collection_list", collectionProjList);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult getHotProject(Integer index, Integer limit) {
        List hotProjectIdList = new ArrayList<>();
        List<Do_project_hot_list> hotList = mapperProjectHotList.getProjectHotList(index, limit);
        for (Do_project_hot_list hot_project : hotList) {
            Do_industry_game_hot_rank industryGameHotRank = mapperIndustryGameHotRank.getGameHotRankByProjectId(hot_project.getProject_id());
            List tags = projectInfoCacheService.getTagListByProjectId(hot_project.getProject_id().toString());
            Map game = new HashMap();
            game.put("projcet_id", hot_project.getProject_id());
            game.put("tags", tags);
            if (null != industryGameHotRank) {
                game.put("rank", industryGameHotRank.getRank());
            } else {
                game.put("rank", "-");
            }
            hotProjectIdList.add(game);
        }
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("hot_project_list", hotProjectIdList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findUserProjectViewHistroy() {
        Do_user userDo = WebUtil.getCurrentUser();
        Map<String, Object> dataMap = new HashMap<>();
        if(userDo == null){
            String tempHistoryProjectStr = (String) WebUtil.getSession(SessionAttr.TEMP_PROJECT_HISTORY);
            if(tempHistoryProjectStr == null || tempHistoryProjectStr.length() == 0){
                dataMap.put("project_list", new ArrayList<>());
            }else{
                String viewHistoryProjects[] = tempHistoryProjectStr.split(",");
                dataMap.put("project_list", getProjectAddTagList(viewHistoryProjects));
            }
        }else{
            String viewHistoryProjectStr = userDo.getProjects_id();
            if(viewHistoryProjectStr == null || viewHistoryProjectStr.length() == 0){
                dataMap.put("project_list", new ArrayList<>());
            }else{
                String viewHistoryProjects[] = viewHistoryProjectStr.split(",");
                dataMap.put("project_list", getProjectAddTagList(viewHistoryProjects));
            }
        }
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    private List getProjectAddTagList(String[] projectIds){
        List projectList = new ArrayList();
        for(String projectId : projectIds){
            Map project = new HashMap();
            List tags = projectInfoCacheService.getTagListByProjectId(projectId);
            project.put("project_id",projectId);
            project.put("project_tags",tags);
            projectList.add(project);
        }
        return projectList;
    }

    public DataResult getReputationAppstoreRankDate() {
        String dataDate = reputationCacheService.getLatestAppstoreRankDate();
        Map data = new HashMap();
        data.put("date",dataDate);
        return new DataResult(ReturnCodeDim.SUCCESS,data);
    }

    public DataResult getRecommendProject(Integer index, Integer limit) {
        List hotProjectIdList = new ArrayList<>();
        List<Do_user_recommend_projects> userRecommendProjectsList = mapperUserRecommendProjects.getRecommendByUserId(WebUtil.getCurrentUser().getUser_id(),index, limit);
        if(null == userRecommendProjectsList || userRecommendProjectsList.size() < 1) {
            List<Do_project_hot_list> hotList = mapperProjectHotList.getProjectHotList(index, limit);
            for (Do_project_hot_list hot_project : hotList) {
                Do_industry_game_hot_rank industryGameHotRank = mapperIndustryGameHotRank.getGameHotRankByProjectId(hot_project.getProject_id());
                List tags = projectInfoCacheService.getTagListByProjectId(hot_project.getProject_id().toString());
                Map game = new HashMap();
                game.put("projcet_id", hot_project.getProject_id());
                game.put("tags", tags);
                if (null != industryGameHotRank) {
                    game.put("rank", industryGameHotRank.getRank());
                } else {
                    game.put("rank", "-");
                }
                hotProjectIdList.add(game);
            }
        }else {
            for(Do_user_recommend_projects project : userRecommendProjectsList) {
                Do_industry_game_hot_rank industryGameHotRank = mapperIndustryGameHotRank.getGameHotRankByProjectId(project.getProject_id());
                List tags = projectInfoCacheService.getTagListByProjectId(project.getProject_id().toString());
                Map game = new HashMap();
                game.put("projcet_id", project.getProject_id());
                game.put("tags", tags);
                if (null != industryGameHotRank) {
                    game.put("rank", industryGameHotRank.getRank());
                } else {
                    game.put("rank", "-");
                }
                hotProjectIdList.add(game);
            }
        }
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("hot_project_list", hotProjectIdList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }
}
