package cn.thinkingdata.web.service.core.user.custom;

import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchObj;
import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchOrder;
import cn.thinkingdata.elasticsearch.query.util.ElasticSearchQueryUtil;
import cn.thinkingdata.web.constant.SessionAttr;
import cn.thinkingdata.web.domain.gas.Do_gas_chat_info;
import cn.thinkingdata.web.domain.project.chat.*;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.domain.user.Do_user_detail;
import cn.thinkingdata.web.domain.user.custom.Do_user_custom_service;
import cn.thinkingdata.web.persistence.gas.Mapper_gas_chat_info;
import cn.thinkingdata.web.persistence.project.chat.*;
import cn.thinkingdata.web.persistence.user.custom.Mapper_user_custom_service;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import cn.thinkingdata.web.util.WebUtil;
import com.alibaba.fastjson.JSONObject;
import com.google.common.base.Throwables;
import org.apache.commons.fileupload.FileItem;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;

/**
 * Created by Xiaowu on 2016/8/23.
 */
@Service
public class ChatInfoService {

    @Autowired
    private Mapper_user_custom_service mapper_user_custom_service;

    @Autowired
    private Mapper_gas_chat_info m_mapper_gas_chat_info;

    @Autowired
    private Mapper_proj_chat_senti_topwords m_mapper_proj_chat_senti_topwords;

    @Autowired
    private Mapper_proj_chat_attitude_distri m_mapper_proj_chat_attitude_distri;

    @Autowired
    private Mapper_proj_chat_active_user m_mapper_proj_chat_active_user;

    @Autowired
    private Mapper_proj_chat_topic_session m_mapper_proj_chat_topic_session;

    @Autowired
    private Mapper_proj_chat_topwords_common m_mapper_proj_chat_topwords_common;

    private static final int SERVICE_TYPE_CHATINFO = 3;
    private static final int DEMO_PROJECT_CHATINFO = 162;
    private static final int MAX_SIZE=150*1024*1024;
    private static final String FILE_DIR = "/data/crawl_data/gas_chat/raw/";

    private static final Logger logger = LogManager.getLogger();

