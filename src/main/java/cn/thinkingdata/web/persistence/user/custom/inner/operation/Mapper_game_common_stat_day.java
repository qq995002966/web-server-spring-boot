package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_game_common_stat_day;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Xiaowu on 2016/10/31.
 */
public interface Mapper_game_common_stat_day {

    public List<Do_game_common_stat_day> getGameCommonStatDayListByGameId(@Param("game_id") Integer gameId,@Param("data_date") String dataDate);

    public List<Do_game_common_stat_day> getGameCommonStatDayAvgByGameId(@Param("game_id") Integer gameId,@Param("data_date") String dataDate);

    public List<Do_game_common_stat_day> getGameCommonStatDayListByGameIdAndDate(@Param("game_id") Integer gameId,@Param("start_date")  String startDate,@Param("end_date") String endDate);
}
