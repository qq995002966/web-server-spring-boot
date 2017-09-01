package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;

/**
 * @author Carpenter
 * @date 2016/11/18 10:31
 * @description Do_retention_custom_analysis_day
 */
public class Do_retention_custom_analysis_month extends Do_retention_custom_analysis {

    private Float rate_1m;
    private Float rate_2m;
    private Float rate_3m;
    private Float rate_4m;
    private Float rate_5m;
    private Float rate_6m;
    private Float rate_7m;
    private Float rate_8m;
    private Float rate_9m;

    public Float getRate_1m() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_1m* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_1m(Float rate_1m) {
        this.rate_1m = rate_1m;
    }

    public Float getRate_2m() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_2m* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_2m(Float rate_2m) {
        this.rate_2m = rate_2m;
    }

    public Float getRate_3m() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_3m* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_3m(Float rate_3m) {
        this.rate_3m = rate_3m;
    }

    public Float getRate_4m() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_4m* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_4m(Float rate_4m) {
        this.rate_4m = rate_4m;
    }

    public Float getRate_5m() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_5m* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_5m(Float rate_5m) {
        this.rate_5m = rate_5m;
    }

    public Float getRate_6m() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_6m* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_6m(Float rate_6m) {
        this.rate_6m = rate_6m;
    }

    public Float getRate_7m() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_7m* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_7m(Float rate_7m) {
        this.rate_7m = rate_7m;
    }

    public Float getRate_8m() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_8m* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_8m(Float rate_8m) {
        this.rate_8m = rate_8m;
    }

    public Float getRate_9m() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_9m* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_9m(Float rate_9m) {
        this.rate_9m = rate_9m;
    }
}
