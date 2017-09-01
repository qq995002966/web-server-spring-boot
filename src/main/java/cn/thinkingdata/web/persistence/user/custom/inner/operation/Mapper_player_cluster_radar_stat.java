package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_player_cluster_radar_stat;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * @author Carpenter
 * @date 2017/3/1 15:59
 * @description Mapper_player_cluster_radar_stat
 */
public interface Mapper_player_cluster_radar_stat {
    public List<Do_player_cluster_radar_stat> findPlayerClusterRadarStatByGameIdAndType(@Param("game_id")Integer gameId, @Param("user_type")String user_type);

    public List findPlayerClusterTypeByGameId(Integer gameId);

    public List<Map> findPlayerClusterTypeAndCountByGameId(Integer gameId);
}
