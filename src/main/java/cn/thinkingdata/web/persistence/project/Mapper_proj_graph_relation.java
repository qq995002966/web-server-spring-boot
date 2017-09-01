package cn.thinkingdata.web.persistence.project;

import cn.thinkingdata.web.domain.project.Do_proj_graph_relation;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface Mapper_proj_graph_relation {
	public List<Do_proj_graph_relation> getRelatedProjectList(@Param("project_ids") Integer[] projectIds, @Param("max_index") Integer max_index);
}
