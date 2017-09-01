package cn.thinkingdata.web.controller.apply;

import cn.thinkingdata.web.domain.apply.Do_apply_operation_user;
import cn.thinkingdata.web.service.core.apply.OperationApplyService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Carpenter
 * @date 2017/3/10 17:19
 * @description OperationController
 */
@RestController
@RequestMapping(value = "/v1/operation")
public class OperationApplyController {

    @Autowired
    private OperationApplyService operationApplyService;

    @RequestMapping(value = "/apply",method = { RequestMethod.POST })
    public DataResult applyOperation(Do_apply_operation_user applyOperationUser){
        return operationApplyService.applyOperation(applyOperationUser);
    }
}
