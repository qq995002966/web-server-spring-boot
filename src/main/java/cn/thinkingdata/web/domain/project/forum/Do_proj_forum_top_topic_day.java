package cn.thinkingdata.web.domain.project.forum;

public class Do_proj_forum_top_topic_day {
	private String data_date;
	private Integer project_id;
	private String topic_id;
	private String topic_word_list;
	private Integer post_num;
	private Integer user_num;
	private Integer positive_num;
	private Integer negative_num;
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
	public String getTopic_id() {
		return topic_id;
	}
	public void setTopic_id(String topic_id) {
		this.topic_id = topic_id;
	}
	public String getTopic_word_list() {
		return topic_word_list;
	}
	public void setTopic_word_list(String topic_word_list) {
		this.topic_word_list = topic_word_list;
	}
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
}
