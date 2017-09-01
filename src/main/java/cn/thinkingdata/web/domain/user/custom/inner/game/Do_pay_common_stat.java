package cn.thinkingdata.web.domain.user.custom.inner.game;

/**
 * @author Carpenter
 * @date 2016/11/21 18:24
 * @description Do_pay_common_stat
 */
public class Do_pay_common_stat {
    /**
     * 游戏ID
     */
    private Integer game_id;
    /**
     * 分类名称
     */
    private String classify_name;
    /**
     * 游戏币消耗量
     */
    private Double coins_consume_num;
    /**
     * 消耗最多商品
     */
    private String consume_favorite;
    /**
     * 充值最多商品
     */
    private String deposit_favorite;
    /**
     * 首充平均时间
     */
    private Double first_deposit_hours;

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

    public Double getCoins_consume_num() {
        return coins_consume_num;
    }

    public void setCoins_consume_num(Double coins_consume_num) {
        this.coins_consume_num = coins_consume_num;
    }

    public String getConsume_favorite() {
        return consume_favorite;
    }

    public void setConsume_favorite(String consume_favorite) {
        this.consume_favorite = consume_favorite;
    }

    public String getDeposit_favorite() {
        return deposit_favorite;
    }

    public void setDeposit_favorite(String deposit_favorite) {
        this.deposit_favorite = deposit_favorite;
    }

    public Double getFirst_deposit_hours() {
        return first_deposit_hours;
    }

    public void setFirst_deposit_hours(Double first_deposit_hours) {
        this.first_deposit_hours = first_deposit_hours;
    }
}
