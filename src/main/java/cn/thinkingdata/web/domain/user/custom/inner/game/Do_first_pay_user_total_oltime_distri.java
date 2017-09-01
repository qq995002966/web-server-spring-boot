package cn.thinkingdata.web.domain.user.custom.inner.game;

/**
 * @author Carpenter
 * @date 2016/11/18 14:07
 * @description Do_first_pay_user_total_oltime_distri
 */
public class Do_first_pay_user_total_oltime_distri extends Do_user_distri {

    private Integer classify_order;
    private String total_oltime_classify;

    public Integer getClassify_order() {
        return classify_order;
    }

    public void setClassify_order(Integer classify_order) {
        this.classify_order = classify_order;
    }

    public String getTotal_oltime_classify() {
        return total_oltime_classify;
    }

    public void setTotal_oltime_classify(String total_oltime_classify) {
        this.total_oltime_classify = total_oltime_classify;
    }
}
