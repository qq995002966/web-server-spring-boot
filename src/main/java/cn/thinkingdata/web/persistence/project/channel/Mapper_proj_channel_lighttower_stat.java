package cn.thinkingdata.web.persistence.project.channel;

import cn.thinkingdata.web.domain.project.channel.Do_proj_channel_lighttower_stat;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;

public interface Mapper_proj_channel_lighttower_stat {
	ArrayList<Do_proj_channel_lighttower_stat> get(@Param("project_id") Integer project_id, @Param("start_date") String data_date_start, @Param("end_date") String data_date_end);
	
}
