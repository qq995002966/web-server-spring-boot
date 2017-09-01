package cn.thinkingdata.web.service.core.user.custom;

import cn.thinkingdata.web.domain.baidu.Do_baidu_user_profile_stat;
import cn.thinkingdata.web.persistence.user.custom.Mapper_user_custom_service;
import cn.thinkingdata.web.service.rest.RestBaseService;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Xiaowu on 2016/8/23.
 */
@Service
public class ProfileService extends RestBaseService{

    @Autowired
    private Mapper_user_custom_service mapper_user_custom_service;

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private CustomServiceService customServiceService;

    private static final int SERVICE_TYPE = 1;
    private static final int DEMO_PROJECT = 134;

    public DataResult findProfileGlobal(Integer projectId) {
//        Do_user userDo = WebUtil.getCurrentUser();
//        Do_user_custom_service userCustomService = mapper_user_custom_service.getCustomServiceByUserAndTypeAndProject(userDo.getUser_id(), SERVICE_TYPE,0,0);
//        if(projectId != DEMO_PROJECT){
//            if(userCustomService == null){
//                return new DataResult(ReturnCodeDim.CUSTOM_SERVICE_NOT_OPEN);
//            }else if(userCustomService.getRemaining_days() <= 0){
//                userCustomService.setService_status(3);
//                mapper_user_custom_service.updateCustomService(userCustomService);
//                return new DataResult(ReturnCodeDim.CUSTOM_SERVICE_EXPIRED);
//            }
//        }
        try {
            Map<String, Object> data= userProfileService.getGlobalBaiduProfileJsonStr(projectId);
            return new DataResult(ReturnCodeDim.SUCCESS,data);
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
        }
    }

    public DataResult findProfileCustom(Do_baidu_user_profile_stat baiduUSerProfileKey) {
//        DataResult dataResult = customServiceService.checkCustomService(0,SERVICE_TYPE);
//        if(dataResult != null){
//            return dataResult;
//        }
        try {
            Map<String, Object> data = userProfileService.getCustomBaiduProfile(baiduUSerProfileKey);
            return new DataResult(ReturnCodeDim.SUCCESS,data);
        } catch (Exception e) {
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
        }
    }

    public DataResult getTiebaProfileByProjectId(int projectId){
        Map<String, Object> urlVariables =  new HashMap<>();
        urlVariables.put("project_id",projectId);
        return getApiData("/v1/profile/baidu/project",urlVariables);
    }

}
