package cn.thinkingdata.web.persistence.user.custom.inner.operation;

import cn.thinkingdata.web.domain.user.custom.inner.game.Do_retention_custom_analysis;
import cn.thinkingdata.web.domain.user.custom.inner.game.Do_retention_custom_analysis_day;
import cn.thinkingdata.web.domain.user.custom.inner.game.Do_retention_custom_analysis_month;
import cn.thinkingdata.web.domain.user.custom.inner.game.Do_retention_custom_analysis_week;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Carpenter on 2016/11/23.
 */
public interface Mapper_retention_custom_analysis {
    public List<Do_retention_custom_analysis_day> getRetentionCustomAnalysisDayListByGameIdAndDate(@Param("game_id") Integer gameId, @Param("start_date")  String startDate, @Param("end_date") String endDate);

    public List<Do_retention_custom_analysis_week> getRetentionCustomAnalysisWeekListByGameIdAndDate(@Param("game_id") Integer gameId, @Param("start_date")  String startDate, @Param("end_date") String endDate);

    public List<Do_retention_custom_analysis_month> getRetentionCustomAnalysisMonthListByGameIdAndDate(@Param("game_id") Integer gameId, @Param("start_date")  String startDate, @Param("end_date") String endDate);
}
