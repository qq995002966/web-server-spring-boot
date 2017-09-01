package cn.thinkingdata.web.domain.user.custom.inner;

import java.util.Date;

/**
 * Created by Xiaowu on 2016/8/24.
 */
public class Do_game_form_config {
    private Integer form_id;
    private Integer service_id;
    private Integer game_id;
    private String form_name;
    private Integer form_type;
    private String sql_template;
    private Integer is_disable;
    private Date create_time;

    public Integer getForm_id() {
        return form_id;
    }

    public void setForm_id(Integer form_id) {
        this.form_id = form_id;
    }

    public Integer getService_id() {
        return service_id;
    }

    public void setService_id(Integer service_id) {
        this.service_id = service_id;
    }

    public Integer getGame_id() {
        return game_id;
    }

    public void setGame_id(Integer game_id) {
        this.game_id = game_id;
    }

    public String getForm_name() {
        return form_name;
    }

    public void setForm_name(String form_name) {
        this.form_name = form_name;
    }

    public Integer getForm_type() {
        return form_type;
    }

    public void setForm_type(Integer form_type) {
        this.form_type = form_type;
    }

    public String getSql_template() {
        return sql_template;
    }

    public void setSql_template(String sql_template) {
        this.sql_template = sql_template;
    }

    public Integer getIs_disable() {
        return is_disable;
    }

    public void setIs_disable(Integer is_disable) {
        this.is_disable = is_disable;
    }

    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }
}
