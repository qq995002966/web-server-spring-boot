package cn.thinkingdata.web.controller.user;

import cn.thinkingdata.web.constant.PingxxConstant;
import cn.thinkingdata.web.domain.order.Do_invoice;
import cn.thinkingdata.web.service.core.user.custom.CustomServiceService;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import cn.thinkingdata.web.util.WebUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.security.PublicKey;

/**
 * Created by Xiaowu on 2016/8/16.
 */
@Controller
@RequestMapping(value = "/v1")
public class OrderController {

    @Autowired
    private CustomServiceService customServiceService;

    @RequestMapping(value = "/service/user/order",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult getUserOrder(@RequestParam(value = "order_id", required = false,defaultValue = "0") String orderId,
                                   @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                   @RequestParam(value = "limit", required = false,defaultValue = "1000") Integer limit){
        if(orderId.equals("0")){
            return customServiceService.GetUserOrder(index,limit);
        }else {
            return customServiceService.GetUserOrder(orderId);
        }
    }

    @RequestMapping(value = "/service/user/order",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult createUserOrder(@RequestParam(value = "order_id", required = false,defaultValue = "0") String orderId,
                                      @RequestParam(value = "order_type", required = false) Integer orderType,
                                      @RequestParam(value = "coupon_id", required = false) String couponId,
                                      @RequestParam(value = "item_unit_id", required = false,defaultValue = "") Integer itemUnitId,
                                      @RequestParam(value = "project_list", required = false,defaultValue = "") String projectList){
        if(orderId.equals("0")){
            return customServiceService.CreateUserOrder(orderType,couponId,itemUnitId,projectList);
        }else {
            return customServiceService.CancelUserOrder(orderId);
        }
    }

    @RequestMapping(value = "/service/pay/charge",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult CreateCharge(@RequestParam(value = "pay_channel", required = false) String payChannel,
                                   @RequestParam(value = "order_id", required = false) String order_id,
                                   HttpServletRequest request){
        String loginIp = WebUtil.getHost(request);
        return customServiceService.CreateCharge(payChannel,order_id,loginIp);
    }

    @RequestMapping(value = "/service/pay/qr",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult QueryQRStatus(@RequestParam(value = "order_id", required = false) String order_id){
        return customServiceService.QueryQRStatus(order_id);
    }

    @RequestMapping(value = "/pay/callback")
    @ResponseBody
    public DataResult WebhooksChargeSuccess(@RequestParam(value = "order_id", required = false) String order_id,
                                            HttpServletRequest request){
        try {
            request.setCharacterEncoding("UTF8");
            String sign = request.getHeader("x-pingplusplus-signature");
            PublicKey pubkey = PingxxConstant.getPingxxPubKey();
            // 获得 http body 内容
            BufferedReader reader = request.getReader();
            StringBuffer buffer = new StringBuffer();
            String string;
            while ((string = reader.readLine()) != null) {
                buffer.append(string);
            }
            reader.close();
            String eventBody = buffer.toString();
            return customServiceService.WebhooksChargeSuccess(eventBody, sign, pubkey);
        }catch (Exception e){
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
        }
    }

    @RequestMapping(value = "/service/invoice",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult PrintInvoice(@RequestParam(value = "order_id", required = false) String order_id,
                                   @RequestParam(value = "title", required = false) String title,
                                   @RequestParam(value = "name", required = false) String name,
                                   @RequestParam(value = "content", required = false) String content,
                                   @RequestParam(value = "phone", required = false) String phone,
                                   @RequestParam(value = "address", required = false) String address,
                                   @RequestParam(value = "postcode", required = false) String postcode){
        Do_invoice invoiceDo = new Do_invoice();
        invoiceDo.setOrder_id(order_id);
        invoiceDo.setTitle(title);
        invoiceDo.setName(name);
        invoiceDo.setContent(content);
        invoiceDo.setPhone(phone);
        invoiceDo.setAddress(address);
        invoiceDo.setPostcode(postcode);
        return customServiceService.PrintInvoice(invoiceDo);
    }

    @RequestMapping(value = "/service/invoice",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult ShowInvoice(@RequestParam(value = "order_id", required = false) String order_id){
        return customServiceService.ShowInvoice(order_id);
    }
}
