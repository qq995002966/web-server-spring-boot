package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_player_lost_pay_stat;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by Carpenter on 2017/3/16.
 */
public interface Mapper_player_lost_pay_stat {

    public List<Do_player_lost_pay_stat> findPlayerPlayerLostPayStatByGameIdAndClassify(@Param("game_id") Integer gameId, @Param("classify_name")  String classifyName, @Param("user_type")  String userType);

    public List<Map> findPlayerPlayerLostPayStatClassifyByUserType(@Param("game_id") Integer gameId, @Param("user_type")  String userType);
}
