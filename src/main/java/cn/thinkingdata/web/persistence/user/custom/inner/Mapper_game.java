package cn.thinkingdata.web.persistence.user.custom.inner;

import cn.thinkingdata.web.domain.user.custom.inner.Do_game_dim;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by Xiaowu on 2016/8/25.
 */
public interface Mapper_game {

    public Do_game_dim getGameById(@Param("game_id") Integer gameId);

}
