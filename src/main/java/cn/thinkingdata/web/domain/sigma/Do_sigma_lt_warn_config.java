package cn.thinkingdata.web.domain.sigma;

import java.util.Date;

public class Do_sigma_lt_warn_config {

    private Integer id;
    private Integer user_id;
    private String task_name;
    private Integer project_id;
    private String email_addr;
    private Integer status;
    private String lt_warn_class;
    private Integer warn_level;
    private Date create_time;
    private Date last_send_time;
    private Integer delete_flag;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUser_id() {
        return user_id;
    }

    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }

    public String getTask_name() {
        return task_name;
    }

    public void setTask_name(String task_name) {
        this.task_name = task_name;
    }

    public Integer getProject_id() {
        return project_id;
    }

    public void setProject_id(Integer project_id) {
        this.project_id = project_id;
    }

    public String getEmail_addr() {
        return email_addr;
    }

    public void setEmail_addr(String email_addr) {
        this.email_addr = email_addr;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getLt_warn_class() {
        return lt_warn_class;
    }

    public void setLt_warn_class(String lt_warn_class) {
        this.lt_warn_class = lt_warn_class;
    }

    public Integer getWarn_level() {
        return warn_level;
    }

    public void setWarn_level(Integer warn_level) {
        this.warn_level = warn_level;
    }

    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    public Date getLast_send_time() {
        return last_send_time;
    }

    public void setLast_send_time(Date last_send_time) {
        this.last_send_time = last_send_time;
    }

    public Integer getDelete_flag() {
        return delete_flag;
    }

    public void setDelete_flag(Integer delete_flag) {
        this.delete_flag = delete_flag;
    }
}
