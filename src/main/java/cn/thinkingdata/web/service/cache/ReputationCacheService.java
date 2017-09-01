package cn.thinkingdata.web.service.cache;

import cn.thinkingdata.web.domain.appstore.Do_gas_rating_info;
import cn.thinkingdata.web.domain.project.Do_project_opinion_rank_distri;
import cn.thinkingdata.web.domain.project.channel.Do_proj_channel_rating_distri_new;
import cn.thinkingdata.web.persistence.appstore.Mapper_gas_rating_info;
import cn.thinkingdata.web.persistence.project.Mapper_project_opinion_rank_distri;
import cn.thinkingdata.web.persistence.project.channel.Mapper_proj_channel_rating_distri_new;
import cn.thinkingdata.web.persistence.project.forum.Mapper_proj_forum_attitude_distri;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.DateUtil;
import cn.thinkingdata.web.vo.project.forum.Vo_proj_forum_attitude;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * @author Carpenter
 * @date 2016/12/28 16:05
 * @description ReputationCacheService
 */
@Service
@CacheConfig(cacheNames = "reputation")
public class ReputationCacheService {

    @Autowired
    private Mapper_project_opinion_rank_distri mapperProjectOpinionRankDistri;

    @Autowired
    private Mapper_proj_channel_rating_distri_new mapperProjChannelRatingDistriNew;

    @Autowired
    private Mapper_gas_rating_info mapperGasRatingInfo;

    @Autowired
    private Mapper_proj_forum_attitude_distri mapperProjForumAttitudeDistri;

    private static final int YESTERDAY_DAY = -1;
    private static final int MONTH_DAY = -30;
    private static final double MAX_GROWTH = 1000;

    @Cacheable(value = "latest_project_opinion_date",key = "#root.method.name", condition = "#result != null")
    public String getLatestProjectOpinionRankDate(){
        return mapperProjectOpinionRankDistri.getLatestProjectOpinionRank();
    }

    @Cacheable(value = "latest_project_channel_date",key = "#root.method.name", condition = "#result != null")
    public String getLatestProjChannelRatingDistriNewDate(){
        String latestProjChannelRatingDistriNewDate = mapperProjChannelRatingDistriNew.getLatestProjChannelRatingDistriNew();
        return latestProjChannelRatingDistriNewDate;
    }

    @Cacheable(value = "latest_project_appstore_date",key = "#root.method.name", condition = "#result != null")
    public String getLatestAppstoreRankDate() {
        String latestDate = mapperGasRatingInfo.getGasRatingInfoLatestDate();
        return latestDate;
    }

    @Cacheable(value = "project_opinion_rank",key = "#root.method.name+':'+#projectId+':'+#dataDate", condition = "#result != null")
    public Do_project_opinion_rank_distri getProjectOpinionRank(String projectId,String dataDate){
        return mapperProjectOpinionRankDistri.getProjectOpinionRankByProjectIdAndDate(Integer.valueOf(projectId),dataDate);
    }

    @Cacheable(value = "proj_channel_rating_distri_new_month",key = "#root.method.name+':'+#projectId+':'+#dataDate", condition = "#result != null")
    public Map getProjChannelRatingDistriNewCycle(String projectId,String dataDate){
        return mapperProjChannelRatingDistriNew.getTotalProjChannelRatingDistriNew(Integer.valueOf(projectId),dataDate);
    }

    @Cacheable(value = "proj_channel_rating_distri_new",key = "#root.method.name+':'+#projectId+':'+#dataDate", condition = "#result != null")
    public Map getProjChannelRatingDistriNew(String projectId,String dataDate){
        return mapperProjChannelRatingDistriNew.getTotalProjChannelRatingDistriNewByDate(Integer.valueOf(projectId),dataDate);
    }

