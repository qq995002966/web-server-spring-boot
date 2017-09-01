package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_player_cluster_detail_stat;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Carpenter on 2017/3/1.
 */
public interface Mapper_player_cluster_detail_stat {
    public List<Do_player_cluster_detail_stat> findPlayerClusterDetailStatByGameIdAndType(@Param("game_id")Integer gameId, @Param("agg_code")Integer aggCode, @Param("user_type")String user_type, @Param("cluster_type")String cluster_type);
}
