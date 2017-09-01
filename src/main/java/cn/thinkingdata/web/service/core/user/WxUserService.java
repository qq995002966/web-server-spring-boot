package cn.thinkingdata.web.service.core.user;

import cn.thinkingdata.web.constant.SessionAttr;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.domain.user.Do_user_detail;
import cn.thinkingdata.web.domain.user.Do_wx_user_info;
import cn.thinkingdata.web.persistence.user.Mapper_user;
import cn.thinkingdata.web.persistence.user.Mapper_wx_user_info;
import cn.thinkingdata.web.properties.Resources;
import cn.thinkingdata.web.service.GameRecommendService;
import cn.thinkingdata.web.shiro.LoginHelper;
import cn.thinkingdata.web.util.*;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;
import java.util.Optional;

@Service
public class WxUserService {

    @Autowired
    private Mapper_user mapper_user;

    @Autowired
    private Mapper_wx_user_info mapper_wx_user_info;

    @Autowired
    private GameRecommendService gameRecommendService;

    public String thirdPartyLogin(Do_wx_user_info thirdUser, String loginIp) {
        Long current_time = CommonUtil.getCurrentTimestamp();
        Do_wx_user_info wxUserInfo = new Do_wx_user_info();
        wxUserInfo.setOpenid(thirdUser.getOpenid());
        wxUserInfo.setNickname(thirdUser.getNickname());
        wxUserInfo.setUnionid(thirdUser.getUnionid());
        wxUserInfo.setCountry(thirdUser.getCountry());
        wxUserInfo.setProvince(thirdUser.getProvince());
        wxUserInfo.setCity(thirdUser.getCity());
        wxUserInfo.setHeadimgurl(thirdUser.getHeadimgurl());
        wxUserInfo.setSex(thirdUser.getSex());
        mapper_wx_user_info.insertUpdateWXUserInfo(wxUserInfo);
        //已经登入用户绑定weixin
        Do_user userInfo = WebUtil.getCurrentUser();
        if(null != userInfo){
            Optional<Do_user> userWXOpt = Optional.ofNullable(mapper_user.getUserInfoByWX(thirdUser.getUnionid()));
            if(userWXOpt.isPresent()){
                Do_user userWX = userWXOpt.get();
                if(null != userWX.getMobile()){
                    WebUtil.setSession("wx_union_id",thirdUser.getUnionid());
                    return "msg="+ReturnCodeDim.WX_HAD_BOUND;
                }else {
                    userWX.setUser_level(userWX.FORBIDDEN_USER);
                    mapper_user.updateUser(userWX);
                }
            }
            userInfo.setWx_union_id(thirdUser.getUnionid());
            mapper_user.updateUser(userInfo);
        }else {
            userInfo = mapper_user.getUserInfoByWX(thirdUser.getUnionid());
        }
        if(userInfo == null) {//新的微信用户
            userInfo = new Do_user();
            String openId = "TG-"+StringUtil.getUuId();
            userInfo.setTg_open_id(openId);
            userInfo.setWx_union_id(thirdUser.getUnionid());
            userInfo.setNick_name(thirdUser.getNickname());
            userInfo.setUser_level(Do_user.NORMAL_USER);
            userInfo.setLast_login_ip(loginIp);
            userInfo.setLast_login_time(current_time);
            try{
                mapper_user.insertWXUser(userInfo);
            }catch (Exception e){
                userInfo.setNick_name(StringUtil.getUuId());
                mapper_user.insertWXUser(userInfo);
                String newNickName = thirdUser.getNickname() + "#" + userInfo.getUser_id();
                mapper_user.updateNickName(userInfo.getUser_id(), newNickName);
                userInfo.setNick_name(newNickName);
            }
            gameRecommendService.getRecommendGamesByTags(userInfo.getUser_id(), null, 20);
        }else {
            mapper_user.updateLastLogin(userInfo.getUser_id(), loginIp, current_time);
        }

        LoginHelper.login(userInfo.getWx_union_id(),"",true);
        Do_user_detail userDetail = mapper_user.getUserDetailById(userInfo.getUser_id());
        WebUtil.setSession(SessionAttr.USER_DETAIL,userDetail);
        if((userDetail==null)|| ((userDetail.getMobile().trim().length() < 1)&&(userDetail.getQq().trim().length() < 1))){
            return "error";
        }
        return "success";
    }

    public String getDeviceInfo(String userAgent) {
        if(userAgent.contains("MicroMessenger")){
            return "mobile";
        }else {
            return "pc";
        }
    }


    public String event(Map<String, String> map,String MsgType , String Event , String openid , String content , String createTime , String eventKey){

        String info = "";
        //用户关注
        if(MsgType == "event" && Event == "subscribe"){
            String msg = "感谢您的关注与支持。\r\n";
            ThirdPartyLoginHelper.sendMsg(this.getToken(),openid, msg);

        }

        //用户取消关注
        if(MsgType == "event" && Event == "unsubscribe"){
//			return document
        }
        //点击事件
        if(MsgType == "event" && Event == "CLICK"){
            //火堆说  咨询的key   与菜单栏中的key一一对应
            if(eventKey.equals("consult")){
                String msg = "感谢您对thinkinggame的关注和支持。";
                ThirdPartyLoginHelper.sendMsg(this.getToken(),openid, msg);
            }
        }
        return info;

    }

    /**
     * 微信公众号 access_token获取
     * 要与oauth token区分
     */
    public synchronized String getToken(){
        try{
            if(ThirdPartyLoginHelper.access_token == null){
                this.getAccessToken();
            }else if((System.currentTimeMillis() - ThirdPartyLoginHelper.access_time) >= ThirdPartyLoginHelper.expires_in){
                this.getAccessToken();
            }else{
                return ThirdPartyLoginHelper.access_token;
            }
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
        return ThirdPartyLoginHelper.access_token;
    }

    /**
     * 账号密码获取access_token,实现单例，
     * 获取oauth token请使用oauth_accessToken()方法
     */
    private synchronized void getAccessToken() {
        String url = Resources.WEIXIN.getString("access_token_url");
        String appid = Resources.WEIXIN.getString("app_id_wx");
        String appsecurity = Resources.WEIXIN.getString("app_key_wx");
        url = url + "?appid="+appid+"&secret=" + appsecurity ;
        String res = HttpUtil.httpClientPost(url);
        System.out.println(res);
        JSONObject accessToken = JSONObject.parseObject(res);
        if(accessToken.containsKey("access_token")){
            ThirdPartyLoginHelper.access_token = accessToken.getString("access_token");
            ThirdPartyLoginHelper.access_time = System.currentTimeMillis();
        }
    }

}
