package cn.thinkingdata.web.persistence.project.lt;

import cn.thinkingdata.web.domain.custom.Custom_do_lt_class_distri;
import cn.thinkingdata.web.domain.project.lt.Do_proj_lt_detail_stat;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_proj_lt_detail_stat {
	public List<Custom_do_lt_class_distri> getLtClassDistriList(@Param("project_id") int projectId, @Param("start_date") String startDate, @Param("end_date") String endDate);
	
	public List<Do_proj_lt_detail_stat> getLtDetailStatList(@Param("project_id") int projectId, @Param("start_date") String startDate, @Param("end_date") String endDate, @Param("classify_sentiment") int classify_sentiment, @Param("lighttower_classify") String lighttower_classify);

	public List getClassifyList(@Param("project_id") int projectId);
}