    public DataResult GetGasChatInfo(String infoIdListStr, Integer index, Integer limit) {
        Do_user m_login_user = WebUtil.getCurrentUser();
        List<Do_gas_chat_info> _list = new ArrayList<>();
        Integer total = 1;
        if(infoIdListStr == null || infoIdListStr.equals("")){
            total = m_mapper_gas_chat_info.getTotal(m_login_user.getUser_id());
            _list = m_mapper_gas_chat_info.get(m_login_user.getUser_id(), index, limit);
            Do_gas_chat_info demoChatInfo = m_mapper_gas_chat_info.getJustByInfoId(DEMO_PROJECT_CHATINFO);
            _list.add(demoChatInfo);
            total++;
        }else{
            String infoIdStrs[] = infoIdListStr.split(",");
            ArrayList<Long> infoIdList = new ArrayList<>();
            for(String infoIdStr : infoIdStrs){
                infoIdList.add(Long.parseLong(infoIdStr));
            }
            _list = m_mapper_gas_chat_info.getByInfoIdList(m_login_user.getUser_id(), infoIdList);
        }
        List<Map<String, Object>> chatInfoList = new ArrayList<>();
        for(Do_gas_chat_info _do:_list){
            Long tm=_do.getCreate_time();
            String createTime = CommonUtil.longToDateStr(tm);
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("dt_create_time", createTime);
            map.put("end_date", _do.getEnd_date());
            map.put("file_name", _do.getFile_name());
            map.put("info_id", _do.getInfo_id());
            map.put("source_type", _do.getSource_type());
            map.put("start_date", _do.getStart_date());
            map.put("status", _do.getStatus());
            chatInfoList.add(map);
        }
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("get", chatInfoList);
        dataMap.put("total", total);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult checkCustomServiceChatInfo(Integer infoId){
        if(0 == infoId){
            return new DataResult(ReturnCodeDim.PARAMETER_ERROR,"infoId不能为空","");
        }
        Do_user userDo = WebUtil.getCurrentUser();
        Do_user_custom_service userCustomService = mapper_user_custom_service.getCustomServiceByUserAndTypeAndProject(userDo.getUser_id(), SERVICE_TYPE_CHATINFO, 0,0);
        if (userCustomService != null&&userCustomService.getRemain_times() <= 0) {
            userCustomService.setService_status(5);
            mapper_user_custom_service.updateCustomService(userCustomService);
        }
        if (infoId != DEMO_PROJECT_CHATINFO) {
            Do_gas_chat_info gasChatInfo = m_mapper_gas_chat_info.getJustByInfoId(infoId);
            if (gasChatInfo.getUser_id().intValue() != userDo.getUser_id().intValue()) {
                return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
            }
        }
        return null;
    }

    public DataResult delChatInfo(Integer infoId) {
        Do_gas_chat_info chatInfo = m_mapper_gas_chat_info.getJustByInfoId(infoId);
        if(chatInfo.getStatus() == 1 || chatInfo.getStatus() == 2 || chatInfo.getStatus() == 4 || chatInfo.getStatus() == 5){
            return new DataResult(ReturnCodeDim.ILLEAGAL_ACTION,"文件解析中，请等待完成后再删除","");
        }
        Do_user m_login_user = WebUtil.getCurrentUser();
        if(chatInfo.getUser_id().intValue() != m_login_user.getUser_id().intValue()){
            return new DataResult(ReturnCodeDim.ILLEAGAL_ACTION,"您没有权限删除该文件","");
        }
        m_mapper_gas_chat_info.del(infoId, m_login_user.getUser_id());
        return new DataResult(ReturnCodeDim.SUCCESS);
    }

    public DataResult uploadGasChatInfo(List<FileItem> list) {
        String file_name = null;
        int infoId = 0;
        int sourceType = 0;
        FileItem fileItem = null;
        long file_bytes = 0;
        String real_file_name = null;
        String FileTail="";
        Do_user userDo = WebUtil.getCurrentUser();
        Do_user_detail userDetailDo = (Do_user_detail) WebUtil.getSession(SessionAttr.USER_DETAIL);
        try {
            for (FileItem item : list) {
                //获取表单的属性名字
                String name = item.getFieldName();
                //如果获取的 表单信息是普通的 文本 信息
                if (item.isFormField()) {
                    //获取用户具体输入的字符串 ，名字起得挺好，因为表单提交过来的是 字符串类型的
                    String value = item.getString();
                    if (name.equalsIgnoreCase("file_name")) {
                        String[] _ar = value.split("\\."); // 获取文件名的后缀
                        if (_ar.length > 1) {
                            FileTail = _ar[_ar.length - 1];
                        }
                        file_name = value;
                    } else if (name.equalsIgnoreCase("info_id")) {
                        infoId = Integer.parseInt(value.toString());
                    } else if (name.equalsIgnoreCase("source_type")) {
                        sourceType = Integer.parseInt(value.toString());
                    }
                }else {
                    fileItem = item;
                }
            }
            logger.info("upload chat info id: " + infoId);
            if (infoId != 0) {
                Do_gas_chat_info chatInfo = m_mapper_gas_chat_info.getJustByInfoId(infoId);
                if (userDo.getUser_id().intValue() != chatInfo.getUser_id().intValue()) {
                    return returnError(ReturnCodeDim.AUTHORITY_FORBIDDEN, null, real_file_name);
                }
                if (chatInfo.getStatus() != 3 && chatInfo.getStatus() != 7) {
                    return returnError(ReturnCodeDim.AUTHORITY_FORBIDDEN, "禁止重新上传", real_file_name);
                }
                real_file_name = chatInfo.getReal_file_name();
                m_mapper_gas_chat_info.reUpdateFile(infoId, file_name, (int) file_bytes);
            } else {
//                Do_user_custom_service customService = mapper_user_custom_service.getCustomServiceByUserAndTypeAndProject(userDo.getUser_id(), SERVICE_TYPE_CHATINFO, 0, 0);
//                int remainTimes = customService.getRemain_times();
//                if (remainTimes <= 0) {
//                    return returnError(ReturnCodeDim.CUSTOM_SERVICE_EXHAUST, null, real_file_name);
//                }
                real_file_name = UUID.randomUUID().toString() + "." + FileTail;
                Do_gas_chat_info chatInfo = new Do_gas_chat_info();
                String companyName = "";
                if (userDetailDo != null) {
                    companyName = userDetailDo.getCompany_name();
                }
                chatInfo.setCompany(companyName);
                chatInfo.setUser_id(userDo.getUser_id());
                chatInfo.setFile_name(file_name);
                chatInfo.setSource_type(sourceType);
                chatInfo.setReal_file_name(real_file_name);
                chatInfo.setFile_bytes(file_bytes);
                m_mapper_gas_chat_info.add(chatInfo);
                mapper_user_custom_service.reduceServiceTimes(userDo.getUser_id(), SERVICE_TYPE_CHATINFO, 0);
            }
            //第三方提供的
            if (fileItem.getSize() > MAX_SIZE) {
                return returnError(ReturnCodeDim.PARAMETER_ERROR, null, real_file_name);
            }
            if (!FileTail.equalsIgnoreCase("txt") && !FileTail.equalsIgnoreCase("csv")) {
                return returnError(ReturnCodeDim.PARAMETER_ERROR, "错误的文件后缀名", real_file_name);
            }
            fileItem.write(new File(FILE_DIR + real_file_name));
        }catch (Exception e) {
            logger.error(Throwables.getStackTraceAsString(e));
            return returnError(ReturnCodeDim.PARAMETER_ERROR,"保存文件失败",real_file_name);
        }
        return new DataResult(ReturnCodeDim.SUCCESS);
    }

    private DataResult returnError(int returnCode, String returnMsg, String real_file_name){
        if(real_file_name != null){
            File file = new File(FILE_DIR + real_file_name);
            if(file.exists()){
                file.delete();
            }
        }
        if(returnMsg != null){
            return new DataResult(returnCode, returnMsg,"");
        }else{
            return new DataResult(returnCode);
        }
    }

    public DataResult doChatAnalysis(Integer infoId,String startDate,String endDate) {
//        DataResult dataResult = checkCustomServiceChatInfo(infoId);
//        if(dataResult != null){
//            return dataResult;
//        }
        Do_user userDo = WebUtil.getCurrentUser();
        int processingNum = m_mapper_gas_chat_info.getUserProcessingChatNum(userDo.getUser_id());
        if(processingNum >= 1){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"同时只能执行一个解析任务，请等待其他任务解析完成","");
        }
        Do_user_detail m_login_user_detail = (Do_user_detail)WebUtil.getSession(SessionAttr.USER_DETAIL);
        Do_gas_chat_info _do=new Do_gas_chat_info();
        String companyName = "";
        if(m_login_user_detail != null){
            companyName = m_login_user_detail.getCompany_name();
        }
        _do.setCompany(companyName);
        _do.setUser_id(userDo.getUser_id());
        _do.setInfo_id(Long.valueOf(infoId));
        _do.setStart_date(startDate);
        _do.setEnd_date(endDate);
        m_mapper_gas_chat_info.setup(_do);
        return new DataResult(ReturnCodeDim.SUCCESS,"操作成功!解析大概需要8分钟,请耐心等待","");
    }

