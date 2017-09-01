package cn.thinkingdata.web.domain.project;


import com.alibaba.fastjson.annotation.JSONField;

import java.util.Date;

public class Do_proj_outflow_direction_detail {

    @JSONField(format="yyyy-MM-dd")
    private Date data_date;
    private Integer project_id;
    private String forum_name;
    private Integer count;
    private String pic_url;

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

    public String getForum_name() {
        return forum_name;
    }

    public void setForum_name(String forum_name) {
        this.forum_name = forum_name;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public String getPic_url() {
        return pic_url;
    }

    public void setPic_url(String pic_url) {
        this.pic_url = pic_url;
    }
}
