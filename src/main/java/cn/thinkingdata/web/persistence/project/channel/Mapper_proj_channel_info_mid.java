package cn.thinkingdata.web.persistence.project.channel;

import cn.thinkingdata.web.domain.project.channel.Do_proj_channel_info_mid;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;

public interface Mapper_proj_channel_info_mid {
	public ArrayList<Do_proj_channel_info_mid> get(@Param("project_id") int project_id);
	
}
