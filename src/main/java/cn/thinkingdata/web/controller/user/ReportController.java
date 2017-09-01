package cn.thinkingdata.web.controller.user;

import cn.thinkingdata.web.service.core.user.custom.ReportService;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.WebUtil;

import com.aliyuncs.exceptions.ClientException;
import com.qcloud.cos.exception.AbstractCosException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;

/**
 * Created by Xiaowu on 2016/8/23.
 */
@Controller
@RequestMapping(value = "/v1/service")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @RequestMapping(value = "/report",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult ReadReport(@RequestParam(value = "report_id", required = false) Integer reportId,
                           HttpServletResponse response) throws AbstractCosException, UnsupportedEncodingException, ClientException {
        return reportService.ReadReport(reportId);
    }

    @RequestMapping(value = "/report/item",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult getUserReportListByItem(@RequestParam(value = "item_id", required = false) Integer itemId){
        return reportService.getUserReportListByItem(itemId);
    }

    @RequestMapping(value = "/report/classify",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult getUserReportListByClassify(@RequestParam(value = "classify_id", required = false) Integer classifyId){
        return reportService.getUserReportListByClassify(classifyId);
    }

    @RequestMapping(value = "/report/user",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetUserReportList(){
        return reportService.getUserReportList(WebUtil.getCurrentUser().getUser_id());
    }

    @RequestMapping(value = "/report/book/item",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetBookList(@RequestParam(value = "item_id", required = false) Long itemId,
                                  @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                  @RequestParam(value = "limit", required = false,defaultValue = "20") Integer limit){
        return reportService.GetBookList(itemId,index,limit);
    }

    @RequestMapping(value = "/report/book",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult CreateBook(@RequestParam(value = "item_unit_id", required = false,defaultValue = "0") Integer itemUnitId,
                                 @RequestParam(value = "project_num", required = false,defaultValue = "0") Integer projectNum,
                                 @RequestParam(value = "project_list", required = false,defaultValue = "") String projectList,
                                 @RequestParam(value = "company_name", required = false,defaultValue = "") String companyName,
                                 @RequestParam(value = "company_address", required = false,defaultValue = "") String companyAddress,
                                 @RequestParam(value = "contact_name", required = false,defaultValue = "") String contactName,
                                 @RequestParam(value = "contact_type", required = false,defaultValue = "") String contactType){
        return reportService.CreateBook(itemUnitId,projectNum,projectList,companyName,companyAddress,contactName,contactType);
    }
}
