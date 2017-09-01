package cn.thinkingdata.web.properties;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class CommonProperties extends Properties {

	private static final long serialVersionUID = 7215296458434319395L;
	private static CommonProperties instance;
	private static final String path = "/common.properties";
	
	public CommonProperties(){
		
	}

	public static CommonProperties getInstance() {
		if (instance != null) {
			return instance;
		} else {
			makeInstance(path);
			return instance;
		}
	}

	private static synchronized void makeInstance(String path) {
		if (instance == null) {
			instance = new CommonProperties(path);
		}
	}

	private CommonProperties(String path) {
		InputStream is = getClass().getResourceAsStream(path);
		try {
			load(is);
		} catch (IOException ex) {
			System.err
					.println("Error: Read properties file unsuccessfully, file is "
							+ path);
		}
	}
	
	public String getEsClusterName(){
		return instance.getProperty("dw.elasticsearch.cluster.name");
	}
	
	public List<String> getEsNodeList(){
		ArrayList<String> nodeList = new ArrayList<String>();
		String nodeStr = instance.getProperty("dw.elasticsearch.node.list");
		String tokens[] = nodeStr.split(",");
		for(String token : tokens){
			nodeList.add(token);
		}
		return nodeList;
	}
	
	public int getEsTransPort(){
		return Integer.parseInt(instance.getProperty("dw.elasticsearch.trans.port"));
	}
	
	public String getEsIndexName(){
		return instance.getProperty("dw.elasticsearch.index.name");
				
	}
	
	
	
}
