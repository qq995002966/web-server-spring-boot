package cn.thinkingdata.web.persistence.gas;

import java.util.List;

import cn.thinkingdata.web.domain.gas.Do_gas_projects;
import org.apache.ibatis.annotations.Param;


public interface Mapper_gas_projects {
	
	// 获取所有业务，包括status是0的
	public List<Do_gas_projects> getAll();
	
	public Do_gas_projects getProjectById(int projectId);
	
	public List<Do_gas_projects> getSome(@Param("index") int index, @Param("limit") int limit);
	
	public int getCnt();
	
	public List<Integer> getProjectIdListByGameType(@Param("game_type") String gameType);
	
	public List<Integer> getProjectIdListByDetailType(@Param("detail_type") String detailType);

	public Integer getProjectByAppId(@Param("app_id") String appId);
}
