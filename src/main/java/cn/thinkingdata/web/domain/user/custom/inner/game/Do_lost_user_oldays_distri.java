package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;

/**
 * Created by Xiaowu on 2016/10/27.
 */
public class Do_lost_user_oldays_distri extends Do_user_distri{

    private String user_type;
    private String oldays_classify;

    public String getUser_type() {
        return user_type;
    }

    public void setUser_type(String user_type) {
        this.user_type = user_type;
    }

    public String getOldays_classify() {
        return oldays_classify;
    }

    public void setOldays_classify(String oldays_classify) {
        this.oldays_classify = oldays_classify;
    }

}
