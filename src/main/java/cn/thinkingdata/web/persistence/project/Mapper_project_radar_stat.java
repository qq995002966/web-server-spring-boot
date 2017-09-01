package cn.thinkingdata.web.persistence.project;

import cn.thinkingdata.web.domain.project.Do_project_radar_stat;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

public interface Mapper_project_radar_stat {

    public Do_project_radar_stat getGameRadar(@Param("project_id") int projectId);

    public Map getGameAvg(@Param("project_id") int projectId);
}
