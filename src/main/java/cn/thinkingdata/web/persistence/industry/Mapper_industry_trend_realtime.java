package cn.thinkingdata.web.persistence.industry;

import cn.thinkingdata.web.domain.industry.Do_industry_trend_realtime;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_industry_trend_realtime {
	Do_industry_trend_realtime getTrendRealtimeByDate(@Param("data_date") String dataDate);
	
	List<Do_industry_trend_realtime> getTrendRealtimeByDateSpan(@Param("start_date") String startDate, @Param("end_date") String endDate);
}
