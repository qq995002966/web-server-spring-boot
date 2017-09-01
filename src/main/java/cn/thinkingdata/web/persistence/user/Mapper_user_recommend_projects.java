package cn.thinkingdata.web.persistence.user;


import cn.thinkingdata.web.domain.user.Do_user_recommend_projects;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_user_recommend_projects {
		
	public List<Do_user_recommend_projects> getByUserId(@Param("user_id") int user_id);
	
	public int insertUserRecomProjects(Do_user_recommend_projects userRecomProjects);

	public List<Do_user_recommend_projects> getRecommendByUserId(@Param("user_id") Integer user_id,@Param("index")  Integer index,@Param("limit")  Integer limit);
}
