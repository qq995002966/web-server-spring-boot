package cn.thinkingdata.web.controller.user;

import cn.thinkingdata.web.service.core.user.UserService;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.WebUtil;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by Xiaowu on 2016/8/9.
 */
@RestController
@RequestMapping(value = "/v1/user")
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/mobile",method = { RequestMethod.GET })
    public DataResult checkMobileUsed(@RequestParam(value = "mobile", required = false,defaultValue = "") String mobile){
        return userService.checkMobileUsed(mobile);
    }

    @RequestMapping(value = "/password",method = { RequestMethod.POST })
    public DataResult ChangePassword(@RequestParam(value = "old_password", required = false) String oldPassword,
                                 @RequestParam(value = "password", required = false) String password){
        return userService.ChangePassword(oldPassword,password);
    }

    @RequestMapping(value = "/identity",method = { RequestMethod.POST })
    public DataResult UserIdentity(@RequestParam(value = "real_name", required = false) String realName,
                                   @RequestParam(value = "company_type", required = false) String companyType,
                                   @RequestParam(value = "company_name", required = false) String companyName,
                                   @RequestParam(value = "job_type", required = false) String jobType,
                                   @RequestParam(value = "project_names", required = false) String projectNames,
                                   @RequestParam(value = "email", required = false) String email){
        return userService.UserIdentity(realName,companyType,companyName,jobType,projectNames,email);
    }

    @RequestMapping(value = "/details",method = { RequestMethod.POST })
    public DataResult updateUser(@RequestParam(value = "nick_name", required = false) String nick_name,
                                 @RequestParam(value = "gender", required = false) String gender,
                                 @RequestParam(value = "gaming_years", required = false) String gaming_years,
                                 @RequestParam(value = "tags_id", required = false) String tags_id,
                                 HttpServletRequest request){
        return userService.updateUser(nick_name,gender,gaming_years,tags_id);
    }

    @RequestMapping(value = "/details",method = { RequestMethod.GET })
    public DataResult DetailMobile(){
        return userService.DetailMobile();
    }

    @RequestMapping(value = "/mobile/bind",method = { RequestMethod.POST })
    public DataResult BindMobile(@RequestParam(value = "mobile", required = false,defaultValue = "") String mobile,
                                 @RequestParam(value = "password", required = false,defaultValue = "") String password,
                                 @RequestParam(value = "verify_code", required = false,defaultValue = "") String verifyCode,
                                 HttpServletRequest request){
        String loginIp = WebUtil.getHost(request);
        return userService.BindMobile(mobile,password,verifyCode,loginIp);
    }

    @RequestMapping(value = "/project/collection",method = { RequestMethod.GET })
    @RequiresPermissions("user")
    public DataResult findUserGetProjectCollection(){
        return userService.findUserGetProjectCollection();
    }

    @RequestMapping(value = "/project/histroy",method = { RequestMethod.GET })
    public DataResult findUserProjectViewHistroy(){
        return userService.findUserProjectViewHistroy();
    }

    @RequestMapping(value = "/opinion",method = { RequestMethod.POST })
    public DataResult SubmitOpinion(@RequestParam(value = "opinion_type", required = false,defaultValue = "0") Integer opinionType,
                                 @RequestParam(value = "opinion_msg", required = false,defaultValue = "") String opinionMsg){
        return userService.SubmitOpinion(opinionType,opinionMsg);
    }
}
