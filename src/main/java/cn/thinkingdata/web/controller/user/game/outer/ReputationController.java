package cn.thinkingdata.web.controller.user.game.outer;

import cn.thinkingdata.web.service.core.user.custom.outer.ReputationService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Carpenter
 * @date 2016/12/19 10:01
 * @description ReputationController
 */
@RestController
@RequestMapping(value = "/v1/service/outer/reputation")
public class ReputationController {

    @Autowired
    private ReputationService reputationService;

    /**
     *  口碑分析-游戏简介
     * @param projectId
     * @return
     */
    @RequestMapping(value = "/introduce",method = { RequestMethod.GET })
    public DataResult ReputationIntroduce(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return reputationService.getReputationIntroduce(projectId);
    }

    /**
     *
     * @param projectId
     * @return
     */
    @RequestMapping(value = "/introduce/appstore",method = { RequestMethod.GET })
    public DataResult ReputationIntroduceOpinionAppstore(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return reputationService.getReputationIntroduceOpinionAppstore(projectId);
    }

    /**
     *  口碑分析-游戏简介-玩家情感概览
     * @param projectId
     * @param appType
     * @param listType
     * @param deviceType
     * @param startDate
     * @param endDate
     * @return
     */
    @RequestMapping(value = "/introduce/opinion",method = { RequestMethod.GET })
    public DataResult ReputationIntroduceOpinion(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId,
                                                 @RequestParam(value = "app_type", required = false,defaultValue = "") Integer appType,
                                                 @RequestParam(value = "list_type", required = false,defaultValue = "") Integer listType,
                                                 @RequestParam(value = "device_type", required = false,defaultValue = "") Integer deviceType,
                                                 @RequestParam(value = "start_date", required = false) String startDate,
                                                 @RequestParam(value = "end_date", required = false) String endDate){
        return reputationService.getReputationIntroduceOpinion(projectId,startDate,endDate,appType,listType,deviceType);
    }

    /**
     * 口碑分析-游戏简介-榜单排名
     * @param projectId
     * @param startDate
     * @param endDate
     * @return
     */
    @RequestMapping(value = "/introduce/feedback",method = { RequestMethod.GET })
    public DataResult ReputationIntroduceFeedback(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId,
                                                  @RequestParam(value = "start_date", required = false) String startDate,
                                                  @RequestParam(value = "end_date", required = false) String endDate){
        return reputationService.getReputationIntroduceFeedback(projectId,startDate,endDate);
    }

