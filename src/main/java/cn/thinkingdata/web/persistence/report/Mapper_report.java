package cn.thinkingdata.web.persistence.report;

import cn.thinkingdata.web.domain.report.Do_report;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by Xiaowu on 2016/9/27.
 */
public interface Mapper_report {

    public Do_report get(@Param("report_id") int report_id);

    public List<Do_report> findByItem(@Param("item_id") int item_id);

    public List<Do_report> findByUserAndItemDemo(@Param("item_id") int item_id);

    public List<Do_report> findByUserAndClassifyDemo(@Param("classify_id") int classify_id);

    public List<Do_report> findByUserAndItem(@Param("user_id") int user_id,@Param("item_id") int item_id);

    public List<Do_report> findByUserAndClassify(@Param("user_id") int user_id,@Param("classify_id") int classify_id);

    public List<Do_report> getUserReportList(@Param("user_id") Integer user_id);
}
