package cn.thinkingdata.web.service.core.user;

import cn.thinkingdata.mailsms.sender.sms.SendSmsUtil;
import cn.thinkingdata.web.constant.GameConstant;
import cn.thinkingdata.web.constant.SessionAttr;
import cn.thinkingdata.web.domain.gas.Do_gas_projects;
import cn.thinkingdata.web.domain.industry.Do_industry_article_classify_distri;
import cn.thinkingdata.web.domain.user.*;
import cn.thinkingdata.web.persistence.industry.Mapper_industry_article_classify_distri;
import cn.thinkingdata.web.persistence.project.Mapper_project_detail_type_dim;
import cn.thinkingdata.web.persistence.user.*;
import cn.thinkingdata.web.properties.Resources;
import cn.thinkingdata.web.service.GameRecommendService;
import cn.thinkingdata.web.service.cache.ProjectInfoCacheService;
import cn.thinkingdata.web.service.rest.RestBaseService;
import cn.thinkingdata.web.shiro.LoginHelper;
import cn.thinkingdata.web.util.*;
import com.google.common.base.Throwables;
import com.qq.connect.api.OpenID;
import com.qq.connect.javabeans.AccessToken;
import com.qq.connect.utils.QQConnectConfig;
import com.qq.connect.utils.http.HttpClient;
import com.qq.connect.utils.http.PostParameter;
import com.qq.connect.utils.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

/**
 * Created by Xiaowu on 2016/8/3.
 */
@Service
public class UserService extends RestBaseService {

    private static final Logger logger = LogManager.getLogger();


    @Autowired
    private Mapper_user mapper_user;

    @Autowired
    private Mapper_user_role mapper_user_role;

    @Autowired
    private Mapper_user_project_collection mapper_user_project_collection;

    @Autowired
    private Mapper_qq_user_info mapper_qq_user_info;

    @Autowired
    private Mapper_user_opinion mapper_user_opinion;

    @Autowired
    private Mapper_wx_user_info mapper_wx_user_info;

    @Autowired
    private GameRecommendService gameRecommendService;

    @Autowired
    private ProjectInfoCacheService projectInfoCacheService;

    @Autowired
    private WxUserService wxUserService;

    @Autowired
    private Mapper_industry_article_classify_distri mapper_industry_article_classify_distri;

    @Autowired
    private Mapper_project_detail_type_dim mapper_project_detail_type_dim;

    private DataResult CheckUserNameAndPasswordAndSetSessionIfOk(String login_name, String md5_psswd,Boolean rememberMe){
        Do_user userDo = null;
        StringUtil.AccountType accountType = StringUtil.getAccountType(login_name);
        if(accountType != StringUtil.AccountType.MOBILE){
            return new DataResult(ReturnCodeDim.MOBILE_ILLEGAL,"");
        }
        userDo = mapper_user.getUserInfoByMobile(login_name);
        // 用户不存在
        if(userDo == null){
            return new DataResult(ReturnCodeDim.ACCOUNT_NONEXIST,"");
        }
        // 密码错误
        else if(!LoginHelper.login(login_name, md5_psswd,rememberMe)){
            logger.info(userDo.getPassword());
            return new DataResult(ReturnCodeDim.PASSWORD_ERROR,"");
        }else{
            WebUtil.saveCurrentUser(userDo);
            Do_user_detail userDetail = mapper_user.getUserDetailById(userDo.getUser_id());
            WebUtil.setSession(SessionAttr.USER_DETAIL,userDetail);
        }
        return null;
    }

    public Do_user authLogin(){
        Subject currentUser = SecurityUtils.getSubject();
        Do_user userDo = WebUtil.getCurrentUser();
        if( null == userDo && null != currentUser && null != currentUser.getPrincipal()){
            String username = currentUser.getPrincipal().toString();
            StringUtil.AccountType accountType = StringUtil.getAccountType(username);
            if(accountType == StringUtil.AccountType.MOBILE){
                userDo = mapper_user.getUserInfoByMobile(username);
            }else if(accountType == StringUtil.AccountType.WX){
                userDo = mapper_user.getUserInfoByWX(username);
            }else if(accountType == StringUtil.AccountType.QQ){
                userDo = mapper_user.getUserInfoByQQ(username);
            }
            WebUtil.saveCurrentUser(userDo);
        }
        return userDo;
    }

