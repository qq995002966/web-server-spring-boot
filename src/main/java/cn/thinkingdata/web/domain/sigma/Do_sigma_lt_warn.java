package cn.thinkingdata.web.domain.sigma;


import java.util.Date;

public class Do_sigma_lt_warn {

    private Date data_date;
    private Integer project_id;
    private String main_type;
    private String sub_type;
    private Float warn_level;

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

    public String getMain_type() {
        return main_type;
    }

    public void setMain_type(String main_type) {
        this.main_type = main_type;
    }

    public String getSub_type() {
        return sub_type;
    }

    public void setSub_type(String sub_type) {
        this.sub_type = sub_type;
    }

    public Float getWarn_level() {
        return warn_level;
    }

    public void setWarn_level(Float warn_level) {
        this.warn_level = warn_level;
    }
}
