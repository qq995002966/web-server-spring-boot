package cn.thinkingdata.web.domain.user;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by Xiaowu on 2016/8/3.
 */
public class Do_user_role implements Serializable {

    private static final long serialVersionUID = -5560518374391442531L;
    private Integer role_id;
    private String name;
    private Integer status;
    private Date create_time;
    private Date update_time;

    public Integer getRole_id() {
        return role_id;
    }

    public void setRole_id(Integer role_id) {
        this.role_id = role_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Date getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }
}
