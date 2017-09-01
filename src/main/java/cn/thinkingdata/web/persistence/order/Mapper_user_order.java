package cn.thinkingdata.web.persistence.order;

import cn.thinkingdata.web.domain.order.Do_user_order;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface Mapper_user_order {
	public int insertUserOrder(Do_user_order userOrderDo);
	
	public Integer isUserBuyedItem(@Param("user_id") Long userId, @Param("item_id") Integer itemId);
	
	public Do_user_order getOrderByOrderId(String orderId);

	public Map getOrderDescByOrderId(String orderId);

	public Do_user_order getOrderById(Long id);

	public List getOrderByUserId(@Param("user_id") Integer userId, @Param("index") Integer index, @Param("limit") Integer limit);

	public int orderPaySuccess(Do_user_order userOrder);

	public int cancelOrder(Do_user_order userOrder);

	public int printInvoice(Do_user_order userOrder);
	
	public int getUserOrderCount(Integer userId);
	
	public int updateOrderChargeInfo(@Param("order_id") String orderId, @Param("pay_channel") String payChannel, @Param("charge_no") String chargeNo);
	
	public Do_user_order getOrderByChargeNo(String chargeNo);
}
