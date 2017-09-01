package cn.thinkingdata.web.domain.gas;


public class Do_gas_projects {

	private Integer status;
	private Integer project_id;
	private String   project_name;
	private String   pinyin;
	private String   game_type;
	private Double hot_score;
	private Integer detail_type;
	private String detail_type_desc;
	private String author;
	private String distributor;
	private String overview;
	private String release_date;
	private Integer hot_rank;
	private Integer hot_rank_yesterday;
	private Integer article_num;
	private Integer forum_content_num;
	private Integer channel_content_num;
	private Integer opinion_score;
	
	public String getGame_type() {
		return game_type;
	}
	public void setGame_type(String game_type) {
		this.game_type = game_type;
	}
	public String getPinyin() {
		return pinyin;
	}
	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public String getProject_name() {
		return project_name;
	}
	public void setProject_name(String project_name) {
		this.project_name = project_name;
	}
	public Double getHot_score() {
		return hot_score;
	}
	public void setHot_score(Double hot_score) {
		this.hot_score = hot_score;
	}
	public Integer getDetail_type() {
		return detail_type;
	}
	public void setDetail_type(Integer detail_type) {
		this.detail_type = detail_type;
	}
	public String getDetail_type_desc() {
		return detail_type_desc;
	}
	public void setDetail_type_desc(String detail_type_desc) {
		this.detail_type_desc = detail_type_desc;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public String getDistributor() {
		return distributor;
	}
	public void setDistributor(String distributor) {
		this.distributor = distributor;
	}
	public String getOverview() {
		return overview;
	}
	public void setOverview(String overview) {
		this.overview = overview;
	}
	public String getRelease_date() {
		return release_date;
	}
	public void setRelease_date(String release_date) {
		this.release_date = release_date;
	}
	public Integer getHot_rank() {
		return hot_rank;
	}
	public void setHot_rank(Integer hot_rank) {
		this.hot_rank = hot_rank;
	}
	public Integer getHot_rank_yesterday() {
		return hot_rank_yesterday;
	}
	public void setHot_rank_yesterday(Integer hot_rank_yesterday) {
		this.hot_rank_yesterday = hot_rank_yesterday;
	}
	public Integer getArticle_num() {
		return article_num;
	}
	public void setArticle_num(Integer article_num) {
		this.article_num = article_num;
	}
	public Integer getForum_content_num() {
		return forum_content_num;
	}
	public void setForum_content_num(Integer forum_content_num) {
		this.forum_content_num = forum_content_num;
	}
	public Integer getChannel_content_num() {
		return channel_content_num;
	}
	public void setChannel_content_num(Integer channel_content_num) {
		this.channel_content_num = channel_content_num;
	}

	public Integer getOpinion_score() {
		return opinion_score;
	}

	public void setOpinion_score(Integer opinion_score) {
		this.opinion_score = opinion_score;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((project_id == null) ? 0 : project_id.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Do_gas_projects other = (Do_gas_projects) obj;
		if (project_id == null) {
			if (other.project_id != null)
				return false;
		} else if (!project_id.equals(other.project_id))
			return false;
		return true;
	}
	
	
}
