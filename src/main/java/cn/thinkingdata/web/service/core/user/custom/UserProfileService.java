package cn.thinkingdata.web.service.core.user.custom;

import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchObj;
import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchObj.ESearchType;
import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchOrder;
import cn.thinkingdata.elasticsearch.query.util.ElasticSearchQueryUtil;
import cn.thinkingdata.web.domain.baidu.Do_baidu_global_profile_stat;
import cn.thinkingdata.web.domain.baidu.Do_baidu_user_profile_stat;
import cn.thinkingdata.web.domain.gas.Do_gas_crawler_info;
import cn.thinkingdata.web.persistence.baidu.Mapper_baidu_global_profile_stat;
import cn.thinkingdata.web.persistence.baidu.Mapper_baidu_user_profile_stat;
import cn.thinkingdata.web.persistence.gas.Mapper_gas_crawler_info;
import cn.thinkingdata.web.service.cache.RedisService;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.MathCaculateUtil;
import cn.thinkingdata.web.util.RedisUtil;
import cn.thinkingdata.web.util.ReturnCodeDim;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.parser.Feature;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.fasterxml.jackson.core.JsonParseException;
import com.google.common.base.Throwables;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.Map.Entry;

@Service
public class UserProfileService {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    Mapper_baidu_user_profile_stat mapper_baidu_user_profile_stat;
    @Autowired
    Mapper_baidu_global_profile_stat mapper_baidu_global_profile_stat;
    @Autowired
    Mapper_gas_crawler_info mapper_gas_crawler_info;

    @Autowired
    protected RedisService redisService;

    private static int CACHE_EXPIRE_SECONDS = 24 * 60 * 60;

    private static final String BAIDU_USER_PROFILE_TABLE = "baidu_user_profile_mid";

    private static final String[] provinces = {"广东", "江苏", "浙江", "北京", "山东", "上海", "四川", "河南", "湖北", "福建", "河北", "辽宁", "安徽", "湖南", "重庆", "陕西", "广西", "海外", "黑龙江", "江西", "天津", "山西", "吉林", "云南", "内蒙古", "贵州", "甘肃", "新疆", "海南", "宁夏", "香港", "台湾", "西藏", "澳门", "青海"};

