package cn.thinkingdata.web.service.core.industry;

import cn.thinkingdata.web.domain.appstore.Do_gas_rating_info;
import cn.thinkingdata.web.domain.industry.*;
import cn.thinkingdata.web.persistence.appstore.Mapper_gas_rating_info;
import cn.thinkingdata.web.persistence.industry.*;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.DateUtil;
import cn.thinkingdata.web.util.ReturnCodeDim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by Xiaowu on 2016/8/8.
 */
@Service
public class IndustryService {

    @Autowired
    private Mapper_industry_trend_day mapper_industry_trend_day;
    @Autowired
    private Mapper_industry_trend_realtime mapper_industry_trend_realtime;

    @Autowired
    private Mapper_industry_game_type_distri mapper_industry_game_type_distri;

    @Autowired
    private Mapper_industry_province_distri mapper_industry_province_distri;

    @Autowired
    private Mapper_industry_type_game_num_distri mapper_industry_type_game_num_distri;

    @Autowired
    private Mapper_industry_type_negative_distri mapper_industry_type_negative_distri;

    @Autowired
    private Mapper_industry_appstore_type_distri mapper_industry_appstore_type_distri;

    @Autowired
    private Mapper_industry_article_classify_distri mapper_industry_article_classify_distri;

    @Autowired
    private Mapper_industry_article_topic mapper_industry_article_topic;

    @Autowired
    private Mapper_industry_article_hot_words mapper_industry_article_hot_words;

    @Autowired
    private Mapper_industry_game_hot_rank mapper_industry_game_hot_rank;

    @Autowired
    private Mapper_gas_rating_info mapper_gas_rating_info;

    private static final double MAX_GROWTH = 1000;

    private static final int RELATED_WORD_NUM = 20;

