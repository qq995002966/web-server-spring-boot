package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;

/**
 * Created by Xiaowu on 2016/10/27.
 */
public class Do_lost_user_pay_distri extends Do_user_distri{

    private String user_type;
    private String pay_amount_classify;

    public String getUser_type() {
        return user_type;
    }

    public void setUser_type(String user_type) {
        this.user_type = user_type;
    }

    public String getPay_amount_classify() {
        return pay_amount_classify;
    }

    public void setPay_amount_classify(String pay_amount_classify) {
        this.pay_amount_classify = pay_amount_classify;
    }

}
