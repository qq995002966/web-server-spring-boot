package cn.thinkingdata.web.domain.user.custom.inner.game;

/**
 * @author Carpenter
 * @date 2016/11/18 14:19
 * @description Do_pay_user_paytimes_week_distri
 */
public class Do_pay_user_paytimes_distri extends Do_user_distri {

    private Integer classify_order;
    private String paytimes_classify;

    public Integer getClassify_order() {
        return classify_order;
    }

    public void setClassify_order(Integer classify_order) {
        this.classify_order = classify_order;
    }

    public String getPaytimes_classify() {
        return paytimes_classify;
    }

    public void setPaytimes_classify(String paytimes_classify) {
        this.paytimes_classify = paytimes_classify;
    }
}
