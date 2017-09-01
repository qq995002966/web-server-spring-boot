package cn.thinkingdata.web.controller.oss;

import cn.thinkingdata.web.service.oss.OssService;
import cn.thinkingdata.web.util.DataResult;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

@Controller
@RequestMapping(value = "/v1/oss")
public class OssController {
	
	@Autowired
	private OssService ossService;
	
	@RequestMapping(value = "/chat_policy",method = { RequestMethod.GET })
	@ResponseBody
	public DataResult getChatFilePostPolicy(HttpServletRequest request,HttpServletResponse response,
			@RequestParam(value = "file_name", required = true,defaultValue = "") String fileName,
			@RequestParam(value = "info_id", required = false,defaultValue = "0") int infoId,
			@RequestParam(value = "source_type", required = false,defaultValue = "10") int sourceType) throws UnsupportedEncodingException{						
		
		return ossService.getUploadChatFilePolicy(request, response, fileName, infoId, sourceType);
	}
	
	@RequestMapping(value = "/chat_callback",method = { RequestMethod.POST })
	@ResponseBody
	public DataResult chatFileUploadCallback(@RequestBody JSONObject bodyObj, HttpServletRequest request, HttpServletResponse response) throws NumberFormatException, IOException{

		return ossService.chatFileUploadCallback(bodyObj,request, response);
	}
}
