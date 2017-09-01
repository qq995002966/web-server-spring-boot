package cn.thinkingdata.web.persistence.project.channel;

import cn.thinkingdata.web.domain.project.channel.Do_proj_channel_rating_distri;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;

public interface Mapper_proj_channel_rating_distri {
	public ArrayList<Do_proj_channel_rating_distri> get(@Param("project_id") int project_id, @Param("data_date_start") String data_date_start, @Param("data_date_end") String data_date_end);

	public ArrayList<Do_proj_channel_rating_distri> getRatingDistriByProjectDateSpan(@Param("project_id") int project_id, @Param("start_date") String data_date_start, @Param("end_date") String data_date_end);

}
