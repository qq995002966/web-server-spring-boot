package cn.thinkingdata.web.domain.order;

import com.alibaba.fastjson.annotation.JSONField;

import java.util.Date;

public class Do_coupon {
	public static final int NOT_USED = 0;
	public static final int IN_USE = 1;
	public static final int USED = 2;
	@JSONField(serialize=false)
	private Long id;
	private String coupon_id;
	private Integer bind_user_id;
	private Integer coupon_price;
	@JSONField(serialize=false)
	private Date create_time;
	@JSONField(format="yyyy-MM-dd")
	private Date expire_date;
	private Integer status;
	@JSONField(format="yyyy-MM-dd HH:mm:ss")
	private Date used_time;
	private String item_list;

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getCoupon_id() {
		return coupon_id;
	}
	public void setCoupon_id(String coupon_id) {
		this.coupon_id = coupon_id;
	}

	public Integer getBind_user_id() {
		return bind_user_id;
	}

	public void setBind_user_id(Integer bind_user_id) {
		this.bind_user_id = bind_user_id;
	}

	public Integer getCoupon_price() {
		return coupon_price;
	}
	public void setCoupon_price(Integer coupon_price) {
		this.coupon_price = coupon_price;
	}
	public Date getCreate_time() {
		return create_time;
	}
	public void setCreate_time(Date create_time) {
		this.create_time = create_time;
	}
	public Date getExpire_date() {
		return expire_date;
	}
	public void setExpire_date(Date expire_date) {
		this.expire_date = expire_date;
	}
	
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Date getUsed_time() {
		return used_time;
	}
	public void setUsed_time(Date used_time) {
		this.used_time = used_time;
	}

	public String getItem_list() {
		return item_list;
	}

	public void setItem_list(String item_list) {
		this.item_list = item_list;
	}
}
