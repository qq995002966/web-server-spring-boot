package cn.thinkingdata.web.persistence.gas;

import java.util.List;

import cn.thinkingdata.web.domain.gas.Do_gas_crawler_info;
import org.apache.ibatis.annotations.Param;


public interface Mapper_gas_crawler_info {
	public List<Do_gas_crawler_info> getAll();
	public Do_gas_crawler_info getGasCrawlerInfoByInfoId(@Param("info_id") Integer infoId);
	public List<Do_gas_crawler_info> getByProjectId(@Param("project_id") int project_id);
	public List<Do_gas_crawler_info> getInfoidListByProjectId(@Param("project_id") int project_id);
	public List<Do_gas_crawler_info> getByInfoIdList(@Param("info_id_list") List<Long> info_id_list);
	public int update(Do_gas_crawler_info _do);
}
