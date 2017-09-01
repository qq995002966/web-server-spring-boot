package cn.thinkingdata.web.domain.project.chat;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_chat_top_topic {

	public String getTopic_word_list() {
		return topic_word_list;
	}
	public void setTopic_word_list(String topic_word_list) {
		this.topic_word_list = topic_word_list;
	}
	public String getTopic_id() {
		return topic_id;
	}
	public void setTopic_id(String topic_id) {
		this.topic_id = topic_id;
	}
	public Integer getPost_num() {
		return post_num;
	}
	public void setPost_num(Integer post_num) {
		this.post_num = post_num;
	}
	public Integer getPositive_num() {
		return positive_num;
	}
	public void setPositive_num(Integer positive_num) {
		this.positive_num = positive_num;
	}
	public Integer getNegative_num() {
		return negative_num;
	}
	public void setNegative_num(Integer negative_num) {
		this.negative_num = negative_num;
	}
	private String topic_word_list;
	private String topic_id; 
	private Integer post_num;
	private Integer positive_num;
	private Integer negative_num;
	

	
	

}
