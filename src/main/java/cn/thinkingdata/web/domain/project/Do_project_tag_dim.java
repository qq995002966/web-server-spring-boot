package cn.thinkingdata.web.domain.project;

/**
 * Created by Xiaowu on 2016/8/8.
 */
public class Do_project_tag_dim {
    private Integer tag_id;
    private String   tag_name;
    private Integer is_disable;
    private Integer rank;
    public Integer getTag_id() {
        return tag_id;
    }
    public void setTag_id(Integer tag_id) {
        this.tag_id = tag_id;
    }
    public String getTag_name() {
        return tag_name;
    }
    public void setTag_name(String tag_name) {
        this.tag_name = tag_name;
    }
    public Integer getIs_disable() {
        return is_disable;
    }
    public void setIs_disable(Integer is_disable) {
        this.is_disable = is_disable;
    }
    public Integer getRank() {
        return rank;
    }
    public void setRank(Integer rank) {
        this.rank = rank;
    }
}
