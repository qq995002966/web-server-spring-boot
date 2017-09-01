package cn.thinkingdata.web.persistence.user.custom;


import cn.thinkingdata.web.domain.user.center.Do_user_center;
import cn.thinkingdata.web.domain.user.center.Do_user_center_follow;
import org.apache.ibatis.annotations.Param;

import java.util.HashMap;
import java.util.List;

public interface Mapper_user_center {

	public int insert(Do_user_center _do);

	public int update(Do_user_center _do);
	
	public int delete(@Param("id") int id, @Param("user_id") int user_id);
	
	public List<Do_user_center> get(@Param("user_id") int user_id, @Param("index") int index, @Param("limit") int limit);
	
	public List<Do_user_center_follow> getFollow(@Param("user_id") int user_id);

	public HashMap<String, Integer> getKeywordsCnt(@Param("user_id") int user_id);
	
	public int getKeywordMonitorNum(@Param("user_id") int user_id);
	
	
	
}
