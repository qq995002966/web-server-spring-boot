package cn.thinkingdata.web.util;

import cn.thinkingdata.web.domain.user.Do_wx_user_info;
import cn.thinkingdata.web.properties.Resources;
import cn.thinkingdata.web.util.weixin.SignUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ThirdPartyLoginHelper {

    protected static final Logger logger = LogManager.getLogger();
    /**
     * 微信获得的access_token
     * getToken方法所使用
     */
    public static String access_token = null;
    /**
     * 获取access_token 时间, 有效期为expires_in
     * 为实现单例
     * 微信防止过量获取access_token冲击服务器
     */
    public static long access_time = 0;

    /**
     * 过期时间（设置小一点） 原大小为  7200*1000
     */
    public static long expires_in = 6000*1000;

    public static final String getWXPCLoginUrl(){
        String redirectUrl = Resources.WEIXIN.getString("authorizeURL_wx_pc");
        try {
            redirectUrl = redirectUrl + "?appid=" + Resources.WEIXIN.getString("app_id_wx") + "&redirect_uri="+ URLEncoder.encode(Resources.WEIXIN.getString("redirect_url_wx")+"?type=pc","UTF-8")
        + "&response_type=code&scope=" + Resources.WEIXIN.getString("scope_wx")  + "&state=STATE#wechat_redirect";
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return redirectUrl;
    }

    public static String getWXLoginUrl() {
        String redirectUrl = Resources.WEIXIN.getString("authorizeURL_wx");
        try {
            redirectUrl = redirectUrl + "?appid=" + Resources.WEIXIN.getString("app_id") + "&redirect_uri="+ URLEncoder.encode(Resources.WEIXIN.getString("redirect_url_wx_mobile")+"?type=mobile","UTF-8")
                    + "&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return redirectUrl;
    }

    /** 获取微信用户信息 */
    public static final Do_wx_user_info getWxUserinfo(String token, String openid){
        Do_wx_user_info user = new Do_wx_user_info();
        String url = Resources.WEIXIN.getString("getUserInfoURL_wx");
        url = url + "?access_token=" + token + "&openid=" + openid+"&lang=zh_CN";
        String res = HttpUtil.httpClientPost(url);
        JSONObject json = JSONObject.parseObject(res);
        if (json.getString("errcode") == null) {
            user.setOpenid(json.getString("openid"));
            user.setNickname(json.getString("nickname"));
            user.setProvince(json.getString("province"));
            user.setCity(json.getString("city"));
            user.setCountry(json.getString("country"));
            user.setUnionid(json.getString("unionid"));
            String img = json.getString("headimgurl");
            if (img != null && !"".equals(img)) {
                user.setHeadimgurl(img);
            }
            String sex = json.getString("sex");
            if ("1".equals(sex)) {
                user.setSex("男");
            }else if ("2".equals(sex)) {
                user.setSex("女");
            }else {
                user.setSex("");
            }
        } else {
            throw new IllegalArgumentException(json.getString("errmsg"));
        }
        return user;
    }

    /**
     * 解析XML为HashMap
     */
    public static final Map parseXML(InputStream stream){
        Map<String, String> map = new HashMap<String, String>();
        SAXReader reader = new SAXReader();
        Document document = null;
        try {
            document = reader.read(stream);
            Element root = document.getRootElement();
            List<Element> elementList = root.elements();
            for (Element e : elementList){
                map.put(e.getName(), e.getText());
            }
            stream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        stream = null;
        return map;
    }

    /** 微信向用户发送文本消息 */
    public static final JSONObject sendMsg(String token,String openid, String msg)  {
        String json = "{\"touser\":\""+openid+"\",\"msgtype\":\"text\",\"text\":{\"content\":\""+msg+"\"}}";
        String url = Resources.WEIXIN.getString("send_message_wx");
        url = url + "?access_token=" + token ;
        String res = HttpUtil.httpClientPostJSON(url,json);
        System.out.println(res);
        JSONObject jsonObject = JSONObject.parseObject(res);
        return jsonObject;
    }
    /**
     * 微信回调，验证签名
     */
    public static final boolean checkSignature(String signature, String timestamp, String nonce){
        return SignUtil.checkSignature(signature, timestamp, nonce);
    }


    public static Map<String,String> getWxTokenAndOpenid(String code,String type) {
        Map<String, String> map = new HashMap<String, String>();
        // 获取令牌
        String tokenUrl = Resources.WEIXIN.getString("accessTokenURL_wx");
        if(type.equals("pc")){
            tokenUrl = tokenUrl + "?appid=" + Resources.WEIXIN.getString("app_id_wx") + "&secret="
                    + Resources.WEIXIN.getString("app_key_wx") + "&code=" + code + "&grant_type=authorization_code";
        }else if(type.equals("mobile")){
            tokenUrl = tokenUrl + "?appid=" + Resources.WEIXIN.getString("app_id") + "&secret="
                    + Resources.WEIXIN.getString("app_secret") + "&code=" + code + "&grant_type=authorization_code";
        }
        String tokenRes = HttpUtil.httpClientPost(tokenUrl);
        logger.info("token result: " + tokenRes);
        if (tokenRes != null && tokenRes.indexOf("access_token") > -1) {
            Map<String, String> tokenMap = JSON.parseObject(tokenRes, new TypeReference<Map<String, String>>() {});
            map.put("access_token", tokenMap.get("access_token"));
            // 获取微信用户的唯一标识openid
            map.put("openId", tokenMap.get("openid"));
        } else {
            logger.error(new Date()+"type:"+type+"tokenUrl:"+tokenUrl+"tokenRes:  "+tokenRes);
            throw new IllegalArgumentException();
        }
        return map;
    }
}
