package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;
import java.util.Date;
import java.util.StringTokenizer;

/**
 * @author Carpenter
 * @date 2016/11/18 10:37
 * @description Do_channel_common_stat
 */
public class Do_channel_common_stat {

    private Integer game_id;
    private Date data_date;
    private String channel_id;
    private Integer newlogin_num;
    private Float retention_rate_1d;
    private Float retention_rate_7d;
    private Float retention_rate_30d;
    private Integer login_num;
    private Float first_week_pay_rate;
    private Float pay_amount;
    private Integer pay_num;
    private Integer pay_times;
    private Float pay_rate;
    private Float arpu;
    private Float arppu;
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

    public String getChannel_id() {
        return channel_id;
    }

    public void setChannel_id(String channel_id) {
        this.channel_id = channel_id;
    }

    public Integer getNewlogin_num() {
        return newlogin_num;
    }

    public void setNewlogin_num(Integer newlogin_num) {
        this.newlogin_num = newlogin_num;
    }

    public Float getRetention_rate_1d() {
        BigDecimal bigDecimal = new BigDecimal((double) retention_rate_1d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRetention_rate_1d(Float retention_rate_1d) {
        this.retention_rate_1d = retention_rate_1d;
    }

    public Float getRetention_rate_7d() {
        BigDecimal bigDecimal = new BigDecimal((double)retention_rate_7d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRetention_rate_7d(Float retention_rate_7d) {
        this.retention_rate_7d = retention_rate_7d;
    }

    public Float getRetention_rate_30d() {
        BigDecimal bigDecimal = new BigDecimal((double)retention_rate_30d * 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRetention_rate_30d(Float retention_rate_30d) {
        this.retention_rate_30d = retention_rate_30d;
    }

    public Integer getLogin_num() {
        return login_num;
    }

    public void setLogin_num(Integer login_num) {
        this.login_num = login_num;
    }

    public Float getFirst_week_pay_rate() {
        BigDecimal bigDecimal = new BigDecimal((double) first_week_pay_rate* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setFirst_week_pay_rate(Float first_week_pay_rate) {
        this.first_week_pay_rate = first_week_pay_rate;
    }

    public Float getPay_amount() {
        return pay_amount;
    }

    public void setPay_amount(Float pay_amount) {
        this.pay_amount = pay_amount;
    }

    public Integer getPay_num() {
        return pay_num;
    }

    public void setPay_num(Integer pay_num) {
        this.pay_num = pay_num;
    }

    public Integer getPay_times() {
        return pay_times;
    }

    public void setPay_times(Integer pay_times) {
        this.pay_times = pay_times;
    }

    public Float getPay_rate() {
        BigDecimal bigDecimal = new BigDecimal((double)pay_rate* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setPay_rate(Float pay_rate) {
        this.pay_rate = pay_rate;
    }

    public Float getArpu() {
        return arpu;
    }

    public void setArpu(Float arpu) {
        this.arpu = arpu;
    }

    public Float getArppu() {
        return arppu;
    }

    public void setArppu(Float arppu) {
        this.arppu = arppu;
    }

    public String getAbnormal_columns() {
        return abnormal_columns;
    }

    public void setAbnormal_columns(String abnormal_columns) {
        this.abnormal_columns = abnormal_columns;
    }
}
