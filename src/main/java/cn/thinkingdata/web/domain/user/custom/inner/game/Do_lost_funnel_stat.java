package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.util.Date;

/**
 * @author Carpenter
 * @date 2016/11/18 15:08
 * @description Do_lost_funnel_stat
 */
public class Do_lost_funnel_stat {

    private Integer game_id;
    private Date data_date;
    private String user_type;
    private Integer total_user_num;
    private Integer left_user_1d;
    private Integer left_user_2d;
    private Integer left_user_7d;
    private Integer left_user_2w;
    private Integer left_user_3w;
    private Integer left_user_6w;
    private Integer left_user_1y;

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

    public Integer getTotal_user_num() {
        return total_user_num;
    }

    public void setTotal_user_num(Integer total_user_num) {
        this.total_user_num = total_user_num;
    }

    public Integer getLeft_user_1d() {
        return left_user_1d;
    }

    public void setLeft_user_1d(Integer left_user_1d) {
        this.left_user_1d = left_user_1d;
    }

    public Integer getLeft_user_2d() {
        return left_user_2d;
    }

    public void setLeft_user_2d(Integer left_user_2d) {
        this.left_user_2d = left_user_2d;
    }

    public Integer getLeft_user_7d() {
        return left_user_7d;
    }

    public void setLeft_user_7d(Integer left_user_7d) {
        this.left_user_7d = left_user_7d;
    }

    public Integer getLeft_user_2w() {
        return left_user_2w;
    }

    public void setLeft_user_1w(Integer left_user_2w) {
        this.left_user_2w = left_user_2w;
    }

    public Integer getLeft_user_3w() {
        return left_user_3w;
    }

    public void setLeft_user_3w(Integer left_user_3w) {
        this.left_user_3w = left_user_3w;
    }

    public Integer getLeft_user_6w() {
        return left_user_6w;
    }

    public void setLeft_user_6w(Integer left_user_6w) {
        this.left_user_6w = left_user_6w;
    }

    public Integer getLeft_user_1y() {
        return left_user_1y;
    }

    public void setLeft_user_1y(Integer left_user_1y) {
        this.left_user_1y = left_user_1y;
    }
}
