package cn.thinkingdata.web.domain.user.custom.inner.game;

import com.alibaba.fastjson.annotation.JSONField;

import java.util.Date;

/**
 * Created by Xiaowu on 2016/10/27.
 */
public class Do_lost_user_common_analysis {
    private Integer game_id;
    @JSONField(format="yyyy-MM-dd")
    private Date data_date;
    @JSONField(serialize = false)
    private String lost_type;
    @JSONField(serialize = false)
    private String user_type;
    private Integer user_num;
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

    public String getLost_type() {
        return lost_type;
    }

    public void setLost_type(String lost_type) {
        this.lost_type = lost_type;
    }

    public String getUser_type() {
        return user_type;
    }

    public void setUser_type(String user_type) {
        this.user_type = user_type;
    }

    public Integer getUser_num() {
        return user_num;
    }

    public void setUser_num(Integer user_num) {
        this.user_num = user_num;
    }

    public String getAbnormal_columns() {
        return abnormal_columns;
    }

    public void setAbnormal_columns(String abnormal_columns) {
        this.abnormal_columns = abnormal_columns;
    }
}