    /**
     * @param projectId
     * @return 该游戏的全局画像结果
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getGlobalBaiduProfileJsonStr(int projectId) throws Exception {
        logger.info("global baidu profile, project_id: " + projectId);
        Map<String, Object> resultMap = new HashMap<>();
        Do_baidu_global_profile_stat baiduGlobalProfile = mapper_baidu_global_profile_stat.getProjectGlobalProfile(projectId);
        if (baiduGlobalProfile == null) {
            return resultMap;
        }
        //总人数
        int totalNum = baiduGlobalProfile.getTotal_num();
        resultMap.put("total_num", totalNum);
        //性别分布
        Map<String, Object> sexDistriMap = JSON.parseObject(baiduGlobalProfile.getSex_distri(), new TypeReference<Map<String, Object>>() {
        });
        resultMap.put("sex_distri", mapTrans2ListForObject(sexDistriMap, MapSortType.KEY_ASC, null));
        //地域分布
        Map<String, Object> provinceDistriMap = JSON.parseObject(baiduGlobalProfile.getProvince_distri(), new TypeReference<Map<String, Object>>() {
        });
        for (String province : provinces) {
            if (!provinceDistriMap.containsKey(province)) {
                provinceDistriMap.put(province, 0);
            }
        }
        double provinceTotalNum = 0;
        for (Object value : provinceDistriMap.values()) {
            provinceTotalNum += Double.parseDouble(value.toString());
        }
        for (Entry<String, Object> entry : provinceDistriMap.entrySet()) {
            double num = Double.parseDouble(entry.getValue().toString());
            double provinceRate = 0;
            if (provinceTotalNum != 0) {
                provinceRate = CommonUtil.setScale((double) num / provinceTotalNum, 4);
            }
            provinceDistriMap.put(entry.getKey(), provinceRate);
        }
        resultMap.put("province_distri", mapTrans2ListForObject(provinceDistriMap, MapSortType.VALUE_DESC, null));
        //影响力分布
        Map<String, Object> influenceDistriMap = JSON.parseObject(baiduGlobalProfile.getInfluence_level_distri(), new TypeReference<Map<String, Object>>() {
        });
        resultMap.put("influence_distri", mapTrans2ListForObject(influenceDistriMap, MapSortType.KEY_ASC, null));
        //活跃度分布
        Map<String, Object> activeDistriMap = JSON.parseObject(baiduGlobalProfile.getActive_class_distri(), new TypeReference<Map<String, Object>>() {
        });
        resultMap.put("active_distri", mapTrans2ListForObject(activeDistriMap, MapSortType.KEY_ASC, null));
        //兴趣分布
        Map<String, Object> interestDistriMap = JSON.parseObject(baiduGlobalProfile.getInterest_classifies_distri(), new TypeReference<Map<String, Object>>() {
        });
        for (Entry<String, Object> entry : interestDistriMap.entrySet()) {
            interestDistriMap.put(entry.getKey(), Double.valueOf(entry.getValue().toString()).intValue());
        }
        resultMap.put("interest_distri", mapTrans2ListForObject(interestDistriMap, MapSortType.KEY_ASC, null));
        //抱怨用户数
        int complainNum = baiduGlobalProfile.getComplain_num();
        resultMap.put("complain_num", complainNum);
        //各游戏抱怨情况分布
        Map<String, Object> projRankDistriMap = JSON.parseObject(baiduGlobalProfile.getProject_rank_distri(), new TypeReference<Map<String, Object>>() {
        });
        int maxRank = 0;
        for (Entry<String, Object> entry : projRankDistriMap.entrySet()) {
            int rank = Double.valueOf(entry.getValue().toString()).intValue();
            if (rank > maxRank) {
                maxRank = rank;
            }
        }
        Map<String, Object> projComplainDistriMap = JSON.parseObject(baiduGlobalProfile.getComplain_rate_distri(), new TypeReference<Map<String, Object>>() {
        });
        for (Entry<String, Object> entry : projComplainDistriMap.entrySet()) {
            String key = entry.getKey();
            double complainRate = Double.parseDouble(entry.getValue().toString());
            int rank = Double.valueOf((projRankDistriMap.get(key).toString())).intValue();
            double rank_rate = 0;
            if (maxRank != 0) {
                rank_rate = CommonUtil.setScale((double) (maxRank - rank) / (double) maxRank, 2);
            }
            HashMap<String, Object> projComplainDataMap = new HashMap<>();
            projComplainDataMap.put("rank", rank);
            if (key.equals(projectId + "")) {
                projComplainDataMap.put("rank_rate", rank_rate);
            }
            projComplainDataMap.put("complain_rate", complainRate);
            projComplainDistriMap.put(key, projComplainDataMap);
        }
        resultMap.put("complain_rate_distri", projComplainDistriMap);
        //垃圾用户数
        int trashNum = baiduGlobalProfile.getTrash_user_num();
        resultMap.put("trash_num", trashNum);
        //高付费用户数
        int highPayNum = baiduGlobalProfile.getHigh_pay_user_num();
        resultMap.put("high_pay_num", highPayNum);
        //高魅力用户数
        int highCharmNum = baiduGlobalProfile.getHigh_charm_user_num();
        resultMap.put("high_charm_num", highCharmNum);
        //流失用户数
        int lostNum = baiduGlobalProfile.getLost_user_num();
        resultMap.put("lost_num", lostNum);
        //不同活跃度每日发帖量分布
        Map<String, Object> activePostDistriMap = JSON.parseObject(baiduGlobalProfile.getActive_class_post_distri(), new TypeReference<Map<String, Object>>() {
        });
        resultMap.put("active_post_distri", mapTrans2ListForObject(activePostDistriMap, MapSortType.KEY_ASC, null));
        //不同影响力发帖响应量分布
        Map<String, Object> influenceBeRepliedDistriMap = JSON.parseObject(baiduGlobalProfile.getInfluence_level_replied_distri(), new TypeReference<Map<String, Object>>() {
        });
        resultMap.put("influence_be_replied_distri", mapTrans2ListForObject(influenceBeRepliedDistriMap, MapSortType.KEY_ASC, null));
        return resultMap;
    }

    /**
     * @return 全行业的全局画像结果
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getGlobalBaiduProfileJsonStr() throws Exception {
        logger.info("global baidu profile for all games");
        String cacheRes = null;
        String cacheKey = "all_game_stat";
        try {
//			cacheRes = RedisUtil.getValue(cacheKey).toString();
            cacheRes = redisService.getValue(cacheKey).toString();
        } catch (Exception e) {
            logger.error(Throwables.getStackTraceAsString(e));
            cacheRes = null;
        }
        if (cacheRes != null) {
            logger.info("get all game baidu profile result from cache!");
            return JSON.parseObject(cacheRes, new TypeReference<Map<String, Object>>() {
            });
        }
        Map<String, Object> resultMap = new HashMap<>();
        List<Do_baidu_global_profile_stat> baiduGlobalProfileList = mapper_baidu_global_profile_stat.getProjectGlobalProfileList();
        int totalNum = 0;
        int complainNum = 0;
        int trashNum = 0;
        int highPayNum = 0;
        int highCharmNum = 0;
        int lostNum = 0;
        HashMap<String, Double> sexDistriMap = new HashMap<>();
        HashMap<String, Double> provinceDistriMap = new HashMap<>();
        HashMap<String, Double> interestDistriMap = new HashMap<>();
        HashMap<String, Double> activeDistriMap = new HashMap<>();
        HashMap<String, Double> influenceDistriMap = new HashMap<>();
        HashMap<String, Double> activePostDistriMap = new HashMap<>();
        HashMap<String, Double> influenceRepliedDistriMap = new HashMap<>();

        StringBuilder sexDistriSb = new StringBuilder("[");
        StringBuilder provinceDistriSb = new StringBuilder("[");
        StringBuilder interestDistriSb = new StringBuilder("[");
        StringBuilder activeDistriSb = new StringBuilder("[");
        StringBuilder influenceDistriSb = new StringBuilder("[");
        StringBuilder activePostDistriSb = new StringBuilder("[");
        StringBuilder influenceRepliedDistriSb = new StringBuilder("[");

        for (Do_baidu_global_profile_stat baiduGlobalProfileStat : baiduGlobalProfileList) {
            totalNum += baiduGlobalProfileStat.getTotal_num();
            complainNum += baiduGlobalProfileStat.getComplain_num();
            trashNum += baiduGlobalProfileStat.getTrash_user_num();
            highPayNum += baiduGlobalProfileStat.getHigh_pay_user_num();
            highCharmNum += baiduGlobalProfileStat.getHigh_charm_user_num();
            lostNum += baiduGlobalProfileStat.getLost_user_num();

            addJsonStringBuilder(sexDistriSb, baiduGlobalProfileStat.getSex_distri());
            addJsonStringBuilder(provinceDistriSb, baiduGlobalProfileStat.getProvince_distri());
            addJsonStringBuilder(interestDistriSb, baiduGlobalProfileStat.getInterest_classifies_distri());
            addJsonStringBuilder(activeDistriSb, baiduGlobalProfileStat.getActive_class_distri());
            addJsonStringBuilder(influenceDistriSb, baiduGlobalProfileStat.getInfluence_level_distri());
            addJsonStringBuilder(activePostDistriSb, baiduGlobalProfileStat.getActive_class_post_distri());
            addJsonStringBuilder(influenceRepliedDistriSb, baiduGlobalProfileStat.getInfluence_level_replied_distri());
        }
        setJsonStrToMap(sexDistriSb.replace(sexDistriSb.length() - 1, sexDistriSb.length(), "]").toString(), sexDistriMap);
        setJsonStrToMap(provinceDistriSb.replace(provinceDistriSb.length() - 1, provinceDistriSb.length(), "]").toString(), provinceDistriMap);
        setJsonStrToMap(interestDistriSb.replace(interestDistriSb.length() - 1, interestDistriSb.length(), "]").toString(), interestDistriMap);
        setJsonStrToMap(activeDistriSb.replace(activeDistriSb.length() - 1, activeDistriSb.length(), "]").toString(), activeDistriMap);
        setJsonStrToMap(influenceDistriSb.replace(influenceDistriSb.length() - 1, influenceDistriSb.length(), "]").toString(), influenceDistriMap);
        Map<String, Integer> activePostKeyNumMap = setJsonStrToMap(activePostDistriSb.replace(activePostDistriSb.length() - 1, activePostDistriSb.length(), "]").toString(), activePostDistriMap);
        Map<String, Integer> influenceRepliedKeyNumMap = setJsonStrToMap(influenceRepliedDistriSb.replace(influenceRepliedDistriSb.length() - 1, influenceRepliedDistriSb.length(), "]").toString(), influenceRepliedDistriMap);

        resultMap.put("total_num", totalNum);
        resultMap.put("complain_num", complainNum);
        resultMap.put("trash_num", trashNum);
        resultMap.put("high_pay_num", highPayNum);
        resultMap.put("high_charm_num", highCharmNum);
        resultMap.put("lost_num", lostNum);
        resultMap.put("sex_distri", mapTrans2List(sexDistriMap, MapSortType.KEY_ASC, null));
        resultMap.put("province_distri", mapTrans2List(getPercentValueMap(provinceDistriMap), MapSortType.VALUE_DESC, null));
        for (Entry<String, Double> entry : interestDistriMap.entrySet()) {
            interestDistriMap.put(entry.getKey(), Double.parseDouble(entry.getValue().intValue() + ""));
        }
        resultMap.put("interest_distri", mapTrans2List(interestDistriMap, MapSortType.KEY_ASC, null));
        resultMap.put("active_distri", mapTrans2List(activeDistriMap, MapSortType.KEY_ASC, null));
        resultMap.put("influence_distri", mapTrans2List(influenceDistriMap, MapSortType.KEY_ASC, null));
        resultMap.put("active_post_distri", mapTrans2List(MathCaculateUtil.getAvgValueMap(activePostDistriMap, activePostKeyNumMap), MapSortType.KEY_ASC, null));
        resultMap.put("influence_post_distri", mapTrans2List(MathCaculateUtil.getAvgValueMap(influenceRepliedDistriMap, influenceRepliedKeyNumMap), MapSortType.KEY_ASC, null));
        String jsonStr = JSON.toJSONString(resultMap, SerializerFeature.DisableCircularReferenceDetect);
//        RedisUtil.insertKey(cacheKey, jsonStr, CACHE_EXPIRE_SECONDS);
        redisService.insertKey(cacheKey, jsonStr, CACHE_EXPIRE_SECONDS);
        return resultMap;
    }

    /**
     * @param baiduUSerProfileKey: project_id(必传),active_class,influence_level,interest_classify,charm_level,province,op_type,pay_ability,complain_level,post_quality,game_lifecycle
     * @return 该游戏自定义画像结果(jsonObject形式)
     * @throws Exception
     */
    public Map<String, Object> getCustomBaiduProfile(Do_baidu_user_profile_stat baiduUSerProfileKey) throws Exception {
        logger.info("profile custom key: " + baiduUSerProfileKey.toString());
        String cacheRes = null;
        try {
//            Object obj = RedisUtil.getValue(JSON.toJSONString(baiduUSerProfileKey));
            Object obj = redisService.getValue(JSON.toJSONString(baiduUSerProfileKey));
            if (null != obj) {
                cacheRes = obj.toString();
            }
        } catch (Exception e) {
            logger.error(Throwables.getStackTraceAsString(e));
        }
        if (cacheRes != null) {
            logger.info("get baidu profile result from cache!");
            return JSON.parseObject(cacheRes, new TypeReference<Map<String, Object>>() {
            }, Feature.DisableCircularReferenceDetect);
        }
        long startTime = System.currentTimeMillis();
        List<Do_baidu_user_profile_stat> baiduProfileStatList = mapper_baidu_user_profile_stat.getBaiduUserProfileList(baiduUSerProfileKey);
        long getMysqlDataTime = System.currentTimeMillis();
        logger.info("get custom profile data from mysql cost time: " + (getMysqlDataTime - startTime) + "ms");
        Map<String, Object> resultMap = new HashMap<>();
        if (baiduProfileStatList == null) {
            return resultMap;
        }
        int userNum = 0;
        double userNumRate = 0;
        HashMap<String, Double> attentionForumMap = new HashMap<>();
        HashMap<String, Double> attentionGameForumMap = new HashMap<>();
        HashMap<String, Double> interestClassifyMap = new HashMap<>();
        HashMap<String, Double> titleNumMap = new HashMap<>();
        HashMap<String, Double> contentNumMap = new HashMap<>();
        HashMap<String, Double> beRepliedNumMap = new HashMap<>();
        HashMap<String, Double> postHourMap = new HashMap<>();
        HashMap<String, Double> fansNumMap = new HashMap<>();
        HashMap<String, Double> tiebaAgeMap = new HashMap<>();
        HashMap<String, Double> sexMap = new HashMap<>();
        HashMap<String, Double> hotValueMap = new HashMap<>();
        HashMap<String, Double> provinceMap = new HashMap<>();
        StringBuilder attentionForumSb = new StringBuilder("[");
        StringBuilder attentionGameForumSb = new StringBuilder("[");
        StringBuilder interestClassifySb = new StringBuilder("[");
        StringBuilder titleNumSb = new StringBuilder("[");
        StringBuilder contentNumSb = new StringBuilder("[");
        StringBuilder beRepliedNumSb = new StringBuilder("[");
        StringBuilder postHourSb = new StringBuilder("[");
        StringBuilder fansNumSb = new StringBuilder("[");
        StringBuilder tiebaAgeSb = new StringBuilder("[");
        StringBuilder sexSb = new StringBuilder("[");
        StringBuilder hotValueSb = new StringBuilder("[");
        StringBuilder provinceSb = new StringBuilder("[");
        for (Do_baidu_user_profile_stat baiduUserProfileStat : baiduProfileStatList) {
            int tempUserNum = baiduUserProfileStat.getUser_num();
            userNum += tempUserNum;
            double tempUserRate = baiduUserProfileStat.getUser_rate();
            userNumRate += tempUserRate;
            addJsonStringBuilder(attentionForumSb, baiduUserProfileStat.getAttention_forums_distri());
            addJsonStringBuilder(attentionGameForumSb, baiduUserProfileStat.getAttention_game_forums_distri());
            addJsonStringBuilder(interestClassifySb, baiduUserProfileStat.getInterest_classifies_distri());
            addJsonStringBuilder(titleNumSb, baiduUserProfileStat.getUser_title_num_distri());
            addJsonStringBuilder(contentNumSb, baiduUserProfileStat.getUser_content_num_distri());
            addJsonStringBuilder(beRepliedNumSb, baiduUserProfileStat.getUser_be_replied_num_distri());
            addJsonStringBuilder(postHourSb, baiduUserProfileStat.getUser_post_hour_distri());
            addJsonStringBuilder(fansNumSb, baiduUserProfileStat.getFans_num_distri());
            addJsonStringBuilder(tiebaAgeSb, baiduUserProfileStat.getTieba_age_distri());
            addJsonStringBuilder(sexSb, baiduUserProfileStat.getSex_distri());
            addJsonStringBuilder(hotValueSb, baiduUserProfileStat.getHot_value_distri());
            addJsonStringBuilder(provinceSb, baiduUserProfileStat.getProvince_distri());
        }
        setJsonStrToMap(attentionForumSb.replace(attentionForumSb.length() - 1, attentionForumSb.length(), "]").toString(), attentionForumMap);
        setJsonStrToMap(attentionGameForumSb.replace(attentionGameForumSb.length() - 1, attentionGameForumSb.length(), "]").toString(), attentionGameForumMap);
        setJsonStrToMap(interestClassifySb.replace(interestClassifySb.length() - 1, interestClassifySb.length(), "]").toString(), interestClassifyMap);
        setJsonStrToMap(titleNumSb.replace(titleNumSb.length() - 1, titleNumSb.length(), "]").toString(), titleNumMap);
        setJsonStrToMap(contentNumSb.replace(contentNumSb.length() - 1, contentNumSb.length(), "]").toString(), contentNumMap);
        Map<String, Integer> beRepliedNumUserNumMap = setJsonStrToMap(beRepliedNumSb.replace(beRepliedNumSb.length() - 1, beRepliedNumSb.length(), "]").toString(), beRepliedNumMap);
        setJsonStrToMap(postHourSb.replace(postHourSb.length() - 1, postHourSb.length(), "]").toString(), postHourMap);
        setJsonStrToMap(fansNumSb.replace(fansNumSb.length() - 1, fansNumSb.length(), "]").toString(), fansNumMap);
        setJsonStrToMap(tiebaAgeSb.replace(tiebaAgeSb.length() - 1, tiebaAgeSb.length(), "]").toString(), tiebaAgeMap);
        setJsonStrToMap(sexSb.replace(sexSb.length() - 1, sexSb.length(), "]").toString(), sexMap);
        setJsonStrToMap(hotValueSb.replace(hotValueSb.length() - 1, hotValueSb.length(), "]").toString(), hotValueMap);
        setJsonStrToMap(provinceSb.replace(provinceSb.length() - 1, provinceSb.length(), "]").toString(), provinceMap);
        long setJsonMapTime = System.currentTimeMillis();
        logger.info("process profile data cost time: " + (setJsonMapTime - getMysqlDataTime) + "ms");
        for (String key : attentionForumMap.keySet()) {
            Double actualVal = attentionGameForumMap.get(key);
            if (actualVal != null) {
                attentionForumMap.put(key, actualVal);
            }
        }
        resultMap.put("total_num", userNum);
        resultMap.put("user_rate", CommonUtil.setScale(userNumRate, 4));
        resultMap.put("attention_forum_distri", mapTrans2List(sortAndCutMap(attentionForumMap, "desc", 10), MapSortType.VALUE_DESC, null));
        resultMap.put("attention_game_forum_distri", mapTrans2List(sortAndCutMap(attentionGameForumMap, "desc", 10), MapSortType.VALUE_DESC, null));
        List<Do_gas_crawler_info> projectFourmList = mapper_gas_crawler_info.getByProjectId(baiduUSerProfileKey.getProject_id());
        for (Do_gas_crawler_info crawlerInfo : projectFourmList) {
            String host = crawlerInfo.getHost();
            int status = crawlerInfo.getStatus();
            String forumName = crawlerInfo.getForum_name();
            if (host.contains("tieba.baidu.com") && (status == 1 || status == 2)) {
                attentionForumMap.remove(forumName);
                attentionGameForumMap.remove(forumName);
            }
        }
        resultMap.put("attention_forum_no_source_distri", mapTrans2List(sortAndCutMap(attentionForumMap, "desc", 10), MapSortType.VALUE_DESC, null));
        resultMap.put("attention_game_forum_no_source_distri", mapTrans2List(sortAndCutMap(attentionGameForumMap, "desc", 10), MapSortType.VALUE_DESC, null));
        for (Entry<String, Double> entry : interestClassifyMap.entrySet()) {
            interestClassifyMap.put(entry.getKey(), Double.parseDouble(entry.getValue().intValue() + ""));
        }
        resultMap.put("interest_classify_distri", mapTrans2List(interestClassifyMap, MapSortType.KEY_ASC, null));
        //TODO: 手动修改数据，后续需调整回来
        List<Map<String, Double>> titleNumDistriList = mapTrans2List(MathCaculateUtil.getAvgValueMap(titleNumMap, userNum), MapSortType.KEY_ASC, null);
        resultMap.put("title_num_distri", titleNumDistriList);
        resultMap.put("content_num_distri", mapTrans2List(MathCaculateUtil.getAvgValueMap(contentNumMap, userNum), MapSortType.KEY_ASC, null));
        //TODO: 手动修改数据，后续需调整回来
        List<Map<String, Double>> beRepliedNumDistriList = mapTrans2List(MathCaculateUtil.getAvgValueMap(beRepliedNumMap, beRepliedNumUserNumMap), MapSortType.KEY_ASC, null);
        resultMap.put("be_replied_num_distri", beRepliedNumDistriList);
        String[] postHourSortedKeys = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"};
        resultMap.put("post_hour_distri", mapTrans2List(getPercentValueMap(postHourMap), MapSortType.KEY_CUSTOM, postHourSortedKeys));
        String[] fansNumSortedKeys = {"0~5", "5~20", "20~50", "50~200", "200~500", ">500"};
        resultMap.put("fans_num_distri", mapTrans2List(fansNumMap, MapSortType.KEY_CUSTOM, fansNumSortedKeys));
        String[] tiebaAgeSortedKeys = {"0~1年", "1~3年", "3~5年", "5~8年", ">8年"};
        resultMap.put("tieba_age_distri", mapTrans2List(tiebaAgeMap, MapSortType.KEY_CUSTOM, tiebaAgeSortedKeys));
        resultMap.put("sex_distri", mapTrans2List(sexMap, MapSortType.KEY_ASC, null));
        resultMap.put("hot_value_distri", mapTrans2List(hotValueMap, MapSortType.KEY_ASC, null));
        for (String province : provinces) {
            if (!provinceMap.containsKey(province)) {
                provinceMap.put(province, Double.valueOf(0));
            }
        }
        resultMap.put("province_distri", mapTrans2List(getPercentValueMap(provinceMap), MapSortType.VALUE_DESC, null));
        String jsonStr = JSON.toJSONString(resultMap, SerializerFeature.DisableCircularReferenceDetect);
//        RedisUtil.insertKey(JSON.toJSONString(baiduUSerProfileKey), jsonStr, CACHE_EXPIRE_SECONDS);
        redisService.insertKey(JSON.toJSONString(baiduUSerProfileKey), jsonStr, CACHE_EXPIRE_SECONDS);
        long finishTime = System.currentTimeMillis();
        logger.info("combine data cost time: " + (finishTime - setJsonMapTime) + "ms");
        return resultMap;
    }

