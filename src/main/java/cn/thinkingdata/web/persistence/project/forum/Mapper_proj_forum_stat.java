package cn.thinkingdata.web.persistence.project.forum;


import cn.thinkingdata.web.domain.project.forum.Do_proj_forum_stat;
import org.apache.ibatis.annotations.Param;

import java.util.HashMap;
import java.util.List;

public interface Mapper_proj_forum_stat {
    public List<Do_proj_forum_stat> getDistribute(@Param("project_id") int project_id, @Param("start_date") String start_date, @Param("end_date") String end_date);
    public HashMap<String, Integer> getPostCnt(@Param("project_id") int project_id, @Param("start_date") String start_date, @Param("end_date") String end_date);
}
