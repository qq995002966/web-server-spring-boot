package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_channel_common_stat;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Carpenter on 2016/11/21.
 */
public interface Mapper_channel_common_stat {

    public List<Do_channel_common_stat> getChannelCommonStatByGameId(@Param("game_id") Integer gameId,@Param("start_date")  String startDate,@Param("end_date") String endDate,@Param("order_type") String orderType);

    public List<Do_channel_common_stat> getChannelQualityByGameId(@Param("game_id") Integer gameId,@Param("start_date")  String startDate,@Param("end_date") String endDate);

    public List<Do_channel_common_stat> getChannelCommonStatByGameIdAndDate(@Param("game_id") Integer gameId,@Param("start_date")  String startDate,@Param("end_date") String endDate);

    public List<Do_channel_common_stat> getChannelPayByGameId(@Param("game_id") Integer gameId,@Param("start_date")  String startDate,@Param("end_date") String endDate);
}
