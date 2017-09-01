package cn.thinkingdata.web.controller.user;

import cn.thinkingdata.web.domain.sigma.Do_sigma_lt_warn_config;
import cn.thinkingdata.web.service.core.user.custom.ItwarnService;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.WebUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * Created by Xiaowu on 2016/8/23.
 */
@RestController
@RequestMapping(value = "/v1/service")
public class ItwarnController {

    @Autowired
    private ItwarnService itwarnService;

    @RequestMapping(value = "/sigma/itwarn/config",method = { RequestMethod.GET })
    public DataResult GetSigmaItWarnConfig(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId,
                                           @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                           @RequestParam(value = "limit", required = false,defaultValue = "20") Integer limit){
        return itwarnService.GetSigmaItWarnConfig(projectId,index,limit);
    }

    @RequestMapping(value = "/sigma/itwarn/config",method = { RequestMethod.POST })
    public DataResult deleteSigmaItWarnConfig(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return itwarnService.deleteSigmaItWarnConfig(projectId);
    }

    @RequestMapping(value = "/sigma/itwarn/mail",method = { RequestMethod.POST })
    public DataResult SetSigmaItWarnMail(@RequestParam(value = "email_addr", required = false) String emailAddr,
                                         @RequestParam(value = "status", required = false) Integer status,
                                         @RequestParam(value = "lt_warn_class", required = false) String ltWarnClass,
                                         @RequestParam(value = "warn_level", required = false) Integer warnLevel,
                                         @RequestParam(value = "task_name", required = false) String taskName,
                                         @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        Do_sigma_lt_warn_config sigmaLtWarnConfig = new Do_sigma_lt_warn_config();
        sigmaLtWarnConfig.setProject_id(projectId);
        sigmaLtWarnConfig.setUser_id(WebUtil.getCurrentUser().getUser_id());
        sigmaLtWarnConfig.setTask_name(taskName);
        sigmaLtWarnConfig.setEmail_addr(emailAddr);
        sigmaLtWarnConfig.setStatus(status);
        sigmaLtWarnConfig.setLt_warn_class(ltWarnClass);
        sigmaLtWarnConfig.setWarn_level(warnLevel);
        return itwarnService.SetSigmaItWarnMail(sigmaLtWarnConfig);
    }

    @RequestMapping(value = "/sigma/itwarn/details",method = { RequestMethod.GET })
    public DataResult GetSigmaItWarnDetails(@RequestParam(value = "sub_type", required = false) String sub_type,
                                            @RequestParam(value = "data_date", required = false) String data_date,
                                            @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId,
                                            @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                            @RequestParam(value = "limit", required = false,defaultValue = "1000") Integer limit){
        return itwarnService.GetSigmaItWarnDetails(sub_type,data_date,index,limit,projectId);
    }

    @RequestMapping(value = "/sigma/itwarn",method = { RequestMethod.GET })
    public DataResult GetSigmaItWarn(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return itwarnService.GetSigmaItWarn(projectId);
    }
}