    public DataResult GetChatQueryPosts(String keywords, String sessionId, String topicId, String qqId, String author, String sourceType, Integer infoId, Integer index, Integer limit) {
//        DataResult dataResult = checkCustomServiceChatInfo(infoId);
//        if(dataResult != null){
//            return dataResult;
//        }
        ArrayList<ElasticSearchObj> searchList = new ArrayList<>();
        ElasticSearchObj searchObj;
        // 根据时间跨度查询
        searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "info_id", infoId.toString());
        searchList.add(searchObj);
        if(! CommonUtil.IsEmpty(keywords)){
            // 根据关键词查询
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.QUERY, "content", keywords);
            searchList.add(searchObj);
        }
        if(! CommonUtil.IsEmpty(topicId)){
            // 根据论坛的topic_id来查询
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.IN, "topic_id", topicId.replaceAll(",", "\t"));
            searchList.add(searchObj);
        }
        if(!CommonUtil.IsEmpty(qqId)){
            // 根据论坛的topic_id来查询
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "qq_id", qqId);
            searchList.add(searchObj);
        }
        else if(!CommonUtil.IsEmpty(author)){
            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "author",author);
            searchList.add(searchObj);
        }
        if(!CommonUtil.IsEmpty(sessionId)){

            searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.EQUAL, "session_id",sessionId);
            searchList.add(searchObj);
        }
        ElasticSearchQueryUtil util = ElasticSearchQueryUtil.getInstance();
        String title="gas_chat" ;
        ArrayList<ElasticSearchOrder> orderList = new ArrayList<>();
        ElasticSearchOrder searchOrder = new ElasticSearchOrder("publish_time", SortOrder.ASC);
        orderList.add(searchOrder);
        try {
            JSONObject resultObj =  util.searchData(title,index, limit, searchList, orderList);
            return new DataResult(ReturnCodeDim.SUCCESS, resultObj);
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR);
        }
    }

    public DataResult GetProjChatTopicSession(Integer infoId, String topicId, Integer index, Integer limit) {
//        DataResult dataResult = checkCustomServiceChatInfo(infoId);
//        if(dataResult != null){
//            return dataResult;
//        }
        if(CommonUtil.IsEmpty(topicId)){
            List<Do_proj_chat_topic_session> _list = m_mapper_proj_chat_topic_session.getJustByInfoId(infoId);
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("get", _list);
            return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
        }else {
            List<Do_proj_chat_topic_session2> _list = m_mapper_proj_chat_topic_session.getSessionsJustByInfoId(infoId, topicId, index, limit);
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("get", _list);
            return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
        }
    }

    public DataResult GetProjChatSentiTopwords(Integer infoId) {
//        DataResult dataResult = checkCustomServiceChatInfo(infoId);
//        if(dataResult != null){
//            return dataResult;
//        }
        List<Do_proj_chat_senti_topwords> _list = m_mapper_proj_chat_senti_topwords.getJustByInfoId(infoId);
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("get", _list);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult GetProjChatAttitudeDistri(Integer infoId) {
//        DataResult dataResult = checkCustomServiceChatInfo(infoId);
//        if(dataResult != null){
//            return dataResult;
//        }
        List<Do_proj_chat_attitude_distri> _list = m_mapper_proj_chat_attitude_distri.getJustByInfoId(infoId);
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("get", _list);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult GetChatKeywordsDistribute(Integer infoId) {
//        DataResult dataResult = checkCustomServiceChatInfo(infoId);
//        if(dataResult != null){
//            return dataResult;
//        }
        List<Do_proj_chat_topwords_common> _list = m_mapper_proj_chat_topwords_common.getJustByInfoId(infoId);
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("get", _list);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }

    public DataResult GetProjChatActiveUser(Integer infoId) {
//        DataResult dataResult = checkCustomServiceChatInfo(infoId);
//        if(dataResult != null){
//            return dataResult;
//        }
        List<Do_proj_chat_active_user> _list = m_mapper_proj_chat_active_user.getJustByInfoId(infoId);
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("get", _list);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }
}
