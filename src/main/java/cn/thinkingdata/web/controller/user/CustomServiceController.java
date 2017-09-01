package cn.thinkingdata.web.controller.user;

import cn.thinkingdata.web.service.core.user.custom.CustomServiceService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

/**
 * Created by Xiaowu on 2016/8/11.
 */
@RestController
@RequestMapping(value = "/v1/service")
public class CustomServiceController {

    @Autowired
    private CustomServiceService customServiceService;

    @RequestMapping(value = "/custom",method = { RequestMethod.GET })
    public DataResult findService(@RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                  @RequestParam(value = "limit", required = false,defaultValue = "1000") Integer limit){
        return customServiceService.findService(index,limit);
    }

    @RequestMapping(value = "/custom/keywords",method = { RequestMethod.POST })
    public DataResult AddCustomKeywords(@RequestParam(value = "custom_keywords", required = false) String customKeywords,
                                        @RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return customServiceService.AddCustomKeywords(projectId,customKeywords);
    }

    @RequestMapping(value = "/user/coupon",method = { RequestMethod.GET })
    public DataResult GetUserCoupon(@RequestParam(value = "item_id", required = false,defaultValue = "0") Integer itemId){
        return customServiceService.GetUserCoupon(itemId);
    }

    @RequestMapping(value = "/user/coupon",method = { RequestMethod.POST })
    public DataResult CheckCoupon(@RequestParam(value = "coupon_id", required = false) String couponId,
                                  @RequestParam(value = "item_id", required = false) String itemId){
        return customServiceService.CheckCoupon(couponId,itemId);
    }

    @RequestMapping(value = "/user/project",method = { RequestMethod.GET })
    public DataResult GetUserProject(){
        return customServiceService.GetUserProject();
    }

    @RequestMapping(value = "/user/project/detail",method = { RequestMethod.GET })
    public DataResult GetUserProjectDetail(){
        return customServiceService.GetUserProjectDetail();
    }

    @RequestMapping(value = "/user/free",method = { RequestMethod.POST })
    public DataResult ApplyTryForFree(HttpServletRequest request){
        String userAgent = request.getHeader("User-Agent");
        return customServiceService.ApplyTryForFree(userAgent);
    }

    @RequestMapping(value = "/download",method = { RequestMethod.POST })
    public void DownloadExcel(@RequestParam(value = "data", required = false,defaultValue = "") String data,
                              @RequestParam(value = "name", required = false,defaultValue = "data") String name,
                              HttpServletResponse response){
        response.setCharacterEncoding("GBK");
        try {
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-disposition", "attachment;filename="+java.net.URLEncoder.encode(name, "UTF-8")+".csv");
            OutputStream outputStream = response.getOutputStream();
            customServiceService.DownloadExcel(data,outputStream);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