    public DataResult checkLogin() {
        Do_user userDo = authLogin();
        Map<String, Object> dataMap = new HashMap<>();
        Set<Integer> authOutterProjectIDSet = new LinkedHashSet<>();
        int authChatAnalysis = 0;
        if(userDo != null) {
            Map<String, Object> userMap = new LinkedHashMap<>();
            userMap.put("nick_name", userDo.getNick_name());
            userMap.put("projects_id", userDo.getProjects_id());
            userMap.put("mobile", userDo.getMobile());
            userMap.put("email", userDo.getEmail());
            Do_user_detail userDetail = (Do_user_detail) WebUtil.getSession(SessionAttr.USER_DETAIL);
            if (userDetail == null) {
                userDetail = new Do_user_detail();
            }
            Optional<String> qqOpenId = Optional.of(userDo.getQq_open_id());
            Optional<String> wxOpenId = Optional.of(userDo.getWx_union_id());
            String qqNickName = "";
            String wxNickName = "";
            String qqHead = "";
            String wxHead = "";
            if(qqOpenId.isPresent()){
                Optional<Map> qqInfoOpt = Optional.ofNullable(mapper_qq_user_info.getQQNickName(qqOpenId.get()));
                if(qqInfoOpt.isPresent()){
                    Map<String,Object> qqInfo = qqInfoOpt.get();
                    qqNickName = qqInfo.get("nick_name").toString();
                    qqHead = qqInfo.get("avatar_url").toString();

                }
            }
            if(wxOpenId.isPresent()){
                Optional<Map> wxInfoOpt = Optional.ofNullable(mapper_wx_user_info.getWXNickName(wxOpenId.get()));
                if(wxInfoOpt.isPresent()){
                    Map<String,String> wxInfo = wxInfoOpt.get();
                    wxNickName = wxInfo.get("nickname");
                    wxHead = wxInfo.get("headimgurl");
                }
            }
            userMap.put("qq_name", qqNickName);
            userMap.put("qq_head", qqHead);
            userMap.put("wx_name", wxNickName);
            userMap.put("wx_head", wxHead);
            userMap.put("company_name", userDetail.getCompany_name());
            userMap.put("company_type", userDetail.getCompany_type());
            userMap.put("gaming_years", userDetail.getGaming_years());
            userMap.put("gender", userDetail.getGender());
            userMap.put("job_type", userDetail.getJob_type());
            userMap.put("project_names", userDetail.getProject_names());
            userMap.put("real_name", userDetail.getReal_name());
            userMap.put("status", userDetail.getStatus());
            userMap.put("status_info", userDetail.getStatus_info());
            userMap.put("tags_id", userDetail.getTags_id());
            if (!userDetail.getEmail().equals("")) {
                userMap.put("email", userDetail.getEmail());
            }
            dataMap.put("user", userMap);

            Map<String,Object> urlVariables = new HashMap<>();
            urlVariables.put("open_id",userDo.getTg_open_id());
            DataResult innerGameListRes = getApiData("/v1/user/auth/inner_game/list",urlVariables);
            DataResult outterGameListRes = getApiData("/v1/user/auth/outter_game/list",urlVariables);
            List innerGameObjList = (List) innerGameListRes.getData();
            Set<Integer> innerGameIdSet = new HashSet<>();
            for (Object obj : innerGameObjList) {
//                innerGameIdSet.add(((Integer) obj).intValue());
                innerGameIdSet.add((Integer)obj);
            }
            List outterGameObjList = (List) outterGameListRes.getData();
            for(Object obj : outterGameObjList){
//                authOutterProjectIDSet.add(((Integer) obj).intValue());
                authOutterProjectIDSet.add((Integer)obj);
            }
            userDo.setInnerGameSet(innerGameIdSet);
            userDo.setOutterGameSet(authOutterProjectIDSet);
            WebUtil.saveCurrentUser(userDo);
            if(!userDo.getMobile().equals("demo")){
                authChatAnalysis = 1;
            }
        }
        authOutterProjectIDSet.addAll(Arrays.asList(GameConstant.OUTTER_DEMO_PROJECTS));
        List<Do_gas_projects> projectList = projectInfoCacheService.getGasProjectsList();
        List<Map<String, Object>> projectMapList = new ArrayList<>();
        for (Do_gas_projects project : projectList) {
            Map<String, Object> map = new HashMap<>();
            map.put("game_type", project.getGame_type());
            map.put("pinyin", project.getPinyin());
            map.put("project_id", project.getProject_id());
            map.put("project_name", project.getProject_name());
            map.put("author", project.getAuthor());
            projectMapList.add(map);
        }
        dataMap.put("gas_projects", projectMapList);
        dataMap.put("project_tag_dim", projectInfoCacheService.getAllProjectTagList());
        dataMap.put("gas_source_dim", projectInfoCacheService.getGasSourceDimList());
        dataMap.put("article_source_dim", projectInfoCacheService.getArticleSourceDimList());
        dataMap.put("article_classify_dim", getArticleClassifyDim());
        dataMap.put("project_detail_type_dim", mapper_project_detail_type_dim.getDetailTypeDimList());
        dataMap.put("auth_project_list",authOutterProjectIDSet);
        int authOpinionMonitor = 0;
        if(authOutterProjectIDSet.size() > GameConstant.OUTTER_DEMO_PROJECTS.length){
            authOpinionMonitor = 1;
        }
        dataMap.put("auth_opinion_monitor",authOpinionMonitor);
        dataMap.put("auth_chat_analysis",authChatAnalysis);

        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }



