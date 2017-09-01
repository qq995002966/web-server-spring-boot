package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;
import java.util.Date;

/**
 * @author Carpenter
 * @date 2016/11/18 15:05
 * @description Do_lost_common_stat_day
 */
public class Do_lost_common_stat {

    private Integer game_id;
    private Date data_date;
    private String user_type;
    private Float lost_rate_7d;
    private Float lost_rate_14d;
    private Float lost_rate_30d;
    private Integer back_num_7d;
    private Integer back_num_14d;
    private Integer back_num_30d;
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

    public Float getLost_rate_7d() {
        BigDecimal bigDecimal = new BigDecimal((double)lost_rate_7d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setLost_rate_7d(Float lost_rate_7d) {
        this.lost_rate_7d = lost_rate_7d;
    }

    public Float getLost_rate_14d() {
        BigDecimal bigDecimal = new BigDecimal((double)lost_rate_14d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setLost_rate_14d(Float lost_rate_14d) {
        this.lost_rate_14d = lost_rate_14d;
    }

    public Float getLost_rate_30d() {
        BigDecimal bigDecimal = new BigDecimal((double)lost_rate_30d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setLost_rate_30d(Float lost_rate_30d) {
        this.lost_rate_30d = lost_rate_30d;
    }

    public Integer getBack_num_7d() {
        return back_num_7d;
    }

    public void setBack_num_7d(Integer back_num_7d) {
        this.back_num_7d = back_num_7d;
    }

    public Integer getBack_num_14d() {
        return back_num_14d;
    }

    public void setBack_num_14d(Integer back_num_14d) {
        this.back_num_14d = back_num_14d;
    }

    public Integer getBack_num_30d() {
        return back_num_30d;
    }

    public void setBack_num_30d(Integer back_num_30d) {
        this.back_num_30d = back_num_30d;
    }

    public String getAbnormal_columns() {
        return abnormal_columns;
    }

    public void setAbnormal_columns(String abnormal_columns) {
        this.abnormal_columns = abnormal_columns;
    }
}
