package cn.thinkingdata.web.service.core.article;

import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchObj;
import cn.thinkingdata.elasticsearch.query.dao.ElasticSearchOrder;
import cn.thinkingdata.elasticsearch.query.util.ElasticSearchQueryUtil;
import cn.thinkingdata.web.service.cache.ProjectInfoCacheService;
import cn.thinkingdata.web.service.core.sys.SysEventService;
import cn.thinkingdata.web.util.*;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Xiaowu on 2016/8/8.
 */
@Service
public class ArticleService {
	private static final Logger logger = LogManager.getLogger();
	@Autowired
	private ProjectInfoCacheService projectInfoCacheService;

	private static final String TABLE_NAMES[] = {"game_article"};
	private static final String INCLUDE_FIELDS_QUERY[] = {"title","source","post_date","url","main_class","sub_class","content","raw_html_content"};
	private static final String INCLUDE_FIELDS_DETAIL[] = {"title","source","post_date","raw_html_content","url"};
	private static final String INCLUDE_FIELDS_RELATED[] = {"title","post_date","url","raw_html_content","source"};
	private static final String TABLE_NAME = "game_article";
	private static final String[] MAIN_CLASS_ARRAY = {"公司","前沿","研发","行业","电竞","人物","游戏","其他"};
	private static final String[][] SUB_CLASS_ARRAYS = {{"财务","纠纷","要闻","战略"},{"HTML5","大数据","VR/AR"},{"运营","开发","测试","设计","策划"},{"排行榜","IP","动态","峰会","报告"},{"电竞"},{"人物"},{"游戏"},{""}};
	private static final int RELATED_NUM = 10;
	private static final float SCORE_THRESHHOLD = 1.0f;
	private static final int MAX_PREVIEW_NUM = 100;

	private static Pattern imgPattern = Pattern.compile("<(img|IMG) .*?src=\"(.*?)\".*?>",Pattern.DOTALL);

	private static String[] signLetters = {",","，","。","；",";"};

