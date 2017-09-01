package cn.thinkingdata.web.persistence.project;

import cn.thinkingdata.web.domain.project.Do_project_hot_list;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_project_hot_list {
	public List<Do_project_hot_list> getProjectHotList(@Param("index") Integer index, @Param("limit") Integer limit);
}
