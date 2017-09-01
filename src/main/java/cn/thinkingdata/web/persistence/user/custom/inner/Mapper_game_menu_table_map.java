package cn.thinkingdata.web.persistence.user.custom.inner;

import cn.thinkingdata.web.domain.user.custom.inner.Do_game_menu_table_map;
import cn.thinkingdata.web.domain.user.custom.inner.game.*;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Carpenter on 2016/12/8.
 */
public interface Mapper_game_menu_table_map {
    public List<Do_game_menu_table_map> getGameMenuTableMapListByTableAndColumn(@Param("game_id") Integer game_id, @Param("table_name") String table_name, @Param("column_name") String column_name);

    public Do_game_common_stat_day getAbnormalGameCommonStatDay(@Param("game_id") Integer gameId);

    public Do_game_retention_stat getAbnormalGameRetentionStat(@Param("game_id") Integer gameId);

    public Do_pay_user_potential_lost_stat getAbnormalPayUserPotentialLost(@Param("game_id") Integer gameId);

    public Do_lost_user_common_analysis getAbnormalLostUserCommonAnalysis(@Param("game_id") Integer gameId);

    public Do_user_habit_play_time_stat getAbnormalUserHabitPlayTimeStatDay(@Param("game_id") Integer gameId);

    public Do_user_habit_play_time_stat getAbnormalUserHabitPlayTimeStatWeek(@Param("game_id") Integer gameId);

    public Do_channel_common_stat getAbnormalChannelCommonStat(@Param("game_id") Integer gameId);

    public Do_pay_common_stat_week getAbnormalPayCommonStatWeek(@Param("game_id") Integer gameId);

    public Do_lost_common_stat getAbnormalLostCommonStatDay(@Param("game_id") Integer gameId);
}
