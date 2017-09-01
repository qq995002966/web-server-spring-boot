package cn.thinkingdata.web.domain.project.forum;

public class Do_proj_forum_topwords_common {

	private String data_date;
	private String keyword;
	private String keyword_classify;
	private Integer cnt;

	public String getData_date() {
		return data_date;
	}

	public void setData_date(String data_date) {
		this.data_date = data_date;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public String getKeyword_classify() {
		return keyword_classify;
	}

	public void setKeyword_classify(String keyword_classify) {
		this.keyword_classify = keyword_classify;
	}

	public Integer getCnt() {
		return cnt;
	}

	public void setCnt(Integer cnt) {
		this.cnt = cnt;
	}
}
