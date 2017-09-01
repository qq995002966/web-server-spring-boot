package cn.thinkingdata.web.domain.gas;

import org.springframework.stereotype.Repository;

@Repository
public class Do_gas_words {
	public Integer word_id;
	public Integer classify_id;
	public Integer user_id;
	public String keyword;
	
	public Integer getWord_id() {
		return word_id;
	}
	public void setWord_id(Integer word_id) {
		this.word_id = word_id;
	}
	public Integer getClassify_id() {
		return classify_id;
	}
	public void setClassify_id(Integer classify_id) {
		this.classify_id = classify_id;
	}
	public Integer getUser_id() {
		return user_id;
	}
	public void setUser_id(Integer user_id) {
		this.user_id = user_id;
	}
	public String getKeyword() {
		return keyword;
	}
	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}
}
