package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_pay_user_pay_method_distri;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Carpenter on 2016/11/22.
 */
public interface Mapper_pay_user_pay_method_distri {
    public List<Do_pay_user_pay_method_distri> getPayUserPayMethodListByGameIdAndDate(@Param("game_id") Integer gameId, @Param("start_date")  String startDate, @Param("end_date") String endDate);
}
