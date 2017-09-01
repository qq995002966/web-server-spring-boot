package cn.thinkingdata.web.domain.user.custom.inner.game;

/**
 * Created by Xiaowu on 2016/11/3.
 */
public abstract class Do_user_area_distri extends Do_user_distri{

    private String global_classify;
    private String area_classify;

    public String getGlobal_classify() {
        return global_classify;
    }

    public void setGlobal_classify(String global_classify) {
        this.global_classify = global_classify;
    }

    public String getArea_classify() {
        return area_classify;
    }

    public void setArea_classify(String area_classify) {
        this.area_classify = area_classify;
    }

}
