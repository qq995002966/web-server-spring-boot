package cn.thinkingdata.web.domain.report;

import com.alibaba.fastjson.annotation.JSONField;

import java.util.Date;

/**
 * Created by Xiaowu on 2016/9/27.
 */
public class Do_report {

    public static final int DEFAULT_STATU = 0;
    public static final int DEMO_STATU = 1;

    private Integer report_id;
    private String report_name;
    private String report_slogan;
    private String cover_pic;
    private String report_desc;
    @JSONField(serialize=false)
    private String report_path;
    private Integer status;
    @JSONField(serialize=false)
    private Date create_time;
    @JSONField(serialize=false)
    private Integer item_id;

    public Integer getReport_id() {
        return report_id;
    }

    public void setReport_id(Integer report_id) {
        this.report_id = report_id;
    }

    public String getReport_name() {
        return report_name;
    }

    public void setReport_name(String report_name) {
        this.report_name = report_name;
    }

    public String getReport_slogan() {
        return report_slogan;
    }

    public void setReport_slogan(String report_slogan) {
        this.report_slogan = report_slogan;
    }

    public String getCover_pic() {
        return cover_pic;
    }

    public void setCover_pic(String cover_pic) {
        this.cover_pic = cover_pic;
    }

    public String getReport_desc() {
        return report_desc;
    }

    public void setReport_desc(String report_desc) {
        this.report_desc = report_desc;
    }

    public String getReport_path() {
        return report_path;
    }

    public void setReport_path(String report_path) {
        this.report_path = report_path;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    public Integer getItem_id() {
        return item_id;
    }

    public void setItem_id(Integer item_id) {
        this.item_id = item_id;
    }
}
