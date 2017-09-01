package cn.thinkingdata.web.persistence.industry;

import cn.thinkingdata.web.domain.industry.Do_content_detail_realtime;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_content_detail_realtime {
	public List<Do_content_detail_realtime> getContentDetailByDate(@Param("data_date") String dataDate);
}
