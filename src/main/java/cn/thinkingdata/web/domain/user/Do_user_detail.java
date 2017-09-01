package cn.thinkingdata.web.domain.user;

import java.io.Serializable;

/**
 * Created by Xiaowu on 2016/8/3.
 */
public class Do_user_detail implements Serializable {

    private static final long serialVersionUID = -3961018020631078824L;
    public static final int VERIFY_FAILED = -1;
    public static final int NOT_VERIFY = 0;
    public static final int IN_VERIFY = 1;
    public static final int VERIFY_SUCCESS = 2;

    private Integer user_id       ;
    private Integer status = 0       ;
    private String status_info = ""   ;
    private Integer gender = 0       ;
    private Integer gaming_years = 0  ;
    private String company_name = ""  ;
    private String real_name = ""    ;
    private Integer company_type = 0 ;
    private Integer job_type = 0   ;
    private String project_names = "" ;
    private String tags_id = ""      ;
    private String mobile = "";
    private String qq = "";
    private String email = "";

    public Integer getUser_id() {
        return user_id;
    }
    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }
    public Integer getStatus() {
        return status;
    }
    public void setStatus(Integer status) {
        this.status = status;
    }
    public String getStatus_info() {
        return status_info;
    }
    public void setStatus_info(String status_info) {
        this.status_info = status_info;
    }
    public Integer getGender() {
        return gender;
    }
    public void setGender(Integer gender) {
        this.gender = gender;
    }
    public Integer getGaming_years() {
        return gaming_years;
    }
    public void setGaming_years(Integer gaming_years) {
        this.gaming_years = gaming_years;
    }
    public String getCompany_name() {
        return company_name;
    }
    public void setCompany_name(String company_name) {
        this.company_name = company_name;
    }
    public String getReal_name() {
        return real_name;
    }
    public void setReal_name(String real_name) {
        this.real_name = real_name;
    }
    public Integer getCompany_type() {
        return company_type;
    }
    public void setCompany_type(Integer company_type) {
        this.company_type = company_type;
    }
    public Integer getJob_type() {
        return job_type;
    }
    public void setJob_type(Integer job_type) {
        this.job_type = job_type;
    }
    public String getProject_names() {
        return project_names;
    }
    public void setProject_names(String project_names) {
        this.project_names = project_names;
    }
    public String getTags_id() {
        return tags_id;
    }
    public void setTags_id(String tags_id) {
        this.tags_id = tags_id;
    }
    public String getMobile() {
        return mobile;
    }
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }
    public String getQq() {
        return qq;
    }
    public void setQq(String qq) {
        this.qq = qq;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }


}

