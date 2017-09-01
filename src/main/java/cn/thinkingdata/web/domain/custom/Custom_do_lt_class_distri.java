package cn.thinkingdata.web.domain.custom;

import org.springframework.stereotype.Repository;

@Repository
public class Custom_do_lt_class_distri {
	private Integer classify_sentiment;
	private String lighttower_classify;
	private Integer post_num;
	
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
	
	
}
