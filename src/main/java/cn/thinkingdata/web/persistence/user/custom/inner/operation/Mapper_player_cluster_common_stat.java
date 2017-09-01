package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_player_cluster_common_stat;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Carpenter
 * @date 2017/3/1 15:58
 * @description Mapper_player_cluster_common_stat
 */
public interface Mapper_player_cluster_common_stat {
    public Do_player_cluster_common_stat getPlayerClusterCommonStatListByGameId(@Param("game_id")Integer gameId);
}
