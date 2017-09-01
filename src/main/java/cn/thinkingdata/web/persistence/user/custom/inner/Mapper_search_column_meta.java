package cn.thinkingdata.web.persistence.user.custom.inner;

import cn.thinkingdata.web.domain.user.custom.inner.Do_search_column_meta;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Xiaowu on 2016/8/26.
 */
public interface Mapper_search_column_meta {
    public List<Do_search_column_meta> findSearchMetaByServiceAndGame(@Param("service_id") Integer serviceId,@Param("game_id")  Integer gameId);
    public List<String> findSearchMetaGroupByServiceAndGame(@Param("service_id") Integer serviceId,@Param("game_id")  Integer gameId);
    public List findSearchMetaByServiceAndGameAndType(@Param("service_id") Integer serviceId,@Param("game_id")  Integer gameId,@Param("table_name")  String table_name);
}
