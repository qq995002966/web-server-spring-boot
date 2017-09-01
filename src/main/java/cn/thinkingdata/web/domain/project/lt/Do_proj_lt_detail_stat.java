package cn.thinkingdata.web.domain.project.lt;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_lt_detail_stat {
	private String data_date;
	private Integer project_id;
	private Integer classify_sentiment;
	private String lighttower_classify;
	private Integer post_num;
	private String lighttower_tags;
	
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
	public Integer getClassify_sentiment() {
		return classify_sentiment;
	}
	public void setClassify_sentiment(Integer classify_sentiment) {
		this.classify_sentiment = classify_sentiment;
	}
	public String getLighttower_classify() {
		return lighttower_classify;
	}
	public void setLighttower_classify(String lighttower_classify) {
		this.lighttower_classify = lighttower_classify;
	}
	public Integer getPost_num() {
		return post_num;
	}
	public void setPost_num(Integer post_num) {
		this.post_num = post_num;
	}
	public String getLighttower_tags() {
		return lighttower_tags;
	}
	public void setLighttower_tags(String lighttower_tags) {
		this.lighttower_tags = lighttower_tags;
	}
	
	
}
