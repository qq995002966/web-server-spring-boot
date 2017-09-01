package cn.thinkingdata.web.domain.user.custom.inner.game;

/**
 * @author Carpenter
 * @date 2017/2/23 10:55
 * @description Do_player_cluster_detail_stat
 */
public class Do_player_cluster_detail_stat {
    /**
     * 游戏ID
     */
    private Integer game_id;
    /**
     * 统计粒度：0：大类用户；1：聚类细分类用户
     */
    private Integer agg_code;
    /**
     * 玩家类别
     */
    private String user_type;
    /**
     * 聚类类别
     */
    private String cluster_type;
    /**
     * 聚类详细标签名
     */
    private String column_name;
    /**
     * 标签权重
     */
    private Float column_value;

    public Integer getGame_id() {
        return game_id;
    }

    public void setGame_id(Integer game_id) {
        this.game_id = game_id;
    }

    public Integer getAgg_code() {
        return agg_code;
    }

    public void setAgg_code(Integer agg_code) {
        this.agg_code = agg_code;
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

    public void setColumn_name(String clumn_name) {
        this.column_name = clumn_name;
    }

    public Float getColumn_value() {
        return column_value;
    }

    public void setColumn_value(Float column_value) {
        this.column_value = column_value;
    }

    @Override
    public String toString() {
        return "Do_player_cluster_detail_stat{" +
                "game_id=" + game_id +
                ", agg_code=" + agg_code +
                ", user_type='" + user_type + '\'' +
                ", cluster_type='" + cluster_type + '\'' +
                ", clumn_name='" + column_name + '\'' +
                ", column_value=" + column_value +
                '}';
    }
}
