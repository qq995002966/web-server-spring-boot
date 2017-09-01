package cn.thinkingdata.web.domain.user.custom.inner.game;

/**
 * @author Carpenter
 * @date 2017/2/23 10:54
 * @description Do_player_cluster_radar_stat
 */
public class Do_player_cluster_radar_stat {

    /**
     * 游戏ID
     */
    private Integer game_id;
    /**
     * 玩家类别
     */
    private String user_type;
    /**
     * 聚类类别
     */
    private String cluster_type;
    /**
     * 聚类雷达图字段标签名
     */
    private String column_name;
    /**
     * 标签权重
     */
    private Float column_value;
    /**
     * 玩家数
     */
    private Integer user_num;

    public Integer getGame_id() {
        return game_id;
    }

    public void setGame_id(Integer game_id) {
        this.game_id = game_id;
    }

    public String getUser_type() {
        return user_type;
    }

    public void setUser_type(String user_type) {
        this.user_type = user_type;
    }

    public String getCluster_type() {
        return cluster_type;
    }

    public void setCluster_type(String cluster_type) {
        this.cluster_type = cluster_type;
    }

    public String getColumn_name() {
        return column_name;
    }

    public void setColumn_name(String column_name) {
        this.column_name = column_name;
    }

    public Float getColumn_value() {
        return column_value;
    }

    public void setColumn_value(Float column_value) {
        this.column_value = column_value;
    }

    public Integer getUser_num() {
        return user_num;
    }

    public void setUser_num(Integer user_num) {
        this.user_num = user_num;
    }

    @Override
    public String toString() {
        return "Do_player_cluster_radar_stat{" +
                "game_id=" + game_id +
                ", user_type='" + user_type + '\'' +
                ", cluster_type='" + cluster_type + '\'' +
                ", column_name='" + column_name + '\'' +
                ", column_value=" + column_value +
                ", user_num=" + user_num +
                '}';
    }
}
