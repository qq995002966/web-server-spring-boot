package cn.thinkingdata.web.persistence.gas;

import java.util.List;
import java.util.Map;

import cn.thinkingdata.web.domain.gas.Do_gas_project_tag;
import cn.thinkingdata.web.domain.gas.Do_gas_projects;
import org.apache.ibatis.annotations.Param;

public interface Mapper_gas_project_tag {
	// 获取所有业务，包括status是0的
	public List<Do_gas_project_tag> getByTags(@Param("tags") List<Integer> tags_list);
	
	public List getProjectTagListByProject(int projectId);

	public List getProjectTagNameListByProject(int projectId);

	public List<Do_gas_project_tag> getProjectTagListByTag(int tagId);
	
	public List<Integer> getProjectIDListByTag(int tagId);
	
	public List<Do_gas_projects> getProjectIdListByTagName(String tagName);

	public List<Map> findAll();
}
