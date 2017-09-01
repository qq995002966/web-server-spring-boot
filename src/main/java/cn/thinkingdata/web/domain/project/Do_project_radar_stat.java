package cn.thinkingdata.web.domain.project;

/**
 * Created by Xiaowu on 2016/5/19.
 */
public class Do_project_radar_stat {
    private Integer project_id;
    private Integer user_num;//活跃用户数
    private Integer user_rank;//排名
    private Integer post_num;//发帖数
    private Integer post_rank;//排名
    private Float negative_rate;//负面占比
    private Integer negative_rank;//排名
    private Float stable_rate;//稳定度
    private Integer stable_rank;//稳定度排名
    private Float useless_rate;//无效帖占比
    private Integer useless_rank;
    private Integer appstore_order;
    private Integer appstore_rank;

    public Integer getProject_id() {
        return project_id;
    }

    public void setProject_id(Integer project_id) {
        this.project_id = project_id;
    }

    public Integer getUser_num() {
        return user_num;
    }

    public void setUser_num(Integer user_num) {
        this.user_num = user_num;
    }

    public Integer getUser_rank() {
        return user_rank;
    }

    public void setUser_rank(Integer user_rank) {
        this.user_rank = user_rank;
    }

    public Integer getPost_num() {
        return post_num;
    }

    public void setPost_num(Integer post_num) {
        this.post_num = post_num;
    }

    public Integer getPost_rank() {
        return post_rank;
    }

    public void setPost_rank(Integer post_rank) {
        this.post_rank = post_rank;
    }

    public Float getNegative_rate() {
        return negative_rate;
    }

    public void setNegative_rate(Float negative_rate) {
        this.negative_rate = negative_rate;
    }

    public Integer getNegative_rank() {
        return negative_rank;
    }

    public void setNegative_rank(Integer negative_rank) {
        this.negative_rank = negative_rank;
    }

    public Float getStable_rate() {
        return stable_rate;
    }

    public void setStable_rate(Float stable_rate) {
        this.stable_rate = stable_rate;
    }

    public Integer getStable_rank() {
        return stable_rank;
    }

    public void setStable_rank(Integer stable_rank) {
        this.stable_rank = stable_rank;
    }

    public Float getUseless_rate() {
        return useless_rate;
    }

    public void setUseless_rate(Float useless_rate) {
        this.useless_rate = useless_rate;
    }

    public Integer getUseless_rank() {
        return useless_rank;
    }

    public void setUseless_rank(Integer useless_rank) {
        this.useless_rank = useless_rank;
    }

    public Integer getAppstore_order() {
        return appstore_order;
    }

    public void setAppstore_order(Integer appstore_order) {
        this.appstore_order = appstore_order;
    }

    public Integer getAppstore_rank() {
        return appstore_rank;
    }

    public void setAppstore_rank(Integer appstore_rank) {
        this.appstore_rank = appstore_rank;
    }
}
