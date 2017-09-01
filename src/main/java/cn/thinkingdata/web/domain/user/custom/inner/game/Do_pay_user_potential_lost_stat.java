package cn.thinkingdata.web.domain.user.custom.inner.game;

import com.alibaba.fastjson.annotation.JSONField;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Created by Xiaowu on 2016/10/27.
 */
public class Do_pay_user_potential_lost_stat {

    private Integer game_id;
    @JSONField(format="yyyy-MM-dd")
    private Date data_date;
    private String classify_order;
    private Integer potential_lost_num;
    private Float potential_lost_rate;
    private String abnormal_columns;

    public Integer getGame_id() {
        return game_id;
    }

    public void setGame_id(Integer game_id) {
        this.game_id = game_id;
    }

    public Date getData_date() {
        return data_date;
    }

    public void setData_date(Date data_date) {
        this.data_date = data_date;
    }

    public String getClassify_order() {
        return classify_order;
    }

    public void setClassify_order(String classify_order) {
        this.classify_order = classify_order;
    }

    public Integer getPotential_lost_num() {
        return potential_lost_num;
    }

    public void setPotential_lost_num(Integer potential_lost_num) {
        this.potential_lost_num = potential_lost_num;
    }

    public Float getPotential_lost_rate() {
        BigDecimal bigDecimal = new BigDecimal((double)potential_lost_rate* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setPotential_lost_rate(Float potential_lost_rate) {
        this.potential_lost_rate = potential_lost_rate;
    }

    public String getAbnormal_columns() {
        return abnormal_columns;
    }

    public void setAbnormal_columns(String abnormal_columns) {
        this.abnormal_columns = abnormal_columns;
    }
}
