package cn.thinkingdata.web.controller.activity;

import cn.thinkingdata.web.domain.activity.Do_activity_operation_user;
import cn.thinkingdata.web.service.core.activity.OperationActivityService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Carpenter
 * @date 2017/1/4 13:56
 * @description OperationActivityController
 */
@RestController
@RequestMapping(value = "/v1/activity/operation")
public class OperationActivityController {

    @Autowired
    private OperationActivityService operationActivityService;

    @RequestMapping(value = "/join",method = { RequestMethod.POST })
    public DataResult joinActivity(Do_activity_operation_user activityOperation){
        return operationActivityService.joinActivity(activityOperation);
    }
}
