package cn.thinkingdata.web.util.coupon;

import java.util.Date;

public class CouponsRule {

    private Integer item_id;
    private Integer price;
    private Integer num;
    private Integer expire_date;
    private Date start_date;
    private Date end_date;

    public Integer getItem_id() {
        return item_id;
    }

    public void setItem_id(Integer item_id) {
        this.item_id = item_id;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public Integer getExpire_date() {
        return expire_date;
    }

    public void setExpire_date(Integer expire_date) {
        this.expire_date = expire_date;
    }

    public Date getStart_date() {
        return start_date;
    }

    public void setStart_date(Date start_date) {
        this.start_date = start_date;
    }

    public Date getEnd_date() {
        return end_date;
    }

    public void setEnd_date(Date end_date) {
        this.end_date = end_date;
    }
}
