package cn.thinkingdata.web.domain.industry;

import org.springframework.stereotype.Repository;

@Repository
public class Do_industry_article_topic {
	private String data_date;
	private String topic_id;
	private String topic_keywords;
	private Integer article_num;
	
	public String getData_date() {
		return data_date;
	}
	public void setData_date(String data_date) {
		this.data_date = data_date;
	}
	public String getTopic_id() {
		return topic_id;
	}
	public void setTopic_id(String topic_id) {
		this.topic_id = topic_id;
	}
	public String getTopic_keywords() {
		return topic_keywords;
	}
	public void setTopic_keywords(String topic_keywords) {
		this.topic_keywords = topic_keywords;
	}
	public Integer getArticle_num() {
		return article_num;
	}
	public void setArticle_num(Integer article_num) {
		this.article_num = article_num;
	}
	
}
