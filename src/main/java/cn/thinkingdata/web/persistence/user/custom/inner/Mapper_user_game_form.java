package cn.thinkingdata.web.persistence.user.custom.inner;

import cn.thinkingdata.web.domain.user.custom.inner.Do_user_game_form;
import org.apache.ibatis.annotations.Param;

/**
 * Created by Xiaowu on 2016/8/25.
 */
public interface Mapper_user_game_form {

    public Do_user_game_form findUserGameFormByUserAndService(@Param("user_id") Integer userId,@Param("service_id") Integer serviceId,@Param("game_id") Integer gameId);

    public Integer insertUpdateUserGameForm(Do_user_game_form userGameForm);
}
