package cn.thinkingdata.web.service.core.user.custom;

import cn.thinkingdata.web.constant.PingxxConstant;
import cn.thinkingdata.web.domain.appstore.Do_gas_apps_history_ratings;
import cn.thinkingdata.web.domain.order.*;
import cn.thinkingdata.web.domain.project.forum.Do_proj_forum_common_stat;
import cn.thinkingdata.web.domain.project.lt.Do_proj_lt_common_stat;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.domain.user.Do_user_project_collection;
import cn.thinkingdata.web.domain.user.custom.Do_user_custom_keywords;
import cn.thinkingdata.web.domain.user.custom.Do_user_custom_service;
import cn.thinkingdata.web.domain.user.custom.inner.game.Do_game_common_stat_day;
import cn.thinkingdata.web.domain.user.custom.inner.game.Do_game_retention_stat;
import cn.thinkingdata.web.domain.user.evo.Do_user_evo_forum;
import cn.thinkingdata.web.domain.user.evo.Do_user_evo_proj;
import cn.thinkingdata.web.domain.user.evo.Do_user_evo_words;
import cn.thinkingdata.web.persistence.appstore.Mapper_gas_apps_history_ratings;
import cn.thinkingdata.web.persistence.order.Mapper_coupon;
import cn.thinkingdata.web.persistence.order.Mapper_item_unit;
import cn.thinkingdata.web.persistence.order.Mapper_user_order;
import cn.thinkingdata.web.persistence.project.forum.Mapper_proj_forum_common_stat;
import cn.thinkingdata.web.persistence.project.lt.Mapper_proj_lt_common_stat;
import cn.thinkingdata.web.persistence.user.Mapper_user_evo_forum;
import cn.thinkingdata.web.persistence.user.Mapper_user_evo_proj;
import cn.thinkingdata.web.persistence.user.Mapper_user_evo_words;
import cn.thinkingdata.web.persistence.user.Mapper_user_project_collection;
import cn.thinkingdata.web.persistence.user.custom.Mapper_user_custom_keywords;
import cn.thinkingdata.web.persistence.user.custom.Mapper_user_custom_service;
import cn.thinkingdata.web.persistence.user.custom.inner.Mapper_game;
import cn.thinkingdata.web.persistence.user.custom.inner.Mapper_user_game;
import cn.thinkingdata.web.persistence.user.custom.inner.operation.Mapper_game_common_stat_day;
import cn.thinkingdata.web.persistence.user.custom.inner.operation.Mapper_game_retention_stat;
import cn.thinkingdata.web.service.cache.ProjectInfoCacheService;
import cn.thinkingdata.web.service.core.user.order.CouponService;
import cn.thinkingdata.web.service.core.user.order.OrderService;
import cn.thinkingdata.web.util.*;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.pingplusplus.model.Charge;
import com.pingplusplus.model.Event;
import com.pingplusplus.model.PingppObject;
import com.pingplusplus.model.Webhooks;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.security.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Xiaowu on 2016/8/11.
 */
@Service
public class CustomServiceService {

    @Autowired
    private Mapper_user_custom_service mapper_user_custom_service;

    @Autowired
    private Mapper_user_order mapper_user_order;

    @Autowired
    private Mapper_user_custom_keywords m_mapper_user_custom_keywords;

    @Autowired
    private Mapper_item_unit mapper_item_unit;

    @Autowired
    private Mapper_user_evo_forum mapper_user_evo_forum;

    @Autowired
    private Mapper_user_evo_words mapper_user_evo_words;

    @Autowired
    private Mapper_user_evo_proj mapper_user_evo_proj;

    @Autowired
    private Mapper_user_project_collection mapper_user_project_collection;

    @Autowired
    private Mapper_coupon mapper_coupon;

    @Autowired
    private ProjectInfoCacheService projectInfoCacheService;

    @Autowired
    private CouponService couponService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private Mapper_user_game mapper_user_game;

    @Autowired
    private Mapper_proj_lt_common_stat mapper_proj_lt_common_stat;

    @Autowired
    private Mapper_proj_forum_common_stat mapper_proj_forum_common_stat;

    @Autowired
    private Mapper_gas_apps_history_ratings mapper_gas_apps_history_ratings;

    @Autowired
    private Mapper_game_common_stat_day mapperGameCommonStatDay;
    @Autowired
    private Mapper_game_retention_stat mapperGameRetentionStat;


    @Autowired
    private Mapper_game mapperGame;

