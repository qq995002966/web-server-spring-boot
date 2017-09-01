package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_first_pay_user_level_distri;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Carpenter on 2016/11/22.
 */
public interface Mapper_first_pay_user_level_distri {
    public List<Do_first_pay_user_level_distri> getFirstPayUserLevelListByGameIdAndDate(@Param("game_id") Integer gameId, @Param("start_date")  String startDate, @Param("end_date") String endDate);
}
