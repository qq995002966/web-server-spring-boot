package cn.thinkingdata.web.domain.project.chat;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_chat_senti_topwords {

	private String senti_type;
	private String keyword;
	private Integer num;
	private Integer info_id;
	
	public String getSenti_type() {
		return senti_type;
	}
	public void setSenti_type(String senti_type) {
		this.senti_type = senti_type;
	}
	public String getKeyword() {
		return keyword;
	}
	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}
	public Integer getNum() {
		return num;
	}
	public void setNum(Integer num) {
		this.num = num;
	}
	public Integer getInfo_id() {
		return info_id;
	}
	public void setInfo_id(Integer info_id) {
		this.info_id = info_id;
	}

}
