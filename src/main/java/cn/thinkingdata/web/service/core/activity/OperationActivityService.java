package cn.thinkingdata.web.service.core.activity;

import cn.thinkingdata.web.domain.activity.Do_activity_operation_user;
import cn.thinkingdata.web.persistence.activity.Mapper_activity_operation_user;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author Carpenter
 * @date 2017/1/4 14:00
 * @description OperationActivityService
 */
@Service
public class OperationActivityService {

    @Autowired
    private Mapper_activity_operation_user mapperActivityOperation;

    public DataResult joinActivity(Do_activity_operation_user activityOperation) {

        Optional<String> name = Optional.ofNullable(activityOperation.getUser_name());
        Optional<String> company = Optional.ofNullable(activityOperation.getUser_company());
        Optional<String> position = Optional.ofNullable(activityOperation.getUser_position());
        Optional<String> phone = Optional.ofNullable(activityOperation.getUser_phone());

        if(!name.isPresent()||name.get().trim().length() < 1){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"姓名不能为空!");
        }
        if(!company.isPresent() || name.get().trim().length()<1){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"公司不能为空!");
        }
        if(!position.isPresent() || position.get().trim().length()<1){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"职位不能为空!");
        }
        if(!phone.isPresent() || phone.get().trim().length()<1){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"手机号不能为空!");
        }

        if(!CommonUtil.isMobile(phone.get())){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"手机号不合法!");
        }

        Integer userId = mapperActivityOperation.insertActivityOperationUser(activityOperation);
        if(null == userId){
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
        }
        return new DataResult(ReturnCodeDim.SUCCESS,"");
    }
}
