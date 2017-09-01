package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Created by Xiaowu on 2016/10/27.
 */
public class Do_game_common_stat_day {

    private Integer game_id;
    private Date data_date;
    private Integer newlogin_num;
    private Integer oldlogin_num;
    private Integer login_num;
    private Integer wau;
    private Integer mau;
    private Integer pay_num;
    private Integer pay_times;
    private Integer first_pay_num;
    private Float pay_again_num;
    private Float pay_amount;
    private Integer lost_num;
    private Float pay_rate;
    private Integer first_day_pay_num;
    private Float first_day_pay_rate;
    private Float first_week_pay_rate;
    private Float first_month_pay_rate;
    private Float first_pay_rate;
    private Float arpu;
    private Float arppu;
    private Float avg_online_minutes;
    private Float avg_login_times;
    private Integer potential_lost_num;
    private Integer potential_pay_num;
    private String abnormal_columns;

    public Integer getGame_id() {
        return game_id;
    }

    public Integer getFirst_pay_num() {
        return first_pay_num;
    }

    public void setFirst_pay_num(Integer first_pay_num) {
        this.first_pay_num = first_pay_num;
    }

    public Integer getPay_times() {
        return pay_times;
    }

    public void setPay_times(Integer pay_times) {
        this.pay_times = pay_times;
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

    public Integer getNewlogin_num() {
        return newlogin_num;
    }

    public void setNewlogin_num(Integer newlogin_num) {
        this.newlogin_num = newlogin_num;
    }

    public Integer getOldlogin_num() {
        return oldlogin_num;
    }

    public void setOldlogin_num(Integer oldlogin_num) {
        this.oldlogin_num = oldlogin_num;
    }

    public Integer getLogin_num() {
        return login_num;
    }

    public void setLogin_num(Integer login_num) {
        this.login_num = login_num;
    }

    public Integer getWau() {
        return wau;
    }

    public void setWau(Integer wau) {
        this.wau = wau;
    }

    public Integer getMau() {
        return mau;
    }

    public void setMau(Integer mau) {
        this.mau = mau;
    }

    public Integer getPay_num() {
        return pay_num;
    }

    public void setPay_num(Integer pay_num) {
        this.pay_num = pay_num;
    }

    public Integer getFirst_day_pay_num() {
        return first_day_pay_num;
    }

    public void setFirst_day_pay_num(Integer first_day_pay_num) {
        this.first_day_pay_num = first_day_pay_num;
    }

    public Float getFirst_day_pay_rate() {
        BigDecimal bigDecimal = new BigDecimal((double)first_day_pay_rate* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setFirst_day_pay_rate(Float first_day_pay_rate) {
        this.first_day_pay_rate = first_day_pay_rate;
    }

    public Float getFirst_week_pay_rate() {
        BigDecimal bigDecimal = new BigDecimal((double)first_week_pay_rate* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setFirst_week_pay_rate(Float first_week_pay_rate) {
        this.first_week_pay_rate = first_week_pay_rate;
    }

    public Float getFirst_month_pay_rate() {
        BigDecimal bigDecimal = new BigDecimal((double)first_month_pay_rate* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setFirst_month_pay_rate(Float first_month_pay_rate) {
        this.first_month_pay_rate = first_month_pay_rate;
    }

    public Float getPay_again_num() {
        return pay_again_num;
    }

    public void setPay_again_num(Float pay_again_num) {
        this.pay_again_num = pay_again_num;
    }

    public Float getPay_amount() {
        return pay_amount;
    }

    public void setPay_amount(Float pay_amount) {
        this.pay_amount = pay_amount;
    }

    public Integer getLost_num() {
        return lost_num;
    }

    public void setLost_num(Integer lost_num) {
        this.lost_num = lost_num;
    }

    public Float getPay_rate() {
        BigDecimal bigDecimal = new BigDecimal((double)pay_rate* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setPay_rate(Float pay_rate) {
        this.pay_rate = pay_rate;
    }

    public Float getFirst_pay_rate() {
        BigDecimal bigDecimal = new BigDecimal((double)first_pay_rate* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setFirst_pay_rate(Float first_pay_rate) {
        this.first_pay_rate = first_pay_rate;
    }

    public Float getArpu() {
        BigDecimal bigDecimal = new BigDecimal((double)arpu);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
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

    public Float getAvg_online_minutes() {
        BigDecimal bigDecimal = new BigDecimal((double)avg_online_minutes);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setAvg_online_minutes(Float avg_online_minutes) {
        this.avg_online_minutes = avg_online_minutes;
    }

    public Float getAvg_login_times() {
        BigDecimal bigDecimal = new BigDecimal((double)avg_login_times);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setAvg_login_times(Float avg_login_times) {
        this.avg_login_times = avg_login_times;
    }

    public Integer getPotential_lost_num() {
        return potential_lost_num;
    }

    public void setPotential_lost_num(Integer potential_lost_num) {
        this.potential_lost_num = potential_lost_num;
    }

    public Integer getPotential_pay_num() {
        return potential_pay_num;
    }

    public void setPotential_pay_num(Integer potential_pay_num) {
        this.potential_pay_num = potential_pay_num;
    }

    public String getAbnormal_columns() {
        return abnormal_columns;
    }

    public void setAbnormal_columns(String abnormal_columns) {
        this.abnormal_columns = abnormal_columns;
    }
}
