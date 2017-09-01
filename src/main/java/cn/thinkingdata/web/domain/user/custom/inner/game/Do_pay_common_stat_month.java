package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;
import java.util.Date;

/**
 * @author Carpenter
 * @date 2016/11/18 10:43
 * @description Do_pay_common_stat_week
 */
public class Do_pay_common_stat_month {

    private Integer game_id;
    private Date data_date;
    private Float pay_rate;
    private Float arpu;
    private Float arppu;

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
}
