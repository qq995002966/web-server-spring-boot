package cn.thinkingdata.web.util.qcloud;

import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Date;


import cn.thinkingdata.web.util.coupon.CouponsDim;

import com.aliyun.oss.OSSClient;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.http.MethodType;
import com.aliyuncs.http.ProtocolType;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import com.aliyuncs.sts.model.v20150401.AssumeRoleRequest;
import com.aliyuncs.sts.model.v20150401.AssumeRoleResponse;
import com.qcloud.cos.exception.AbstractCosException;
import com.qcloud.cos.sign.Credentials;
import com.qcloud.cos.sign.Sign;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class AliyunApiUtil {
	 private static final Logger logger = LogManager.getLogger();
	private static final String REGION_CN_HANGZHOU = "cn-hangzhou";
	private static final String STS_API_VERSION = "2015-04-01";
	private static final String ACCESS_KEY_ID = "LTAIl3cdJvEmYxEt";
	private static final String ACCESS_KEY_SECRET = "OCESTrbWfx55le0jijABFdBUwLUUzz";
	private static final String ROLE_ARN = "acs:ram::1858873835677881:role/aliyunosstokengeneratorrole";
	private static final String ROLE_SESSION_NAME = "secretfile-tg";
	private static final String POLICY = "{\n" +
			"    \"Version\": \"1\", \n" +
			"    \"Statement\": [\n" +
			"        {\n" +
			"            \"Action\": [\n" +
			"                \"oss:GetBucket\", \n" +
			"                \"oss:GetObject\" \n" +
			"            ], \n" +
			"            \"Resource\": [\n" +
			"                \"acs:oss:*:*:*\"\n" +
			"            ], \n" +
			"            \"Effect\": \"Allow\"\n" +
			"        }\n" +
			"    ]\n" +
			"}";

	private static final String END_POINT = "http://oss-cn-shanghai.aliyuncs.com";
	private static final String BUCKET_NAME = "thinkinggame-sfile";
	
	
	
	public static String getReportPdfAccessUrl(String fileName,long expireSeconds) throws AbstractCosException, UnsupportedEncodingException, ClientException{
//		ProtocolType protocolType = ProtocolType.HTTPS;
//		final AssumeRoleResponse response = assumeRole(ACCESS_KEY_ID, ACCESS_KEY_SECRET,ROLE_ARN, ROLE_SESSION_NAME, POLICY, protocolType);
//		
//		String expiration = response.getCredentials().getExpiration();
//		logger.info("expiration: " + expiration);
//		String accessKeyId = response.getCredentials().getAccessKeyId();
//		logger.info("accessKeyId: " + accessKeyId);
//		String accessKeySecret = response.getCredentials().getAccessKeySecret();
//		logger.info("accessKeySecret: " + accessKeySecret);
//		String secretToken = response.getCredentials().getSecurityToken();		
//		logger.info("secretToken: " + secretToken);
		

		OSSClient client = new OSSClient(END_POINT, ACCESS_KEY_ID, ACCESS_KEY_SECRET);
		String key = "report_pdf/" + fileName;
		Date fileExpireTime = new Date(new Date().getTime() + expireSeconds * 1000);
		String url = client.generatePresignedUrl(BUCKET_NAME, key, fileExpireTime).toString();
		url = url.replace("thinkinggame-sfile.oss-cn-shanghai.aliyuncs.com", "secretfile.thinkinggame.cn");
				
		return url;
	}

	private static AssumeRoleResponse assumeRole(String accessKeyId, String accessKeySecret,
			String roleArn, String roleSessionName, String policy,
			ProtocolType protocolType) throws ClientException {
		try {
			// 创建一个 Aliyun Acs Client, 用于发起 OpenAPI 请求
			IClientProfile profile = DefaultProfile.getProfile(REGION_CN_HANGZHOU, accessKeyId, accessKeySecret);
			DefaultAcsClient client = new DefaultAcsClient(profile);
			// 创建一个 AssumeRoleRequest 并设置请求参数
			final AssumeRoleRequest request = new AssumeRoleRequest();
			request.setVersion(STS_API_VERSION);
			request.setMethod(MethodType.POST);
			request.setProtocol(protocolType);
			request.setRoleArn(roleArn);
			request.setRoleSessionName(roleSessionName);
			request.setPolicy(policy);
			// 发起请求，并得到response
			final AssumeRoleResponse response = client.getAcsResponse(request);
			return response;
		} catch (ClientException e) {			
			throw e;
		}
	}
}
