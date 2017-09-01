package cn.thinkingdata.web.controller.user;

import cn.thinkingdata.web.domain.baidu.Do_baidu_user_profile_stat;
import cn.thinkingdata.web.service.core.user.custom.ProfileService;
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
public class ProfileController {

    @Autowired
    private ProfileService profileService;


    @RequestMapping(value = "/profile",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findProfileGlobal(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return profileService.findProfileGlobal(projectId);
    }

    @RequestMapping(value = "/profile/custom",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult findProfileCustom(@RequestParam(value = "active_class", required = false) String activeClass,
                                        @RequestParam(value = "influence_level", required = false) String influenceLevel,
                                        @RequestParam(value = "interest_classify", required = false) String interestClassify,
                                        @RequestParam(value = "charm_level", required = false) String charmLevel,
                                        @RequestParam(value = "province", required = false) String province,
                                        @RequestParam(value = "op_type", required = false) String opType,
                                        @RequestParam(value = "pay_ability", required = false) String payAbility,
                                        @RequestParam(value = "complain_level", required = false) String complainLevel,
                                        @RequestParam(value = "post_quality", required = false) String postQuality,
                                        @RequestParam(value = "game_lifecycle", required = false) String gameLifecycle,
                                        @RequestParam(value = "project_id", required = true,defaultValue = "0") Integer projectId){
        Do_baidu_user_profile_stat baiduUSerProfileKey = new Do_baidu_user_profile_stat();
        baiduUSerProfileKey.setActive_class(activeClass);
        baiduUSerProfileKey.setInfluence_level(influenceLevel);
        baiduUSerProfileKey.setInterest_classify(interestClassify);
        baiduUSerProfileKey.setCharm_level(charmLevel);
        baiduUSerProfileKey.setProvince(province);
        baiduUSerProfileKey.setOp_type(opType);
        baiduUSerProfileKey.setPay_ability(payAbility);
        baiduUSerProfileKey.setComplain_level(complainLevel);
        baiduUSerProfileKey.setPost_quality(postQuality);
        baiduUSerProfileKey.setGame_lifecycle(gameLifecycle);
        baiduUSerProfileKey.setProject_id(projectId);
        return profileService.findProfileCustom(baiduUSerProfileKey);
    }

    @RequestMapping(value = "/profile/tieba/project",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult getTiebaProfileByProjectId(@RequestParam(value = "project_id") Integer projectId){
        return profileService.getTiebaProfileByProjectId(projectId);
    }
}
