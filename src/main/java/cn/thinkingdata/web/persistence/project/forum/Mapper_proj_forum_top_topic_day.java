package cn.thinkingdata.web.persistence.project.forum;

import cn.thinkingdata.web.domain.project.forum.Do_proj_forum_top_topic_day;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_proj_forum_top_topic_day {
    public List<Do_proj_forum_top_topic_day> getTopicDistriListByProjectDateSpan(@Param("project_id") int projectId, @Param("start_date") String startDate, @Param("end_date") String endDate,@Param("index") Integer index, @Param("limit") Integer limit);

    public Double getTopicDistriTotalByProjectDateSpan(@Param("project_id") int projectId, @Param("start_date") String startDate, @Param("end_date") String endDate);
}
