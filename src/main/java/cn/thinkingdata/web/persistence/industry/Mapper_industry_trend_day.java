package cn.thinkingdata.web.persistence.industry;

import cn.thinkingdata.web.domain.industry.Do_industry_trend_day;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_industry_trend_day {
	List<Do_industry_trend_day> getTrendDayByDateSpan(@Param("start_date") String startDate, @Param("end_date") String endDate);
}
