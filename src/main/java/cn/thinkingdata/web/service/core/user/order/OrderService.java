package cn.thinkingdata.web.service.core.user.order;

import cn.thinkingdata.web.domain.order.Do_coupon;
import cn.thinkingdata.web.domain.order.Do_invoice;
import cn.thinkingdata.web.domain.order.Do_item_unit;
import cn.thinkingdata.web.domain.order.Do_user_order;
import cn.thinkingdata.web.persistence.order.Mapper_coupon;
import cn.thinkingdata.web.persistence.order.Mapper_invoice;
import cn.thinkingdata.web.persistence.order.Mapper_item_unit;
import cn.thinkingdata.web.persistence.order.Mapper_user_order;
import cn.thinkingdata.web.service.cache.ProjectInfoCacheService;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.DateUtil;
import cn.thinkingdata.web.util.ReturnCodeDim;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {
	private static final Logger logger = LogManager.getLogger();
	
	@Autowired
	Mapper_user_order mapper_user_order;
	@Autowired
	Mapper_coupon mapper_coupon;
	@Autowired
	Mapper_item_unit mapper_item_unit;
	@Autowired
	private ProjectInfoCacheService projectInfoCacheService;
	@Autowired
	Mapper_invoice mapper_invoice;
	
	@Transactional
	public synchronized Integer cancelOrder(long user_id,String order_id){
		Do_user_order do_user_order = mapper_user_order.getOrderByOrderId(order_id);
		Integer status = do_user_order.getStatus();
		Long order_user = do_user_order.getUser_id();
		if(status == Do_user_order.CANCELED){
			return ReturnCodeDim.ORDER_HAS_CANCELED;
		}
		if(status == Do_user_order.FINISHED){
			return ReturnCodeDim.ORDER_HAS_FINISHED;
		}
		if(user_id != order_user){
			return ReturnCodeDim.AUTHORITY_FORBIDDEN;
		}
		do_user_order.setStatus(Do_user_order.CANCELED);
		Integer result = mapper_user_order.cancelOrder(do_user_order);
		if(do_user_order.getCoupon_id().length() > 0){
			Do_coupon do_coupon = mapper_coupon.getCouponInfo(do_user_order.getCoupon_id());
			do_coupon.setStatus(Do_coupon.NOT_USED);
			mapper_coupon.updateCouponInfo(do_coupon);
		}
		return result;
	}

	@Transactional
	public synchronized DataResult checkAndBindCoupon(int userId,String coupon_id,String item_id){
		Do_coupon do_coupon = mapper_coupon.checkCoupon(coupon_id);
		Integer itemId = 0;
		if(item_id != null){
			itemId = Integer.valueOf(item_id);
		}
		if(do_coupon == null ){
			return new DataResult(ReturnCodeDim.COUPON_NONEXIST,"");
		}else{
			if(do_coupon.getStatus() == 1 ){
				return new DataResult(ReturnCodeDim.COUPON_ONUSE,"");
			}
			if(do_coupon.getStatus() == 2 ){
				return new DataResult(ReturnCodeDim.COUPON_USED,"");
			}
			if(do_coupon.getBind_user_id().intValue() != 0 && do_coupon.getBind_user_id().intValue() != userId){
				return new DataResult(ReturnCodeDim.COUPON_NOPOWER,"");
			}else if(do_coupon.getExpire_date().getTime() < new Date().getTime()){
				return new DataResult(ReturnCodeDim.COUPON_EXPIRED,"");
			}else if(checkItemList(do_coupon.getItem_list(),itemId)){
				return new DataResult(ReturnCodeDim.COUPON_NOUSED,"");
			}else if(do_coupon.getBind_user_id().intValue() == 0){
				do_coupon.setBind_user_id(userId);
				mapper_coupon.updateCouponInfo(do_coupon);
			}
		}
		return new DataResult(ReturnCodeDim.SUCCESS,do_coupon);
	}

	@Transactional
	public synchronized DataResult operateUserorder(Integer item_unit_id, String project_list, String couponId, Long userId, String orderId, Integer order_type){
		int totalPrice = 0;
		Do_item_unit do_item_unit = null;
		if(item_unit_id == null){
			return new DataResult(ReturnCodeDim.ITEM_NONEXIST,"");
		}else {
			do_item_unit = mapper_item_unit.getItemUnitByItemUnitId(item_unit_id);
			if(do_item_unit == null){
				return new DataResult(ReturnCodeDim.ITEM_NONEXIST,"");
			}
		}
		Do_user_order userOrder = new Do_user_order();
		if(do_item_unit.getGame_scope() != 0){
			Object checkObj = checkProjectList(project_list);
			if(checkObj instanceof DataResult){
				return (DataResult) checkObj;
			}
			List project_id_list = (List) checkObj;
			if(project_id_list.size()>0){
				userOrder.setProject_num(project_id_list.size());
				totalPrice = do_item_unit.getPrice() * userOrder.getProject_num();
			}
		}else {
			totalPrice = do_item_unit.getPrice();
		}
		int payPrice = totalPrice;
		Do_coupon couponInfo = null;
		if(couponId == null){
			couponId = "";
		}else{
			couponInfo = mapper_coupon.getCouponInfo(couponId);
			if(couponInfo == null){
				return new DataResult(ReturnCodeDim.COUPON_NONEXIST,"");
			}else if(DateUtil.parseDateString(DateUtil.getPartitionString(new Date())).compareTo(couponInfo.getExpire_date()) > 0){
				return new DataResult(ReturnCodeDim.COUPON_EXPIRED,"");
			}else if(couponInfo.getStatus() == Do_coupon.IN_USE){
				return new DataResult(ReturnCodeDim.COUPON_IN_USE,"");
			}else if(couponInfo.getStatus() == Do_coupon.USED){
				return new DataResult(ReturnCodeDim.COUPON_USED,"");
			}else if(couponInfo.getBind_user_id() != userId.intValue() ) {
				return new DataResult(ReturnCodeDim.COUPON_NONEXIST,"");
			}else if(couponInfo.getCoupon_price() >= payPrice){
				return new DataResult(ReturnCodeDim.COUPON_OVER_PRICE,"");
			}else if(checkItemList(couponInfo.getItem_list(),do_item_unit.getItem_id())){
				return new DataResult(ReturnCodeDim.COUPON_NOUSED,"");
			}else {
				couponInfo.setStatus(Do_coupon.IN_USE);
				couponInfo.setUsed_time(new Date());
				mapper_coupon.updateCouponInfo(couponInfo);
			}
		}
		userOrder.setItem_unit_id(do_item_unit.getItem_unit_id().longValue());
		userOrder.setCoupon_id(couponId);
		userOrder.setCoupon_price(0);
		if(couponInfo != null){
			userOrder.setCoupon_price(couponInfo.getCoupon_price());
			payPrice = totalPrice - couponInfo.getCoupon_price();
		}
		userOrder.setProject_list(project_list);
		userOrder.setOrder_id(orderId);
		userOrder.setPay_price(payPrice);
		userOrder.setOrder_type(order_type);
		userOrder.setStatus(Do_user_order.TO_PAY);
		userOrder.setTotal_price(totalPrice);
		userOrder.setPay_channel("");
		userOrder.setUser_id(userId);
		mapper_user_order.insertUserOrder(userOrder);
		userOrder = mapper_user_order.getOrderById(userOrder.getId());
		return new DataResult(ReturnCodeDim.SUCCESS,userOrder);
	}

	private boolean checkItemList(String item_list,Integer item_id){
		if(item_list.equals("0")){
			return false;
		}
		if(Integer.valueOf(item_list) == item_id) {
			return false;
		}
		return true;
	}

	private Object checkProjectList(String project_list){
		List project_id_list = null;
		String[] project_lists = project_list.trim().split(",");
		if(project_lists.length > 1){
			project_id_list = new ArrayList();
			for(String str : project_lists){
				Integer project_id = Integer.parseInt(str);
				if(projectInfoCacheService.checkProjectId(project_id)){
					project_id_list.add(project_id);
				}else {
					return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
				}
			}
		}else {
			project_id_list = new ArrayList();
			Integer project_id = Integer.parseInt(project_list);
			if(projectInfoCacheService.checkProjectId(project_id)){
				project_id_list.add(project_id);
			}else {
				return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
			}
		}
		return project_id_list;
	}

	@Transactional
	public synchronized DataResult printInvoice(Do_invoice do_invoice, String order_id, Long user_id){
		Do_user_order do_user_order = mapper_user_order.getOrderByOrderId(order_id);
		if( do_user_order == null ){
			return  new DataResult(ReturnCodeDim.ORDER_NONEXIST,"");
		}
		if( do_user_order.getUser_id().longValue() != user_id.longValue() ){
			logger.info("order user id: " + do_user_order.getUser_id() + ", login user id: " + user_id);
			return  new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
		}
		if( do_user_order.getStatus() != Do_user_order.FINISHED ){
			return  new DataResult(ReturnCodeDim.ORDER_HAS_NOT_FINISHED,"");
		}
		if(do_user_order.getInvoice_id() != 0 ){
			return  new DataResult(ReturnCodeDim.ORDER_HAS_INVOICE,"");
		}
		do_invoice.setOrder_id(do_user_order.getOrder_id());
		mapper_invoice.insertInvoice(do_invoice);
		do_user_order.setInvoice_id(do_invoice.getInvoice_id());
		mapper_user_order.printInvoice(do_user_order);
		return  new DataResult(ReturnCodeDim.SUCCESS,"");
	}

	public Do_invoice getInvoiceByOrder(String order_id){
		Do_invoice do_invoice = mapper_invoice.getInvoiceInfoByOrderId(order_id);
		return do_invoice;
	}
}
