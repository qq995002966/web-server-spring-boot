package cn.thinkingdata.web.service.core.user.custom;

import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Created by Xiaowu on 2016/8/23.
 */
@Service
public class OutflowService {

    @Autowired
    private ProjOutflowService projOutflowService;
    @Autowired
    private CustomServiceService customServiceService;

    private static final int SERVICE_TYPE_OUTFLOW = 6;

    public DataResult GetOutflowDate(Integer projectId) {
//        DataResult dataResult = customServiceService.checkCustomService(projectId,SERVICE_TYPE_OUTFLOW);
//        if(dataResult != null){
//            return dataResult;
//        }
        return projOutflowService.getOutflowDate(projectId);
    }

    public DataResult GetOutflowSumType(Integer projectId, String data_date) {
//        DataResult dataResult = customServiceService.checkCustomService(projectId,SERVICE_TYPE_OUTFLOW);
//        if(dataResult != null){
//            return dataResult;
//        }
        Date date = DateUtil.parseDateString(data_date);
        return projOutflowService.getOutflowSumType(projectId,date);
    }

    public DataResult GetOutflowSumReason(Integer projectId, String sum_type, String data_date) {
//        DataResult dataResult = customServiceService.checkCustomService(projectId,SERVICE_TYPE_OUTFLOW);
//        if(dataResult != null){
//            return dataResult;
//        }
        Date date = DateUtil.parseDateString(data_date);
        return projOutflowService.getOutflowReason(projectId,sum_type,date);
    }

    public DataResult GetOutflowRadarData(String startDate, String endDate, Integer projectId) {
//        DataResult dataResult = customServiceService.checkCustomService(projectId,SERVICE_TYPE_OUTFLOW);
//        if(dataResult != null){
//            return dataResult;
//        }
        return projOutflowService.getOutflowRadarData(startDate,endDate,projectId);
    }
}
