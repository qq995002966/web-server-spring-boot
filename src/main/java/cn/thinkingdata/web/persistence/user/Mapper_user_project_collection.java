package cn.thinkingdata.web.persistence.user;

import cn.thinkingdata.web.domain.user.Do_user_project_collection;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_user_project_collection {
	public int getUserCollectionNum(Long user_id);
	
	public void collectProject(@Param("user_id") Long user_id, @Param("project_id") Integer project_id);
	
	public void unCollectProject(@Param("user_id") Long user_id, @Param("project_id") Integer project_id);
	
	public List<Do_user_project_collection> getUserCollectionList(@Param("user_id") Long user_id,@Param("index") Integer index, @Param("limit") Integer limit);
}
