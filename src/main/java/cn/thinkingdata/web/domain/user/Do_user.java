package cn.thinkingdata.web.domain.user;

import java.io.Serializable;
import java.util.Set;

/**
 * Created by Xiaowu on 2016/8/3.
 */
public class Do_user implements Serializable {
    public static final int FORBIDDEN_USER = -1;
    public static final int NORMAL_USER = 0;
    public static final int SUPER_USER = 10;
    public static final int ADMIN = 11;

    private static final long serialVersionUID = -5560518374391442531L;
    private Integer user_id;
    private Do_user_role user_role;
    private String mobile;
    private String email;
    private String tg_open_id;
    private String qq_open_id;
    private String wx_union_id;
    private String password;
    private String nick_name;
    private String create_time;
    private Long last_login_time;
    private String last_login_ip;
    private Integer user_level;
    private String projects_id;
    private Set<Integer> innerGameSet;
    private Set<Integer> outterGameSet;

    public Integer getUser_id() {
        return user_id;
    }

    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }

    public Do_user_role getUser_role() {
        return user_role;
    }

    public void setUser_role(Do_user_role user_role) {
        this.user_role = user_role;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTg_open_id() {
        return tg_open_id;
    }

    public void setTg_open_id(String tg_open_id) {
        this.tg_open_id = tg_open_id;
    }

    public String getQq_open_id() {
        return qq_open_id;
    }

    public void setQq_open_id(String qq_open_id) {
        this.qq_open_id = qq_open_id;
    }

    public String getWx_union_id() {
        return wx_union_id;
    }

    public void setWx_union_id(String wx_union_id) {
        this.wx_union_id = wx_union_id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNick_name() {
        return nick_name;
    }

    public void setNick_name(String nick_name) {
        this.nick_name = nick_name;
    }


    public String getCreate_time() {
        return create_time;
    }

    public void setCreate_time(String create_time) {
        this.create_time = create_time;
    }

    public Long getLast_login_time() {
        return last_login_time;
    }

    public void setLast_login_time(Long last_login_time) {
        this.last_login_time = last_login_time;
    }

    public String getLast_login_ip() {
        return last_login_ip;
    }

    public void setLast_login_ip(String last_login_ip) {
        this.last_login_ip = last_login_ip;
    }

    public Integer getUser_level() {
        return user_level;
    }

    public void setUser_level(Integer user_level) {
        this.user_level = user_level;
    }

    public String getProjects_id() {
        return projects_id;
    }

    public void setProjects_id(String projects_id) {
        this.projects_id = projects_id;
    }

    public Set<Integer> getInnerGameSet() {
        return innerGameSet;
    }

    public void setInnerGameSet(Set<Integer> innerGameSet) {
        this.innerGameSet = innerGameSet;
    }

    public Set<Integer> getOutterGameSet() {
        return outterGameSet;
    }

    public void setOutterGameSet(Set<Integer> outterGameSet) {
        this.outterGameSet = outterGameSet;
    }
}