    private List<Map<String, Object>> getArticleClassifyDim(){
        List<Do_industry_article_classify_distri> articleClassifyDistriList = mapper_industry_article_classify_distri.getArticleClassifyDistriList();
        Map<String, List<Map<String, Object>>> mainClassDistriMap = new LinkedHashMap<>();
        for(Do_industry_article_classify_distri do_distri : articleClassifyDistriList){
            String mainClass = do_distri.getMain_class();
            List<Map<String, Object>> subDistriList = mainClassDistriMap.get(mainClass);
            if(subDistriList == null){
                subDistriList = new ArrayList<>();
            }
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("sub_class", do_distri.getSub_class());
            subDistriList.add(map);
            mainClassDistriMap.put(mainClass, subDistriList);
        }

        List<Map<String, Object>> mainClassDistriList = new ArrayList<>();
        for(Map.Entry<String, List<Map<String, Object>>> entry : mainClassDistriMap.entrySet()){
            String mainClass = entry.getKey();
            List<Map<String, Object>> subDistriList = entry.getValue();

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("main_class", mainClass);
            map.put("sub_class_list", subDistriList);
            mainClassDistriList.add(map);
        }
        return mainClassDistriList;
    }

    public DataResult dologin(String loginName, String password, String loginType, String verifyCode,Integer maxInactiveInterval,String remoteAddr) {
        if(loginName == null || loginName.equals("")){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN, "请输入登录账号","");
        }
        Boolean rememberMe = false;
        if(maxInactiveInterval > 0 ){
            rememberMe = true;
        }
        StringUtil.AccountType accountType = StringUtil.getAccountType(loginName);
        if(accountType != StringUtil.AccountType.MOBILE){
            return new DataResult(ReturnCodeDim.MOBILE_ILLEGAL, "");
        }
        String md5Pwd = "";
        Do_user userDo = null;
        try {
            if (loginType != null && loginType.equals("verify")) {
                if (verifyCode == null || verifyCode.equals("")) {
                    return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN, "请输入验证码","");
                }
                userDo = mapper_user.getUserInfoByMobile(loginName);
                // 用户不存在
                if (userDo == null) {
                    return new DataResult(ReturnCodeDim.ACCOUNT_NONEXIST,"");
                } else {
                    Object verify_s = WebUtil.getSession(SessionAttr.VERIFY_CODE);
                    if (verify_s != null && verify_s.equals(verifyCode)) {
                        if (!userDo.getPassword().equals("")) {
                            md5Pwd = CommonUtil.getMD5Str(userDo.getPassword());
                        }
                        DataResult dataResult = CheckUserNameAndPasswordAndSetSessionIfOk( loginName, userDo.getPassword(),rememberMe);
                        if (null != dataResult) {
                            return dataResult;
                        }
                    } else {
                        return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "验证码不正确","");
                    }
                }
            } else {
                if (password == null || password.equals("")) {
                    return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN, "请输入密码","");
                }
                md5Pwd = CommonUtil.getMD5Str(password);
                DataResult dataResult = CheckUserNameAndPasswordAndSetSessionIfOk( loginName, md5Pwd,rememberMe);
                if (null != dataResult) {
                    return dataResult;
                }
            }
            userDo = WebUtil.getCurrentUser();
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("data", userDo);
            mapper_user.updateLastLogin(userDo.getUser_id(), remoteAddr, CommonUtil.getCurrentTimestamp());
            return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
        }catch (Exception e){
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR);
        }
    }

    public DataResult checkMobileUsed(String mobile) {
        Do_user userDo = mapper_user.getUserInfoByMobile(mobile);
        // 判断手机号是否已经注册
        if(userDo != null){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "该手机号已被注册！","");
        }
        return new DataResult(ReturnCodeDim.SUCCESS);
    }

    public DataResult dologout() {
        if(WebUtil.getCurrentUser() != null){
            LoginHelper.logout();
        }
        return new DataResult(ReturnCodeDim.SUCCESS, "退出登录成功","");
    }

    public DataResult findUserGetProjectCollection() {
        Do_user userDo = WebUtil.getCurrentUser();
        Map<String, Object> dataMap = new HashMap<>();
        Set<Integer> collectionProjSet = new LinkedHashSet<>();
        if(userDo != null){
//            List<Do_user_project_collection> collectionList = mapper_user_project_collection.getUserCollectionList(userDo.getUser_id().longValue(),0,10);
//            for(Do_user_project_collection projCollection : collectionList){
//                Integer projectId = projCollection.getProject_id();
//                collectionProjSet.add(projectId);
//            }
            collectionProjSet.addAll(userDo.getOutterGameSet());
        }
        collectionProjSet.addAll(GameConstant.OUTTER_DEMO_PROJECT_SET);
        dataMap.put("collection_list", collectionProjSet);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult findUserProjectViewHistroy() {
        Do_user userDo = WebUtil.getCurrentUser();
        Map<String, Object> dataMap = new HashMap<>();
        if(userDo == null){
            String tempHistoryProjectStr = (String) WebUtil.getSession(SessionAttr.TEMP_PROJECT_HISTORY);
            if(tempHistoryProjectStr == null || tempHistoryProjectStr.length() == 0){
                dataMap.put("project_list", new ArrayList<>());
            }else{
                String viewHistoryProjects[] = tempHistoryProjectStr.split(",");
                dataMap.put("project_list", viewHistoryProjects);
            }
        }else{
            String viewHistoryProjectStr = userDo.getProjects_id();
            if(viewHistoryProjectStr == null || viewHistoryProjectStr.length() == 0){
                dataMap.put("project_list", new ArrayList<>());
            }else{
                String viewHistoryProjects[] = viewHistoryProjectStr.split(",");
                dataMap.put("project_list", viewHistoryProjects);
            }
        }
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult SendSmsCode(String mobile, String password) {
        // 判断手机号是否已经注册
        String type="";
//        String type="注册";
//        Do_user tempUserDo = mapper_user.getUserInfoByMobile(mobile);
//        if(tempUserDo!=null){
//            type = "登录";
//        }
        // 是属于重置密码的验证码
        if( !CommonUtil.IsEmpty(password) ){
//            type="重置密码";
            Do_user _do= mapper_user.getUserInfoByMobile(mobile);
            if(_do==null){
                return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "用户不存在","");
            }else{
                mobile=_do.getMobile();
            }
        }else{
            if(!CommonUtil.isMobile(mobile)){
                return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "请输入合法的手机号！","");
            }
        }
        int random=(int)(Math.random()*1000000);
        if(random==1000000)
            random--;
        else if(random<100000)
            random+=100000;
        String msg=String.valueOf(random);
        try {
            String msgContent = "您"+type+"的验证码是："+msg+"，请在30分钟内使用。";
            //logger.info("mobile: " + mobile + ", msg: " + msgContent);

            SendSmsUtil.sendSmsContent(mobile, msgContent);
        } catch (Exception e) {
            logger.error(Throwables.getStackTraceAsString(e));
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR);
        }
        WebUtil.setSession(SessionAttr.MOBILE, mobile);
        WebUtil.setSession(SessionAttr.VERIFY_CODE, msg);
        return new DataResult(ReturnCodeDim.SUCCESS);
    }

    public DataResult register(String mobile, String password, String verifyCode,String loginIp) {
        Do_user tempUserDo = mapper_user.getUserInfoByMobile(mobile);
        if(mobile == null || mobile.equals("")){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "手机号不能为空","");
        }else if(password == null || password.equals("")){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "密码不能为空","");
        }else if(tempUserDo != null){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "该手机号已被注册！","");
        }
        try {
            String md5Pwd = CommonUtil.getMD5Str(password);
            if(!CommonUtil.IsEmpty(mobile)){
                Object mobile_s = WebUtil.getSession(SessionAttr.MOBILE);
                Object verify_s = WebUtil.getSession(SessionAttr.VERIFY_CODE);
                if(verify_s ==null || mobile_s==null || (!mobile_s.equals(mobile)) || (!verify_s.equals(verifyCode))){
                    return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "验证码不正确","");
                }
            }else{
                return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "请输入合法的手机号","");
            }
            // 使用过的验证码就作废
            WebUtil.setSession(SessionAttr.MOBILE, "");
            WebUtil.setSession(SessionAttr.VERIFY_CODE, "");
            Long current_time = CommonUtil.getCurrentTimestamp();
            Do_user userDo = new Do_user();
            Do_user_role userRole = mapper_user_role.getUserRole("user");
            String openId = "TG-"+StringUtil.getUuId();
            userDo.setTg_open_id(openId);
            userDo.setUser_role(userRole);
            userDo.setLast_login_ip(loginIp);
            userDo.setLast_login_time(current_time);
            userDo.setMobile(mobile);
            userDo.setEmail("");
            userDo.setPassword(md5Pwd);
            String nick_name = StringUtil.getUuId();
            userDo.setNick_name(nick_name);
            userDo.setUser_level(Do_user.NORMAL_USER);
            mapper_user.insertUser(userDo);
            String newNickName = "*TG" + userDo.getUser_id();
            mapper_user.updateNickName(userDo.getUser_id(), newNickName);
            gameRecommendService.getRecommendGamesByTags(userDo.getUser_id(), null, 20);
            //couponService.setCouponAfterReg(userDo);
            return new DataResult(ReturnCodeDim.SUCCESS, "注册成功","");
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
        }
    }

    public String WXLoginCallback(String code, String type, String loginIp) {
        String jumpUrl = (String)WebUtil.getSession("wx_jump_url");
        logger.info("jumpUrl:"+jumpUrl);
        Map<String, String> map = null;
        if(StringUtils.isNotBlank(code)){
            // 获取token和openid
            map = ThirdPartyLoginHelper.getWxTokenAndOpenid(code,type);
            String openId = map.get("openId");
            if (StringUtils.isNotBlank(openId)) {// 如果openID存在
                // 获取第三方用户信息存放到session中
                Do_wx_user_info thirdUser = ThirdPartyLoginHelper.getWxUserinfo(map.get("access_token"), openId);
                String msg = wxUserService.thirdPartyLogin(thirdUser,loginIp);
                if(type.equals("mobile")){
                    if("error".equals(msg)){
                        return Resources.WEIXIN.getString("server_url")+"/WeiLogin/";
                    }
                }
                if(msg.contains("msg")){
                    if(jumpUrl.contains("?")){
                        return jumpUrl + "&" +msg;
                    }else {
                        return jumpUrl + "?" +msg;
                    }
                }
                return jumpUrl;
            } else {// 如果未获取到OpenID
                logger.warn("wx login failed code:" + code + ", openId is black. ");
                return jumpUrl;
            }
        }else {
            logger.warn("wx login failed code is black. ");
            return jumpUrl;
        }
    }

    public String WXLogin(String redirectUrl, String userAgent) {
        WebUtil.setSession("wx_jump_url",redirectUrl);
//        Do_user userInfo = WebUtil.getCurrentUser();
//        if(userInfo != null && !userInfo.getNick_name().equalsIgnoreCase("demo") ){
//            Do_user_detail userDetail = mapper_user.getUserDetailById(userInfo.getUser_id());
//            if((userDetail != null && userDetail.getMobile().trim().length() > 1)&&(userDetail.getQq().trim().length() > 1)){
//                return redirectUrl;
//            }
//        }
        String type = wxUserService.getDeviceInfo(userAgent);
        if(type.equals("pc")){
            return ThirdPartyLoginHelper.getWXPCLoginUrl();
        }else if(type.equals("mobile")){
            return ThirdPartyLoginHelper.getWXLoginUrl();
        }
        return redirectUrl;
    }

    public DataResult WXLoginDetail(String mobile,String qq,String company_name,String job_type) {
        if(!StringUtils.isNotBlank(mobile)){
            return new DataResult(ReturnCodeDim.MOBILE_ILLEGAL,"");
        }
        if(!StringUtils.isNotBlank(qq)){
            return new DataResult(ReturnCodeDim.QQ_ILLEGAL,"");
        }
        if( StringUtils.isNotBlank(mobile) &&  StringUtils.isNotBlank(qq) ){
            Do_user_detail user_detail = mapper_user.getUserDetailById(WebUtil.getCurrentUser().getUser_id());
            if(user_detail == null ){
                user_detail = new Do_user_detail();
            }
            user_detail.setMobile(mobile);
            user_detail.setQq(qq);
            if(StringUtils.isNotBlank(company_name)){
                user_detail.setCompany_name(company_name);
            }
            if(StringUtils.isNotBlank(job_type)){
                user_detail.setJob_type(Integer.valueOf(job_type));
            }
            user_detail.setUser_id(WebUtil.getCurrentUser().getUser_id());
            mapper_user.insertUpdateUserDetail(user_detail);
        }
        return new DataResult(ReturnCodeDim.SUCCESS,"");
    }

    public String QQLoginCallback(AccessToken accessTokenObj,String loginIp) {
        String jumpUrl = WebUtil.getSession("qq_jump_url").toString();
        if (accessTokenObj.getAccessToken().equals("")) {
            logger.warn("user canceled qq auth");
        }else{
            try {
                OpenID openIDObj = new OpenID(accessTokenObj.getAccessToken());
                String openId = openIDObj.getUserOpenID();
                HttpClient client = new HttpClient();
                client.setToken(accessTokenObj.getAccessToken());
                client.setOpenID(openId);
                JSONObject userJson = client.get(QQConnectConfig.getValue("getUserInfoURL"), new PostParameter[]{
                        new PostParameter("openid", openId), new PostParameter("oauth_consumer_key", QQConnectConfig.getValue("app_ID")), new PostParameter("access_token", client.getToken()), new PostParameter("format", "json")
                }).asJSONObject();
                int retCode = userJson.getInt("ret");
                String retMsg = userJson.getString("msg");
                if (retCode != 0) {
                    logger.warn("qq login failed ret_code: " + retCode + ", ret_msg: " + retMsg);
                    return jumpUrl;
                }
                String gender = userJson.getString("gender");
                String province = userJson.getString("province");
                String city = userJson.getString("city");
                String year = userJson.getString("year");
                String nickName = userJson.getString("nickname");
                String avatarUrl = userJson.getString("figureurl_qq_2");
                Long current_time = CommonUtil.getCurrentTimestamp();
                Do_qq_user_info qqUserInfo = new Do_qq_user_info();
                qqUserInfo.setAccess_token(accessTokenObj.getAccessToken());
                qqUserInfo.setAvatar_url(avatarUrl);
                qqUserInfo.setBirth_year(year);
                qqUserInfo.setCity(city);
                qqUserInfo.setGender(gender);
                qqUserInfo.setNick_name(nickName);
                qqUserInfo.setOpen_id(openId);
                qqUserInfo.setProvince(province);
                mapper_qq_user_info.insertUpdateQQUserInfo(qqUserInfo);
                //已经登入用户绑定QQ
                Do_user userInfo = WebUtil.getCurrentUser();
                if(null != userInfo){
                    Optional<Do_user> userQQOpt = Optional.ofNullable(mapper_user.getUserInfoByQQ(openId));
                    if(userQQOpt.isPresent()){
                        Do_user userQQ = userQQOpt.get();
                        if(null != userQQ.getMobile()){
                            WebUtil.setSession("qq_open_id",openId);
                            if(jumpUrl.contains("?")){
                                return jumpUrl+"&msg="+ReturnCodeDim.QQ_HAD_BOUND;
                            }else {
                                return jumpUrl+"?msg="+ReturnCodeDim.QQ_HAD_BOUND;
                            }
                        }else {
                            userQQ.setUser_level(userQQ.FORBIDDEN_USER);
                            mapper_user.updateUser(userQQ);
                        }
                    }
                    userInfo.setQq_open_id(openId);
                    mapper_user.updateUser(userInfo);
                }else {
                    userInfo = mapper_user.getUserInfoByQQ(openId);
                }
                if (userInfo == null) {//新的QQ用户
                    userInfo = new Do_user();
                    String tgOpenId = "TG-"+StringUtil.getUuId();
                    userInfo.setTg_open_id(tgOpenId);
                    userInfo.setQq_open_id(openId);
                    userInfo.setNick_name(nickName);
                    userInfo.setUser_level(Do_user.NORMAL_USER);
                    userInfo.setLast_login_ip(loginIp);
                    userInfo.setLast_login_time(current_time);
                    try {
                        mapper_user.insertQQUser(userInfo);
                    } catch (Exception e) {
                        userInfo.setNick_name(StringUtil.getUuId());
                        mapper_user.insertQQUser(userInfo);
                        String newNickName = nickName + "#" + userInfo.getUser_id();
                        mapper_user.updateNickName(userInfo.getUser_id(), newNickName);
                        userInfo.setNick_name(newNickName);
                    }
                    gameRecommendService.getRecommendGamesByTags(userInfo.getUser_id(), null, 20);
                } else {
                    mapper_user.updateLastLogin(userInfo.getUser_id(), loginIp, current_time);
                }
                LoginHelper.login(userInfo.getQq_open_id(),"",true);
                Do_user_detail userDetail = mapper_user.getUserDetailById(userInfo.getUser_id());
                WebUtil.setSession(SessionAttr.USER_DETAIL, userDetail);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return jumpUrl;
    }

    public DataResult BindMobile(String mobile, String password, String verifyCode,String loginIp) {
        Do_user userDo = WebUtil.getCurrentUser();
        if(userDo.getMobile().trim().length()>0){
            return  new DataResult(ReturnCodeDim.MOBILE_HAD_BOUND, "当前账户已经绑定手机号！","");
        }
        if(mobile == null || mobile.equals("")){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "手机号不能为空","");
        }else if(password == null || password.equals("")){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "密码不能为空","");
        }
        String md5Pwd = null;
        try {
            md5Pwd = CommonUtil.getMD5Str(password);
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
        }
        Object mobile_s=WebUtil.getSession(SessionAttr.MOBILE);
        Object verify_s=WebUtil.getSession(SessionAttr.VERIFY_CODE);

        if(verify_s==null || mobile_s==null || (!mobile_s.equals(mobile)) || (!verify_s.equals(verifyCode)))
        {
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "验证码不正确","");
        }
        // 使用过的验证码就作废
        WebUtil.setSession(SessionAttr.MOBILE, "");
        WebUtil.setSession(SessionAttr.VERIFY_CODE, "");
        Long current_time = CommonUtil.getCurrentTimestamp();
        //通过手机号获取用户
        Do_user userPC = mapper_user.getUserInfoByMobile(mobile);
        //判断该手机号是否注册
        if(userPC == null){
            userDo.setPassword(md5Pwd);
            userDo.setLast_login_ip(loginIp);
            userDo.setLast_login_time(current_time);
            if(CommonUtil.isMobile(mobile))
            {
                userDo.setMobile(mobile);
                mapper_user.updateUser(userDo);
                userPC = userDo;
            }else{
                return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "请输入合法的手机号","");
            }
        }else {
            /**
             * 手机号已经注册
             *      微信（QQ）账号User user_level 设置为  -1 （封禁用户）
             *      已有手机号账号 设置 qq_open_id （QQ） 或者  wx_union_id  （微信）
             */
            userPC.setPassword(md5Pwd);
            userPC.setLast_login_ip(loginIp);
            userPC.setLast_login_time(current_time);
            if(userDo.getWx_union_id().length() > 0){
                //微信用户
                userPC.setWx_union_id(userDo.getWx_union_id());
            }
            if(userDo.getQq_open_id().length()>0){
                //QQ用户
                userPC.setQq_open_id(userDo.getQq_open_id());
            }
            if(userDo.getWx_union_id().length() < 1 && userDo.getQq_open_id().length()<1){
                return new DataResult(ReturnCodeDim.SYSTEM_ERROR, "绑定失败","");
            }
            userDo.setUser_level(userDo.FORBIDDEN_USER);
            userDo.setNick_name(StringUtil.getUuId());
            mapper_user.updateUser(userPC);
            mapper_user.updateUser(userDo);
        }
        WebUtil.saveCurrentUser(userPC);
        Do_user_detail userDetail = mapper_user.getUserDetailById(userPC.getUser_id());
        WebUtil.setSession(SessionAttr.USER_DETAIL,userDetail);
        return new DataResult(ReturnCodeDim.SUCCESS, "绑定成功","");
    }

    public DataResult SubmitOpinion(Integer opinionType, String opinionMsg) {
        Do_user m_login_user = WebUtil.getCurrentUser();
        Do_user_opinion _do = new Do_user_opinion();
        _do.setUser_id(m_login_user.getUser_id());
        _do.setOpinion_type(opinionType);
        _do.setOpinion_msg(opinionMsg);
        mapper_user_opinion.insert(_do);
        return new DataResult(ReturnCodeDim.SUCCESS);
    }

    public DataResult checkRegister(String mobile) {
        if(!CommonUtil.isMobile(mobile)){
            return new DataResult(ReturnCodeDim.MOBILE_ILLEGAL,"");
        }
        Do_user userDo = mapper_user.getUserInfoByMobile(mobile);
        Map<String, Object> dataMap = new HashMap<>();
        // 判断手机号是否已经注册
        if(userDo != null){
            dataMap.put("mobile_exist", 1);
        }else{
            dataMap.put("mobile_exist", 0);
        }
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult ResetPassword(String mobile, String password, String verifyCode) {
        Do_user userDo = mapper_user.getUserInfoByMobile(mobile);
        if(userDo==null){
            logger.info("userDo nul");
        }
        if(!WebUtil.getSession(SessionAttr.MOBILE).equals(userDo.getMobile())){
            logger.info("mobile not same");
        }
        if(!WebUtil.getSession(SessionAttr.VERIFY_CODE).equals(verifyCode)) {
            logger.info("VERIFY_CODE not same"+WebUtil.getSession(SessionAttr.VERIFY_CODE));
        }
        if(userDo==null || !WebUtil.getSession(SessionAttr.MOBILE).equals(userDo.getMobile()) || !WebUtil.getSession(SessionAttr.VERIFY_CODE).equals(verifyCode) ) {
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "验证码不正确");
        }
        // 使用过的验证码就作废
        WebUtil.setSession(SessionAttr.MOBILE, "");
        WebUtil.setSession(SessionAttr.VERIFY_CODE, "");
        String md5Pwd = null;
        try {
            md5Pwd = CommonUtil.getMD5Str(password);
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR);
        }
        mapper_user.updatePassword(userDo.getUser_id(), md5Pwd);
        return new DataResult(ReturnCodeDim.SUCCESS);
    }

    public DataResult CheckVerifyCode(String mobile, String verifyCode) {
        if(!WebUtil.getSession(SessionAttr.MOBILE).equals(mobile.trim())){
            logger.info("mobile not same");
        }
        if(!WebUtil.getSession(SessionAttr.VERIFY_CODE).equals(verifyCode)) {
            logger.info("VERIFY_CODE not same"+WebUtil.getSession(SessionAttr.VERIFY_CODE));
        }
        if(!WebUtil.getSession(SessionAttr.MOBILE).equals(mobile.trim()) || !WebUtil.getSession(SessionAttr.VERIFY_CODE).equals(verifyCode) ) {
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "验证码不正确");
        }
        return new DataResult(ReturnCodeDim.SUCCESS);
    }

    public DataResult updateUser(String nick_name, String gender, String gaming_years, String tags_id) {
        if(!nick_name.matches("^[_\\-\\da-zA-Z\u4e00-\u9fa5]{1,20}$")){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "昵称必须是1-20位字符，支持汉字、字符、数字及\"-\"、\"_\"组合","");
        }
        Do_user userDo = WebUtil.getCurrentUser();
        if(mapper_user.checkUserInfoByNickname(nick_name, userDo.getUser_id())!=null){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "昵称【"+nick_name+"】已经被人用过了，请换一个","");
        }
        userDo.setUser_id(userDo.getUser_id());
        userDo.setNick_name(nick_name);
        mapper_user.updateNickName(userDo.getUser_id(), nick_name);
        Do_user_detail userDetail = mapper_user.getUserDetailById(userDo.getUser_id());
        if(userDetail == null){
            userDetail = new Do_user_detail();
        }
        userDetail.setUser_id(userDo.getUser_id());
        Optional<String> genderOpt = Optional.ofNullable(gender);
        Optional<String> gamingYearsOpt = Optional.ofNullable(gaming_years);
        Optional<String> tagsIdOpt = Optional.ofNullable(tags_id);
        if(genderOpt.isPresent()){
            userDetail.setGender(Integer.valueOf(genderOpt.get()));
        }
        if(genderOpt.isPresent()){
            userDetail.setGaming_years(Integer.valueOf(gamingYearsOpt.get()));
        }
        if(genderOpt.isPresent()){
            userDetail.setTags_id(tagsIdOpt.get());
        }
        mapper_user.insertUpdateUserDetail(userDetail);
        // 更新推荐游戏表
        if(!CommonUtil.IsEmpty(tags_id)){
            String[] tags=tags_id.split(",");
            Integer[] i_tags=new Integer[tags.length];
            int i=0;
            for(String tag:tags){
                i_tags[i++]=Integer.valueOf(tag);
            }
            gameRecommendService.getRecommendGamesByTags(userDo.getUser_id(), Arrays.asList(i_tags), 20);
        }
        WebUtil.saveCurrentUser(userDo);
        WebUtil.setSession(SessionAttr.USER_DETAIL,userDetail);
        return new DataResult(ReturnCodeDim.SUCCESS,"");
    }

    public DataResult DetailMobile() {
        Do_user userDo = WebUtil.getCurrentUser();
        if(userDo != null){
            Do_user_detail doUserDetail = mapper_user.getUserDetailById(userDo.getUser_id());
            Map<String,Object> result = new HashMap<>();
            String mobile = "";
            if(doUserDetail != null && doUserDetail.getMobile().trim().length() > 0){
                mobile =  doUserDetail.getMobile();
                result.put("mobile",mobile);
            }
            if(userDo != null){
                if(userDo.getMobile() != null && userDo.getMobile().trim().length()>0){
                    return new DataResult(ReturnCodeDim.MOBILE_HAD_BOUND,result);
                }else{
                    return new DataResult(ReturnCodeDim.SUCCESS, result);
                }
            }
        }
        return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
    }

    public DataResult ChangePassword(String oldPassword, String password) {
        try {
            oldPassword = CommonUtil.getMD5Str(oldPassword);
            password = CommonUtil.getMD5Str(password);
        } catch (Exception e) {
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
        }
        Do_user userDo = WebUtil.getCurrentUser();
        if(null == userDo ){
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
        }
        if(!userDo.getPassword().equalsIgnoreCase(oldPassword)){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "旧密码错误","");
        }else{
            mapper_user.updatePassword(userDo.getUser_id(), password);
            // 同时更新缓存里的密码信息
            userDo.setPassword(password);
            WebUtil.saveCurrentUser(userDo);
            return new DataResult(ReturnCodeDim.SUCCESS,"");
        }
    }

    public DataResult UserIdentity(String realName, String companyType, String companyName, String jobType, String projectNames, String email) {
        if(!CommonUtil.isEmail(email)){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"请填写正确的邮箱","");
        }
        Do_user m_login_user = WebUtil.getCurrentUser();
        Do_user_detail userDetail = mapper_user.getUserDetailById(m_login_user.getUser_id());
        if(userDetail == null){
            userDetail = new Do_user_detail();
        }else{
            if(userDetail.getStatus() == Do_user_detail.IN_VERIFY){
                return new DataResult(ReturnCodeDim.ILLEAGAL_ACTION,"正在审核中，请勿重复提交","");
            }else if(userDetail.getStatus() == Do_user_detail.VERIFY_SUCCESS){
                return new DataResult(ReturnCodeDim.ILLEAGAL_ACTION,"已成功认证，请勿重复提交","");
            }
        }
        userDetail.setUser_id(m_login_user.getUser_id());
        userDetail.setReal_name(realName);
        userDetail.setCompany_type(Integer.valueOf(companyType));
        userDetail.setCompany_name(companyName);
        userDetail.setJob_type(Integer.valueOf(jobType));
        userDetail.setProject_names(projectNames);
        userDetail.setStatus(Do_user_detail.IN_VERIFY); // 待审核
        userDetail.setEmail(email);
        mapper_user.insertUpdateUserDetail(userDetail);
        WebUtil.setSession(SessionAttr.USER_DETAIL,userDetail);
        return new DataResult(ReturnCodeDim.SUCCESS);
    }

    public DataResult thirdpartyBind(String type) {
        if("qq".equals(type)){
            Object openidObj = WebUtil.getSession("qq_open_id");
            WebUtil.setSession("qq_open_id","");
            if(null != openidObj){
                String openid = openidObj.toString();
                Optional<Do_user> userQQOpt = Optional.ofNullable(mapper_user.getUserInfoByQQ(openid));
                if(userQQOpt.isPresent()){
                    Do_user userQQ = userQQOpt.get();
                    if(null != userQQ.getMobile()){
                        userQQ.setQq_open_id("");
                        mapper_user.updateUser(userQQ);
                        Do_user userInfo = WebUtil.getCurrentUser();
                        userInfo.setQq_open_id(openid);
                        mapper_user.updateUser(userInfo);
                        return new DataResult(ReturnCodeDim.SUCCESS);
                    }
                }
            }
        }else if("wx".equals(type)){
            Object unionidObj = WebUtil.getSession("wx_union_id");
            if(null != unionidObj){
                String unionid = unionidObj.toString();
                Optional<Do_user> userWXOpt = Optional.ofNullable(mapper_user.getUserInfoByWX(unionid));
                if(userWXOpt.isPresent()){
                    Do_user userWX = userWXOpt.get();
                    if(null != userWX.getMobile()){
                        userWX.setWx_union_id("");
                        mapper_user.updateUser(userWX);
                        Do_user userInfo = WebUtil.getCurrentUser();
                        userInfo.setWx_union_id(unionid);
                        mapper_user.updateUser(userInfo);
                        return new DataResult(ReturnCodeDim.SUCCESS);
                    }
                }
            }
        }
        return new DataResult(ReturnCodeDim.SYSTEM_ERROR);
    }
}
