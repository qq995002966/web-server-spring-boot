package cn.thinkingdata.web.service.core.apply;

import cn.thinkingdata.web.domain.apply.Do_apply_operation_user;
import cn.thinkingdata.web.persistence.apply.Mapper_apply_operation_user;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author Carpenter
 * @date 2017/3/10 17:21
 * @description OperationApplyService
 */
@Service
public class OperationApplyService {

    @Autowired
    private Mapper_apply_operation_user mapperApplyOperationUser;

    public DataResult applyOperation(Do_apply_operation_user applyOperationUser) {

        Optional<String> applyProduct = Optional.ofNullable(applyOperationUser.getApply_product());
        Optional<String> company = Optional.ofNullable(applyOperationUser.getUser_company());
        Optional<Integer> companyType = Optional.ofNullable(applyOperationUser.getCompany_type());
        Optional<String> name = Optional.ofNullable(applyOperationUser.getUser_name());
        Optional<String> phone = Optional.ofNullable(applyOperationUser.getUser_phone());
        Optional<String> email = Optional.ofNullable(applyOperationUser.getEmail());
        Optional<Integer> position = Optional.ofNullable(applyOperationUser.getJob_type());

        if(!applyProduct.isPresent() || applyProduct.get().trim().length()<1){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"功能不能为空!");
        }
        if(!company.isPresent() || name.get().trim().length()<1){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"公司不能为空!");
        }
        if(!companyType.isPresent() || companyType.get()<0){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"公司类型必选!");
        }
        if(!name.isPresent()||name.get().trim().length() < 1){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"联系人不能为空!");
        }
        if(!phone.isPresent() || phone.get().trim().length()<1){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"联系方式不能为空!");
        }
        if(!email.isPresent() || email.get().trim().length()<1){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"公司邮箱不能为空!");
        }
        if(!position.isPresent() || position.get()<0){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"公司职位不能为空!");
        }

        if(!CommonUtil.isMobile(phone.get())){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"联系方式不合法!");
        }
        if(!CommonUtil.isEmail(email.get())){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"公司邮箱不合法!");
        }

        Integer userId = mapperApplyOperationUser.insertAapplyOperationUser(applyOperationUser);
        if(null == userId){
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
        }
        return new DataResult(ReturnCodeDim.SUCCESS,"");
    }
}
