package cn.thinkingdata.web.persistence.user.custom;

import cn.thinkingdata.web.domain.user.custom.Do_user_custom_keywords;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_user_custom_keywords {
	
	int insertTry(Do_user_custom_keywords _do);

	int delete(@Param("id") int id, @Param("user_id") int user_id);

	int update(Do_user_custom_keywords _do);
	
	List<Do_user_custom_keywords> getByUserId(@Param("user_id") int user_id, @Param("index") int index, @Param("limit") int limit);

	int getByUserIdTotal(@Param("user_id") int user_id);

	List<Do_user_custom_keywords> getByUserIdProjectId(@Param("user_id") int user_id, @Param("project_id") int project_id);
	
}
