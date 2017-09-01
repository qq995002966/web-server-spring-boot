package cn.thinkingdata.web.persistence.appstore;

import cn.thinkingdata.web.domain.appstore.Do_gas_rating_info;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_gas_rating_info {
	public List<Do_gas_rating_info> getAppstoreTopRatingByDetailType(@Param("data_date") String dataDate, @Param("app_type") Integer appType, @Param("device_type") Integer deviceType, @Param("list_type") Integer listType, @Param("index") Integer index, @Param("limit") Integer limit);

	public Integer getAppstoreTopRatingByDetailTypeCount(@Param("data_date") String dataDate, @Param("app_type") Integer appType, @Param("device_type") Integer deviceType, @Param("list_type") Integer listType);

	public Do_gas_rating_info getGasRatingInfoByKeywordByDateAndAppId(@Param("data_date") String dataDate,@Param("app_id") String app_id, @Param("app_type") Integer appType, @Param("device_type") Integer deviceType, @Param("list_type") Integer listType);

	public String getGasRatingInfoLatestDate();
}
