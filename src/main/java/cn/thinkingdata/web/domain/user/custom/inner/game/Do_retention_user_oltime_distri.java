package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;

/**
 * Created by Xiaowu on 2016/10/27.
 */
public class Do_retention_user_oltime_distri extends Do_user_distri{

    private String retention_classify;
    private String oltime_classify;

    public String getRetention_classify() {
        return retention_classify;
    }

    public void setRetention_classify(String retention_classify) {
        this.retention_classify = retention_classify;
    }

    public String getOltime_classify() {
        return oltime_classify;
    }

    public void setOltime_classify(String oltime_classify) {
        this.oltime_classify = oltime_classify;
    }

}
