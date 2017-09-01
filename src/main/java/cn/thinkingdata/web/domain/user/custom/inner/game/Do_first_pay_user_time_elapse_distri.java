package cn.thinkingdata.web.domain.user.custom.inner.game;

/**
 * @author Carpenter
 * @date 2016/11/18 14:31
 * @description Do_first_pay_user_time_elapse_distri
 */
public class Do_first_pay_user_time_elapse_distri extends Do_user_distri {

    private Integer classify_order;
    private String elapse_time_classify;

    public Integer getClassify_order() {
        return classify_order;
    }

    public void setClassify_order(Integer classify_order) {
        this.classify_order = classify_order;
    }

    public String getElapse_time_classify() {
        return elapse_time_classify;
    }

    public void setElapse_time_classify(String elapse_time_classify) {
        this.elapse_time_classify = elapse_time_classify;
    }
}
