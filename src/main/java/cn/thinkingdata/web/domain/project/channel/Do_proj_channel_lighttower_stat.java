package cn.thinkingdata.web.domain.project.channel;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_channel_lighttower_stat {
	String data_date;
	Integer project_id;
	Integer info_id;
	String source_name;
	String lighttower_classify;
	Integer classify_sentiment;
	Integer post_num;
	String lighttower_tags;
	
	public String getLighttower_tags() {
		return lighttower_tags;
	}
	public void setLighttower_tags(String lighttower_tags) {
		this.lighttower_tags = lighttower_tags;
	}
	
	public String getData_date() {
		return data_date;
	}
	public void setData_date(String data_date) {
		this.data_date = data_date;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public Integer getInfo_id() {
		return info_id;
	}
	public void setInfo_id(Integer info_id) {
		this.info_id = info_id;
	}
	public String getSource_name() {
		return source_name;
	}
	public void setSource_name(String source_name) {
		this.source_name = source_name;
	}
	public String getLighttower_classify() {
		return lighttower_classify;
	}
	public void setLighttower_classify(String lighttower_classify) {
		this.lighttower_classify = lighttower_classify;
	}
	public Integer getClassify_sentiment() {
		return classify_sentiment;
	}
	public void setClassify_sentiment(Integer classify_sentiment) {
		this.classify_sentiment = classify_sentiment;
	}
	public Integer getPost_num() {
		return post_num;
	}
	public void setPost_num(Integer post_num) {
		this.post_num = post_num;
	}
	
	
}
