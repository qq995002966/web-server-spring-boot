package cn.thinkingdata.web.domain.user.custom.inner.game;

/**
 * @author Carpenter
 * @date 2016/11/18 14:19
 * @description Do_pay_user_paytimes_week_distri
 */
public class Do_pay_user_payamount_distri extends Do_user_distri {

    private Integer classify_order;
    private String payamount_classify;

    public Integer getClassify_order() {
        return classify_order;
    }

    public void setClassify_order(Integer classify_order) {
        this.classify_order = classify_order;
    }

    public String getPayamount_classify() {
        return payamount_classify;
    }

    public void setPayamount_classify(String payamount_classify) {
        this.payamount_classify = payamount_classify;
    }
}
