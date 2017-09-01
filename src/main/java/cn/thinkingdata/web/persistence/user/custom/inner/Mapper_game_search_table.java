package cn.thinkingdata.web.persistence.user.custom.inner;

import cn.thinkingdata.web.domain.user.custom.inner.Do_game_search_table;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Xiaowu on 2016/8/26.
 */
public interface Mapper_game_search_table {
    public Do_game_search_table findGameSearchTableByServiceAndGame(@Param("service_id") Integer serviceId, @Param("game_id") Integer gameId);

    public Do_game_search_table findGameSearchTableByServiceAndGameAndType(@Param("service_id") Integer serviceId, @Param("game_id") Integer gameId,@Param("table_name")  String table_name);

    public Do_game_search_table findGameSearchTableById(@Param("gt_id") Integer gtId);

    public List findLogSearchTableTypeByGame(@Param("game_id") Integer gameId);
}
