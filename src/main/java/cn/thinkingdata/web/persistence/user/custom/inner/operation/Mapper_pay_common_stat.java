package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_pay_common_stat;
import cn.thinkingdata.web.domain.user.custom.inner.game.Do_pay_common_stat_month;
import cn.thinkingdata.web.domain.user.custom.inner.game.Do_pay_common_stat_week;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Carpenter on 2016/11/21.
 */
public interface Mapper_pay_common_stat {

    public List<Do_pay_common_stat> getPayCommonStatListByGameId(@Param("game_id") Integer gameId, @Param("start_date")  String startDate, @Param("end_date") String endDate);

    public List<Do_pay_common_stat_week> getPayCommonStatWeekListByGameId(@Param("game_id") Integer gameId, @Param("start_date")  String startDate, @Param("end_date") String endDate);

    public List<Do_pay_common_stat_month> getPayCommonStatMonthListByGameId(@Param("game_id") Integer gameId, @Param("start_date")  String startDate, @Param("end_date") String endDate);
}
