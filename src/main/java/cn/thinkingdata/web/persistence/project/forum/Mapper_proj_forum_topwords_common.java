package cn.thinkingdata.web.persistence.project.forum;


import cn.thinkingdata.web.domain.project.forum.Do_proj_forum_topwords_common;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_proj_forum_topwords_common {
    public List<Do_proj_forum_topwords_common> getKeywordsDistribute(@Param("project_id") int project_id, @Param("start_date") String start_date, @Param("end_date") String end_date);

    public List<Do_proj_forum_topwords_common> getKeywordClassifyCountByProjectId(@Param("project_id") int project_id, @Param("start_date") String start_date, @Param("end_date") String end_date);

    public List<Do_proj_forum_topwords_common> getKeywordByKeywordClassify(@Param("project_id") int project_id, @Param("start_date") String start_date, @Param("end_date") String end_date, @Param("keyword_classify") String keyword_classify);

    public List<Do_proj_forum_topwords_common> getProjForumDataByKeyword(@Param("project_id") int project_id, @Param("start_date") String start_date, @Param("end_date") String end_date, @Param("keyword") String keyword);
}
