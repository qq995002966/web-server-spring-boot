package cn.thinkingdata.web.controller.project;

import cn.thinkingdata.web.service.core.project.ChannelService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Xiaowu on 2016/8/9.
 */
@Controller
@RequestMapping(value = "/v1/channel")
public class ChannelController {

    @Autowired
    private ChannelService channelService;

    @RequestMapping(value = "/sentiworddistri",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findChannelSentiWordDistri(@RequestParam(value = "data_date_start", required = false,defaultValue = "") String dataDateStart,
                                          @RequestParam(value = "data_date_end", required = false,defaultValue = "") String dataDateEnd,
                                          @RequestParam(value = "data_date", required = false) String dataDate,
                                          @RequestParam(value = "senti_type", required = false) String sentiType,
                                          @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return channelService.findChannelSentiWordDistri(dataDateStart,dataDateEnd,dataDate,sentiType,projectId);
    }

    @RequestMapping(value = "/project/rating",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findChannelProjChannelRatingDistri(@RequestParam(value = "data_date_start", required = false,defaultValue = "") String dataDateStart,
                                                         @RequestParam(value = "data_date_end", required = false,defaultValue = "") String dataDateEnd,
                                                         @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return channelService.findChannelProjChannelRatingDistri(dataDateStart,dataDateEnd,projectId);
    }

    @RequestMapping(value = "/project/info",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findChannelProjChannelInfoMid(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return channelService.findChannelProjChannelInfoMid(projectId);
    }

    @RequestMapping(value = "/comments",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findChannelQueryComments(@RequestParam(value = "keywords", required = false,defaultValue = "") String keywords,
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
        if(lighttowerTags == null ){
            lighttowerTags = realTag;
        }
        return channelService.findChannelQueryComments(keywords,ratingStageList,sourceTypeList,esFieldName,esFieldVal,sentimentKeywords,queryOrTerm,lighttowerClassify,
                classifySentiment,lighttowerTags,dataDateStart,dataDateEnd,index,limit,projectId);
    }
}
