package cn.thinkingdata.web.persistence.project.forum;

import cn.thinkingdata.web.domain.project.forum.Do_proj_forum_useless_classify;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_proj_forum_useless_classify {
	List<Do_proj_forum_useless_classify> getFourmUselessClassifyListByProjectDateSpan(@Param("project_id") int projectId, @Param("start_date") String startDate, @Param("end_date") String endDate);
	
}
