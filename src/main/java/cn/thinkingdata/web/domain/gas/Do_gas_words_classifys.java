package cn.thinkingdata.web.domain.gas;

import org.springframework.stereotype.Repository;

@Repository
public class Do_gas_words_classifys {
	Integer classify_id;
	Integer user_id;
	Integer project_id;
	String classify_name;
	Integer word_number;
	String last_update_time;

	public Integer getUser_id() {
		return user_id;
	}
	public void setUser_id(Integer user_id) {
		this.user_id = user_id;
	}
	public Integer getClassify_id() {
		return classify_id;
	}
	public void setClassify_id(Integer classify_id) {
		this.classify_id = classify_id;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public String getClassify_name() {
		return classify_name;
	}
	public void setClassify_name(String classify_name) {
		this.classify_name = classify_name;
	}
	public Integer getWord_number() {
		return word_number;
	}
	public void setWord_number(Integer word_number) {
		this.word_number = word_number;
	}
	public String getLast_update_time() {
		return last_update_time;
	}
	public void setLast_update_time(String last_update_time) {
		this.last_update_time = last_update_time;
	}
	
	
}
