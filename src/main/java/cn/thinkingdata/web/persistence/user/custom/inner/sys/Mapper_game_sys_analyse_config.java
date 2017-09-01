package cn.thinkingdata.web.persistence.user.custom.inner.sys;

import cn.thinkingdata.web.domain.user.custom.inner.sys.Do_game_sys_analyse_config;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Carpenter on 2017/3/1.
 */
public interface Mapper_game_sys_analyse_config {

    public List<Do_game_sys_analyse_config> findMenuConfigByGameId(@Param("game_id") Integer gameId);

    public List<Do_game_sys_analyse_config> findMenuConfigByGameIdAndMenu(@Param("game_id") Integer gameId,@Param("menu") String menu);

    public Do_game_sys_analyse_config findMenuConfigByChartId(@Param("chart_id") Integer chartId);
}