    private static final Logger logger = LogManager.getLogger();
    private static final int SERVICE_TYPE = 1;
    private static final int SERVICE_TYPE_OPINION = 2;
    private static final int SERVICE_TYPE_WORD = 4;
    private static final int SERVICE_TYPE_ITWARN = 5;
    private static final int SERVICE_TYPE_OUTFLOW = 6;

    private static final int COLLECTION_NUM_LIMIT = 20;

    private static final int TRAIL_DAYS = 180;
    private static final int TRAIL_TIMES = 10;
    private static final int TRAIL_PROJECT = 134;

    public DataResult findService(Integer index, Integer limit) {
        Integer userId = WebUtil.getCurrentUser().getUser_id();
        List<Do_user_custom_service> _list=mapper_user_custom_service.getByUserId(userId,index,limit);
        int total = mapper_user_custom_service.getTotalByUserId(userId);
        List<Map<String,Object>> result = new ArrayList<>();
        for(int i = 0; i < _list.size(); i++){
            Do_user_custom_service customService = _list.get(i);
            if(customService.getService_type() !=3 && customService.getRemaining_days() <= 0){
                customService.setService_status(3);
            }else if(customService.getService_type() == 3 && customService.getRemain_times() <= 0){
                customService.setService_status(5);
            }
            Map temp = new HashMap();
            temp.put("service_type",customService.getService_type());
            temp.put("try_tag",customService.getTry_tag());
            temp.put("service_status",customService.getService_status());
            temp.put("final_date",customService.getFinal_date());
            temp.put("remain_times",customService.getRemain_times());
            temp.put("project_id",customService.getProject_id());
            temp.put("remaining_days",customService.getRemaining_days());
            temp.put("use_format",customService.getUse_format());
            result.add(temp);
        }
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("get", result);
        dataMap.put("total", total);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

//    public DataResult checkCustomService(Integer projectId,Integer serviceType){
//        Do_user userDo = WebUtil.getCurrentUser();
//        Do_user_custom_service userCustomService = mapper_user_custom_service.getCustomServiceByUserAndTypeAndProject(userDo.getUser_id(), serviceType,projectId,0);
//        if(userCustomService == null){
//            return new DataResult(ReturnCodeDim.CUSTOM_SERVICE_NOT_OPEN,"");
//        }else {
//            if(serviceType == SERVICE_TYPE_ITWARN || serviceType == SERVICE_TYPE_OUTFLOW){
//                Date finalDate = DateUtil.parseDateString(userCustomService.getFinal_date());
//                if(finalDate.before(new Date())){
//                    userCustomService.setService_status(3);
//                    mapper_user_custom_service.updateCustomService(userCustomService);
//                    return new DataResult(ReturnCodeDim.CUSTOM_SERVICE_EXPIRED,"");
//                }
//            }
//            if(serviceType == SERVICE_TYPE_OPINION || serviceType == SERVICE_TYPE || serviceType == SERVICE_TYPE_WORD){
//                if(userCustomService.getRemaining_days() <= 0){
//                    userCustomService.setService_status(3);
//                    mapper_user_custom_service.updateCustomService(userCustomService);
//                    return new DataResult(ReturnCodeDim.CUSTOM_SERVICE_EXPIRED,"");
//                }
//            }
//        }
//        return null;
//    }

    public DataResult GetUserOrder(Integer index, Integer limit) {
        Integer userId = WebUtil.getCurrentUser().getUser_id();
        List list = mapper_user_order.getOrderByUserId(userId,index,limit);
        int totalNum = mapper_user_order.getUserOrderCount(userId);
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("total_num", totalNum);
        dataMap.put("order_list", list);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult GetUserCoupon(Integer itemId) {
        return couponService.findCouponByUserId(WebUtil.getCurrentUser().getUser_id(),itemId);
    }

    public DataResult CreateUserOrder(Integer orderType, String couponId, Integer itemUnitId, String projectList) {
        Long userId = WebUtil.getCurrentUser().getUser_id().longValue();
        String orderId = StringUtil.genOrderId(userId);
        return orderService.operateUserorder(itemUnitId, projectList, couponId, userId, orderId, orderType);

    }

    public DataResult AddCustomKeywords(Integer projectId, String customKeywords) {
//        DataResult dataResult = checkCustomService(0,SERVICE_TYPE_WORD);
//        if(dataResult != null){
//            return dataResult;
//        }
        Do_user userDo = WebUtil.getCurrentUser();
        if(!projectInfoCacheService.checkProjectId(projectId)){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,""); // 前端伪造的数据
        }
        Do_user_custom_keywords _do = new Do_user_custom_keywords();
        _do.setUser_id(userDo.getUser_id());
        _do.setProject_id(projectId);
        if(customKeywords.length() >= 500){
            return new DataResult(ReturnCodeDim.ILLEAGAL_ACTION,"");
        }
        String keywords[] = customKeywords.split(" ");
        if(keywords.length > 5 || keywords.length < 1){
            return new DataResult(ReturnCodeDim.ILLEAGAL_ACTION,"");
        }
        for(String keyword : keywords){
            if(keyword.length() > 6){
                return new DataResult(ReturnCodeDim.ILLEAGAL_ACTION,"请输入不多于6个字的热词","");
            }
        }
        _do.setCustom_keywords(customKeywords);
        m_mapper_user_custom_keywords.insertTry(_do);
        return new DataResult(ReturnCodeDim.SUCCESS,"");
    }

    public DataResult GetUserOrder(String orderId) {
        Do_user userDo = WebUtil.getCurrentUser();
        Map map = mapper_user_order.getOrderDescByOrderId(orderId);
        Integer orderUserId = Integer.valueOf(map.get("user_id").toString());
        if(!orderUserId.equals(userDo.getUser_id())){
            return new DataResult(ReturnCodeDim.ORDER_ABNORMAL,"");
        }
        return new DataResult(ReturnCodeDim.SUCCESS,map);
    }

    public DataResult CancelUserOrder(String orderId) {
        long user_id = WebUtil.getCurrentUser().getUser_id().longValue();
        Integer result = orderService.cancelOrder(user_id,orderId);
        if(result != 1){
            return new DataResult(result);
        }else {
            return new DataResult(ReturnCodeDim.SUCCESS);
        }
    }

    public DataResult CreateCharge(String payChannel, String orderId,String loginIp) {
        if(!payChannel.equals("alipay_qr") && !payChannel.equals("wx_pub_qr")){
            return new DataResult(ReturnCodeDim.UNSUPPORTED_PAY_CHANNEL,"");
        }
        Do_user_order userOrder = mapper_user_order.getOrderByOrderId(orderId);
        if(userOrder == null){
            return new DataResult(ReturnCodeDim.ORDER_NONEXIST,"");
        }
        if(userOrder.getStatus() != Do_user_order.TO_PAY){
            if(userOrder.getStatus() == Do_user_order.FINISHED){
                return new DataResult(ReturnCodeDim.ORDER_HAS_PAID,"");
            }else if(userOrder.getStatus() == Do_user_order.CANCELED){
                return new DataResult(ReturnCodeDim.ORDER_HAS_CANCELED,"");
            }else{
                return new DataResult(ReturnCodeDim.ILLEAGAL_ACTION,"订单状态异常，请联系客服","");
            }
        }
        Long userId = WebUtil.getCurrentUser().getUser_id().longValue();
        if(!userOrder.getUser_id().equals(userId)){
            return new DataResult(ReturnCodeDim.ORDER_ABNORMAL,"");
        }
        Do_item_unit itemUnit = mapper_item_unit.getItemUnitByItemUnitId(userOrder.getItem_unit_id().intValue());
        String chargeNo = StringUtil.genOrderId(userId);
        Map<String, Object> chargeParams = new HashMap<String, Object>();
        chargeParams.put("order_no",  chargeNo);
        chargeParams.put("amount", userOrder.getPay_price());
        Map<String, String> app = new HashMap<String, String>();
        app.put("id", PingxxConstant.APP_ID);
        chargeParams.put("app",app);
        chargeParams.put("channel",payChannel);
        chargeParams.put("currency","cny");
        chargeParams.put("client_ip",loginIp);
        String subjectName = itemUnit.getItem_name() + "(" + itemUnit.getUnit_name()+ ")";
        chargeParams.put("subject",subjectName);
        chargeParams.put("body",subjectName);
        if(payChannel.equals("wx_pub_qr")){
            Map<String, String> productIdMap = new HashMap<>();
            productIdMap.put("product_id", orderId);
            chargeParams.put("extra", productIdMap);
        }
        mapper_user_order.updateOrderChargeInfo(userOrder.getOrder_id(), payChannel,chargeNo);
        try{
            PingxxConstant.init();
            Charge c= Charge.create(chargeParams);
            return new DataResult(ReturnCodeDim.SUCCESS, "", c.toString());
        }catch(Exception e){
            logger.warn(e.getMessage());
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN, e.getMessage());
        }
    }

