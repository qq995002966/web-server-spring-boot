package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_lost_user_common_analysis;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Xiaowu on 2016/11/4.
 */
public interface Mapper_lost_user_common_analysis {

    public List<Do_lost_user_common_analysis> getLostUserCommonAnalysisListByGameIdAndDate(@Param("game_id") Integer gameId, @Param("start_date")  String startDate, @Param("end_date") String endDate);
}