    /**
     * @param customKeyJson
     * @param from
     * @param size
     * @return JsonObject
     * @throws IOException
     */
    public JSONObject exportBaiduCustomProfileUsers(JSONObject customKeyJson, int from, int size) throws IOException {
        return exportBaiduCustomProfileUsers(customKeyJson, from, size, null);
    }

    /**
     * @param customKeyJson
     * @param from
     * @param size
     * @param searchOrderList
     * @return JsonObject
     * @throws IOException
     */
    public JSONObject exportBaiduCustomProfileUsers(JSONObject customKeyJson, int from, int size, List<ElasticSearchOrder> searchOrderList) throws IOException {
        ElasticSearchQueryUtil esUtil = ElasticSearchQueryUtil.getInstance();
        List<ElasticSearchObj> searchObjList = new ArrayList<>();
        for (Object keyObj : customKeyJson.keySet()) {
            String keyStr = keyObj.toString();
            ElasticSearchObj searchObj = new ElasticSearchObj(ESearchType.TERM, keyStr, customKeyJson.getString(keyStr));
            searchObjList.add(searchObj);
        }
        JSONObject resultObj = null;
        try {
            resultObj = esUtil.searchData(BAIDU_USER_PROFILE_TABLE, from, size, searchObjList, searchOrderList);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return resultObj;
    }

    private Map<String, Integer> setJsonStrToMap(String jsonStr, Map dataMap) throws JsonParseException, IOException {
        if (jsonStr == null || jsonStr.length() <= 2) {
            return null;
        }
        List<Map<String, Object>> jsonList = JSON.parseObject(jsonStr, new TypeReference<List<Map<String, Object>>>() {
        });
        Map<String, Integer> keyNumMap = new HashMap<>();
        for (Map<String, Object> jsonMap : jsonList) {
            for (Entry<String, Object> entry : jsonMap.entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                Object tempValue = dataMap.get(key);
                if (tempValue == null) {
                    tempValue = 0;
                }
                dataMap.put(key, Double.parseDouble(value.toString()) + Double.parseDouble(tempValue.toString()));

                Integer keyNum = keyNumMap.get(key);
                if (keyNum == null) {
                    keyNum = 0;
                }
                keyNum++;
                keyNumMap.put(key, keyNum);
            }
        }
        return keyNumMap;
    }


    private Map<String, Double> sortAndCutMap(Map<String, Double> oldMap, final String sortParam, final int topNum) {
        ArrayList<Entry<String, Double>> list = new ArrayList<Entry<String, Double>>(oldMap.entrySet());
        Collections.sort(list, new Comparator<Entry<String, Double>>() {

            @Override
            public int compare(Entry<String, Double> arg0,
                               Entry<String, Double> arg1) {
                if (sortParam.equalsIgnoreCase("asc")) {

                    return arg0.getValue().compareTo(arg1.getValue());
                } else {
                    return -arg0.getValue().compareTo(arg1.getValue());
                }

            }
        });
        Map<String, Double> newMap = new LinkedHashMap<String, Double>();
        int totalNum = Math.min(topNum, list.size());
        for (int i = 0; i < totalNum; i++) {
            newMap.put(list.get(i).getKey(), list.get(i).getValue());
        }
        return newMap;
    }

    private Map<String, Double> getPercentValueMap(Map<String, Double> dataMap) {
        int totalNum = 0;
        for (Entry<String, Double> entry : dataMap.entrySet()) {
            totalNum += entry.getValue();
        }
        return MathCaculateUtil.getAvgValueMap(dataMap, totalNum);
    }

    private List<Map<String, Double>> mapTrans2ListForObject(Map<String, Object> dataMap, final MapSortType mapSortType, String[] sortedKeys) {
        Map<String, Double> newDataMap = new HashMap<>();
        for (Entry<String, Object> entry : dataMap.entrySet()) {
            newDataMap.put(entry.getKey(), Double.parseDouble(entry.getValue().toString()));
        }
        return mapTrans2List(newDataMap, mapSortType, sortedKeys);
    }

    private List<Map<String, Double>> mapTrans2List(Map<String, Double> dataMap, final MapSortType mapSortType, String[] sortedKeys) {
        final HashMap<String, Integer> sortKeyIndexMap = new HashMap<>();
        if (sortedKeys != null) {
            for (int i = 0; i < sortedKeys.length; i++) {
                sortKeyIndexMap.put(sortedKeys[i], i);
            }
        }

        ArrayList<Entry<String, Double>> list = new ArrayList<Entry<String, Double>>(dataMap.entrySet());
        Collections.sort(list, new Comparator<Entry<String, Double>>() {

            @Override
            public int compare(Entry<String, Double> arg0,
                               Entry<String, Double> arg1) {
                if (mapSortType == MapSortType.KEY_ASC) {
                    return arg0.getKey().compareTo(arg1.getKey());
                } else if (mapSortType == MapSortType.KEY_DESC) {
                    return -arg0.getKey().compareTo(arg1.getKey());
                } else if (mapSortType == MapSortType.VALUE_ASC) {
                    return arg0.getValue().compareTo(arg1.getValue());
                } else if (mapSortType == MapSortType.VALUE_DESC) {
                    return -arg0.getValue().compareTo(arg1.getValue());
                } else if (mapSortType == MapSortType.KEY_CUSTOM) {
                    Integer idx0 = sortKeyIndexMap.get(arg0.getKey());
                    Integer idx1 = sortKeyIndexMap.get(arg1.getKey());
                    if (idx0 == null || idx1 == null) {
                        return 0;
                    }
                    return idx0.compareTo(idx1);
                } else {
                    return 0;
                }
            }
        });
        List<Map<String, Double>> resultList = new ArrayList<>();
        for (Entry<String, Double> entry : list) {
            Map<String, Double> elementMap = new HashMap<>();
            elementMap.put(entry.getKey(), entry.getValue());
            resultList.add(elementMap);
        }
        return resultList;
    }

    private void addJsonStringBuilder(StringBuilder sb, String jsonStr) {
        sb.append(jsonStr).append(",");
    }

    private enum MapSortType {KEY_ASC, KEY_DESC, VALUE_ASC, VALUE_DESC, KEY_CUSTOM}

    ;

    private List<Map<String, Double>> maunalAdjustErrorData(List<Map<String, Double>> dataList) {
        List<Map<String, Double>> resultList = new ArrayList<>();
        double valueOn711 = 0;
        double valueOn715 = 0;
        for (Map<String, Double> dataMap : dataList) {
            if (dataMap.containsKey("2016-07-11")) {
                valueOn711 = dataMap.get("2016-07-11");
            } else if (dataMap.containsKey("2016-07-15")) {
                valueOn715 = dataMap.get("2016-07-15");
            }
        }
        double avgValue = (valueOn711 + valueOn715) / 2;
        Random rand = new Random();
        int randNum = 50 - rand.nextInt(100);
        double randRate = (double) randNum / 100;
        double valueOn712 = CommonUtil.setScale(avgValue * (1 + randRate), 4);
        double valueOn713 = CommonUtil.setScale(valueOn712 * (1 + randRate), 4);
        double valueOn714 = CommonUtil.setScale(valueOn713 * (1 + randRate), 4);
        for (Map<String, Double> dataMap : dataList) {
            if (dataMap.containsKey("2016-07-12")) {
                Map<String, Double> map = new HashMap<>();
                map.put("2016-07-12", valueOn712);
                resultList.add(map);
            } else if (dataMap.containsKey("2016-07-13")) {
                Map<String, Double> map = new HashMap<>();
                map.put("2016-07-13", valueOn713);
                resultList.add(map);
            } else if (dataMap.containsKey("2016-07-14")) {
                Map<String, Double> map = new HashMap<>();
                map.put("2016-07-14", valueOn714);
                resultList.add(map);
            } else {
                resultList.add(dataMap);
            }
        }
        return resultList;
    }
}
