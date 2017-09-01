package cn.thinkingdata.web.domain.user.custom.inner.game;

/**
 * Created by Xiaowu on 2016/10/27.
 */
public class Do_pay_user_area_distri extends Do_user_area_distri{

    private String user_type;
    private Float pay_amount;
    private Float pay_rate;
    private Float arpu;
    private Float arppu;


    public String getUser_type() {
        return user_type;
    }

    public void setUser_type(String user_type) {
        this.user_type = user_type;
    }

    public Float getPay_amount() {
        return pay_amount;
    }

    public void setPay_amount(Float pay_amount) {
        this.pay_amount = pay_amount;
    }

    public Float getPay_rate() {
        return pay_rate;
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
