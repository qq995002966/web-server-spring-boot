package cn.thinkingdata.web.persistence.project.channel;

import cn.thinkingdata.web.domain.project.channel.Do_proj_channel_senti_topwords;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;
import java.util.List;

public interface Mapper_proj_channel_senti_topwords {
	public ArrayList<Do_proj_channel_senti_topwords> getPos(@Param("project_id") int project_id, @Param("data_date_start") String data_date_start, @Param("data_date_end") String data_date_end);
	public ArrayList<Do_proj_channel_senti_topwords> getNeg(@Param("project_id") int project_id, @Param("data_date_start") String data_date_start, @Param("data_date_end") String data_date_end);
	
	public List<Do_proj_channel_senti_topwords> getSentiDateDistriList(@Param("project_id") int project_id, @Param("start_date") String startDate, @Param("end_date") String endDate);
	
	public List<Do_proj_channel_senti_topwords> getSentiWordDistriList(@Param("project_id") int project_id, @Param("start_date") String startDate, @Param("end_date") String endDate);
	
	public List<Do_proj_channel_senti_topwords> getSentiWordOneDayDistriList(@Param("project_id") int project_id, @Param("data_date") String dataDate, @Param("senti_type") String sentiType);
	
	
}
