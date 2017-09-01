package cn.thinkingdata.web.persistence.project;

import cn.thinkingdata.web.domain.project.Do_project_opinion_rank_distri;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Carpenter on 2016/12/19.
 */
public interface Mapper_project_opinion_rank_distri {

    public List<Do_project_opinion_rank_distri> getProjectOpinionRankList(@Param("project_id") int project_id, @Param("start_date") String data_date_start, @Param("end_date") String data_date_end);

    public Do_project_opinion_rank_distri getProjectOpinionRankByProjectId(@Param("project_id") Integer projectId);

    public String getLatestProjectOpinionRank();

    public Do_project_opinion_rank_distri getProjectOpinionRankByProjectIdAndDate(@Param("project_id") Integer projectId, @Param("data_date") String data_date);
}
