package cn.thinkingdata.web.domain.user.custom.inner.game;

/**
 * @author Carpenter
 * @date 2016/11/18 14:01
 * @description Do_first_pay_user_oldays_distri
 */
public class Do_first_pay_user_oldays_distri extends Do_user_distri {

    private Integer classify_order;
    private String oldays_classify;

    public Integer getClassify_order() {
        return classify_order;
    }

    public void setClassify_order(Integer classify_order) {
        this.classify_order = classify_order;
    }

    public String getOldays_classify() {
        return oldays_classify;
    }

    public void setOldays_classify(String oldays_classify) {
        this.oldays_classify = oldays_classify;
    }
}