    public DataResult QueryQRStatus(String order_id) {
        Map do_user_order = mapper_user_order.getOrderDescByOrderId(order_id);
        int status = (int) do_user_order.get("status");
        Map<String, Object> dataMap = new LinkedHashMap<>();
        dataMap.put("status", status);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult AddProjectDataSource(Integer projectId, String name0, String url0, String name1, String url1) {

        Do_user_evo_forum _do=new Do_user_evo_forum();
        Do_user userDo = WebUtil.getCurrentUser();
        if(!CommonUtil.IsEmpty(url0)){
            _do.setProject_id(projectId);
            _do.setUser_id(userDo.getUser_id());
            if(CommonUtil.IsEmpty(name0)){
                name0 = "" ;
            }
            _do.setForum_name(name0);
            _do.setForum_url(url0);
            _do.setStatus(0);
            mapper_user_evo_forum.add(_do);
        }
        if(!CommonUtil.IsEmpty(url1)){
            _do.setProject_id(projectId);
            _do.setUser_id(userDo.getUser_id());
            if(CommonUtil.IsEmpty(name1)){
                name1 = "" ;
            }
            _do.setForum_name(name1);
            _do.setForum_url(url1);
            _do.setStatus(0);
            mapper_user_evo_forum.add(_do);
        }
        return new DataResult(ReturnCodeDim.SUCCESS);
    }

    public DataResult AddGasWordsClassifys(Integer projectId, String classify_name, String words) {
        ArrayList<Do_user_evo_words> _ar= new ArrayList<Do_user_evo_words>();
        String[] arr=words.split(" ");
        arr=array_unique(arr);
        Do_user userDo = WebUtil.getCurrentUser();
        for(String s:arr){
            if(!CommonUtil.IsEmpty(s)){
                Do_user_evo_words _do2=new Do_user_evo_words();
                _do2.setUser_id(userDo.getUser_id());
                _do2.setWord(s);
                _do2.setProject_id(projectId);
                _do2.setClassify_name(classify_name);
                _ar.add(_do2);
            }
        }
        addManyKeywords(_ar);
        return new DataResult(ReturnCodeDim.SUCCESS);
    }

    private String[] array_unique(String[] a){
        HashSet<String> set = new HashSet<String>();
        set.addAll(Arrays.asList(a));
        return set.toArray(new String[0]);
    }

    private int addManyKeywords(ArrayList<Do_user_evo_words> _list){
        int effected_row_num=0;
        while(effected_row_num<_list.size()){
            ArrayList<Do_user_evo_words> _tmp=new ArrayList<Do_user_evo_words>();
            int i=0;
            // 一次批量添加1000条
            for(i=0; i+effected_row_num<_list.size() && i<1000; ++i){
                _tmp.add(_list.get(i));
            }
            mapper_user_evo_words.add(_tmp);
            effected_row_num+=i;
        }
        return effected_row_num;
    }

    public DataResult AddUserFollowProject(String projectName, Integer projectType, String projectDesc, String forumName1, String forumUrl1, String forumName2, String forumUrl2) {
        Do_user_evo_proj _do=new Do_user_evo_proj();
        Do_user m_login_user = WebUtil.getCurrentUser();
        _do.setProject_id(0);
        _do.setUser_id(m_login_user.getUser_id());
        _do.setProject_name(projectName);
        _do.setProject_type(projectType);
        _do.setProject_desc(projectDesc);
        if(forumName1 != null){
            _do.setForum_name1(forumName1);
        }
        if(forumUrl1 != null){
            _do.setForum_url1(forumUrl1);
        }
        if(forumName2 != null){
            _do.setForum_name2(forumName2);
        }
        if(forumUrl2 != null){
            _do.setForum_url2(forumUrl2);
        }
        mapper_user_evo_proj.add(_do);
        return new DataResult(ReturnCodeDim.SUCCESS);
    }

    public DataResult UserProjectCollect(Integer projectId, String actionName) {
        Do_user userDo = WebUtil.getCurrentUser();
        Long userId = userDo.getUser_id().longValue();
        DataResult dataResult = null;
        if(userDo.getNick_name().equals("demo")){
            dataResult = new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN);
        }else if(actionName.equals("collect")){
            dataResult = collectProject(userId, projectId);
        }else if(actionName.equals("uncollect")){
            mapper_user_project_collection.unCollectProject(userId, projectId);
            dataResult = getCollections(userId);
        }else if(actionName.equals("get_collections")){
            dataResult = getCollections(userId);
        }
        return dataResult;
    }

