package cn.thinkingdata.web.domain.project.outflow;

import com.alibaba.fastjson.annotation.JSONField;

import java.util.Date;

public class Do_proj_outflow_reason {

    @JSONField(format="yyyy-MM-dd")
    private Date data_date;
    private Integer project_id;
    private String lost_type;
    private String lost_reason;
    private Integer weight;
    private String sum_reason;
    private String sum_type;

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

    public String getLost_type() {
        return lost_type;
    }

    public void setLost_type(String lost_type) {
        this.lost_type = lost_type;
    }

    public String getLost_reason() {
        return lost_reason;
    }

    public void setLost_reason(String lost_reason) {
        this.lost_reason = lost_reason;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public String getSum_reason() {
        return sum_reason;
    }

    public void setSum_reason(String sum_reason) {
        this.sum_reason = sum_reason;
    }

    public String getSum_type() {
        return sum_type;
    }

    public void setSum_type(String sum_type) {
        this.sum_type = sum_type;
    }
}
