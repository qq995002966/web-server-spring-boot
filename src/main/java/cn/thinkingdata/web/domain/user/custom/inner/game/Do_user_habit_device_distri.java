package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;

/**
 * Created by Xiaowu on 2016/10/27.
 */
public class Do_user_habit_device_distri extends Do_user_distri{

    private String user_type;
    private String distri_classify;


    public String getUser_type() {
        return user_type;
    }

    public void setUser_type(String user_type) {
        this.user_type = user_type;
    }

    public String getDistri_classify() {
        return distri_classify;
    }

    public void setDistri_classify(String distri_classify) {
        this.distri_classify = distri_classify;
    }

}
