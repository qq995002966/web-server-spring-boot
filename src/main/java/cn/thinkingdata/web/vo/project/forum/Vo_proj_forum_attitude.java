package cn.thinkingdata.web.vo.project.forum;

/**
 * @author Carpenter
 * @date 2016/12/22 17:35
 * @description Vo_proj_forum_attitude
 */
public class Vo_proj_forum_attitude {

    private Integer info_id;
    private Integer total;
    private Integer negative;
    private Integer positive;

    public Integer getInfo_id() {
        return info_id;
    }

    public void setInfo_id(Integer info_id) {
        this.info_id = info_id;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Integer getNegative() {
        return negative;
    }

    public void setNegative(Integer negative) {
        this.negative = negative;
    }

    public Integer getPositive() {
        return positive;
    }

    public void setPositive(Integer positive) {
        this.positive = positive;
    }
}
