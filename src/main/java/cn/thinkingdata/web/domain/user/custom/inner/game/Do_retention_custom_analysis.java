package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.util.Date;

/**
 * @author Carpenter
 * @date 2016/11/18 10:26
 * @description Do_retention_custom_analysis
 */
public abstract class Do_retention_custom_analysis {

    private Integer game_id;
    private Date data_date;
    private String date_type;
    private String user_type;
    private Integer user_num;

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

    public String getDate_type() {
        return date_type;
    }

    public void setDate_type(String date_type) {
        this.date_type = date_type;
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

}
