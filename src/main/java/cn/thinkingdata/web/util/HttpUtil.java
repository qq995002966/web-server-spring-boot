package cn.thinkingdata.web.util;


import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

public final class HttpUtil {
    private static final Logger logger = LogManager.getLogger(HttpUtil.class);

    private HttpUtil() {
    }

    public static final String httpClientPost(String url) {
        String result = "";
        HttpClient client = new HttpClient();
        GetMethod getMethod = new GetMethod(url);

        try {
            client.executeMethod(getMethod);
            InputStream ins = getMethod.getResponseBodyAsStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(ins,"UTF-8"));
            StringBuffer sbf = new StringBuffer();
            String line = null;
            while ((line = br.readLine()) != null)
            {
                sbf.append(line);
            }
            result = new String(sbf);
            br.close();
        } catch (Exception e) {
            logger.error(e);
        } finally {
            getMethod.releaseConnection();
        }
        return result;
    }

    public static final String httpClientPost(String url, ArrayList<NameValuePair> list) {
        String result = "";
        HttpClient client = new HttpClient();
        PostMethod postMethod = new PostMethod(url);
        try {
            NameValuePair[] params = new NameValuePair[list.size()];
            for (int i = 0; i < list.size(); i++) {
                params[i] = list.get(i);
            }
            postMethod.addParameters(params);

            client.executeMethod(postMethod);
            result = postMethod.getResponseBodyAsString();
        } catch (Exception e) {
            logger.error(e);
        } finally {
            postMethod.releaseConnection();
        }
        return result;
    }

    public static final String httpClientPostJSON(String url, String json) {
        String result = "";
        HttpClient client = new HttpClient();
        PostMethod postMethod = new PostMethod(url);
        try {
            RequestEntity requestEntity = new StringRequestEntity(json,"application/json","UTF-8");
            postMethod.setRequestEntity(requestEntity);
            client.executeMethod(postMethod);
            result = postMethod.getResponseBodyAsString();
        } catch (Exception e) {
            logger.error(e);
        } finally {
            postMethod.releaseConnection();
        }
        return result;
    }

}

