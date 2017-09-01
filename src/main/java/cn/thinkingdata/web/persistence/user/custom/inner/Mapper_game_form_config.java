package cn.thinkingdata.web.persistence.user.custom.inner;

import cn.thinkingdata.web.domain.user.custom.inner.Do_game_form_config;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by Xiaowu on 2016/8/24.
 */
public interface Mapper_game_form_config {

    public List<Do_game_form_config> findConfigByServiceAndGame(@Param("service_id") Integer serviceId,@Param("game_id") Integer gameId,@Param("chart_type") Integer chartType);

    public List<Map> findDataBySQL(String sql);

    public Do_game_form_config getGameFormConfigById(@Param("form_id") Integer formId);

}
