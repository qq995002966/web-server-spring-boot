package cn.thinkingdata.web.domain.user.custom.inner.game;

import java.math.BigDecimal;

/**
 * @author Carpenter
 * @date 2016/11/18 10:31
 * @description Do_retention_custom_analysis_day
 */
public class Do_retention_custom_analysis_day extends Do_retention_custom_analysis {

    private Float rate_1d;
    private Float rate_2d;
    private Float rate_3d;
    private Float rate_4d;
    private Float rate_5d;
    private Float rate_6d;
    private Float rate_7d;
    private Float rate_14d;
    private Float rate_30d;

    public Float getRate_1d() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_1d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_1d(Float rate_1d) {
        this.rate_1d = rate_1d;
    }

    public Float getRate_2d() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_2d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_2d(Float rate_2d) {
        this.rate_2d = rate_2d;
    }

    public Float getRate_3d() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_3d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_3d(Float rate_3d) {
        this.rate_3d = rate_3d;
    }

    public Float getRate_4d() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_4d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_4d(Float rate_4d) {
        this.rate_4d = rate_4d;
    }

    public Float getRate_5d() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_5d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_5d(Float rate_5d) {
        this.rate_5d = rate_5d;
    }

    public Float getRate_6d() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_6d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_6d(Float rate_6d) {
        this.rate_6d = rate_6d;
    }

    public Float getRate_7d() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_7d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_7d(Float rate_7d) {
        this.rate_7d = rate_7d;
    }

    public Float getRate_14d() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_14d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_14d(Float rate_14d) {
        this.rate_14d = rate_14d;
    }

    public Float getRate_30d() {
        BigDecimal bigDecimal = new BigDecimal((double) rate_30d* 100);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public void setRate_30d(Float rate_30d) {
        this.rate_30d = rate_30d;
    }
}
