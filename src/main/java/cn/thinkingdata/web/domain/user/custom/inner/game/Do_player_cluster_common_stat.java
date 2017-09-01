package cn.thinkingdata.web.domain.user.custom.inner.game;

/**
 * @author Carpenter
 * @date 2017/2/23 10:54
 * @description Do_player_cluster_common_stat
 */
public class Do_player_cluster_common_stat {

    /**
     * 游戏ID
     */
    private Integer game_id;
    /**
     * 活跃玩家数
     */
    private Integer active_num;
    /**
     * 付费玩家数
     */
    private Integer paid_num;
    /**
     * 流失玩家数
     */
    private Integer lost_num;
    /**
     * 活跃玩家中高付费意愿玩家占比
     */
    private Float active_high_pay_rate;
    /**
     * 活跃玩家中高流失概率玩家占比
     */
    private Float active_high_lost_rate;
    /**
     * 付费玩家中高流失概率玩家占比
     */
    private Float paid_high_lost_rate;
    /**
     * 流失玩家中已付费的玩家占比
     */
    private Float lost_paid_rate;

    public Integer getGame_id() {
        return game_id;
    }

    public void setGame_id(Integer game_id) {
        this.game_id = game_id;
    }

    public Integer getActive_num() {
        return active_num;
    }

    public void setActive_num(Integer active_num) {
        this.active_num = active_num;
    }

    public Integer getPaid_num() {
        return paid_num;
    }

    public void setPaid_num(Integer paid_num) {
        this.paid_num = paid_num;
    }

    public Integer getLost_num() {
        return lost_num;
    }

    public void setLost_num(Integer lost_num) {
        this.lost_num = lost_num;
    }

    public Float getActive_high_pay_rate() {
        return active_high_pay_rate;
    }

    public void setActive_high_pay_rate(Float active_high_pay_rate) {
        this.active_high_pay_rate = active_high_pay_rate;
    }

    public Float getActive_high_lost_rate() {
        return active_high_lost_rate;
    }

    public void setActive_high_lost_rate(Float active_high_lost_rate) {
        this.active_high_lost_rate = active_high_lost_rate;
    }

    public Float getPaid_high_lost_rate() {
        return paid_high_lost_rate;
    }

    public void setPaid_high_lost_rate(Float paid_high_lost_rate) {
        this.paid_high_lost_rate = paid_high_lost_rate;
    }

    public Float getLost_paid_rate() {
        return lost_paid_rate;
    }

    public void setLost_paid_rate(Float lost_paid_rate) {
        this.lost_paid_rate = lost_paid_rate;
    }

    @Override
    public String toString() {
        return "Do_player_cluster_common_stat{" +
                "game_id=" + game_id +
                ", active_num=" + active_num +
                ", paid_num=" + paid_num +
                ", lost_num=" + lost_num +
                ", active_high_pay_rate=" + active_high_pay_rate +
                ", active_high_lost_rate=" + active_high_lost_rate +
                ", paid_high_lost_rate=" + paid_high_lost_rate +
                ", lost_paid_rate=" + lost_paid_rate +
                '}';
    }
}