	public DataResult articleQuery(String mainClass, String subClass, String topicId, String keyword, String startDate, String endDate, String orderField, String orderType, Integer needPreview, Integer titleOnly, Integer ignoreBad, Integer index, Integer limit, Integer projectId) {
		ElasticSearchQueryUtil esUtil = ElasticSearchQueryUtil.getInstance();
		ArrayList<ElasticSearchObj> searchList = new ArrayList<>();
		ElasticSearchObj searchObj;
		if(mainClass != null){
			if(mainClass.equals("其他")){
				mainClass = "";
			}
			searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.TERM, "main_class", mainClass);
			searchList.add(searchObj);
		}
		if(subClass != null){
			searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.TERM, "sub_class", subClass);
			searchList.add(searchObj);
		}
		if(!CommonUtil.IsEmpty(topicId)){
			searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.TERM, "topic_code", topicId);
			searchList.add(searchObj);
		}
		if(!CommonUtil.IsEmpty(keyword)){
			if(titleOnly == 0){
				searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.PHRASE, "title\tcontent", keyword);
			}else{
				searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.PHRASE, "title", keyword);
			}
			searchList.add(searchObj);
		}
		if(projectId != 0){
			String projectName = projectInfoCacheService.getProjectName(projectId.toString());
			projectName = projectName.replaceAll("手游|端游|系列|单机|手游版|端游版|页游", "");

			searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.PHRASE, "title", projectName);
			searchList.add(searchObj);
		}
		if(!CommonUtil.IsEmpty(startDate) && !CommonUtil.IsEmpty(endDate)){
			searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.RANGE, "post_date", startDate + "\t" + endDate);
			searchList.add(searchObj);
		}else{
			searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.RANGE, "post_date", "2000-01-01" + "\t" + DateUtil.getPartitionString(new Date()));
			searchList.add(searchObj);
		}
		if(ignoreBad.intValue() == 1){
			searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.NOT_IN, "main_class", "游戏");
			searchList.add(searchObj);
		}
		ArrayList<ElasticSearchOrder> orderList = new ArrayList<>();
		ElasticSearchOrder searchOrder = null;
		if(!CommonUtil.IsEmpty(orderField)){
			String orderFieldTokens[] = orderField.split(",");
			String orderTypeTokens[] = orderType.split(",");
			for(int i = 0; i < orderFieldTokens.length; i++){
				if(orderFieldTokens[i].equals("score")){
					searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.GT, "score", "0");
					searchList.add(searchObj);
				}
				SortOrder order = SortOrder.DESC;
				if(orderTypeTokens[i].equalsIgnoreCase("asc")){
					order = SortOrder.ASC;
				}
				searchOrder = new ElasticSearchOrder(orderFieldTokens[i], order);
				orderList.add(searchOrder);
			}
		}else{
			searchOrder = new ElasticSearchOrder("post_date", SortOrder.DESC);
			orderList.add(searchOrder);
		}
		String excludeFields[] = null;
		if(needPreview == 0){
			excludeFields = new String[2];
			excludeFields[0] = "content";
			excludeFields[1] = "raw_html_content";
		}
		Float minScore = null;
		if(projectId != 0){
			searchOrder = new ElasticSearchOrder("_score", SortOrder.DESC);
			orderList.add(searchOrder);
			minScore = 1.0f;
		}
		try {
			JSONObject resObj = esUtil.searchDataWithFieldFilter(TABLE_NAMES, index, limit, searchList, orderList, INCLUDE_FIELDS_QUERY, excludeFields,minScore);
			JSONArray dataJsonArray = resObj.getJSONObject("data").getJSONArray("list");
			for(int i = 0; i < dataJsonArray.size(); i++){
				JSONObject sourceObj = dataJsonArray.getJSONObject(i).getJSONObject("source");
				String title = StringUtil.delUselessChar(sourceObj.getString("title"));
				sourceObj.put("title", title);
				if(needPreview == 1){
					String content = sourceObj.getString("content");
					content = StringUtil.delUselessChar(content);
					if(CommonUtil.IsEmpty(keyword)){
						int previewNum = Math.min(MAX_PREVIEW_NUM, content.length());
						content = content.substring(0, previewNum);
					}else{
						int keywordIndex = content.indexOf(keyword);
						if(keywordIndex >= 0){
							String subContent = content.substring(0, keywordIndex);
							int lastLettIndex = 0;
							for(String letter : signLetters){
								int letterIndex = subContent.lastIndexOf(letter);
								if(letterIndex > lastLettIndex){
									lastLettIndex = letterIndex;
								}
							}
							int contentEndIndex = Math.min(lastLettIndex + MAX_PREVIEW_NUM + 1, content.length());
							content = content.substring(lastLettIndex + 1, contentEndIndex);
						}else{
							int previewNum = Math.min(MAX_PREVIEW_NUM, content.length());
							content = content.substring(0, previewNum);
						}

					}
					content = content + "……";
					sourceObj.put("content", content);
					String rawHtmlContent = StringEscapeUtils.unescapeJava(sourceObj.getString("raw_html_content"));
					String imgUrl = "";
					if(rawHtmlContent != null){
						Matcher imgMatcher = imgPattern.matcher(rawHtmlContent);
						if(imgMatcher.find()){
							imgUrl = imgMatcher.group(2);
						}
					}

					sourceObj.remove("raw_html_content");
					sourceObj.put("preview_img", imgUrl);
				}
			}
			return new DataResult(ReturnCodeDim.SUCCESS,resObj);
		} catch (IOException e) {
			e.printStackTrace();
			return new DataResult(ReturnCodeDim.SYSTEM_ERROR);
		}
	}

	public DataResult findArticleDetail(String title) {
		if(title.equals("")){
			return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "title参数未传递");
		}
		try {
			ElasticSearchQueryUtil esUtil = ElasticSearchQueryUtil.getInstance();
			ArrayList<ElasticSearchObj> searchList = new ArrayList<>();
			ElasticSearchObj searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.ID, "title", title);
			searchList.add(searchObj);
			JSONObject resObj = esUtil.searchDataWithFieldFilter(TABLE_NAMES, 0, 1, searchList, null, INCLUDE_FIELDS_DETAIL, null);

			JSONArray dataJsonArray = resObj.getJSONObject("data").getJSONArray("list");
			for(int i = 0; i < dataJsonArray.size(); i++){
				JSONObject sourceObj = dataJsonArray.getJSONObject(i).getJSONObject("source");
				String newTitle = StringUtil.delUselessChar(sourceObj.getString("title"));
				sourceObj.put("title", newTitle);
				String rawhtmlContent = org.apache.commons.lang3.StringEscapeUtils.unescapeJava(sourceObj.getString("raw_html_content"));
				Matcher matcher = imgPattern.matcher(rawhtmlContent);
				List<String> imageList = new ArrayList<>();
				while(matcher.find()){
					imageList.add(matcher.group(2));
				}
				sourceObj.put("image_list", imageList);
			}
			return new DataResult(ReturnCodeDim.SUCCESS,resObj);
		} catch (IOException e) {
			e.printStackTrace();
			return new DataResult(ReturnCodeDim.SYSTEM_ERROR);
		}
	}

	public DataResult findArticleRelatedArticles(String title) {
		if(title == null){
			return new DataResult(ReturnCodeDim.PARAMETER_ERROR, "title参数未传递");
		}
		try {
			ElasticSearchQueryUtil esUtil = ElasticSearchQueryUtil.getInstance();
			ArrayList<ElasticSearchObj> searchObjList = new ArrayList<>();
			ElasticSearchObj searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.SEARCH, "title", title);
			searchObjList.add(searchObj);
			ArrayList<ElasticSearchOrder> orderList = new ArrayList<>();
			ElasticSearchOrder searchOrder = new ElasticSearchOrder("post_date", SortOrder.DESC);
			orderList.add(searchOrder);
			searchOrder = new ElasticSearchOrder("_score", SortOrder.DESC);
			orderList.add(searchOrder);
			JSONObject jsonObj = esUtil.searchDataWithFieldFilter(TABLE_NAMES, 0, RELATED_NUM + 1, searchObjList,orderList,INCLUDE_FIELDS_RELATED,null,SCORE_THRESHHOLD);
			JSONArray listArray = jsonObj.getJSONObject("data").getJSONArray("list");
			int removeIndex = -1;
			for(int i = 0; i < listArray.size(); i++){
				JSONObject sourceObj = listArray.getJSONObject(i).getJSONObject("source");
				String rawTitle = sourceObj.getString("title");
				String refineTitle = StringUtil.delUselessChar(sourceObj.getString("title"));
				if(title.equals(rawTitle)){
					removeIndex = i;
				}
				sourceObj.put("title", refineTitle);
				String imgUrl = "";
				String rawHtmlContent = StringEscapeUtils.unescapeJava(sourceObj.getString("raw_html_content"));
				if(rawHtmlContent != null){
					Matcher imgMatcher = imgPattern.matcher(rawHtmlContent);
					if(imgMatcher.find()){
						imgUrl = imgMatcher.group(2);
					}
				}
				sourceObj.remove("raw_html_content");
				sourceObj.put("preview_img", imgUrl);


			}
			if(removeIndex >= 0){
				listArray.remove(removeIndex);
			}
			return new DataResult(ReturnCodeDim.SUCCESS,jsonObj);
		} catch (IOException e) {
			e.printStackTrace();
			return new DataResult(ReturnCodeDim.SYSTEM_ERROR);
		}
	}

	public DataResult findArticleClassifyCount(String keyword, String startDate, String endDate, Integer titleOnly, Integer projectId) {
		ElasticSearchQueryUtil esUtil = ElasticSearchQueryUtil.getInstance();
		ArrayList<ElasticSearchObj> searchList = new ArrayList<>();
		ElasticSearchObj searchObj;
		if(!CommonUtil.IsEmpty(keyword)){
			if(titleOnly == 0){
				searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.PHRASE, "title\tcontent", keyword);
			}else{
				searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.PHRASE, "title", keyword);
			}
			searchList.add(searchObj);
		}
		if(projectId != 0){
			String projectName = projectInfoCacheService.getProjectName(projectId.toString());
			projectName = projectName.replaceAll("手游|端游|系列|单机|手游版|端游版|页游", "");
			searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.PHRASE, "title", projectName);
			searchList.add(searchObj);
		}
		if(!CommonUtil.IsEmpty(startDate) && !CommonUtil.IsEmpty(endDate)){
			searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.RANGE, "post_date", startDate + "\t" + endDate);
			searchList.add(searchObj);
		}else{
			searchObj = new ElasticSearchObj(ElasticSearchObj.ESearchType.RANGE, "post_date", "2000-01-01" + "\t" + DateUtil.getPartitionString(new Date()));
			searchList.add(searchObj);
		}
		Map<String, Long> classifyNumMap = null;
		try {
			classifyNumMap = esUtil.searchDataClassifyAgg(TABLE_NAME, searchList, "sub_class");
		} catch (IOException e) {
			e.printStackTrace();
		}
		Map<String, Object> dataMap = getFinalDataMap(classifyNumMap);
		return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
	}

	private Map<String, Object> getFinalDataMap(Map<String, Long> classifyNumMap){
		Map<String, Object> resultMap = new LinkedHashMap<>();
		for(int i = 0; i < MAIN_CLASS_ARRAY.length; i++){
			int mainClassNum = 0;
			List<Map<String, Long>> subClassNumMapList = new ArrayList<>();
			for(int j = 0; j < SUB_CLASS_ARRAYS[i].length; j++){
				String subClass = SUB_CLASS_ARRAYS[i][j];
				Long num = classifyNumMap.get(subClass);
				if(num != null){
					Map<String, Long> subClassNumMap = new HashMap<>();
					subClassNumMap.put(subClass, num);
					subClassNumMapList.add(subClassNumMap);
					mainClassNum += num;
				}
			}
			if(mainClassNum > 0){
				Map<String, Object> mainClassResMap = new LinkedHashMap<>();
				mainClassResMap.put("total_num", mainClassNum);
				if(SUB_CLASS_ARRAYS[i].length > 1){
					mainClassResMap.put("sub_list", subClassNumMapList);
				}
				resultMap.put(MAIN_CLASS_ARRAY[i], mainClassResMap);
			}
		}
		return resultMap;
	}
}
