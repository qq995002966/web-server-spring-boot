package cn.thinkingdata.web.controller.user;

import cn.thinkingdata.web.service.core.user.custom.OutflowService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Xiaowu on 2016/8/23.
 */
@Controller
@RequestMapping(value = "/v1/service/outflow")
public class OutflowController {

    @Autowired
    private OutflowService outflowService;

    @RequestMapping(value = "/date",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetOutflowDate(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return outflowService.GetOutflowDate(projectId);
    }

    @RequestMapping(value = "/sumtype",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetOutflowSumType(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId,
                                        @RequestParam(value = "data_date", required = false) String data_date){
        return outflowService.GetOutflowSumType(projectId,data_date);
    }

    @RequestMapping(value = "/sumreason",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetOutflowSumReason(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId,
                                          @RequestParam(value = "sum_type", required = false) String sum_type,
                                          @RequestParam(value = "data_date", required = false) String data_date){
        return outflowService.GetOutflowSumReason(projectId,sum_type,data_date);
    }

    @RequestMapping(value = "/radar/data",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetOutflowRadarData(@RequestParam(value = "start_date", required = false,defaultValue = "") String startDate,
                                          @RequestParam(value = "end_date", required = false,defaultValue = "") String endDate,
                                          @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return outflowService.GetOutflowRadarData(startDate,endDate,projectId);
    }
}
