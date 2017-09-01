package cn.thinkingdata.web.controller.geetest;

import javax.servlet.http.HttpServletRequest;

/**
 * 
 * 
 * @author zheng
 *
 */
public class GeetestValidateInput {

	// 成功返回0
	public static final int validate(HttpServletRequest request) {
		
		// get session to share the object
		GeetestLib geetest = GeetestLib.getGtSession(request);
		if(geetest == null){
			return -1;
		}
		int gt_server_status_code = GeetestLib
				.getGtServerStatusSession(request);

		String gtResult = "fail";

		if (gt_server_status_code == 1) {
			gtResult = geetest.enhencedValidateRequest(request);
			
		} else {
			gtResult = "fail";
			gtResult=geetest.failbackValidateRequest(request);
		}


		if (gtResult.equals(GeetestLib.success_res)) 
		{
			return 0;
		} 
		else if (gtResult.equals(GeetestLib.forbidden_res)) 
		{
			return -2;
		} 
		else 
		{
			return -1;
		}
	}

}
