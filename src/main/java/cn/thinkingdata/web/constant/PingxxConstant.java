package cn.thinkingdata.web.constant;

import com.pingplusplus.Pingpp;
import org.apache.commons.codec.binary.Base64;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;

public class PingxxConstant {
	//PING++ 公钥
	public static final String PINGXX_PUB_KEY = PingxxConstant.class.getResource("/").getPath() + "pingxx/pingxx_pub_key.pem";
	
	public static final String MERCHANT_PRIVATE_KEY =  PingxxConstant.class.getResource("/").getPath() + "pingxx/merchant_private_key.pem";
	
	public static final String APP_ID = "app_eTqzH00m1CG8XrPi"; 

	public static void init(){
		//Pingpp.apiKey = "sk_test_0e9iP0SeLOyLjTq5uDOub1aT";
		Pingpp.apiKey = "sk_live_fvHG4CC0ezbTafj5WTrLyLGO";
		Pingpp.privateKeyPath = MERCHANT_PRIVATE_KEY;
	}
	
	
	public static PublicKey getPingxxPubKey() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException{
		FileInputStream in = new FileInputStream(PINGXX_PUB_KEY);
		byte[] keyBytes = new byte[in.available()];
		in.read(keyBytes);
		in.close();

		String pubKey = new String(keyBytes, "UTF-8");
		pubKey = pubKey.replaceAll("(-+BEGIN PUBLIC KEY-+\\r?\\n|-+END PUBLIC KEY-+\\r?\\n?)", "");

		keyBytes = Base64.decodeBase64(pubKey);

		// generate public key
		X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
		KeyFactory keyFactory = KeyFactory.getInstance("RSA");
		PublicKey publicKey = keyFactory.generatePublic(spec);
		return publicKey;
	}
}
