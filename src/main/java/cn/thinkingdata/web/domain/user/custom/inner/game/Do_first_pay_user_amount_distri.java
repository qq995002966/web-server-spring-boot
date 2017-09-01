package cn.thinkingdata.web.domain.user.custom.inner.game;

/**
 * @author Carpenter
 * @date 2016/11/18 14:16
 * @description Do_first_pay_user_amount_distri
 */
public class Do_first_pay_user_amount_distri extends Do_user_distri{

    private Integer classify_order;
    private String amount_classify;

    public Integer getClassify_order() {
        return classify_order;
    }

    public void setClassify_order(Integer classify_order) {
        this.classify_order = classify_order;
    }

    public String getAmount_classify() {
        return amount_classify;
    }

    public void setAmount_classify(String amount_classify) {
        this.amount_classify = amount_classify;
    }
}
