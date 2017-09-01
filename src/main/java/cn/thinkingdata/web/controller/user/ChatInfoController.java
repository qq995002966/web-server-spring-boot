package cn.thinkingdata.web.controller.user;

import cn.thinkingdata.web.service.core.user.custom.ChatInfoService;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Created by Xiaowu on 2016/8/23.
 */
@Controller
@RequestMapping(value = "/v1/service")
public class ChatInfoController {

    @Autowired
    private ChatInfoService chatInfoService;

    @RequestMapping(value = "/gas/chatinfo",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetGasChatInfo(@RequestParam(value = "info_id_list", required = false,defaultValue = "") String infoIdList,
                                     @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                     @RequestParam(value = "limit", required = false,defaultValue = "1000") Integer limit){
        return chatInfoService.GetGasChatInfo(infoIdList,index,limit);
    }

    @RequestMapping(value = "/gas/chatinfo",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult uploadGasChatInfo(@RequestParam(value = "info_id", required = false,defaultValue = "0") Integer infoId,
                                        HttpServletRequest request){
        if(0 != infoId){
            return chatInfoService.delChatInfo(infoId);
        }
        try {
            request.setCharacterEncoding("utf-8");  //设置编码
            //获得磁盘文件条目工厂
            DiskFileItemFactory factory = new DiskFileItemFactory();
            //高水平的API文件上传处理
            ServletFileUpload upload = new ServletFileUpload(factory);
            List<FileItem> list = (List<FileItem>)upload.parseRequest(request);
            return chatInfoService.uploadGasChatInfo(list);
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
        }
    }

    @RequestMapping(value = "/gas/chatinfo/analysis",method = { RequestMethod.POST })
    @ResponseBody
    public DataResult doChatAnalysis(@RequestParam(value = "info_id", required = false,defaultValue = "0") Integer infoId,
                                     @RequestParam(value = "start_date", required = false,defaultValue = "") String startDate,
                                     @RequestParam(value = "end_date", required = false,defaultValue = "") String endDate){
        return chatInfoService.doChatAnalysis(infoId,startDate,endDate);
    }

    @RequestMapping(value = "/gas/chatinfo/posts",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult GetChatQueryPosts(@RequestParam(value = "keywords", required = false) String keywords,
                                        @RequestParam(value = "session_id", required = false) String sessionId,
                                        @RequestParam(value = "topic_id", required = false) String topicId,
                                        @RequestParam(value = "qq_id", required = false) String qqId,
                                        @RequestParam(value = "author", required = false) String author,
                                        @RequestParam(value = "source_type", required = false) String sourceType,
                                        @RequestParam(value = "info_id", required = false,defaultValue = "0") Integer infoId,
                                        @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                        @RequestParam(value = "limit", required = false,defaultValue = "1000") Integer limit){
        return chatInfoService.GetChatQueryPosts(keywords,sessionId,topicId,qqId,author,sourceType,infoId,index,limit);
    }
}
