package cn.thinkingdata.web.domain.project;

import com.alibaba.fastjson.annotation.JSONField;

import java.util.Date;

/**
 * @author Carpenter
 * @date 2016/12/19 15:01
 * @description Do_project_opinion_rank_distri
 */
public class Do_project_opinion_rank_distri {

    @JSONField(format="yyyy-MM-dd")
    private Date data_date;
    @JSONField(serialize=false)
    private Integer project_id;
    private Integer rank;

    public Date getData_date() {
        return data_date;
    }

    public void setData_date(Date data_date) {
        this.data_date = data_date;
    }

    public Integer getProject_id() {
        return project_id;
    }

    public void setProject_id(Integer project_id) {
        this.project_id = project_id;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }
}
