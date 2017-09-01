package cn.thinkingdata.web.persistence.project.forum;


import cn.thinkingdata.web.domain.project.forum.Do_proj_forum_attitude_distri;
import cn.thinkingdata.web.vo.project.forum.Vo_proj_forum_attitude;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_proj_forum_attitude_distri {
    public List<Do_proj_forum_attitude_distri> getDistribute(@Param("project_id") int project_id, @Param("start_date") String start_date, @Param("end_date") String end_date);
    public List<Do_proj_forum_attitude_distri> getDetailDistribute(@Param("project_id") int project_id, @Param("start_date") String start_date, @Param("end_date") String end_date);
    public List<Do_proj_forum_attitude_distri> getForumPostNumDistribute(@Param("project_id") int project_id, @Param("start_date") String start_date, @Param("end_date") String end_date);
    public String getProjForumAttitudeLatestDate();
    public Vo_proj_forum_attitude getDetailDistributeByDate(@Param("project_id") int project_id, @Param("data_date") String data_date);
    public List<Vo_proj_forum_attitude> getDetailDistributeByProjectIdAndDate(@Param("project_id") Integer projectId,  @Param("start_date") String startDate, @Param("end_date") String endDate);
    public Vo_proj_forum_attitude getDetailDistributeByInfoIdAndDate(@Param("info_id") Integer infoId,  @Param("start_date") String startDate, @Param("end_date") String endDate);
    public String getProjForumName(@Param("info_id") Integer infoId);
}
