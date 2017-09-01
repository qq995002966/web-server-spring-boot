package cn.thinkingdata.web.persistence.project.channel;

import cn.thinkingdata.web.domain.project.channel.Do_proj_channel_rating_distri_new;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

public interface Mapper_proj_channel_rating_distri_new {

	public String getLatestProjChannelRatingDistriNew();

	public Map getTotalProjChannelRatingDistriNew(@Param("project_id") int projectId, @Param("data_date") String dataDate);

	public Map getTotalProjChannelRatingDistriNewByDate(@Param("project_id") int projectId, @Param("data_date") String dataDate);

}
