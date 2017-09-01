package cn.thinkingdata.web.persistence.project.forum;

import cn.thinkingdata.web.domain.project.forum.Do_proj_forum_common_stat;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_proj_forum_common_stat {
	public Do_proj_forum_common_stat getForumCommonStatBydateSpan(@Param("project_id") int projectId, @Param("start_date") String startDate, @Param("end_date") String endDate);

    public List<Do_proj_forum_common_stat> getForumCommonStatListByDate(@Param("project_id") int projectId, @Param("data_date")  String dataSate);

    public Do_proj_forum_common_stat getForumCommonStatLatest(@Param("project_id") int projectId);
}
