package cn.thinkingdata.web.persistence.elasticsearch;

import cn.thinkingdata.web.domain.elasticsearch.Do_table_mapping;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Xiaowu on 2016/9/27.
 */
public interface Mapper_table_mapping {

    public List<Do_table_mapping> findTableMappingByTableName(@Param("table_name") String table_name);
}
