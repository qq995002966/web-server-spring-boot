package cn.thinkingdata.web.controller.project;

import cn.thinkingdata.web.service.core.project.ForumService;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.WebUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by Xiaowu on 2016/8/9.
 */
@Controller
@RequestMapping(value = "/v1/forum")
public class ForumController {

    @Autowired
    private ForumService forumService;

    @RequestMapping(value = "/termsdate/histogramagg",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findForumTermsDateHistogramAgg(@RequestParam(value = "data_date_start", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                                     @RequestParam(value = "data_date_end", required = false,defaultValue = "2020-01-01") String dataDateEnd,
                                                     @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return forumService.findForumTermsDateHistogramAgg(dataDateStart,dataDateEnd,projectId);
    }

    @RequestMapping(value = "/commondata",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findForumCommonData(@RequestParam(value = "data_date_start", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                          @RequestParam(value = "data_date_end", required = false,defaultValue = "2020-01-01") String dataDateEnd,
                                          @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return forumService.findForumCommonData(dataDateStart,dataDateEnd,projectId);
    }

    @RequestMapping(value = "/postnum",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findForumPostNumDistribute(@RequestParam(value = "data_date_start", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                                 @RequestParam(value = "data_date_end", required = false,defaultValue = "2020-01-01") String dataSateEnd,
                                                 @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return forumService.findForumPostNumDistribute(dataDateStart,dataSateEnd,projectId);
    }

    @RequestMapping(value = "/distribute/attitudesgroup",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findForumAttitudesGroupDistribute(@RequestParam(value = "data_date_start", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                                        @RequestParam(value = "data_date_end", required = false,defaultValue = "2020-01-01") String dataSateEnd,
                                                        @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return forumService.findForumAttitudesGroupDistribute(dataDateStart,dataSateEnd,projectId);
    }

    @RequestMapping(value = "/distribute/uselessclassify",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findForumUselessClassifyDistribute(@RequestParam(value = "data_date_start", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                                         @RequestParam(value = "data_date_end", required = false,defaultValue = "2020-01-01") String dataSateEnd,
                                                         @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return forumService.findForumUselessClassifyDistribute(dataDateStart,dataSateEnd,projectId);
    }

    @RequestMapping(value = "/distribute/keywords",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findForumKeywordsDistribute(@RequestParam(value = "data_date_start", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                                  @RequestParam(value = "data_date_end", required = false,defaultValue = "2020-01-01") String dataSateEnd,
                                                  @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return forumService.findForumKeywordsDistribute(dataDateStart,dataSateEnd,projectId);
    }

    @RequestMapping(value = "/distribute/topic",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findForumTopicDistribute(@RequestParam(value = "data_date_start", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                               @RequestParam(value = "data_date_end", required = false,defaultValue = "2020-01-01") String dataSateEnd,
                                               @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return forumService.findForumTopicDistribute(dataDateStart,dataSateEnd,projectId);
    }

    @RequestMapping(value = "/title",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findForumQueryPosts(@RequestParam(value = "keywords", required = false,defaultValue = "") String keywords,
                                          @RequestParam(value = "data_date_start", required = false,defaultValue = "2000-01-01") String data_date_start,
                                          @RequestParam(value = "data_date_end", required = false,defaultValue = "2020-01-01") String data_date_end,
                                          @RequestParam(value = "info_id_list", required = false,defaultValue = "") String info_id_list,
                                          @RequestParam(value = "order_by_field", required = false) String order_by_field,
                                          @RequestParam(value = "order_type", required = false) String order_type,
                                          @RequestParam(value = "topic_id", required = false) String topic_id,
                                          @RequestParam(value = "sentiment_score", required = false) String sentiment_score,
                                          @RequestParam(value = "lighttower_classify", required = false) String lighttower_classify,
                                          @RequestParam(value = "classify_sentiment", required = false) String classify_sentiment,
                                          @RequestParam(value = "useless_classify", required = false) String useless_classify,
                                          @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                          @RequestParam(value = "limit", required = false,defaultValue = "10") Integer limit,
                                          @RequestParam(value = "query_or_term", required = false,defaultValue = "query") String query_or_term,
                                          @RequestParam(value = "lighttower_tags", required = false,defaultValue = "") String lighttower_tags,
                                          @RequestParam(value = "real_tag", required = false) String real_tag,
                                          @RequestParam(value = "only_query_title", required = false,defaultValue = "0") Integer only_query_title,
                                          @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return forumService.findForumQueryPosts(keywords,data_date_start,data_date_end,info_id_list,order_by_field,order_type,topic_id,sentiment_score,lighttower_classify,classify_sentiment,useless_classify,index,limit,query_or_term,
                lighttower_tags,real_tag,only_query_title,projectId);
    }

    @RequestMapping(value = "/reply",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findForumQueryReplyPosts(@RequestParam(value = "info_id", required = false) String infoId,
                                               @RequestParam(value = "title_id", required = false) String titleId,
                                               @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                               @RequestParam(value = "limit", required = false,defaultValue = "10") Integer limit,
                                               @RequestParam(value = "project_id", required = false,defaultValue = "0") String projectId){
        return forumService.findForumQueryReplyPosts(infoId,titleId,index,limit,projectId);
    }
}
