package cn.thinkingdata.web.domain.order;

import com.alibaba.fastjson.annotation.JSONField;
import org.springframework.stereotype.Repository;

import java.util.Date;


@Repository
public class Do_user_order {
	public static final int TO_PAY = 1;
	public static final int FINISHED = 2;
	public static final int CANCELED = 3;
	@JSONField(serialize=false)
	private Long id;
	private Long user_id;
	private String order_id;
	private String charge_no;
	private Integer order_type;
	private Long item_unit_id;
	private Integer project_num;
	private String project_list;
	private Integer total_price;
	private String coupon_id;
	private Integer coupon_price;
	private Integer pay_price;
	private String pay_channel;
	@JSONField(format="yyyy-MM-dd HH:mm:ss")
	private Date create_time;
	@JSONField(serialize=false)
	private Date update_time;
	@JSONField(format="yyyy-MM-dd HH:mm:ss")
	private Date pay_time;
	private Integer status;
	@JSONField(serialize=false)
	private String transaction_no;
	private Long invoice_id;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}

	public Long getUser_id() {
		return user_id;
	}

	public void setUser_id(Long user_id) {
		this.user_id = user_id;
	}

	public String getOrder_id() {
		return order_id;
	}

	public void setOrder_id(String order_id) {
		this.order_id = order_id;
	}
	
	public String getCharge_no() {
		return charge_no;
	}
	public void setCharge_no(String charge_no) {
		this.charge_no = charge_no;
	}
	public Integer getOrder_type() {
		return order_type;
	}

	public void setOrder_type(Integer order_type) {
		this.order_type = order_type;
	}

	public Long getItem_unit_id() {
		return item_unit_id;
	}

	public void setItem_unit_id(Long item_unit_id) {
		this.item_unit_id = item_unit_id;
	}
	
	public Integer getProject_num() {
		return project_num;
	}
	public void setProject_num(Integer project_num) {
		this.project_num = project_num;
	}
	public String getProject_list() {
		return project_list;
	}
	public void setProject_list(String project_list) {
		this.project_list = project_list;
	}
	public Integer getTotal_price() {
		return total_price;
	}

	public void setTotal_price(Integer total_price) {
		this.total_price = total_price;
	}

	public String getCoupon_id() {
		return coupon_id;
	}

	public void setCoupon_id(String coupon_id) {
		this.coupon_id = coupon_id;
	}

	public Integer getCoupon_price() {
		return coupon_price;
	}

	public void setCoupon_price(Integer coupon_price) {
		this.coupon_price = coupon_price;
	}

	public Integer getPay_price() {
		return pay_price;
	}

	public void setPay_price(Integer pay_price) {
		this.pay_price = pay_price;
	}

	public String getPay_channel() {
		return pay_channel;
	}

	public void setPay_channel(String pay_channel) {
		this.pay_channel = pay_channel;
	}

	public Date getCreate_time() {
		return create_time;
	}

	public void setCreate_time(Date create_time) {
		this.create_time = create_time;
	}

	public Date getUpdate_time() {
		return update_time;
	}

	public void setUpdate_time(Date update_time) {
		this.update_time = update_time;
	}

	public Date getPay_time() {
		return pay_time;
	}

	public void setPay_time(Date pay_time) {
		this.pay_time = pay_time;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getTransaction_no() {
		return transaction_no;
	}

	public void setTransaction_no(String transaction_no) {
		this.transaction_no = transaction_no;
	}

	public Long getInvoice_id() {
		return invoice_id;
	}

	public void setInvoice_id(Long invoice_id) {
		this.invoice_id = invoice_id;
	}
}
