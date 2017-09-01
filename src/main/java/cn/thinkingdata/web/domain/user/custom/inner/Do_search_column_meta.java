package cn.thinkingdata.web.domain.user.custom.inner;

import com.alibaba.fastjson.annotation.JSONField;

/**
 * Created by Xiaowu on 2016/8/25.
 */
public class Do_search_column_meta {
    @JSONField(serialize = false)
    private Integer id;
    @JSONField(serialize = false)
    private Integer gt_id;
    private String column_name;
    private String column_desc;
    @JSONField(serialize = false)
    private Integer column_type;
    @JSONField(serialize = false)
    private String parent_column;
    private String search_type;
    private Integer column_order;
    private String column_explain;
    private String column_group;
    @JSONField(serialize = false)
    private Integer is_primary;
    @JSONField(serialize = false)
    private Integer histogram_interval;
    private Integer min_value;
    private Integer max_value;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getGt_id() {
        return gt_id;
    }

    public void setGt_id(Integer gt_id) {
        this.gt_id = gt_id;
    }

    public String getColumn_name() {
        return column_name;
    }

    public void setColumn_name(String column_name) {
        this.column_name = column_name;
    }

    public String getColumn_desc() {
        return column_desc;
    }

    public void setColumn_desc(String column_desc) {
        this.column_desc = column_desc;
    }

    public Integer getColumn_type() {
        return column_type;
    }

    public void setColumn_type(Integer column_type) {
        this.column_type = column_type;
    }

    public String getParent_column() {
        return parent_column;
    }

    public void setParent_column(String parent_column) {
        this.parent_column = parent_column;
    }

    public String getSearch_type() {
        return search_type;
    }

    public void setSearch_type(String search_type) {
        this.search_type = search_type;
    }

    public Integer getColumn_order() {
        return column_order;
    }

    public void setColumn_order(Integer column_order) {
        this.column_order = column_order;
    }

    public String getColumn_explain() {
        return column_explain;
    }

    public void setColumn_explain(String column_explain) {
        this.column_explain = column_explain;
    }

    public String getColumn_group() {
        return column_group;
    }

    public void setColumn_group(String column_group) {
        this.column_group = column_group;
    }

    public Integer getIs_primary() {
        return is_primary;
    }

    public void setIs_primary(Integer is_primary) {
        this.is_primary = is_primary;
    }

    public Integer getHistogram_interval() {
        return histogram_interval;
    }

    public void setHistogram_interval(Integer histogram_interval) {
        this.histogram_interval = histogram_interval;
    }

    public Integer getMin_value() {
        return min_value;
    }

    public void setMin_value(Integer min_value) {
        this.min_value = min_value;
    }

    public Integer getMax_value() {
        return max_value;
    }

    public void setMax_value(Integer max_value) {
        this.max_value = max_value;
    }

    @Override
    public String toString() {
        return "Do_search_column_meta{" +
                "id=" + id +
                ", gt_id=" + gt_id +
                ", column_name='" + column_name + '\'' +
                ", column_desc='" + column_desc + '\'' +
                ", column_type=" + column_type +
                ", parent_column='" + parent_column + '\'' +
                ", search_type='" + search_type + '\'' +
                ", column_order=" + column_order +
                ", column_explain='" + column_explain + '\'' +
                ", column_group='" + column_group + '\'' +
                ", is_primary=" + is_primary +
                ", histogram_interval=" + histogram_interval +
                ", min_value=" + min_value +
                ", max_value=" + max_value +
                '}';
    }
}
