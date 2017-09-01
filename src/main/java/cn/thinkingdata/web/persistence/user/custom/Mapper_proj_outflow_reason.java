package cn.thinkingdata.web.persistence.user.custom;


import cn.thinkingdata.web.domain.project.Do_proj_outflow_reason;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface Mapper_proj_outflow_reason {

    public List<String> getOutflowReason(@Param("data_date") String data_date, @Param("project_id") Integer project_id);

    public List<Do_proj_outflow_reason> getOutflowReasonDetail(@Param("data_date") String data_date, @Param("project_id") Integer project_id, @Param("lost_type") String lost_type);

    public List<Do_proj_outflow_reason> getOutflowReasonBySumReason(@Param("data_date") String data_date, @Param("project_id") Integer project_id, @Param("sum_reason") String sum_reason);

    public List<String> getOutflowSumReason(@Param("data_date") String data_date, @Param("project_id") Integer project_id, @Param("sum_type") String sum_type);

    public List<Map> getOutflowSumType(@Param("data_date") String data_date, @Param("project_id") Integer project_id);

    public List<String> getOutflowDate(@Param("project_id") Integer project_id);
}
