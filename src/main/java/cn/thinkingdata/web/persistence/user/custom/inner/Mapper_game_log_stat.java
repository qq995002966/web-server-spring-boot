package cn.thinkingdata.web.persistence.user.custom.inner;

import cn.thinkingdata.web.domain.user.custom.inner.Do_game_log_stat;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Xiaowu on 2016/9/18.
 */
public interface Mapper_game_log_stat {
    public List<Do_game_log_stat> getGameLogByIdAndType(@Param("game_id") Integer game_id,@Param("log_type") String log_type,@Param("start_date") String start_date,@Param("end_date") String end_date);
}
