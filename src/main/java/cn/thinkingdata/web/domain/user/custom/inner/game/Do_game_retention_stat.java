package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Created by Xiaowu on 2016/10/27.
 */
public class Do_game_retention_stat {
    private Integer game_id;
    private Date data_date;
    private Float retention_rate_1d;
    private Integer retention_num_1d;
    private Float retention_rate_7d;
    private Integer retention_num_7d;
    private Float retention_rate_30d;
    private Integer retention_num_30d;
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

    public Float getRetention_rate_1d() {
        BigDecimal bigDecimal = new BigDecimal((double)retention_rate_1d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRetention_rate_1d(Float retention_rate_1d) {
        this.retention_rate_1d = retention_rate_1d;
    }

    public Integer getRetention_num_1d() {
        return retention_num_1d;
    }

    public void setRetention_num_1d(Integer retention_num_1d) {
        this.retention_num_1d = retention_num_1d;
    }

    public Float getRetention_rate_7d() {
        BigDecimal bigDecimal = new BigDecimal((double)retention_rate_7d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRetention_rate_7d(Float retention_rate_7d) {
        this.retention_rate_7d = retention_rate_7d;
    }

    public Integer getRetention_num_7d() {
        return retention_num_7d;
    }

    public void setRetention_num_7d(Integer retention_num_7d) {
        this.retention_num_7d = retention_num_7d;
    }

    public Float getRetention_rate_30d() {
        BigDecimal bigDecimal = new BigDecimal((double)retention_rate_30d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRetention_rate_30d(Float retention_rate_30d) {
        this.retention_rate_30d = retention_rate_30d;
    }

    public Integer getRetention_num_30d() {
        return retention_num_30d;
    }

    public void setRetention_num_30d(Integer retention_num_30d) {
        this.retention_num_30d = retention_num_30d;
    }

    public String getAbnormal_columns() {
        return abnormal_columns;
    }

    public void setAbnormal_columns(String abnormal_columns) {
        this.abnormal_columns = abnormal_columns;
    }
}
