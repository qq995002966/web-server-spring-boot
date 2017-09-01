package cn.thinkingdata.web.persistence.industry;

import cn.thinkingdata.web.domain.industry.Do_industry_game_type_distri;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_industry_game_type_distri {
	public String getMaxDataDate();
	public List<Do_industry_game_type_distri> getGameTypeDistriListByTwoDay(@Param("data_date") String dataDate, @Param("data_date_yesterday") String yesterdayDate);
}
