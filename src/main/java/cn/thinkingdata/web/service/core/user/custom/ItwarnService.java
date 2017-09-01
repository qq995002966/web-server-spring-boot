package cn.thinkingdata.web.service.core.user.custom;

import cn.thinkingdata.web.domain.sigma.Do_sigma_lt_warn_config;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.persistence.sigma.Mapper_sigma_lt_warn_config;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.DateUtil;
import cn.thinkingdata.web.util.ReturnCodeDim;
import cn.thinkingdata.web.util.WebUtil;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Created by Xiaowu on 2016/8/23.
 */
@Service
public class ItwarnService {

    @Autowired
    private SigmaItWarnService sigmaItWarnService;

    @Autowired
    private Mapper_sigma_lt_warn_config mapper_sigma_lt_warn_config;

    private static final int SERVICE_TYPE_ITWARN = 5;
    private static final int DEMO_PROJECT = 134;

    public DataResult GetSigmaItWarnConfig(Integer projectId,Integer index,Integer limit) {
        Do_user userDo = WebUtil.getCurrentUser();
        if(projectId == 0){
            return sigmaItWarnService.getSigmaItWarnConfigByUser(userDo,index,limit);
        }else {
            return sigmaItWarnService.getSigmaItWarnConfig(projectId, userDo.getUser_id());
        }
    }

    public DataResult SetSigmaItWarnMail(Do_sigma_lt_warn_config sigmaLtWarnConfig) {
        if(sigmaLtWarnConfig.getEmail_addr().contains("@")){
            return sigmaItWarnService.setSigmaItWarnConfig(sigmaLtWarnConfig);
        }else {
            return new DataResult(ReturnCodeDim.EMAIL_ILLEGAL,"");
        }
    }

    public DataResult GetSigmaItWarnDetails(String subType, String data_date, Integer index, Integer limit, Integer projectId) {
        Date date = DateUtil.parseDateString(data_date);
        try {
            JSONObject jsonObject = sigmaItWarnService.getDetailContent(projectId,subType,date,index,limit);
            return new DataResult(ReturnCodeDim.SUCCESS,jsonObject);
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR);
        }
    }

    public DataResult GetSigmaItWarn(Integer projectId) {
        return sigmaItWarnService.getSigmaItWarnResult(projectId);
    }

    public DataResult deleteSigmaItWarnConfig(Integer projectId) {
        Do_sigma_lt_warn_config sigmaLtWarnConfig = mapper_sigma_lt_warn_config.getSigmaItWarnConfig(projectId,WebUtil.getCurrentUser().getUser_id());
        if(null != sigmaLtWarnConfig){
            sigmaLtWarnConfig.setDelete_flag(1);
            mapper_sigma_lt_warn_config.updateSigmaItWarnConfig(sigmaLtWarnConfig);
            return new DataResult(ReturnCodeDim.SUCCESS);
        }else {
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN);
        }
    }
}
