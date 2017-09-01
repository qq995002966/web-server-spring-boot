package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_game_retention_stat;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Xiaowu on 2016/10/31.
 */
public interface Mapper_game_retention_stat {

    public List<Do_game_retention_stat> getGameRetentionStatListByGameId(@Param("game_id") Integer gameId, @Param("data_date") String dataDate);

    public List<Do_game_retention_stat> getGameRetentionStatListByGameIdAndDate(@Param("game_id") Integer gameId,@Param("start_date")  String startDate,@Param("end_date") String endDate);

    public List<Do_game_retention_stat> getGameRetentionStatAvgByGameId(@Param("game_id") Integer gameId,@Param("data_date") String dataDate);


}
