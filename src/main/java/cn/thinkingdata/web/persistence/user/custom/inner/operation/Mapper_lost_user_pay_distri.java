package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_lost_user_pay_distri;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Xiaowu on 2016/11/4.
 */
public interface Mapper_lost_user_pay_distri {
    public List<Do_lost_user_pay_distri> getLostUserPayDistriListByGameId(@Param("game_id") Integer gameId, @Param("start_date")  String startDate, @Param("end_date") String endDate);
}
