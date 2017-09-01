package cn.thinkingdata.web.controller.industry;

import cn.thinkingdata.web.service.core.industry.IndustryService;
import cn.thinkingdata.web.service.rest.IndustryRestService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Created by Xiaowu on 2016/8/8.
 */
@RestController
@RequestMapping(value = "/v1/industry")
public class IndustryController {

    @Autowired
    private IndustryService industryService;

    @Autowired
    private IndustryRestService industryRestService;

    @RequestMapping(value = "/trends",method = { RequestMethod.GET })
    public DataResult findGeneralTrends(@RequestParam(value = "scope", required = false,defaultValue = "realtime") String scope){
        return industryService.findGeneralTrends(scope);
    }

    @RequestMapping(value = "/gametype",method = { RequestMethod.GET })
    public DataResult findGameTypeDistri(){
        return industryService.findGameTypeDistri();
    }

    @RequestMapping(value = "/userprovince",method = { RequestMethod.GET })
    public DataResult findUserProvinceDistri(){
        return industryService.findUserProvinceDistri();
    }

    @RequestMapping(value = "/typenum",method = { RequestMethod.GET })
    public DataResult findTypeNumDistri(){
        return industryService.findTypeNumDistri();
    }

    @RequestMapping(value = "/complain",method = { RequestMethod.GET })
    public DataResult findComplainDistri(@RequestParam(value = "scope", required = false,defaultValue = "all") String scope,
                                         @RequestParam(value = "platform", required = false,defaultValue = "") String platform,
                                         @RequestParam(value = "detail_type", required = false,defaultValue = "") String detailType){
        return industryService.findComplainDistri(scope,platform,detailType);
    }

    @RequestMapping(value = "/complain/detail",method = { RequestMethod.GET })
    public DataResult findComplainDistriDetail(@RequestParam(value = "platform", required = false,defaultValue = "") String platform,
                                               @RequestParam(value = "detail_type", required = false,defaultValue = "") String detailType){
        return industryRestService.findComplainDistriDetail(platform,detailType);
    }

    @RequestMapping(value = "/appstoretype",method = { RequestMethod.GET })
    public DataResult findAppstoreType(@RequestParam(value = "data_date", required = false,defaultValue = "") String dataDate,
                                         @RequestParam(value = "device_type", required = false,defaultValue = "") Integer deviceType,
                                         @RequestParam(value = "list_type", required = false,defaultValue = "") Integer listType){
        return industryService.findAppstoreType(dataDate,deviceType,listType);
    }

    @RequestMapping(value = "/appstore/typerank",method = { RequestMethod.GET })
    public DataResult findIndustryAppstoreTypeRank(@RequestParam(value = "data_date", required = false) String dataDate,
                                       @RequestParam(value = "device_type", required = false) Integer deviceType,
                                       @RequestParam(value = "list_type", required = false) Integer listType,
                                       @RequestParam(value = "app_type", required = false) Integer appType,
                                       @RequestParam(value = "index", required = false) Integer index,
                                       @RequestParam(value = "limit", required = false) Integer limit){
        return industryService.findIndustryAppstoreTypeRank(dataDate,deviceType,listType,appType,index,limit);
    }

    @RequestMapping(value = "/article/distri",method = { RequestMethod.GET })
    public DataResult findArticleDistri(){
        return industryService.findArticleDistri();
    }

    @RequestMapping(value = "/article/topic",method = { RequestMethod.GET })
    public DataResult findArticleTopic(@RequestParam(value = "data_date_start", required = false,defaultValue = "") String startDate,
                                       @RequestParam(value = "data_date_end", required = false,defaultValue = "") String endDate){
        return industryService.findArticleTopic(startDate,endDate);
    }

    @RequestMapping(value = "/article/hotwords",method = { RequestMethod.GET })
    public DataResult findArticleHotWords(){
        return industryService.findArticleHotWords();
    }

    @RequestMapping(value = "/article/gamerank",method = { RequestMethod.GET })
    public DataResult findGameRank(@RequestParam(value = "platform", required = false,defaultValue = "") String platform){
        return industryService.findGameRank(platform);
    }
}
