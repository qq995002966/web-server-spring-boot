package cn.thinkingdata.web.persistence.user;

import cn.thinkingdata.web.domain.user.evo.Do_user_evo_forum;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;
import java.util.HashMap;

public interface Mapper_user_evo_forum {
	public ArrayList<Do_user_evo_forum> get(@Param("project_id") Integer project_id, @Param("user_id") Integer user_id, @Param("index") Integer index, @Param("limit") Integer limit);
	public HashMap<String, Integer> getProjectCnt(@Param("user_id") Integer user_id);
	public HashMap<String, Integer> getDataSourceCntOfStatus1(@Param("user_id") Integer user_id);
	public HashMap<String, Integer> getDataSourceCntOfStatus0(@Param("user_id") Integer user_id);
	public int delete(@Param("id") int id, @Param("user_id") int user_id);
	public int update(Do_user_evo_forum _do);
	public int add(Do_user_evo_forum _do);
}
