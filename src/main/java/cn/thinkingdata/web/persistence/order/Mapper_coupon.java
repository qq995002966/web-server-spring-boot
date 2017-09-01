package cn.thinkingdata.web.persistence.order;

import cn.thinkingdata.web.domain.order.Do_coupon;

import java.util.List;

public interface Mapper_coupon {

	public Do_coupon getCouponInfo(String couponId);

	public Do_coupon checkCoupon(String couponId);

	public List<Do_coupon> findCouponByUserId(Integer userId);

	public int updateCouponInfo(Do_coupon couponInfo);
	
	public int couponUsed(String couponId);

	public int saveCouponInfo(Do_coupon coupon);
}
