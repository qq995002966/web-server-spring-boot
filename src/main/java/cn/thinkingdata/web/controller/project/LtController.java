package cn.thinkingdata.web.controller.project;

import cn.thinkingdata.web.service.core.project.LtService;
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
@RequestMapping(value = "/v1/lt")
public class LtController {

    @Autowired
    private LtService ltService;

    @RequestMapping(value = "/insight/common",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findLtInsightCommon(@RequestParam(value = "data_date_start", required = false,defaultValue = "2000-01-01") String dataDateStart,
                                          @RequestParam(value = "data_date_end", required = false,defaultValue = "2020-01-01") String dataSateEnd,
                                          @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return ltService.findLtInsightCommon(dataDateStart,dataSateEnd,projectId);
    }

    @RequestMapping(value = "/insight/detail",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findLtInsightDetail(@RequestParam(value = "data_date_start", required = false,defaultValue = "") String dataDateStart,
                                          @RequestParam(value = "data_date_end", required = false,defaultValue = "") String dataSateEnd,
                                          @RequestParam(value = "classify_sentiment", required = false,defaultValue = "") Integer classifySentiment,
                                          @RequestParam(value = "lighttower_classify", required = false,defaultValue = "") String lighttowerClassify,
                                          @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return ltService.findLtInsightDetail(dataDateStart,dataSateEnd,classifySentiment,lighttowerClassify,projectId);
    }
}
