package cn.thinkingdata.web.domain.project.chat;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_chat_topwords_common {

	private String keyword;
	private int num;
	
	public String getKeyword() {
		return keyword;
	}
	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}
	public int getNum() {
		return num;
	}
	public void setNum(int num) {
		this.num = num;
	}

	
	

}
