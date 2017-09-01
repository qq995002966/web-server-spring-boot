package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;

/**
 * Created by Xiaowu on 2016/10/27.
 */
public class Do_pay_user_level_distri extends Do_user_distri{
    private String user_type;
    private String classify_order;
    private String level;
    private Float pay_amount;
    private Integer pay_times;

    public String getUser_type() {
        return user_type;
    }

    public void setUser_type(String user_type) {
        this.user_type = user_type;
    }

    public String getClassify_order() {
        return classify_order;
    }

    public void setClassify_order(String classify_order) {
        this.classify_order = classify_order;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Integer getPay_times() {
        return pay_times;
    }

    public void setPay_times(Integer pay_times) {
        this.pay_times = pay_times;
    }

    public Float getPay_amount() {
        return pay_amount;
    }

    public void setPay_amount(Float pay_amount) {
        this.pay_amount = pay_amount;
    }
}
