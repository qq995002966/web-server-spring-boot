package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.util.Date;

/**
 * @author Carpenter
 * @date 2016/11/18 15:03
 * @description Do_pay_user_pay_item_distri
 */
public class Do_pay_user_pay_item_distri {

    private Integer game_id;
    private Date data_date;
    private String pay_item;
    private Float pay_amount;
    private Float pay_amount_rate;
    private Integer pay_times;
    private Float pay_times_rate;

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

    public String getPay_item() {
        return pay_item;
    }

    public void setPay_item(String pay_item) {
        this.pay_item = pay_item;
    }

    public Float getPay_amount() {
        return pay_amount;
    }

    public void setPay_amount(Float pay_amount) {
        this.pay_amount = pay_amount;
    }

    public Float getPay_amount_rate() {
        return pay_amount_rate;
    }

    public void setPay_amount_rate(Float pay_amount_rate) {
        this.pay_amount_rate = pay_amount_rate;
    }

    public Integer getPay_times() {
        return pay_times;
    }

    public void setPay_times(Integer pay_times) {
        this.pay_times = pay_times;
    }

    public Float getPay_times_rate() {
        return pay_times_rate;
    }

    public void setPay_times_rate(Float pay_times_rate) {
        this.pay_times_rate = pay_times_rate;
    }
}