    public Map getTGRank(String projectId){
        String date = this.getLatestProjectOpinionRankDate();
        Optional dateOpt = Optional.ofNullable(date);
        Map resultMap = new HashMap();
        if (!dateOpt.isPresent()){
            resultMap.put("tg_rank", "-");
            resultMap.put("tg_rank_span", "-");
        }else {
            Do_project_opinion_rank_distri projectOpinionRankDistri = this.getProjectOpinionRank(projectId, date);

            if (null != projectOpinionRankDistri) {
                String yesterday = DateUtil.getPartitionString(DateUtil.getOffsetDate(projectOpinionRankDistri.getData_date(), YESTERDAY_DAY));
                Do_project_opinion_rank_distri projectOpinionRankDistriLast = this.getProjectOpinionRank(projectId, yesterday);
                Integer tgRank = projectOpinionRankDistri.getRank();

                resultMap.put("tg_rank", tgRank);
                if (null != projectOpinionRankDistriLast) {
                    Integer tgRankYesterday = projectOpinionRankDistriLast.getRank();
                    resultMap.put("tg_rank_span", tgRankYesterday - tgRank);
                } else {
                    resultMap.put("tg_rank_span", "-");
                }
            } else {
                resultMap.put("tg_rank", "-");
                resultMap.put("tg_rank_span", "-");
            }
        }
        return resultMap;
    }

    public Map getChannelRatingRank(String projectId,String latestDataDate){
        String lastCycleStartDataDate = DateUtil.getPartitionString(DateUtil.getOffsetDate(DateUtil.parseDateString(latestDataDate), MONTH_DAY));
        Map totalProjChannelRatingDistri = this.getProjChannelRatingDistriNewCycle(projectId, latestDataDate);
        if(null == totalProjChannelRatingDistri){
            totalProjChannelRatingDistri = new HashMap();
            totalProjChannelRatingDistri.put("channel_total",0);
            totalProjChannelRatingDistri.put("channel_positive",0);
            totalProjChannelRatingDistri.put("channel_negative",0);
            totalProjChannelRatingDistri.put("channel_total_growth",0);
            totalProjChannelRatingDistri.put("channel_positive_growth",0);
            totalProjChannelRatingDistri.put("channel_negative_growth",0);
            return totalProjChannelRatingDistri;
        }
        Map lastCycleTotalProjChannelRatingDistriLast = this.getProjChannelRatingDistriNewCycle(projectId, lastCycleStartDataDate);
        if (lastCycleTotalProjChannelRatingDistriLast == null) {
            lastCycleTotalProjChannelRatingDistriLast = totalProjChannelRatingDistri;
        }
        Float projChannelTotalGrowth = CommonUtil.calculateRate((Double.valueOf(totalProjChannelRatingDistri.get("channel_total").toString()) - Double.valueOf(lastCycleTotalProjChannelRatingDistriLast.get("channel_total").toString())) , (Double.valueOf(lastCycleTotalProjChannelRatingDistriLast.get("channel_total").toString())));
        if (projChannelTotalGrowth > MAX_GROWTH) {
            projChannelTotalGrowth = 0.0f;
        }
        totalProjChannelRatingDistri.put("channel_total_growth", projChannelTotalGrowth);
        Float projChannelPositiveGrowth = CommonUtil.calculateRate((Double.valueOf(totalProjChannelRatingDistri.get("channel_positive").toString()) - Double.valueOf(lastCycleTotalProjChannelRatingDistriLast.get("channel_positive").toString())) , (Double.valueOf(lastCycleTotalProjChannelRatingDistriLast.get("channel_positive").toString())));
        if (projChannelPositiveGrowth > MAX_GROWTH) {
            projChannelPositiveGrowth = 0.0f;
        }
        totalProjChannelRatingDistri.put("channel_positive_growth", projChannelPositiveGrowth);
        Float projChannelNegativeGrowth = CommonUtil.calculateRate((Double.valueOf(totalProjChannelRatingDistri.get("channel_negative").toString()) - Double.valueOf(lastCycleTotalProjChannelRatingDistriLast.get("channel_negative").toString())) ,(Double.valueOf(lastCycleTotalProjChannelRatingDistriLast.get("channel_negative").toString())));
        if (projChannelNegativeGrowth > MAX_GROWTH) {
            projChannelNegativeGrowth = 0.0f;
        }
        totalProjChannelRatingDistri.put("channel_negative_growth", projChannelNegativeGrowth);
        return totalProjChannelRatingDistri;
    }

    @Cacheable(value = "appstore_rating_info" ,key = "#root.method.name+':'+#lastDay+':'+#app_id+':'+#appType+':'+#deviceType+':'+#listType", condition = "#result != null")
    public Do_gas_rating_info getGasRatingInfoByDateAndAppId(String lastDay, String app_id,String appType,String deviceType,String listType) {
        return mapperGasRatingInfo.getGasRatingInfoByKeywordByDateAndAppId(lastDay, app_id,Integer.valueOf(appType),Integer.valueOf(deviceType),Integer.valueOf(listType));
    }

