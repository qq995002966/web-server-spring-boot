package cn.thinkingdata.web.persistence.project.lt;

import cn.thinkingdata.web.domain.project.lt.Do_proj_lt_common_stat;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_proj_lt_common_stat {

    public Do_proj_lt_common_stat getLatestLtCommonStat(@Param("project_id") int projectId);

	public List<Do_proj_lt_common_stat> getLtCommonStatDataList(@Param("project_id") int projectId, @Param("start_date") String startDate, @Param("end_date") String endDate);

    public List<Do_proj_lt_common_stat> getLtCommonStatListData(@Param("project_id") int projectId, @Param("date_state") String dataSate);
}
