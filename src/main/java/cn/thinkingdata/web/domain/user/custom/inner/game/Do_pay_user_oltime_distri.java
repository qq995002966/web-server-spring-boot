package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;

/**
 * Created by Xiaowu on 2016/10/27.
 */
public class Do_pay_user_oltime_distri extends Do_user_distri{

    private String user_type;
    private String classify_order;
    private String oltime_classify;

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

    public String getOltime_classify() {
        return oltime_classify;
    }

    public void setOltime_classify(String oltime_classify) {
        this.oltime_classify = oltime_classify;
    }

}
