package cn.thinkingdata.web.util.qcloud;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import com.qcloud.cos.exception.AbstractCosException;
import com.qcloud.cos.sign.Credentials;
import com.qcloud.cos.sign.Sign;

public class QcloudApiUtil {
	private static final int APP_ID = 10048160;
	private static final String SECRET_ID = "AKIDzMzSGl0X4O88s5mTvsPEiQ3vmy129g0Z";
	private static final String SECRET_KEY = "Hu5qWkVynQxoDasi6oDyvBdza1MQZLt4";
	
	
	public static String getReportPdfAccessUrl(String fileName,long expireSeconds) throws AbstractCosException, UnsupportedEncodingException{
		String bucketName = "tgfilesecret";
		String cosDir = "/report_pdf/";
		String urlPre = "http://sfile.thinkinggame.cn";
		
		Credentials cred = new Credentials(APP_ID, SECRET_ID, SECRET_KEY);
		long expired = System.currentTimeMillis() / 1000 + expireSeconds;
		String cosPath = cosDir + fileName;
		String signStr = Sign.getDownLoadSign(bucketName, cosPath, cred, expired);
		String urlCosPath = cosDir + URLEncoder.encode(fileName, "UTF-8");
		String url = urlPre + urlCosPath + "?sign=" + signStr;
		return url;
	}
}
