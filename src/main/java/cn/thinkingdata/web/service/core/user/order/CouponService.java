package cn.thinkingdata.web.service.core.user.order;

import cn.thinkingdata.web.domain.order.Do_coupon;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.persistence.order.Mapper_coupon;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import cn.thinkingdata.web.util.coupon.CouponsDim;
import cn.thinkingdata.web.util.coupon.CouponsRule;
import cn.thinkingdata.web.util.DateUtil;
import cn.thinkingdata.web.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class CouponService {

    @Autowired
    Mapper_coupon mapper_coupon;

    public DataResult findCouponByUserId(Integer userId, Integer itemId){
        List<Do_coupon> list = mapper_coupon.findCouponByUserId(userId);
        List result = new ArrayList();
        for(Do_coupon coupon : list){
            if(!checkItemList(coupon.getItem_list(),itemId)){
                result.add(coupon);
            }
        }
        return new DataResult(ReturnCodeDim.SUCCESS,result);
    }

    private boolean checkItemList(String item_list,Integer item_id){
        if(item_list.equals("0")){
            return false;
        }
        if(Integer.valueOf(item_list) == item_id){
            return false;
        }
        return true;
    }

    public Boolean setCouponAfterReg(Do_user doUser){
        List<CouponsRule> couponsRules = CouponsDim.getRuleList();
        for (CouponsRule couponsRule : couponsRules){
            if(couponsRule.getStart_date().before(new Date()) && couponsRule.getEnd_date().after(new Date())) {
                for (int i = 0; i < couponsRule.getNum(); i++) {
                    Do_coupon coupon = new Do_coupon();
                    coupon.setExpire_date(DateUtil.getOffsetDate(new Date(),couponsRule.getExpire_date()));
                    coupon.setStatus(0);
                    coupon.setCoupon_price(couponsRule.getPrice());
                    coupon.setBind_user_id(doUser.getUser_id());
                    coupon.setCoupon_id(StringUtil.genOrderId(doUser.getUser_id().longValue()));
                    coupon.setItem_list(couponsRule.getItem_id().toString());
                    coupon.setCreate_time(new Date());
                    mapper_coupon.saveCouponInfo(coupon);
                }
            }
        }
        return true;
    }


}
