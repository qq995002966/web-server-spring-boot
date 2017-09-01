package cn.thinkingdata.web.controller.geetest;

import cn.thinkingdata.web.util.DataResult;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Xiaowu on 2016/8/10.
 */
@Controller
@RequestMapping(value = "/v1/geetest")
public class StartCaptchaController {

    @RequestMapping(value = "/captcha",method = { RequestMethod.GET })
    @ResponseBody
    public Object StartCaptcha(HttpServletRequest request){
        // Conifg the parameter of the geetest object
        GeetestLib gtSdk = new GeetestLib();
        gtSdk.setCaptchaId(GeetestConfig.getCaptcha_id());
        gtSdk.setPrivateKey(GeetestConfig.getPrivate_key());
        gtSdk.setGtSession(request);//如果是同一会话多实例，可以使用此函数的另一重载实现式，设置不同的key即可
        Map<String ,Object> result = new HashMap<>();
        if (gtSdk.preProcess() == 1) {
            // gt server is in use
            result.put("success",1);
            gtSdk.setGtServerStatusSession(request, 1);
        } else {
            // gt server is down
            result.put("success",0);
            gtSdk.setGtServerStatusSession(request, 0);
        }
        result.put("gt",gtSdk.getCaptchaId());
        result.put("challenge",gtSdk.getChallengeId());
        return result;
    }
}
