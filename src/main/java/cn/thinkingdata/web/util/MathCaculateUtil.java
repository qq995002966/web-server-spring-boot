package cn.thinkingdata.web.util;

import java.util.*;
import java.util.Map.Entry;

public class MathCaculateUtil {
	public static Map<String, Double> getPercentValueMap(Map<String,Double> dataMap){
		int totalNum = 0;
		for(Entry<String, Double> entry : dataMap.entrySet()){
			totalNum += entry.getValue();
		}
		return getAvgValueMap(dataMap, totalNum);

	}
	
	public static Map<String, Double> sortMapByValue(Map<String, Double> oldMap,final String sortParam) {  
		ArrayList<Entry<String, Double>> list = new ArrayList<Entry<String, Double>>(oldMap.entrySet());
		Collections.sort(list, new Comparator<Entry<String, Double>>() {

			@Override  
			public int compare(Entry<String, Double> arg0,  
					Entry<String, Double> arg1) {  
				if(sortParam.equalsIgnoreCase("asc")){

					return arg0.getValue().compareTo(arg1.getValue());
				}else{
					return -arg0.getValue().compareTo(arg1.getValue());  
				}

			}  
		});  
		Map<String, Double> newMap = new LinkedHashMap<String, Double>();  
		for (int i = 0; i < list.size(); i++) {  
			newMap.put(list.get(i).getKey(), list.get(i).getValue());  
		}  
		return newMap;  
	}
	
	public static Map<String, Double> getAvgValueMap(Map<String,Double> dataMap, int totalNum){
		HashMap<String, Double> resultMap = new HashMap<>();		
		for(Entry<String,Double> entry : dataMap.entrySet()){
			String key = entry.getKey();
			double value = entry.getValue();
			double avgNum = 0;
			try{
				avgNum = CommonUtil.setScale(value / totalNum,4);
			}catch(Exception e){
				avgNum = 0;
			}
			resultMap.put(key, avgNum);
		}
		return resultMap;
	}

	public static Map<String, Double> getAvgValueMap(Map<String,Double> dataMap, Map<String, Integer> keyNumMap){
		HashMap<String, Double> resultMap = new HashMap<>();
		for(Entry<String,Double> entry : dataMap.entrySet()){
			String key = entry.getKey();
			double value = entry.getValue();
			int keyNum = keyNumMap.get(key);
			double avgNum = 0;
			try{
				avgNum = CommonUtil.setScale(value / keyNum,4);
			}catch(Exception e){
				avgNum = 0;
			}
			resultMap.put(key, avgNum);
		}
		return resultMap;
	}
}
