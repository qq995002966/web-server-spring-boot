package cn.thinkingdata.web.persistence.industry;

import cn.thinkingdata.web.domain.industry.Do_industry_appstore_type_distri;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_industry_appstore_type_distri {
	public List<Do_industry_appstore_type_distri> getAppstoreTypeDistriList(@Param("data_date") String dataDate, @Param("list_type") Integer listType, @Param("device_type") Integer deviceType);
	
}
