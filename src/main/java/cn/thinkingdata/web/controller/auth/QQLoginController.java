package cn.thinkingdata.web.controller.auth;

import cn.thinkingdata.web.service.core.user.UserService;
import cn.thinkingdata.web.util.WebUtil;
import com.qq.connect.QQConnectException;
import com.qq.connect.javabeans.AccessToken;
import com.qq.connect.oauth.Oauth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by Xiaowu on 2016/9/1.
 */
@Controller
public class QQLoginController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/QQLoginCallbackServlet")
    public String QQLoginCallback(@RequestParam(value = "code", required = false,defaultValue = "") String code,
                                  @RequestParam(value = "type", required = false,defaultValue = "") String type,
                                  HttpServletRequest request){
        String loginIp = WebUtil.getHost(request);
        AccessToken accessTokenObj = null;
        try {
            accessTokenObj = (new Oauth()).getAccessTokenByRequest(request);
        } catch (QQConnectException e) {
            e.printStackTrace();
        }
        String jumpUrl = userService.QQLoginCallback(accessTokenObj,loginIp);
        return "redirect:"+jumpUrl;
    }
}
