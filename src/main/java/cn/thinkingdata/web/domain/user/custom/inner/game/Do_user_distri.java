package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.util.Date;

/**
 * @author Carpenter
 * @date 2016/11/10 17:47
 * @description Do_user_distri
 */
public abstract class Do_user_distri {

    private Integer game_id;
    private Date data_date;
    private Float user_num;
    private Float user_rate;
    private Float percentage;

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

    public Float getUser_num() {
        return user_num;
    }

    public void setUser_num(Float user_num) {
        this.user_num = user_num;
    }

    public Float getUser_rate() {
        return user_rate;
    }

    public void setUser_rate(Float user_rate) {
        this.user_rate = user_rate;
    }

    public Float getPercentage() {
        return percentage;
    }

    public void setPercentage(Float percentage) {
        this.percentage = percentage;
    }
}
