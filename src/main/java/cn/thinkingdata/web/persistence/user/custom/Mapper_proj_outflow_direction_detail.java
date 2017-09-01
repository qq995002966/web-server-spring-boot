package cn.thinkingdata.web.persistence.user.custom;


import cn.thinkingdata.web.domain.project.Do_proj_outflow_direction_detail;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_proj_outflow_direction_detail {

    public List<Do_proj_outflow_direction_detail> getOutflowDirection(@Param("start_date") String start_date, @Param("end_date") String end_date, @Param("project_id") Integer project_id);
}
