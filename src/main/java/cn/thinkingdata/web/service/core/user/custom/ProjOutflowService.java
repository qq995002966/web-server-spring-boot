package cn.thinkingdata.web.service.core.user.custom;


import cn.thinkingdata.web.domain.project.Do_proj_outflow_direction_detail;
import cn.thinkingdata.web.domain.project.Do_proj_outflow_reason;
import cn.thinkingdata.web.persistence.user.custom.Mapper_proj_outflow_direction_detail;
import cn.thinkingdata.web.persistence.user.custom.Mapper_proj_outflow_reason;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.DateUtil;
import cn.thinkingdata.web.util.ReturnCodeDim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProjOutflowService {

    @Autowired
    private Mapper_proj_outflow_direction_detail mapper_proj_outflow_direction_detail;

    @Autowired
    private Mapper_proj_outflow_reason mapper_proj_outflow_reason;

    public DataResult getOutflowRadarData(String start_date, String end_date, Integer project_id){

        List<Do_proj_outflow_direction_detail> projOutflowDirectionDetails = mapper_proj_outflow_direction_detail.getOutflowDirection(start_date,end_date,project_id);

        Map dataMap = new HashMap();
        dataMap.put("result", projOutflowDirectionDetails);
        DataResult dataResult = new DataResult(ReturnCodeDim.SUCCESS, dataMap);
        return dataResult;
    }

    public DataResult getOutflowPieData(String data_date, Integer projectId) {
        List<String> pieDataStr = mapper_proj_outflow_reason.getOutflowReason(data_date,projectId);
        Map dataMap = new HashMap();
        dataMap.put("result", pieDataStr);
        DataResult dataResult = new DataResult(ReturnCodeDim.SUCCESS, dataMap);
        return dataResult;

    }

    public DataResult getOutflowPieDetails(String data_date, Integer projectId, String lost_type ) {
        List<Do_proj_outflow_reason> projOutflowReasons = mapper_proj_outflow_reason.getOutflowReasonDetail(data_date,projectId,lost_type);
        Map dataMap = new HashMap();
        dataMap.put("result", projOutflowReasons);
        DataResult dataResult = new DataResult(ReturnCodeDim.SUCCESS, dataMap);
        return dataResult;

    }
    public DataResult getOutflowReason(Integer projectId, String sum_type, Date date) {
//        Date data_date = DateUtil.lastSunday(date);
        List<String> sumReasonList = mapper_proj_outflow_reason.getOutflowSumReason(DateUtil.getPartitionString(date),projectId,sum_type);
        List<Map<String,Object>> resultList = new ArrayList<>();
        if (sumReasonList.size() > 0){
            for (String sum_reason : sumReasonList){
                Map<String,Object> sumReasonMap = new HashMap<>();
                List<String> reasonName = new ArrayList<>();
                Integer weight = 0;
                List<Do_proj_outflow_reason> reasonList = mapper_proj_outflow_reason.getOutflowReasonBySumReason(DateUtil.getPartitionString(date),projectId,sum_reason);
                for(Do_proj_outflow_reason do_proj_outflow_reason : reasonList){
                    weight += do_proj_outflow_reason.getWeight();
                    reasonName.add(do_proj_outflow_reason.getLost_reason());
                }
                sumReasonMap.put("sum_reason",sum_reason);
                sumReasonMap.put("reason",reasonName);
                sumReasonMap.put("sort_weight",weight);
                sumReasonMap.put("weight",reasonList.size());
                sumReasonMap.put("total",reasonList.size());
                resultList.add(sumReasonMap);
            }
            Collections.sort(resultList, new Comparator<Map>() {
                public int compare(Map o1, Map o2) {
                    int v1 = Integer.valueOf(o1.get("sort_weight").toString());
                    int v2 = Integer.valueOf(o2.get("sort_weight").toString());
                    return v2 - v1;
                }
            });
        }
        DataResult dataResult = new DataResult(ReturnCodeDim.SUCCESS, resultList);
        return dataResult;
    }

    public DataResult getOutflowSumType(Integer projectId, Date date) {
//        Date data_date = DateUtil.lastSunday(date);
        List<Map> resultList = mapper_proj_outflow_reason.getOutflowSumType(DateUtil.getPartitionString(date),projectId);
        Collections.sort(resultList, new Comparator<Map>() {
            public int compare(Map o1, Map o2) {
                int v1 = Integer.valueOf(o1.get("total").toString());
                int v2 = Integer.valueOf(o2.get("total").toString());
                return v2 - v1;
            }
        });
        DataResult dataResult = null;
        if(resultList.size()>0){
            dataResult = new DataResult(ReturnCodeDim.SUCCESS, resultList);
        }else {
//            Date this_sunday = DateUtil.lastSunday(new Date());
//            if(this_sunday.equals(data_date)){
//                dataResult = new DataResult(ReturnCodeDim.PROJECT_SETTING_DATA,"");
//            }else {
                dataResult = new DataResult(ReturnCodeDim.PROJECT_NO_DATA,"");
//            }
        }
        return dataResult;
    }

    public DataResult getOutflowDate(Integer projectId) {
        List<String> resultList = mapper_proj_outflow_reason.getOutflowDate(projectId);
        DataResult dataResult = null;
        if(resultList.size()>0){
            dataResult = new DataResult(ReturnCodeDim.SUCCESS, resultList);
        }else {
            dataResult = new DataResult(ReturnCodeDim.PROJECT_NO_DATA,"");
        }
        return dataResult;
    }
}
