package cn.thinkingdata.web.persistence.gas;


import cn.thinkingdata.web.domain.gas.Do_gas_apps_info;
import org.apache.ibatis.annotations.Param;

import java.util.List;


public interface Mapper_gas_apps_info {

	public List<Do_gas_apps_info> getGasAppsInfoByKeyword(@Param("keyword") String keyword, @Param("index") int index, @Param("limit") int limit);

}