    @Cacheable(value = "latest_project_forum_date",key = "#root.method.name", condition = "#result != null")
    public String getProjForumAttitudeLatestDate() {
        String latestDate = mapperProjForumAttitudeDistri.getProjForumAttitudeLatestDate();
        return latestDate;
    }

    @Cacheable(value = "project_forum_attitude" ,key = "#root.method.name+':'+#projectId+':'+#dataDate", condition = "#result != null")
    public Map getProjForumAttitude(String projectId,String dataDate){
        String oldDate = DateUtil.getPartitionString(DateUtil.getOffsetDate(DateUtil.parseDateString(dataDate),YESTERDAY_DAY));
        Vo_proj_forum_attitude latestProjForumAttitude = mapperProjForumAttitudeDistri.getDetailDistributeByDate(Integer.valueOf(projectId),dataDate);
        Vo_proj_forum_attitude oldProjForumAttitude = mapperProjForumAttitudeDistri.getDetailDistributeByDate(Integer.valueOf(projectId),oldDate);
        Float latestTotal = 0.0f;
        Float latestNegative = 0.0f;
        Float latestPositive = 0.0f;
        Float oldTotal = 0.0f;
        Float oldNegative = 0.0f;
        Float oldPositive = 0.0f;
        if(null != latestProjForumAttitude){
            latestTotal = (float)latestProjForumAttitude.getTotal();
            latestNegative = (float)latestProjForumAttitude.getNegative();
            latestPositive = (float)latestProjForumAttitude.getPositive();
        }
        if(null != oldProjForumAttitude){
            oldTotal = (float)oldProjForumAttitude.getTotal();
            oldNegative = (float)oldProjForumAttitude.getNegative();
            oldPositive = (float)oldProjForumAttitude.getPositive();
        }
        Map<String, Object> projectOpinion = new HashMap<>();
        projectOpinion.put("project_id",projectId);
        projectOpinion.put("total", latestTotal);
        projectOpinion.put("negative", latestNegative);
        projectOpinion.put("positive",latestPositive);
        projectOpinion.put("total_old", oldTotal);
        projectOpinion.put("total_rate", CommonUtil.calculateRate(latestTotal - oldTotal,  latestTotal));
        projectOpinion.put("negative_old", oldNegative);
        projectOpinion.put("negative_rate", CommonUtil.calculateRate(latestNegative - oldNegative, latestNegative));
        projectOpinion.put("positive_old", oldPositive);
        projectOpinion.put("positive_rate", CommonUtil.calculateRate(latestPositive - oldPositive, latestPositive));
        return projectOpinion;
    }

//    @Cacheable(value = "project_forum_attitude_num" ,key = "#root.method.name+':'+#infoId+':'+#dataDateStart+':'+#dataDateEnd")
//    public Vo_proj_forum_attitude getProjForumAttitudeByInfoId(String infoId,String dataDateStart,String dataDateEnd){
//        Vo_proj_forum_attitude latestProjForumAttitude = mapperProjForumAttitudeDistri.getDetailDistributeByInfoIdAndDate(Integer.valueOf(infoId),dataDateStart,dataDateEnd);
//        return latestProjForumAttitude;
//    }

    @Cacheable(value = "project_forum_attitude_num" ,key = "#root.method.name+':'+#projectId+':'+#dataDateStart+':'+#dataDateEnd", condition = "#result != null")
    public Map getProjForumAttitudeByProjectId(String projectId, String dataDateStart, String dataDateEnd) {
        List<Vo_proj_forum_attitude> projForumAttitudeList = mapperProjForumAttitudeDistri.getDetailDistributeByProjectIdAndDate(Integer.valueOf(projectId),dataDateStart,dataDateEnd);
        Map projForumAttitudeMap = new HashMap();
        for(Vo_proj_forum_attitude projForumAttitude:projForumAttitudeList){
            projForumAttitudeMap.put(projForumAttitude.getInfo_id(),projForumAttitude);
        }
        return projForumAttitudeMap;
    }
}