    /**
     * 舆情解读-玩家反馈分析
     * @param dataDateStart
     * @param dataDateEnd
     * @param projectId
     * @return
     */
    @RequestMapping(value = "/feedback/analyse",method = { RequestMethod.GET })
    public DataResult ReputationFeedbackAnalyse(@RequestParam(value = "start_date", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                                @RequestParam(value = "end_date", required = false,defaultValue = "2020-01-01") String dataDateEnd,
                                                @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return reputationService.getReputationFeedbackAnalyse(dataDateStart,dataDateEnd,projectId);
    }

    /**
     * 舆情解读-玩家反馈分析
     * @param dataDateStart
     * @param dataDateEnd
     * @param classifySentiment
     * @param lighttowerClassify
     * @param projectId
     * @return
     */
    @RequestMapping(value = "/feedback/analyse/detail",method = { RequestMethod.GET })
    public DataResult ReputationFeedbackAnalyseDetail(@RequestParam(value = "start_date", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                          @RequestParam(value = "end_date", required = false,defaultValue = "2020-01-01") String dataDateEnd,
                                          @RequestParam(value = "classify_sentiment", required = false) Integer classifySentiment,
                                          @RequestParam(value = "lighttower_classify", required = false) String lighttowerClassify,
                                          @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return reputationService.getReputationFeedbackAnalyseDetail(dataDateStart,dataDateEnd,classifySentiment,lighttowerClassify,projectId);
    }

    /**
     * 舆情解读-热词排行榜
     * @param dataDateStart
     * @param dataDateEnd
     * @param projectId
     * @return
     */
    @RequestMapping(value = "/feedback/hotwords",method = { RequestMethod.GET })
    public DataResult ReputationFeedbackHotwords(@RequestParam(value = "start_date", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                                  @RequestParam(value = "end_date", required = false,defaultValue = "2020-01-01") String dataDateEnd,
                                                  @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return reputationService.getReputationFeedbackHotwords(dataDateStart,dataDateEnd,projectId);
    }

    /**
     * 舆情解读-热词排行榜-关键词
     * @param dataDateStart
     * @param dataDateEnd
     * @param keyword
     * @param projectId
     * @return
     */
    @RequestMapping(value = "/feedback/keywords",method = { RequestMethod.GET })
    public DataResult ReputationFeedbackKeywords(@RequestParam(value = "start_date", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                                 @RequestParam(value = "end_date", required = false,defaultValue = "2020-01-01") String dataDateEnd,
                                                 @RequestParam(value = "keyword", required = false) String keyword,
                                                 @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return reputationService.getReputationFeedbackKeywords(dataDateStart,dataDateEnd,projectId,keyword);
    }

    /**
     *  舆情解读-玩家话题排行榜
     * @param dataDateStart
     * @param dataDateEnd
     * @param projectId
     * @return
     */
    @RequestMapping(value = "/feedback/rank",method = { RequestMethod.GET })
    public DataResult ReputationFeedbackRank(@RequestParam(value = "start_date", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                             @RequestParam(value = "end_date", required = false,defaultValue = "2020-01-01") String dataDateEnd,
                                             @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId,
                                             @RequestParam(value = "index", required = false) Integer index,
                                             @RequestParam(value = "limit", required = false) Integer limit){
        return reputationService.getReputationFeedbackRank(dataDateStart,dataDateEnd,projectId,index,limit);
    }

    /**
     * Appstore排行榜最新日期
     * @return
     */
    @RequestMapping(value = "/appstore/date",method = { RequestMethod.GET })
    public DataResult ReputationAppstoreRankDate(){
        return reputationService.getReputationAppstoreRankDate();
    }

    /**
     * Appstore排行榜
     * @param dataDate
     * @param deviceType
     * @param listType
     * @param appType
     * @param index
     * @param limit
     * @return
     */
    @RequestMapping(value = "/appstore/rank",method = { RequestMethod.GET })
    public DataResult ReputationAppstoreRank(@RequestParam(value = "data_date", required = false) String dataDate,
                                             @RequestParam(value = "device_type", required = false) Integer deviceType,
                                             @RequestParam(value = "list_type", required = false) Integer listType,
                                             @RequestParam(value = "app_type", required = false) Integer appType,
                                             @RequestParam(value = "index", required = false) Integer index,
                                             @RequestParam(value = "limit", required = false) Integer limit){
        return reputationService.getReputationAppstoreRank(dataDate,deviceType,listType,appType,index,limit);
    }

    /**
     * 舆情排行榜
     * @param platform
     * @return
     */
    @RequestMapping(value = "/opinion/rank",method = { RequestMethod.GET })
    public DataResult ReputatinOpinionRank(@RequestParam(value = "platform", required = false,defaultValue = "全部") String platform,
                                           @RequestParam(value = "detail_type", required = false) String detailType,
                                           @RequestParam(value = "index", required = false) Integer index,
                                           @RequestParam(value = "limit", required = false) Integer limit){
        return reputationService.getReputatinOpinionRank(platform,detailType,index,limit);
    }


    //渠道分析-渠道评分统计
    @RequestMapping(value = "/channel/count",method = { RequestMethod.GET })
    public DataResult ReputationChannelCount(@RequestParam(value = "start_date", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                             @RequestParam(value = "end_date", required = false,defaultValue = "2020-01-01") String dataDateEnd,
                                             @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return reputationService.getReputationChannelCount(dataDateStart,dataDateEnd,projectId);
    }

    //渠道分析-渠道评论情感分析
    @RequestMapping(value = "/channel/analyse",method = { RequestMethod.GET })
    public DataResult ReputationChannelAnalyse(@RequestParam(value = "start_date", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                               @RequestParam(value = "end_date", required = false,defaultValue = "2020-01-01") String dataDateEnd,
                                               @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return reputationService.getReputationChannelAnalyse(dataDateStart,dataDateEnd,projectId);
    }

    //论坛分析-论坛帖子总量
    @RequestMapping(value = "/forum/analyse",method = { RequestMethod.GET })
    public DataResult ReputationForumAnalyse(@RequestParam(value = "start_date", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                               @RequestParam(value = "end_date", required = false,defaultValue = "2020-01-01") String dataDateEnd,
                                               @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return reputationService.getReputationForumAnalyse(dataDateStart,dataDateEnd,projectId);
    }

    //论坛分析-情感走势
    @RequestMapping(value = "/forum/analyse/rate",method = { RequestMethod.GET })
    public DataResult ReputationForumAnalyseRate(@RequestParam(value = "start_date", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                             @RequestParam(value = "end_date", required = false,defaultValue = "2020-01-01") String dataDateEnd,
                                             @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return reputationService.getReputationForumAnalyseRate(dataDateStart,dataDateEnd,projectId);
    }

    //论坛分析-论坛帖子质量分析
    @RequestMapping(value = "/forum/quality/analyse",method = { RequestMethod.GET })
    public DataResult ReputationForumAualityAnalyse(@RequestParam(value = "start_date", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                                 @RequestParam(value = "end_date", required = false,defaultValue = "2020-01-01") String dataDateEnd,
                                                 @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return reputationService.getReputationForumAualityAnalyse(dataDateStart,dataDateEnd,projectId);
    }

    //论坛贴搜索-搜索主题
    @RequestMapping(value = "/forum/search/classify",method = { RequestMethod.GET })
    public DataResult ReputationForumClassify(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return reputationService.getReputationForumClassify(projectId);
    }

    //论坛贴搜索-帖子回复
    @RequestMapping(value = "/forum/search/reply",method = { RequestMethod.GET })
    public DataResult ReputationForumClassify(@RequestParam(value = "info_id", required = false) String infoId,
                                              @RequestParam(value = "title_id", required = false) String titleId,
                                              @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                              @RequestParam(value = "limit", required = false,defaultValue = "10") Integer limit,
                                              @RequestParam(value = "project_id", required = false,defaultValue = "0") String projectId){
        return reputationService.getReputationForumReply(infoId,titleId,index,limit,projectId);
    }

    //全网评论-全网评论
    @RequestMapping(value = "/forum/search",method = { RequestMethod.GET })
    public DataResult ReputationForumSearch(@RequestParam(value = "keywords", required = false,defaultValue = "") String keywords,
                                            @RequestParam(value = "rating_stage_list", required = false,defaultValue = "") String ratingStageList,
                                            @RequestParam(value = "source_type_list", required = false,defaultValue = "") String sourceTypeList,
                                            @RequestParam(value = "es_field_name", required = false,defaultValue = "") String esFieldName,
                                            @RequestParam(value = "es_field_val", required = false,defaultValue = "") String esFieldVal,
                                            @RequestParam(value = "sentiment_keywords", required = false,defaultValue = "") String sentimentKeywords,
                                            @RequestParam(value = "query_or_term", required = false,defaultValue = "query") String queryOrTerm,
                                            @RequestParam(value = "lighttower_classify", required = false,defaultValue = "") String lighttowerClassify,
                                            @RequestParam(value = "classify_sentiment", required = false,defaultValue = "") String classifySentiment,
                                            @RequestParam(value = "lighttower_tags", required = false) String lighttowerTags,
                                            @RequestParam(value = "real_tag", required = false,defaultValue = "") String realTag,
                                            @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                            @RequestParam(value = "limit", required = false,defaultValue = "10") Integer limit,
                                            @RequestParam(value = "data_date_start", required = false,defaultValue = "2000-01-01 00:00:00") String dataDateStart,
                                            @RequestParam(value = "data_date_end", required = false,defaultValue = "2050-01-01 23:59:59") String dataDateEnd,
                                            @RequestParam(value = "project_id", required = false,defaultValue = "0") String projectId){
        return reputationService.getReputationForumSearch(keywords,ratingStageList,sourceTypeList,esFieldName,esFieldVal,sentimentKeywords,queryOrTerm,lighttowerClassify,
                classifySentiment,lighttowerTags,dataDateStart,dataDateEnd,index,limit,projectId);
    }

    //论坛贴搜索-帖子回复
    @RequestMapping(value = "/search",method = { RequestMethod.GET })
    public DataResult ReputationSearch(@RequestParam(value = "keyword", required = false) String keyword,
                                      @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                      @RequestParam(value = "limit", required = false,defaultValue = "10") Integer limit){
        return reputationService.getReputationSearch(keyword,index,limit);
    }

    /**
     * 舆情中心
     * @return
     */
    @RequestMapping(value = "/collection",method = {RequestMethod.GET})
    public DataResult getUserCollectionProject(@RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                               @RequestParam(value = "limit", required = false,defaultValue = "5") Integer limit){
        return reputationService.getUserCollectionProject(index,limit);
    }

    /**
     * 舆情中心--热门游戏
     * @return
     */
    @RequestMapping(value = "/recommend",method = {RequestMethod.GET})
    public DataResult getRecommendProject(@RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                    @RequestParam(value = "limit", required = false,defaultValue = "8") Integer limit){
        return reputationService.getRecommendProject(index,limit);
    }

    /**
     * 舆情中心--热门游戏
     * @return
     */
    @RequestMapping(value = "/hot",method = {RequestMethod.GET})
    public DataResult getHotProject(@RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                    @RequestParam(value = "limit", required = false,defaultValue = "5") Integer limit){
        return reputationService.getHotProject(index,limit);
    }
    /**
     * 舆情中心--近期浏览
     * @return
     */
    @RequestMapping(value = "/histroy",method = { RequestMethod.GET })
    public DataResult findUserProjectViewHistroy(){
        return reputationService.findUserProjectViewHistroy();
    }
}