    public DataResult findGeneralTrends(String scope) {
        Map<String, Object> dataMap = new LinkedHashMap<>();
        if(scope.equalsIgnoreCase("realtime")){
            String currentDateStr = DateUtil.getMinuteDateString(new Date());
            String yesterdaySameDateStr = DateUtil.getMinuteDateString(DateUtil.getOffsetDate(DateUtil.parseDateString(currentDateStr), -1));
            String yesterdayLastDateStr = DateUtil.getPartitionString(DateUtil.parseDateString(yesterdaySameDateStr)) + " 23:59:00";

            String trendStartDateStr =  DateUtil.getOffsetMinute(currentDateStr, -60);
            Do_industry_trend_realtime currentStat = mapper_industry_trend_realtime.getTrendRealtimeByDate(currentDateStr);
            if(currentStat == null){
                currentStat = new Do_industry_trend_realtime();
            }
            Do_industry_trend_realtime yesterdaySameTimeStat = mapper_industry_trend_realtime.getTrendRealtimeByDate(yesterdaySameDateStr);
            if(yesterdaySameTimeStat == null){
                yesterdaySameTimeStat = new Do_industry_trend_realtime();
            }
            Do_industry_trend_realtime yesterdayTotalStat = mapper_industry_trend_realtime.getTrendRealtimeByDate(yesterdayLastDateStr);
            if(yesterdayTotalStat == null){
                yesterdayTotalStat = new Do_industry_trend_realtime();
            }
            List<Do_industry_trend_realtime> realtimeTrendsList = mapper_industry_trend_realtime.getTrendRealtimeByDateSpan(trendStartDateStr, currentDateStr);
            if(realtimeTrendsList == null){
                realtimeTrendsList = new ArrayList<>();
            }
            dataMap.put("title_num_today_total", currentStat.getForum_total_post_num());
            dataMap.put("title_num_yesterday_basis", yesterdaySameTimeStat.getForum_total_post_num());
            dataMap.put("title_num_yesterday_total", yesterdayTotalStat.getForum_total_post_num());
            dataMap.put("channel_num_today_total", currentStat.getChan_total_post_num());
            dataMap.put("channel_num_yesterday_basis", yesterdaySameTimeStat.getChan_total_post_num());
            dataMap.put("channel_num_yesterday_total", yesterdayTotalStat.getChan_total_post_num());
            dataMap.put("article_num_today_total", currentStat.getArticle_total_post_num());
            dataMap.put("article_num_yesterday_basis", yesterdaySameTimeStat.getArticle_total_post_num());
            dataMap.put("article_num_yesterday_total", yesterdayTotalStat.getArticle_total_post_num());


            List<Map<String,Object>> realtimeTrendsResList = new ArrayList<>();
            for(Do_industry_trend_realtime do_trend : realtimeTrendsList){
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("data_time", DateUtil.getTimeStringWithoutDate(DateUtil.parseDateString(do_trend.getData_date())));
                map.put("title_num", do_trend.getForum_post_num());
                realtimeTrendsResList.add(map);
            }
            dataMap.put("title_distri_realtime", realtimeTrendsResList);
        }else{
            String yesterdayStr = DateUtil.getOffsetDatePartitionString(new Date(), -1);
            String dayTrendsStartDateStr = DateUtil.getOffsetDatePartitionString(new Date(), -31);
            List<Do_industry_trend_day> dayTrend_list = mapper_industry_trend_day.getTrendDayByDateSpan(dayTrendsStartDateStr, yesterdayStr);
            dataMap.put("industry_distri_day", dayTrend_list);
        }
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findGameTypeDistri() {
        String dataDate = mapper_industry_game_type_distri.getMaxDataDate();
        String yesterdayDate = DateUtil.getOffsetDatePartitionString(DateUtil.parseDateString(dataDate), -1);
        List<Do_industry_game_type_distri> gameTypeDistriList = mapper_industry_game_type_distri.getGameTypeDistriListByTwoDay(dataDate, yesterdayDate);

        Map<String, List<Map<String, Object>>> platformMap = new LinkedHashMap<>();

        for(Do_industry_game_type_distri do_distri : gameTypeDistriList){
            String platform = do_distri.getPlatform();
            List<Map<String, Object>> platformDataList = platformMap.get(platform);
            if(platformDataList == null){
                platformDataList = new ArrayList<>();
            }
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("detail_type", do_distri.getDetail_type());
            map.put("user_rate", do_distri.getUser_rate());

            double userRateGrowth = CommonUtil.setScale((double)(do_distri.getUser_rate() - do_distri.getUser_rate_yesterday()) / (do_distri.getUser_rate_yesterday() + 0.00000000001),4);
            if(userRateGrowth > MAX_GROWTH){
                userRateGrowth = 0;
            }
            map.put("user_rate_growth",userRateGrowth);
            map.put("game_rate", do_distri.getGame_rate());

            double gameRateGrowth = CommonUtil.setScale((double)(do_distri.getGame_rate() - do_distri.getGame_rate_yesterday()) / (do_distri.getGame_rate_yesterday() + 0.00000000001),4);
            if(gameRateGrowth > MAX_GROWTH){
                gameRateGrowth = 0;
            }
            map.put("game_rate_growth", gameRateGrowth);
            map.put("post_num", do_distri.getPost_num());

            double postNumGrowth = CommonUtil.setScale((double)(do_distri.getPost_num() - do_distri.getPost_num_yesterday()) / (do_distri.getPost_num_yesterday() + 0.00000000001),4);
            if(postNumGrowth > MAX_GROWTH){
                postNumGrowth = 0;
            }
            map.put("post_num_growth", postNumGrowth);
            platformDataList.add(map);
            platformMap.put(platform, platformDataList);
        }
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("game_type_distri", platformMap);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findUserProvinceDistri() {
        List<Do_industry_province_distri> provinceDistriList = mapper_industry_province_distri.getProvinceDistriList();
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("province_distri", provinceDistriList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findTypeNumDistri() {
        List<Do_industry_type_game_num_distri> numDistriList = mapper_industry_type_game_num_distri.getTypeNumDistriList();

        Map<String, List<Map<String, Object>>> platformMap = new LinkedHashMap<>();
        for(Do_industry_type_game_num_distri do_distri : numDistriList){
            String platform = do_distri.getPlatform();
            List<Map<String, Object>> platformDataList = platformMap.get(platform);
            if(platformDataList == null){
                platformDataList = new ArrayList<>();
            }
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("detail_type", do_distri.getDetail_type());
            map.put("game_rate", do_distri.getGame_rate());
            map.put("talent_game_list", do_distri.getTalent_game_list().split(","));
            platformDataList.add(map);
            platformMap.put(platform, platformDataList);
        }
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("type_num_distri", platformMap);

        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findComplainDistri(String scope,String platform,String detailType) {
        Map<String, Object> dataMap = new LinkedHashMap<>();
        if(scope.equals("all")){
            List<Do_industry_type_negative_distri> negDistriAllList = mapper_industry_type_negative_distri.getNegTotalDistriList();
            Map<String, List<Map<String, Object>>> negDistriAllTypeMap = new LinkedHashMap<>();
            for(Do_industry_type_negative_distri do_distri : negDistriAllList){
                platform = do_distri.getPlatform();
                List<Map<String, Object>> platformDistriList = negDistriAllTypeMap.get(platform);
                if(platformDistriList == null){
                    platformDistriList = new ArrayList<>();
                }
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("detail_type", do_distri.getDetail_type());
                map.put("complain_rate", do_distri.getComplain_rate());
                map.put("negative_post_rate", do_distri.getNegative_post_rate());
                platformDistriList.add(map);
                negDistriAllTypeMap.put(platform, platformDistriList);
            }
            dataMap.put("negtive_distri_all", negDistriAllTypeMap);

        }else{
            List<Do_industry_type_negative_distri_detail> negDistriDetailList = mapper_industry_type_negative_distri.getNegDetailDistriList(platform, detailType);
            List<Map<String, Object>> negDistriDetailMapList = new ArrayList<>();
            int maxHotIndex = 0;
            for(Do_industry_type_negative_distri_detail do_distri : negDistriDetailList){
                if(do_distri.getHot_index() > maxHotIndex){
                    maxHotIndex = do_distri.getHot_index();
                }
            }
            for(Do_industry_type_negative_distri_detail do_distri : negDistriDetailList){
                int hotIndex = do_distri.getHot_index();
                double rankRate = 0;
                if(maxHotIndex != 0){
                    rankRate = CommonUtil.setScale((double) (maxHotIndex - hotIndex) / (double) maxHotIndex,2);
                }
                if(rankRate == 0.00){
                    rankRate = 0.01;
                }
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("project_id", do_distri.getProject_id());
                map.put("hot_index", do_distri.getHot_index());
                map.put("rank_rate", rankRate);
                map.put("complain_rate", do_distri.getComplain_rate());
                negDistriDetailMapList.add(map);
            }
            dataMap.put("negtive_distri_detail", negDistriDetailMapList);
        }
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findAppstoreType(String dataDate, Integer deviceType, Integer listType) {
        List<Do_industry_appstore_type_distri> typeDistriList = mapper_industry_appstore_type_distri.getAppstoreTypeDistriList(dataDate, listType, deviceType);
        List<Map<String, Object>> typeDistriMapList = new ArrayList<>();
        for(Do_industry_appstore_type_distri do_distri : typeDistriList){
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("app_type", do_distri.getApp_type());
            map.put("app_num", do_distri.getApp_num());
            typeDistriMapList.add(map);
        }
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("appstore_type_distri", typeDistriMapList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findArticleDistri() {
        List<Do_industry_article_classify_distri> articleClassifyDistriList = mapper_industry_article_classify_distri.getArticleClassifyDistriList();
        Map<String, List<Map<String, Object>>> mainClassDistriMap = new LinkedHashMap<>();
        for(Do_industry_article_classify_distri do_distri : articleClassifyDistriList){
            String mainClass = do_distri.getMain_class();
            List<Map<String, Object>> subDistriList = mainClassDistriMap.get(mainClass);
            if(subDistriList == null){
                subDistriList = new ArrayList<>();
            }
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("sub_class", do_distri.getSub_class());
            map.put("article_num", do_distri.getArticle_num());
            subDistriList.add(map);
            mainClassDistriMap.put(mainClass, subDistriList);
        }

        List<Map<String, Object>> mainClassDistriList = new ArrayList<>();
        for(Map.Entry<String, List<Map<String, Object>>> entry : mainClassDistriMap.entrySet()){
            String mainClass = entry.getKey();
            List<Map<String, Object>> subDistriList = entry.getValue();
            int mainArticleNum = 0;
            for(Map<String, Object> map : subDistriList){
                mainArticleNum += (Integer) map.get("article_num");
            }

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("main_class", mainClass);
            map.put("article_num", mainArticleNum);
            map.put("sub_class_list", subDistriList);
            mainClassDistriList.add(map);
        }
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("article_classify_distri", mainClassDistriList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findArticleTopic(String startDate,String endDate) {
        List<Do_industry_article_topic> articleTopicList = mapper_industry_article_topic.getArticleTopicByDateSpan(startDate, endDate);
        List<Map<String, Object>> topicDistriList = new ArrayList<>();
        for(Do_industry_article_topic do_topic : articleTopicList){
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("topic_id", do_topic.getTopic_id());
            map.put("topic_keywords", do_topic.getTopic_keywords());
            map.put("article_num", do_topic.getArticle_num());
            topicDistriList.add(map);
        }
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("article_topic_distri", topicDistriList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findArticleHotWords() {
        List<Do_industry_article_hot_words> hotWordsList = mapper_industry_article_hot_words.getArticleHotWordsList();
        List<Map<String, Object>> hotwordsMapList = new ArrayList<>();
        for(Do_industry_article_hot_words do_words : hotWordsList){
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("keyword", do_words.getKeyword());
            map.put("hot_score", do_words.getHot_score());
            String relatedWords[] = do_words.getRelated_words().split(",");
            int relatedWordNum = Math.min(RELATED_WORD_NUM, relatedWords.length);
            List<String> relatedWordList = new ArrayList<>();
            for(int i = 0; i < relatedWordNum; i++){
                String tokens[] = relatedWords[i].split(":");
                String relatedWord = tokens[0];
                relatedWordList.add(relatedWord);
            }
            map.put("related_word_list", relatedWordList);
            hotwordsMapList.add(map);
        }

        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("article_hot_word_distri", hotwordsMapList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findGameRank(String platform) {
        List<Do_industry_game_hot_rank> hotRankList = mapper_industry_game_hot_rank.getGameHotRankByPlatform(platform);
        Map<String, List<Integer>> detailTypeRankMap = new LinkedHashMap<>();
        for(Do_industry_game_hot_rank do_rank : hotRankList){
            String detailType = do_rank.getDetail_type();
            List<Integer> rankProjectList = detailTypeRankMap.get(detailType);
            if(rankProjectList == null){
                rankProjectList = new ArrayList<>();
            }
            rankProjectList.add(do_rank.getProject_id());
            detailTypeRankMap.put(detailType, rankProjectList);
        }
        List<Map<String, Object>> detailTypeRankList = new ArrayList<>();
        for(Map.Entry<String, List<Integer>> entry : detailTypeRankMap.entrySet()){
            String detailType = entry.getKey();
            List<Integer> projectIdList = entry.getValue();
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("detail_type", detailType);
            map.put("project_list", projectIdList);
            detailTypeRankList.add(map);
        }
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("game_rank_distri", detailTypeRankList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult findIndustryAppstoreTypeRank(String dataDate, Integer deviceType, Integer listType, Integer appType, Integer index, Integer limit) {
        List<Do_gas_rating_info> appstoreRatingList = mapper_gas_rating_info.getAppstoreTopRatingByDetailType(dataDate, appType, deviceType, listType, index, limit);
        List<Map<String, Object>> appstoreRatingMapList = new ArrayList<>();
        for(Do_gas_rating_info do_rating : appstoreRatingList){
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("rank", do_rating.getRank());
            map.put("app_name", do_rating.getApp_name());
            map.put("app_img", do_rating.getApp_img());
            map.put("app_author", do_rating.getApp_author());
            map.put("app_score", do_rating.getApp_total_average_rating());
            map.put("comment_num", do_rating.getApp_total_rating_count());
            appstoreRatingMapList.add(map);
        }
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("appstore_type_rank", appstoreRatingMapList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }
}
