package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_user_habit_play_time_stat;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Xiaowu on 2016/11/4.
 */
public interface Mapper_user_habit_play_time_stat {

    public List<Do_user_habit_play_time_stat> getUserHabitPlayTimeStatDayListByGameIdAndDate(@Param("game_id") Integer gameId, @Param("start_date")  String startDate, @Param("end_date") String endDate);

    public List<Do_user_habit_play_time_stat> getUserHabitPlayTimeStatWeekListByGameIdAndDate(@Param("game_id") Integer gameId,@Param("start_date")  String startDate,@Param("end_date") String endDate);

    public List<Do_user_habit_play_time_stat> getUserHabitPlayTimeStatMonthListByGameIdAndDate(@Param("game_id") Integer gameId,@Param("start_date")  String startDate,@Param("end_date") String endDate);


}
