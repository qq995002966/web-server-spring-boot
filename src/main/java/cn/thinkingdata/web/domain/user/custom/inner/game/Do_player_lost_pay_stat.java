package cn.thinkingdata.web.domain.user.custom.inner.game;

/**
 * @author Carpenter
 * @date 2017/3/16 13:48
 * @description Do_player_lost_pay_stat
 */
public class Do_player_lost_pay_stat {

    private Integer game_id;
    private String classify_name;
    private String user_type;
    private String group_name;
    private Integer group_user_num;
    private Float group_user_rate;
    private Float user_rate;
    private String sub_group_name;
    private Float sub_group_value;
    private Boolean percentage;
    private Float sub_group_value_avg;
    private String sub_group_value_unit;
    private String group_desc;
    private String group_rank;

    public Integer getGame_id() {
        return game_id;
    }

    public void setGame_id(Integer game_id) {
        this.game_id = game_id;
    }

    public String getClassify_name() {
        return classify_name;
    }

    public void setClassify_name(String classify_name) {
        this.classify_name = classify_name;
    }

    public String getUser_type() {
        return user_type;
    }

    public void setUser_type(String user_type) {
        this.user_type = user_type;
    }

    public String getGroup_name() {
        return group_name;
    }

    public void setGroup_name(String group_name) {
        this.group_name = group_name;
    }

    public Integer getGroup_user_num() {
        return group_user_num;
    }

    public void setGroup_user_num(Integer group_user_num) {
        this.group_user_num = group_user_num;
    }

    public Float getGroup_user_rate() {
        return group_user_rate;
    }

    public void setGroup_user_rate(Float group_user_rate) {
        this.group_user_rate = group_user_rate;
    }

    public Float getUser_rate() {
        return user_rate;
    }

    public void setUser_rate(Float user_rate) {
        this.user_rate = user_rate;
    }

    public String getSub_group_name() {
        return sub_group_name;
    }

    public void setSub_group_name(String sub_group_name) {
        this.sub_group_name = sub_group_name;
    }

    public Float getSub_group_value() {
        return sub_group_value;
    }

    public void setSub_group_value(Float sub_group_value) {
        this.sub_group_value = sub_group_value;
    }

    public Boolean getPercentage() {
        return percentage;
    }

    public void setPercentage(Boolean percentage) {
        this.percentage = percentage;
    }

    public Float getSub_group_value_avg() {
        return sub_group_value_avg;
    }

    public void setSub_group_value_avg(Float sub_group_value_avg) {
        this.sub_group_value_avg = sub_group_value_avg;
    }

    public String getSub_group_value_unit() {
        return sub_group_value_unit;
    }

    public void setSub_group_value_unit(String sub_group_value_unit) {
        this.sub_group_value_unit = sub_group_value_unit;
    }

    public String getGroup_desc() {
        return group_desc;
    }

    public void setGroup_desc(String group_desc) {
        this.group_desc = group_desc;
    }

    public String getGroup_rank() {
        return group_rank;
    }

    public void setGroup_rank(String group_rank) {
        this.group_rank = group_rank;
    }

    @Override
    public String toString() {
        return "Do_player_lost_pay_stat{" +
                "game_id=" + game_id +
                ", classify_name='" + classify_name + '\'' +
                ", user_type='" + user_type + '\'' +
                ", group_name='" + group_name + '\'' +
                ", group_user_num=" + group_user_num +
                ", group_user_rate=" + group_user_rate +
                ", user_rate=" + user_rate +
                ", sub_group_name='" + sub_group_name + '\'' +
                ", sub_group_value=" + sub_group_value +
                ", percentage=" + percentage +
                ", sub_group_value_avg=" + sub_group_value_avg +
                ", sub_group_value_unit='" + sub_group_value_unit + '\'' +
                ", group_desc='" + group_desc + '\'' +
                ", group_rank='" + group_rank + '\'' +
                '}';
    }
}
