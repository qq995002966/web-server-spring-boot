package cn.thinkingdata.web.service.oss;

import cn.thinkingdata.web.constant.SessionAttr;
import cn.thinkingdata.web.domain.gas.Do_gas_chat_info;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.domain.user.Do_user_detail;
import cn.thinkingdata.web.persistence.gas.Mapper_gas_chat_info;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.DateUtil;
import cn.thinkingdata.web.util.ReturnCodeDim;
import cn.thinkingdata.web.util.WebUtil;
import com.alibaba.fastjson.JSONObject;
import com.aliyun.oss.OSSClient;
import com.aliyun.oss.common.utils.BinaryUtil;
import com.aliyun.oss.model.MatchMode;
import com.aliyun.oss.model.PolicyConditions;
import com.google.common.base.Throwables;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URI;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class OssService {
	private static final Logger logger = LogManager.getLogger();

	private static final String ACCESS_KEY_ID = "LTAIl3cdJvEmYxEt";
	private static final String ACCESS_KEY_SECRET = "OCESTrbWfx55le0jijABFdBUwLUUzz";
	private static final String ENDPOINT = "http://oss-cn-shanghai.aliyuncs.com";
	private static final String SFILE_BUCKET = "thinkinggame-sfile";
	private static final String SFILE_HOST  = "http://thinkinggame-sfile.oss-cn-shanghai.aliyuncs.com";
	private static final long POLICY_EXPIRE_SECONDS = 30;
	private static final int MAX_UPLOAD_FILE_SIZE = 52428800;// 50MB
	private static final String CHAT_FILE_OSS_DIR = "chat_file/";
	private static final String CHAT_CALLBACK_PATH = "/rest/v1/oss/chat_callback"; 
	//private static final String CHAT_CALLBACK_PATH = "/ossChatCallback"; 

	@Autowired
	private Mapper_gas_chat_info m_mapper_gas_chat_info;

	public DataResult getUploadChatFilePolicy(HttpServletRequest request,HttpServletResponse response,String fileName,int infoId,int sourceType) throws UnsupportedEncodingException{
		Do_user userDo = WebUtil.getCurrentUser();
		String[] fileTokens = fileName.split("\\.");
		String fileTail = fileTokens[fileTokens.length - 1];
		if (!fileTail.equalsIgnoreCase("txt") && !fileTail.equalsIgnoreCase("csv")) {
			return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "错误的文件后缀名","");
		}

		if(sourceType != 10 && sourceType != 11 && sourceType != 12){
			return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "错误的解析源","");
		}
		String realFileName = CHAT_FILE_OSS_DIR + fileName + "_" + userDo.getUser_id() + "_" + infoId + "_" + DateUtil.getLongDateString(new Date());
		if (infoId != 0) {
			Do_gas_chat_info chatInfo = m_mapper_gas_chat_info.getJustByInfoId(infoId);
			if (userDo.getUser_id().intValue() != chatInfo.getUser_id().intValue()) {
				return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN);
			}
			if (chatInfo.getStatus() != 3 && chatInfo.getStatus() != 7) {
				return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN, "禁止重新上传", "");
			}
			chatInfo.setStatus(-1);
			chatInfo.setFile_name(fileName);
			chatInfo.setReal_file_name(realFileName);
			chatInfo.setSource_type(sourceType);
			m_mapper_gas_chat_info.updateChatInfo(chatInfo);
		}else{
			Do_gas_chat_info chatInfo = new Do_gas_chat_info();
			String companyName = "";
			Do_user_detail userDetailDo = (Do_user_detail) WebUtil.getSession(SessionAttr.USER_DETAIL);
			if (userDetailDo != null) {
				companyName = userDetailDo.getCompany_name();
			}
			chatInfo.setCompany(companyName);
			chatInfo.setUser_id(userDo.getUser_id());
			chatInfo.setFile_name(fileName);
			chatInfo.setSource_type(sourceType);
			chatInfo.setReal_file_name(realFileName);
			chatInfo.setFile_bytes(0L);
			chatInfo.setStatus(-1);
			chatInfo.setDel_flag(-1);
			m_mapper_gas_chat_info.insertChatInfo(chatInfo);
			realFileName = CHAT_FILE_OSS_DIR + fileName + "_" + userDo.getUser_id() + "_" + chatInfo.getInfo_id() + "_" + DateUtil.getLongDateString(new Date());
			chatInfo.setReal_file_name(realFileName);
			m_mapper_gas_chat_info.updateChatInfo(chatInfo);
		}


		OSSClient client = new OSSClient(ENDPOINT, ACCESS_KEY_ID, ACCESS_KEY_SECRET);
		long expireEndTime = System.currentTimeMillis() + POLICY_EXPIRE_SECONDS * 1000;
		Date expiration = new Date(expireEndTime);

		PolicyConditions policyConds = new PolicyConditions();
		policyConds.addConditionItem(PolicyConditions.COND_CONTENT_LENGTH_RANGE, 0, MAX_UPLOAD_FILE_SIZE);

		policyConds.addConditionItem(MatchMode.Exact, PolicyConditions.COND_KEY, realFileName);


		String postPolicy = client.generatePostPolicy(expiration, policyConds);
		byte[] binaryData = postPolicy.getBytes("utf-8");
		String encodedPolicy = BinaryUtil.toBase64String(binaryData);
		String postSignature = client.calculatePostSignature(postPolicy);

		String serverName = request.getServerName();
		String callbackUrl = "http://" + serverName + CHAT_CALLBACK_PATH;
		JSONObject callbackObj = new JSONObject();
		callbackObj.put("callbackUrl", callbackUrl);
		//callbackObj.put("callbackBody", "{\"filename\":${object},\"size\":${size},\"mimeType\":${mimeType}}");
		callbackObj.put("callbackBody", "{\"filename\":${object},\"mimeType\":${mimeType},\"size\":${size}}");
		callbackObj.put("callbackBodyType", "application/json");
		String callbackStr = BinaryUtil.toBase64String(callbackObj.toJSONString().getBytes("utf-8"));

		Map<String, String> respMap = new LinkedHashMap<String, String>();
		respMap.put("accessid", ACCESS_KEY_ID);
		respMap.put("policy", encodedPolicy);
		respMap.put("signature", postSignature);
		respMap.put("upload_file_name", realFileName);
		respMap.put("host", SFILE_HOST);
		respMap.put("expire", String.valueOf(expireEndTime / 1000));
		respMap.put("callback", callbackStr);
		DataResult res = new DataResult(ReturnCodeDim.SUCCESS, respMap);
		return res;
	}

	public DataResult chatFileUploadCallback(JSONObject bodyObj,HttpServletRequest request,HttpServletResponse response) throws NumberFormatException, IOException{

		String ossCallbackBody =bodyObj.toJSONString();
						
		logger.info("OSS Callback Body:" + ossCallbackBody);
		boolean verifySuccess = verifyOSSCallbackRequest(request, ossCallbackBody);
		logger.info("is verify success:" + verifySuccess);		
		if(verifySuccess){
//			String fileName = request.getParameter("filename");
//			int fileSize = Integer.parseInt(request.getParameter("size"));
//			String mimeType = request.getParameter("mimeType");

			String fileName = bodyObj.getString("filename");
			int fileSize = bodyObj.getIntValue("size");
			String mimeType = bodyObj.getString("mimeType");

			String[] fileTokens = fileName.split("_");
			int infoId = Integer.parseInt(fileTokens[fileTokens.length - 2]);
			m_mapper_gas_chat_info.uploadFileSuccess(infoId, fileSize);
						
			DataResult res = new DataResult(ReturnCodeDim.SUCCESS);
			return res;
		}else{
			DataResult res = new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"文件上传回调校验失败","");
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return res;
		}
		
	}


	private String getPostBody(InputStream is, int contentLen) {
		if (contentLen > 0) {
			int readLen = 0;
			int readLengthThisTime = 0;
			byte[] message = new byte[contentLen];
			try {
				while (readLen != contentLen) {
					readLengthThisTime = is.read(message, readLen, contentLen - readLen);
					if (readLengthThisTime == -1) {
						break;
					}
					readLen += readLengthThisTime;
				}
				return new String(message);
			} catch (IOException e) {
				logger.error(Throwables.getRootCause(e));
			}
		}
		return "";
	}

	private boolean verifyOSSCallbackRequest(HttpServletRequest request, String ossCallbackBody) throws NumberFormatException, IOException{
		boolean ret = false;	
		String autorizationInput = new String(request.getHeader("Authorization"));
		String pubKeyInput = request.getHeader("x-oss-pub-key-url");
		byte[] authorization = BinaryUtil.fromBase64String(autorizationInput);
		byte[] pubKey = BinaryUtil.fromBase64String(pubKeyInput);
		String pubKeyAddr = new String(pubKey);
		if (!pubKeyAddr.startsWith("http://gosspublic.alicdn.com/") && !pubKeyAddr.startsWith("https://gosspublic.alicdn.com/")){
			logger.error("pub key addr must be oss addrss");
			return false;
		}
		String retString = executeGet(pubKeyAddr);
		retString = retString.replace("-----BEGIN PUBLIC KEY-----", "");
		retString = retString.replace("-----END PUBLIC KEY-----", "");
		String queryString = request.getQueryString();
		String uri = request.getRequestURI();
		String decodeUri = java.net.URLDecoder.decode(uri, "UTF-8");
		String authStr = decodeUri;
		if (queryString != null && !queryString.equals("")) {
			authStr += "?" + queryString;
		}
		authStr += "\n" + ossCallbackBody;
		logger.info("oss auth string: " + authStr);
		ret = doCheck(authStr, authorization, retString);
		return ret;
	}

	@SuppressWarnings("finally")
	public String executeGet(String url) {
		BufferedReader in = null;

		String content = null;
		try {
			@SuppressWarnings("resource")
			DefaultHttpClient client = new DefaultHttpClient();
			// 实例化HTTP方法
			HttpGet request = new HttpGet();
			request.setURI(new URI(url));
			HttpResponse response = client.execute(request);

			in = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
			StringBuffer sb = new StringBuffer("");
			String line = "";
			String NL = System.getProperty("line.separator");
			while ((line = in.readLine()) != null) {
				sb.append(line + NL);
			}
			in.close();
			content = sb.toString();
		} catch (Exception e) {
			logger.error(Throwables.getStackTraceAsString(e));
		} finally {
			if (in != null) {
				try {
					in.close();// 最后要关闭BufferedReader
				} catch (Exception e) {
					logger.error(Throwables.getStackTraceAsString(e));
				}
			}
			return content;
		}
	}
	
	private boolean doCheck(String content, byte[] sign, String publicKey) {
		try {
			KeyFactory keyFactory = KeyFactory.getInstance("RSA");
			byte[] encodedKey = BinaryUtil.fromBase64String(publicKey);
			PublicKey pubKey = keyFactory.generatePublic(new X509EncodedKeySpec(encodedKey));
			java.security.Signature signature = java.security.Signature.getInstance("MD5withRSA");
			signature.initVerify(pubKey);
			signature.update(content.getBytes());
			boolean bverify = signature.verify(sign);
			return bverify;

		} catch (Exception e) {
			logger.error(Throwables.getStackTraceAsString(e));
		}

		return false;
	}
	
	
}
