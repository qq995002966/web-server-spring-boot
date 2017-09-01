package cn.thinkingdata.web.domain.project.chat;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_chat_topic_session {
	public Integer user_num;
	public Integer post_num;
	public String topic_id;
	public String topic_keywords;
	public Integer session_num;
	public Integer getPost_num() {
		return post_num;
	}
	public void setPost_num(Integer post_num) {
		this.post_num = post_num;
	}
	public Integer getUser_num() {
		return user_num;
	}
	public void setUser_num(Integer user_num) {
		this.user_num = user_num;
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
	public Integer getSession_num() {
		return session_num;
	}
	public void setSession_num(Integer session_num) {
		this.session_num = session_num;
	}


}
