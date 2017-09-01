package cn.thinkingdata.web.controller.auth;

import cn.thinkingdata.web.controller.geetest.GeetestValidateInput;
import cn.thinkingdata.web.service.core.user.UserService;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import cn.thinkingdata.web.util.WebUtil;
import com.qq.connect.QQConnectException;
import com.qq.connect.oauth.Oauth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by Xiaowu on 2016/8/8.
 */
@Controller
@RequestMapping(value = "/v1/login")
public class LoginController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/check",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult checkLogin(){
        return userService.checkLogin();
    }

    @RequestMapping(value = "/auth",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult dologin(@RequestParam(value = "login_name", required = false,defaultValue = "") String loginName,
                            @RequestParam(value = "password", required = false,defaultValue = "") String password,
                            @RequestParam(value = "logintype", required = false,defaultValue = "") String loginType,
                            @RequestParam(value = "verify_code", required = false,defaultValue = "") String verifyCode,
                            @RequestParam(value = "maxInactiveInterval", required = false) Integer maxInactiveInterval,
                              HttpServletRequest request){
        String remoteAddr = WebUtil.getHost(request);
        return userService.dologin(loginName,password,loginType,verifyCode,maxInactiveInterval,remoteAddr);
    }

    @RequestMapping(value = "/logout",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult dologout(HttpServletRequest request){
        DataResult dataResult = userService.dologout();
        if(null != WebUtil.getCurrentUser()){
            WebUtil.removeCurrentUser(request);
        }
        return dataResult;
    }

    @RequestMapping(value = "/sms",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult SendSmsCode(@RequestParam(value = "mobile_or_email", required = false,defaultValue = "") String mobile1,
                                  @RequestParam(value = "mobile", required = false,defaultValue = "") String mobile2,
                                  @RequestParam(value = "renew_password", required = false,defaultValue = "") String password,
                                  HttpServletRequest request){
        String mobile = mobile1.trim().length()>0?mobile1:mobile2;
        if(GeetestValidateInput.validate(request)!=0){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "滑动验证不正确","");
        }else {
            return userService.SendSmsCode(mobile,password);
        }
    }

    @RequestMapping(value = "/sms/check",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult CheckVerifyCode(@RequestParam(value = "mobile", required = false,defaultValue = "") String mobile,
                                    @RequestParam(value = "verify_code", required = false,defaultValue = "") String verifyCode){
        return userService.CheckVerifyCode(mobile,verifyCode);
    }

    @RequestMapping(value = "/register",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult checkRegister(@RequestParam(value = "mobile", required = false,defaultValue = "") String mobile,
                               HttpServletRequest request){
        return userService.checkRegister(mobile);
    }

    @RequestMapping(value = "/register",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult register(@RequestParam(value = "mobile_or_email", required = false,defaultValue = "") String mobile,
                              @RequestParam(value = "password", required = false,defaultValue = "") String password,
                              @RequestParam(value = "verify_code", required = false,defaultValue = "") String verifyCode,
                               HttpServletRequest request){
        String loginIp = WebUtil.getHost(request);
        return userService.register(mobile,password,verifyCode,loginIp);
    }

    @RequestMapping(value = "/password",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult ResetPassword(@RequestParam(value = "mobile", required = false,defaultValue = "") String mobile,
                               @RequestParam(value = "password", required = false,defaultValue = "") String password,
                               @RequestParam(value = "verify_code", required = false,defaultValue = "") String verifyCode,
                               HttpServletRequest request){
        return userService.ResetPassword(mobile,password,verifyCode);
    }

//    @RequestMapping(value = "/qq/callback")
//    public String QQLoginCallback(@RequestParam(value = "code", required = false,defaultValue = "") String code,
//                                  @RequestParam(value = "type", required = false,defaultValue = "") String type,
//                                  HttpServletRequest request){
//        String loginIp = WebUtil.getHost(request);
//        AccessToken accessTokenObj = null;
//        try {
//            accessTokenObj = (new Oauth()).getAccessTokenByRequest(request);
//        } catch (QQConnectException e) {
//            e.printStackTrace();
//        }
//        String jumpUrl = userService.QQLoginCallback(accessTokenObj,loginIp);
//        return "redirect:"+jumpUrl;
//    }

    @RequestMapping(value = "/qq/login")
    public String QQLogin(@RequestParam(value = "type", required = false,defaultValue = "login") String type,
                          @RequestParam(value = "redirect_url", required = false,defaultValue = "") String redirectUrl,
                          HttpServletRequest request){
        if(null != type && type.equals("bind")){
            userService.dologout();
            if(null != WebUtil.getCurrentUser()){
                WebUtil.removeCurrentUser(request);
            }
        }
        String jumpUrl = "";
        try {
            WebUtil.setSession("qq_jump_url",redirectUrl);
            jumpUrl = (new Oauth()).getAuthorizeURL(request);
        } catch (QQConnectException e) {
            e.printStackTrace();
        }
        return "redirect:"+jumpUrl;
    }

    @RequestMapping(value = "/weixin/callback")
    public String WXLoginCallback(@RequestParam(value = "code", required = false,defaultValue = "") String code,
                               @RequestParam(value = "type", required = false,defaultValue = "") String type,
                               HttpServletRequest request){
        String loginIp = WebUtil.getHost(request);
        String jumpUrl = userService.WXLoginCallback(code,type,loginIp);
        return "redirect:"+jumpUrl;
    }

    @RequestMapping(value = "/weixin/login")
    public String WXLogin(@RequestParam(value = "type", required = false,defaultValue = "login") String type,
                          @RequestParam(value = "redirect_url", required = false,defaultValue = "") String redirectUrl,
                           HttpServletRequest request){
        String userAgent = request.getHeader("User-Agent");
        if(null != type && type.equals("bind")){
            userService.dologout();
            if(null != WebUtil.getCurrentUser()){
                WebUtil.removeCurrentUser(request);
            }
        }
        String jumpUrl = userService.WXLogin(redirectUrl,userAgent);
        return "redirect:"+jumpUrl;
    }

    @RequestMapping(value = "/thirdparty/bind")
    @ResponseBody
    public DataResult WXLogin(@RequestParam(value = "type", required = false,defaultValue = "qq") String type){
        return userService.thirdpartyBind(type);
    }

    @RequestMapping(value = "/weixin/detail")
    @ResponseBody
    public DataResult WXLogin(@RequestParam(value = "mobile", required = false,defaultValue = "") String mobile,
                          @RequestParam(value = "qq", required = false,defaultValue = "") String qq,
                          @RequestParam(value = "company_name", required = false,defaultValue = "") String company_name,
                          @RequestParam(value = "redirect_url", required = false,defaultValue = "") String job_type){
        return userService.WXLoginDetail(mobile,qq,company_name,job_type);
    }
}
