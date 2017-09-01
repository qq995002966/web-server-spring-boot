package cn.thinkingdata.web.persistence.appstore;

import cn.thinkingdata.web.domain.appstore.Do_gas_apps_history_ratings;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_gas_apps_history_ratings {
	public List<Do_gas_apps_history_ratings> getProjectAppstoreRatingList(@Param("project_id") int projectId, @Param("start_date") String startDate, @Param("end_date") String endDate, @Param("app_type") Integer appType, @Param("list_type") Integer listType, @Param("device_type") Integer deviceType);
	
	public List<Integer> getListTypeDimList(@Param("project_id") int projectId);
	
	public List<Integer> getDeviceTypeDimList(@Param("project_id") int projectId);
	
	public List<Integer> getGameTypeDimList(@Param("project_id") int projectId);

    public List<Do_gas_apps_history_ratings> getProjectAppstoreRatingListByDate(@Param("project_id")Integer projectId,@Param("data_date") String datadate);
}
