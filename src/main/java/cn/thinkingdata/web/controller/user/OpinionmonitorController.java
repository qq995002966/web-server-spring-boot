package cn.thinkingdata.web.controller.user;

import cn.thinkingdata.web.domain.user.center.Do_user_center;
import cn.thinkingdata.web.service.core.user.custom.OpinionmonitorService;
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
@RequestMapping(value = "/v1/service")
public class OpinionmonitorController {

    @Autowired
    private OpinionmonitorService opinionmonitorService;

    @RequestMapping(value = "/opinionmonitor",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetOpinionMonitor(@RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                        @RequestParam(value = "limit", required = false,defaultValue = "1000") Integer limit){
        return opinionmonitorService.GetOpinionMonitor(index,limit);
    }

    @RequestMapping(value = "/opinionmonitor/task",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult AddOpinionMonitorTask(@RequestParam(value = "id", required = false,defaultValue = "0") Integer id,
                                            @RequestParam(value = "email_addr", required = false,defaultValue = "") String emailAddr,
                                            @RequestParam(value = "status", required = false,defaultValue = "") Integer status,
                                            @RequestParam(value = "email_title", required = false,defaultValue = "") String emailTitle,
                                            @RequestParam(value = "keywords", required = false,defaultValue = "") String keywords,
                                            @RequestParam(value = "send_day_of_week", required = false,defaultValue = "") String sendDayOfWeek,
                                            @RequestParam(value = "send_hour_of_day", required = false,defaultValue = "") String sendHourOfDay,
                                            @RequestParam(value = "ignore_empty", required = false,defaultValue = "") Integer ignoreEmpty,
                                            @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        Do_user_center _do = new Do_user_center();
        _do.setId(id);
        _do.setProject_id(projectId);
        _do.setEmail_addr(emailAddr);
        _do.setEmail_title(emailTitle);
        _do.setStatus(status);
        _do.setKeywords(keywords);
        _do.setSend_day_of_week(sendDayOfWeek);
        _do.setSend_hour_of_day(sendHourOfDay);
        _do.setIgnore_empty(ignoreEmpty);
        return opinionmonitorService.AddOpinionMonitorTask(_do);
    }

}
