package cn.thinkingdata.web.persistence.user.custom;

import cn.thinkingdata.web.domain.user.custom.Do_user_custom_service;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_user_custom_service {
	int insertTry(Do_user_custom_service do_user_custom_service);
	
	List<Do_user_custom_service> getByUserId(@Param("user_id") int user_id, @Param("index") int index, @Param("limit") int limit);
	int getTotalByUserId(@Param("user_id") int user_id);

	public List getCustomService(@Param("user_id") int user_id);

	Do_user_custom_service getCustomServiceByUserAndTypeAndProject(@Param("user_id") int user_id, @Param("service_type") int serviceType, @Param("project_id") int projectId, @Param("report_id") int reportId);
	
	int updateCustomService(Do_user_custom_service do_user_custom_service);
	
	int insertUpdateCustomService(Do_user_custom_service userCustomService);
	
	int reduceServiceTimes(@Param("user_id") int user_id, @Param("service_type") int serviceType, @Param("project_id") int projectId);
}
