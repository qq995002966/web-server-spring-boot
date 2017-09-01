package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;

/**
 * @author Carpenter
 * @date 2016/11/18 10:31
 * @description Do_retention_custom_analysis_day
 */
public class Do_retention_custom_analysis_week extends Do_retention_custom_analysis {

    private Float rate_1w;
    private Float rate_2w;
    private Float rate_3w;
    private Float rate_4w;
    private Float rate_5w;
    private Float rate_6w;
    private Float rate_7w;
    private Float rate_8w;
    private Float rate_9w;

    public Float getRate_1w() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_1w* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_1w(Float rate_1w) {
        this.rate_1w = rate_1w;
    }

    public Float getRate_2w() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_2w* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_2w(Float rate_2w) {
        this.rate_2w = rate_2w;
    }

    public Float getRate_3w() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_3w* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_3w(Float rate_3w) {
        this.rate_3w = rate_3w;
    }

    public Float getRate_4w() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_4w* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_4w(Float rate_4w) {
        this.rate_4w = rate_4w;
    }

    public Float getRate_5w() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_5w* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_5w(Float rate_5w) {
        this.rate_5w = rate_5w;
    }

    public Float getRate_6w() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_6w* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_6w(Float rate_6w) {
        this.rate_6w = rate_6w;
    }

    public Float getRate_7w() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_7w* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_7w(Float rate_7w) {
        this.rate_7w = rate_7w;
    }

    public Float getRate_8w() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_8w* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_8w(Float rate_8w) {
        this.rate_8w = rate_8w;
    }

    public Float getRate_9w() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_9w* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_9w(Float rate_9w) {
        this.rate_9w = rate_9w;
    }
}
