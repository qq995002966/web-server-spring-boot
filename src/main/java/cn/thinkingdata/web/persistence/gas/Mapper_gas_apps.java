package cn.thinkingdata.web.persistence.gas;


import cn.thinkingdata.web.domain.gas.Do_gas_apps;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;


public interface Mapper_gas_apps {
	public ArrayList<Do_gas_apps> getAll();
	public ArrayList<Do_gas_apps> getByProjectId(@Param("project_id") int project_id);
	public int update(Do_gas_apps _do);
	public String getAppIdByProjectId(@Param("project_id") String projectId);
}
