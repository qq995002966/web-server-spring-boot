package cn.thinkingdata.web.service.core.user.custom;

import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.domain.user.center.Do_user_center;
import cn.thinkingdata.web.persistence.user.custom.Mapper_user_center;
import cn.thinkingdata.web.service.cache.ProjectInfoCacheService;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import cn.thinkingdata.web.util.WebUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Xiaowu on 2016/8/23.
 */
@Service
public class OpinionmonitorService {

    @Autowired
    private Mapper_user_center m_mapper_user_center;

    @Autowired
    private CustomServiceService customServiceService;

    @Autowired
    private ProjectInfoCacheService projectInfoCacheService;

    private static final int SERVICE_TYPE_OPINION = 2;

    public DataResult GetOpinionMonitor(Integer index, Integer limit) {
        index = index > 0?index:0;
        limit = limit > 0?limit:0;
//        DataResult dataResult = customServiceService.checkCustomService(0,SERVICE_TYPE_OPINION);
//        if( dataResult != null){
//            return dataResult;
//        }
        Integer userId = WebUtil.getCurrentUser().getUser_id();
        List<Do_user_center> _list=m_mapper_user_center.get(userId, index, limit);
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("get", _list);
        Map<String, Integer> m = m_mapper_user_center.getKeywordsCnt(userId);
        dataMap.put("keywords_cnt", m.get("keywords_cnt"));
        int keywordMonitorNum = m_mapper_user_center.getKeywordMonitorNum(userId);
        dataMap.put("user_center_cnt", keywordMonitorNum);
        return new DataResult(ReturnCodeDim.SUCCESS,dataMap);
    }

    public DataResult AddOpinionMonitorTask(Do_user_center userCenter) {
//        DataResult dataResult = customServiceService.checkCustomService(0,SERVICE_TYPE_OPINION);
//        if(dataResult != null){
//            return dataResult;
//        }
        Do_user userDo = WebUtil.getCurrentUser();
        if("".equals(userCenter.getEmail_addr())){
            m_mapper_user_center.delete(userCenter.getId(),userDo.getUser_id());
            return new DataResult(ReturnCodeDim.SUCCESS);
        }
        int keywordMonitorNum = m_mapper_user_center.getKeywordMonitorNum(userDo.getUser_id());
        if(keywordMonitorNum >= 10 && 0 == userCenter.getId()){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"最多允许添加10个监控任务","");
        }
        Integer keywords_cnt=0;
        if(!CommonUtil.IsEmpty(userCenter.getKeywords())){
            keywords_cnt=Integer.valueOf(userCenter.getKeywords().split(" ").length);
        }
        if(keywords_cnt > 10 && 0 == userCenter.getId()){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"最多允许添加10个监控任务","");
        }
        String projectName = projectInfoCacheService.getProjectName(userCenter.getProject_id().toString());
        if(projectName.equals("")){
            return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
        }
        userCenter.setUser_id(userDo.getUser_id());
        userCenter.setKeywords_cnt(keywords_cnt);
        if(0 == userCenter.getId()){
            m_mapper_user_center.insert(userCenter);
        }else {
            m_mapper_user_center.update(userCenter);
        }
        return new DataResult(ReturnCodeDim.SUCCESS);
    }
}
