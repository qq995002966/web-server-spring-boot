package cn.thinkingdata.web.domain.user.custom.inner.game;

import com.alibaba.fastjson.annotation.JSONField;

import java.util.Date;

/**
 * Created by Xiaowu on 2016/10/27.
 */
public class Do_user_habit_play_time_stat {
    private Integer game_id;
    @JSONField(format="yyyy-MM-dd")
    private Date data_date;
    private String user_type;
    private Float login_times;
    private Float online_time;
    private String abnormal_columns;

    public Integer getGame_id() {
        return game_id;
    }

    public void setGame_id(Integer game_id) {
        this.game_id = game_id;
    }

    public Date getData_date() {
        return data_date;
    }

    public void setData_date(Date data_date) {
        this.data_date = data_date;
    }

    public String getUser_type() {
        return user_type;
    }

    public void setUser_type(String user_type) {
        this.user_type = user_type;
    }

    public Float getLogin_times() {
        return login_times;
    }

    public void setLogin_times(Float login_times) {
        this.login_times = login_times;
    }

    public Float getOnline_time() {
        return online_time;
    }

    public void setOnline_time(Float online_time) {
        this.online_time = online_time;
    }

    public String getAbnormal_columns() {
        return abnormal_columns;
    }

    public void setAbnormal_columns(String abnormal_columns) {
        this.abnormal_columns = abnormal_columns;
    }
}
