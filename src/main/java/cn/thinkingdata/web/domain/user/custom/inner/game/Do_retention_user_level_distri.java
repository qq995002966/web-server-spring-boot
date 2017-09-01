package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;

/**
 * Created by Xiaowu on 2016/10/27.
 */
public class Do_retention_user_level_distri extends Do_user_distri{

    private String retention_classify;
    private String level;

    public String getRetention_classify() {
        return retention_classify;
    }

    public void setRetention_classify(String retention_classify) {
        this.retention_classify = retention_classify;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

}
