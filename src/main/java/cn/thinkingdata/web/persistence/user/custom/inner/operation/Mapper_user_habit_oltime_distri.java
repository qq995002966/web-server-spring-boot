package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_user_habit_oltime_distri;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Xiaowu on 2016/11/4.
 */
public interface Mapper_user_habit_oltime_distri {
    public List<Do_user_habit_oltime_distri> getUserHabitOltimeDistriListByGame(@Param("game_id") Integer gameId, @Param("start_date")  String startDate, @Param("end_date") String endDate);
}