    private DataResult collectProject(long userId,Integer projectId){
        String projectName = projectInfoCacheService.getProjectName(projectId.toString());
        if(projectName.equals("")){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN);
        }
        int collectedNum = mapper_user_project_collection.getUserCollectionNum(userId);
        if(collectedNum > COLLECTION_NUM_LIMIT){
            return new DataResult(ReturnCodeDim.COLLECTION_NUM_OVERHEAD);
        }else{
            mapper_user_project_collection.collectProject(userId, projectId);
            return getCollections(userId);
        }
    }

    private DataResult getCollections(long userId){
        List<Do_user_project_collection> collectionList = mapper_user_project_collection.getUserCollectionList(userId,0,10);
        List<Integer> collectionProjList = new ArrayList<>();
        for(Do_user_project_collection projCollection : collectionList){
            Integer projectId = projCollection.getProject_id();
            collectionProjList.add(projectId);
        }
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("collection_list", collectionProjList);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult PrintInvoice(Do_invoice invoiceDo) {
        Do_user user = WebUtil.getCurrentUser();
        invoiceDo.setUser_id(user.getUser_id().longValue());
        invoiceDo.setStatus(Do_invoice.TO_CHECK);
        return orderService.printInvoice(invoiceDo, invoiceDo.getOrder_id(), user.getUser_id().longValue());
    }

    public DataResult ShowInvoice(String order_id) {
        Map<String, Object> dataMap = new HashMap<>();
        Do_invoice do_invoice = orderService.getInvoiceByOrder(order_id);
        if(do_invoice != null){
            dataMap.put("title", do_invoice.getTitle());
            dataMap.put("name", do_invoice.getName());
            dataMap.put("content", do_invoice.getContent());
            dataMap.put("phone", do_invoice.getPhone());
            dataMap.put("address", do_invoice.getAddress());
            dataMap.put("postcode", do_invoice.getPostcode());
            dataMap.put("status", do_invoice.getStatus());
            DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            dataMap.put("create_time", format.format(do_invoice.getCreate_time()));
            return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
        }else {
            return new DataResult(ReturnCodeDim.INVOICE_NONEXIST,"");
        }
    }

    public DataResult WebhooksChargeSuccess(String eventBody, String sign, PublicKey pubkey) throws UnsupportedEncodingException, NoSuchAlgorithmException, InvalidKeyException, SignatureException {
        logger.info(eventBody);
        // 解析异步通知数据
        Event event = Webhooks.eventParse(eventBody);
        boolean isVerifySuccess = verifyData(eventBody, sign, pubkey);
        if(!isVerifySuccess){
            logger.warn("pingxx verify failed!!");
            return new DataResult(ReturnCodeDim.ILLEAGAL_ACTION, "verify hooker failed","");
        }
        String type = event.getType();
        if(!type.equals("charge.succeeded")){
            logger.warn("not charge succeeded notify!");
            return new DataResult(ReturnCodeDim.ILLEAGAL_ACTION, "not charge succeeded notify!","");
        }
        Map<String, Object> dataMap = PingppObject.PRETTY_PRINT_GSON.fromJson(event.getData().getObject().toString(),Map.class);
        boolean isPaid = (boolean) dataMap.get("paid");
        String chargeNo =  (String) dataMap.get("order_no");
        Date payTime = new Date((((Double)dataMap.get("time_paid")).longValue() * 1000));
        String transactionNo = (String) dataMap.get("transaction_no");
        if(!isPaid){
            logger.warn("not paid!");
            return new DataResult(ReturnCodeDim.ILLEAGAL_ACTION, "not paid!","");
        }
        Do_user_order userOrder = mapper_user_order.getOrderByChargeNo(chargeNo);
        if(userOrder == null){
            logger.warn("nonexistent order");
            return new DataResult(ReturnCodeDim.ILLEAGAL_ACTION, "nonexistent order","");
        }else if(userOrder.getStatus() != Do_user_order.TO_PAY){
            logger.warn("order in unnormal status: " + userOrder.getStatus());
            return new DataResult(ReturnCodeDim.ILLEAGAL_ACTION, "order in unnormal status: " + userOrder.getStatus(),"");
        }
        operatePaidFlow(userOrder,payTime, transactionNo);
        return new DataResult(ReturnCodeDim.SUCCESS,"");
    }

    @Transactional
    private void operatePaidFlow(Do_user_order userOrder,Date payTime,String transactionNo){
        String todayDateStr = DateUtil.getPartitionString(new Date());
        userOrder.setPay_time(payTime);
        userOrder.setStatus(Do_user_order.FINISHED);
        userOrder.setTransaction_no(transactionNo);
        mapper_user_order.orderPaySuccess(userOrder);
        String couponId = userOrder.getCoupon_id();
        if(couponId.length() > 0){
            mapper_coupon.couponUsed(couponId);
        }
        Do_item_unit itemUnit = mapper_item_unit.getItemUnitByItemUnitId(userOrder.getItem_unit_id().intValue());
        List<Integer> projectList = new ArrayList<>();
        if(itemUnit.getGame_scope().intValue() == Do_item.ALL_GAME){
            projectList.add(0);
        }else if(itemUnit.getGame_scope().intValue() == Do_item.ONE_GAME){
            String projectIDStrs[] = userOrder.getProject_list().split(",");
            for(String projectIDStr : projectIDStrs){
                int projectId = Integer.parseInt(projectIDStr);
                projectList.add(projectId);
            }
        }
        for(Integer projectId : projectList){
            String serviceTypeStrs[] = itemUnit.getService_list().split(",");
            for(String serviceTypeStr : serviceTypeStrs){
                int serviceType = Integer.parseInt(serviceTypeStr);
                Do_user_custom_service userCustService = mapper_user_custom_service.getCustomServiceByUserAndTypeAndProject(userOrder.getUser_id().intValue(), serviceType,projectId,0);
                if(userCustService == null){
                    userCustService = new Do_user_custom_service();
                    userCustService.setFinal_date(todayDateStr);
                    userCustService.setProject_id(projectId);
                    userCustService.setReport_id(0);
                    userCustService.setRemain_times(0);
                    userCustService.setRemaining_days(0);
                    userCustService.setService_status(Do_user_custom_service.BUY_EXPIRED);
                    userCustService.setService_type(serviceType);
                    userCustService.setTry_tag(0);
                    userCustService.setUser_id(userOrder.getUser_id().intValue());
                }
                if(itemUnit.getItem_unit() == Do_item_unit.MONTH_UNIT){
                    String realFinalDate = todayDateStr;
                    if(userCustService.getFinal_date().compareTo(todayDateStr) >= 0){
                        realFinalDate = userCustService.getFinal_date();
                    }
                    String afterBuyFinalDate = DateUtil.getOffsetMonthPartitionString(realFinalDate, itemUnit.getUnit_num());
                    userCustService.setFinal_date(afterBuyFinalDate);
                    userCustService.setService_status(Do_user_custom_service.IN_BUY);
                }else if(itemUnit.getItem_unit() == Do_item_unit.TIMES_UNIT){
                    int remainTimes = 0;
                    if(userCustService.getRemain_times() > 0){
                        remainTimes = userCustService.getRemain_times();
                    }
                    int afterBuyRemainTimes = remainTimes + itemUnit.getUnit_num();
                    userCustService.setRemain_times(afterBuyRemainTimes);
                    userCustService.setService_status(Do_user_custom_service.IN_BUY);
                }else if(itemUnit.getItem_unit() == Do_item_unit.ONCE_UNIT){
                    if(serviceType == Do_user_custom_service.GAME_REPORT){
                        userCustService.setReport_id(itemUnit.getItem_id());
                        userCustService.setService_status(Do_user_custom_service.IN_BUY);
                    }
                }
                logger.info("after pay custom service: " + userCustService);
                mapper_user_custom_service.insertUpdateCustomService(userCustService);
            }
        }

    }

    private boolean verifyData(String dataString, String signatureString, PublicKey publicKey) throws NoSuchAlgorithmException, InvalidKeyException, SignatureException, UnsupportedEncodingException {
        byte[] signatureBytes = org.apache.commons.codec.binary.Base64.decodeBase64(signatureString);
        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initVerify(publicKey);
        signature.update(dataString.getBytes("UTF-8"));
        return signature.verify(signatureBytes);
    }

    public DataResult CheckCoupon(String couponId, String itemId) {
        Integer userId = WebUtil.getCurrentUser().getUser_id();
        return orderService.checkAndBindCoupon(userId, couponId,itemId);
    }

    public DataResult ApplyTryForFree(String userAgent) {
        if(false){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"暂不支持免费试用","");
        }
        Do_user m_login_user = WebUtil.getCurrentUser();
        List userCustServiceList = mapper_user_custom_service.getCustomService(m_login_user.getUser_id());
        if(userCustServiceList != null && userCustServiceList.size() > 0){
            String errorMsg = "您已经开通过后台服务，无法申请试用";
            if(userAgent.contains("Mobile")){
                errorMsg = "您已经开通过定制服务，无法再次申请，请用PC登录网站->我的服务界面进行使用";
            }
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,errorMsg,"");
        }
        openTrialService(m_login_user.getUser_id(), Do_user_custom_service.CHAT_ANALYSIS, 0, TRAIL_TIMES, 0, 0);
        openTrialService(m_login_user.getUser_id(), Do_user_custom_service.EMERGENT_MONITOR, TRAIL_DAYS, 0, TRAIL_PROJECT, 0);
        openTrialService(m_login_user.getUser_id(), Do_user_custom_service.HOTWORD_CUSTOM, TRAIL_DAYS, 0, 0, 0);
        openTrialService(m_login_user.getUser_id(), Do_user_custom_service.KEYWORD_MONITOR, TRAIL_DAYS, 0, 0, 0);
        openTrialService(m_login_user.getUser_id(), Do_user_custom_service.LOST_ANALYSIS, TRAIL_DAYS, 0, TRAIL_PROJECT, 0);
        openTrialService(m_login_user.getUser_id(), Do_user_custom_service.USER_PORTRAYAL, TRAIL_DAYS, 0, 0, 0);

        return new DataResult(ReturnCodeDim.SUCCESS);
    }

    private void openTrialService(int userId,int serviceType,int trailDays,int trailTimes,int projectId,int reportId){
        Do_user_custom_service userCustService = new Do_user_custom_service();
        userCustService.setUser_id(userId);
        userCustService.setFinal_date(getFinalDate(trailDays));
        userCustService.setService_status(Do_user_custom_service.IN_TRY);
        userCustService.setService_type(serviceType);
        userCustService.setProject_id(projectId);
        userCustService.setRemain_times(trailTimes);
        userCustService.setReport_id(reportId);
        mapper_user_custom_service.insertUpdateCustomService(userCustService);
    }

    private String getFinalDate(int trailDays){
        return  DateUtil.getOffsetDatePartitionString(new Date(), trailDays);
    }

    public DataResult GetUserProject() {
        Do_user user = WebUtil.getCurrentUser();
        List<Map> dataMap = mapper_user_game.findGameByUserWithoutDemo(new ArrayList<>(user.getInnerGameSet()));
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult GetUserProjectDetail() {
        Map<String,Object> resultMap = new HashMap<>();
        Do_user doUser = WebUtil.getCurrentUser();

        //舆情指标
        String dataDate = DateUtil.getPartitionString(DateUtil.getOffsetDate(new Date(),-35));
        List<Map> userGameList = mapper_user_game.findGameByUserWithoutDemo(new ArrayList<>(doUser.getInnerGameSet()));
        List<Map> dataList = new ArrayList<>();
        if(userGameList.size() < 1){
            userGameList = mapper_user_game.findGameByUser(new ArrayList<>(doUser.getInnerGameSet()));
        }

        for(Map map :userGameList){
            Map<String,Object> game = new HashMap<>();
            Integer gameId = 0;
            if(null != map.get("game_id")){
                gameId = Integer.valueOf(map.get("game_id").toString());
            }
            Integer projectId = (Integer) map.get("project_id");
            game.put("game_id",gameId);
            game.put("project_id",projectId);
            game.put("game_name",map.get("game_name"));

            List<Do_proj_lt_common_stat> projLtCommonStats = mapper_proj_lt_common_stat.getLtCommonStatListData(projectId, dataDate);
            List<Do_proj_forum_common_stat> projForumCommonStats = mapper_proj_forum_common_stat.getForumCommonStatListByDate(projectId, dataDate);
            List<Do_gas_apps_history_ratings> appsHistoryRatingses = mapper_gas_apps_history_ratings.getProjectAppstoreRatingListByDate(projectId, dataDate);
            Map<String, Object> dataMap = new LinkedHashMap<>();
            if(projForumCommonStats.size() > 1 && projLtCommonStats.size() > 1) {
                dataMap.put("data_date",projForumCommonStats.get(0).getData_date());
                dataMap.put("positive_num", projLtCommonStats.get(0).getPositive_num());
                dataMap.put("positive_span", projLtCommonStats.get(0).getPositive_num() - projLtCommonStats.get(1).getPositive_num());
                dataMap.put("negative_num", projLtCommonStats.get(0).getNegative_num());
                dataMap.put("negative_span", projLtCommonStats.get(0).getNegative_num() - projLtCommonStats.get(1).getNegative_num());
                dataMap.put("title_num", projForumCommonStats.get(0).getTitle_num());
                dataMap.put("title_span", projForumCommonStats.get(0).getTitle_num() - projForumCommonStats.get(1).getTitle_num());
                dataMap.put("hotword_num", projForumCommonStats.get(0).getHotword_num());
                dataMap.put("hotword_span", projForumCommonStats.get(0).getHotword_num() - projForumCommonStats.get(1).getHotword_num());
                dataMap.put("topic_num", projForumCommonStats.get(0).getTopic_num());
                dataMap.put("topic_span", projForumCommonStats.get(0).getTopic_num() - projForumCommonStats.get(1).getTopic_num());
                if(appsHistoryRatingses.size()>1){
                    dataMap.put("apps_num", appsHistoryRatingses.get(0).getRank());
                    dataMap.put("apps_span", appsHistoryRatingses.get(0).getRank() - appsHistoryRatingses.get(1).getRank());
                }
            }
            game.put("lt",dataMap);
            List<Do_game_common_stat_day> gameCommonStatDays = mapperGameCommonStatDay.getGameCommonStatDayListByGameId(gameId,dataDate);
            List<Do_game_retention_stat> gameRetentionStats = mapperGameRetentionStat.getGameRetentionStatListByGameId(gameId,dataDate);
            Map<String,Object> baseData = new HashMap<>();
            if(gameCommonStatDays.size()>1&& gameRetentionStats.size() > 1) {
                baseData.put("data_date", DateUtil.getPartitionString(gameCommonStatDays.get(0).getData_date()));
                baseData.put("newlogin_num", gameCommonStatDays.get(0).getNewlogin_num());
                baseData.put("newlogin_num_span", gameCommonStatDays.get(0).getNewlogin_num()-gameCommonStatDays.get(1).getNewlogin_num());
                baseData.put("login_num", gameCommonStatDays.get(0).getLogin_num());
                baseData.put("login_num_span", gameCommonStatDays.get(0).getLogin_num()-gameCommonStatDays.get(1).getLogin_num());
                baseData.put("pay_num", gameCommonStatDays.get(0).getPay_num());

                baseData.put("pay_num_span", gameCommonStatDays.get(0).getPay_num()-gameCommonStatDays.get(1).getPay_num());
                baseData.put("pay_amount", gameCommonStatDays.get(0).getPay_amount());
                Float pay_amount_span = gameCommonStatDays.get(0).getPay_amount()-gameCommonStatDays.get(1).getPay_amount();
                BigDecimal bigDecimal = new BigDecimal((double)pay_amount_span);
                baseData.put("pay_amount_span", bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue());
                baseData.put("arpu", gameCommonStatDays.get(0).getArpu());
                Float arpu_span = gameCommonStatDays.get(0).getArpu()-gameCommonStatDays.get(1).getArpu();
                bigDecimal = new BigDecimal((double)arpu_span);
                baseData.put("arpu_span", bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue());
                baseData.put("retention_rate", gameRetentionStats.get(0).getRetention_rate_1d());
                Float retention_rate_span = gameRetentionStats.get(0).getRetention_rate_1d()-gameRetentionStats.get(1).getRetention_rate_1d();
                bigDecimal = new BigDecimal((double)retention_rate_span);
                baseData.put("retention_rate_span", bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue());
            }
            game.put("inner",baseData);
            dataList.add(game);
        }
        resultMap.put("data",dataList);
        //运营指标
        return new DataResult(ReturnCodeDim.SUCCESS,resultMap);
    }

    public void DownloadExcel(String data, OutputStream outputStream) {
        JSONObject jsonData = JSON.parseObject(data);
        JSONArray columName = jsonData.getJSONArray("tb_head");
        JSONArray columData = jsonData.getJSONArray("tb_body");
        try {
            Object[] titles = columName.toArray();
            List<Object[]> rowList = new ArrayList<>();
            for (Object object : columData) {
                JSONArray jsonArray = (JSONArray) object;
                List valueList = new ArrayList();
                for (Object key : jsonArray){
                    String value = key.toString();
                    valueList.add(value);
                }
                rowList.add(valueList.toArray());
            }
            ExcelUtil.genRawCsvFile(titles,rowList,outputStream);

        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
