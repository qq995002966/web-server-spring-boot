package cn.thinkingdata.web.domain.industry;


public class Do_industry_game_hot_rank {
	private String platform;
	private String detail_type;
	private Integer rank;
	private Integer project_id;
	private String author;
	private Integer rank_yesterday;
	public String getPlatform() {
		return platform;
	}
	public void setPlatform(String platform) {
		this.platform = platform;
	}
	public String getDetail_type() {
		return detail_type;
	}
	public void setDetail_type(String detail_type) {
		this.detail_type = detail_type;
	}
	public Integer getRank() {
		return rank;
	}
	public void setRank(Integer rank) {
		this.rank = rank;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public Integer getRank_yesterday() {
		return rank_yesterday;
	}
	public void setRank_yesterday(Integer rank_yesterday) {
		this.rank_yesterday = rank_yesterday;
	}
}
