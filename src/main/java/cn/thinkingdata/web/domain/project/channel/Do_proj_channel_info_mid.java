package cn.thinkingdata.web.domain.project.channel;


public class Do_proj_channel_info_mid {
	
	private Integer project_id;
	private Integer source_type;
	private String download_num;
	private String version;
	private String update_date;
	private String rating_value;
	private String rating_count;
	private String full_rating_value;
	private String cv_rating_value;
	private String cv_rating_count;
	
	public String getHot_level() {
		return hot_level;
	}
	public void setHot_level(String hot_level) {
		this.hot_level = hot_level;
	}
	public String getFirmware() {
		return firmware;
	}
	public void setFirmware(String firmware) {
		this.firmware = firmware;
	}
	public String getLike_num() {
		return like_num;
	}
	public void setLike_num(String like_num) {
		this.like_num = like_num;
	}
	private String hot_level;
	private String firmware;
	private String like_num;


	
	public String getCv_rating_value() {
		return cv_rating_value;
	}
	public void setCv_rating_value(String cv_rating_value) {
		this.cv_rating_value = cv_rating_value;
	}
	public String getCv_rating_count() {
		return cv_rating_count;
	}
	public void setCv_rating_count(String cv_rating_count) {
		this.cv_rating_count = cv_rating_count;
	}
	public String getFull_rating_value() {
		return full_rating_value;
	}
	public void setFull_rating_value(String full_rating_value) {
		this.full_rating_value = full_rating_value;
	}
	public String getRating_count() {
		return rating_count;
	}
	public void setRating_count(String rating_count) {
		if(null == rating_count||rating_count.length()<1){
			rating_count = "-";
		}
		this.rating_count = rating_count;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public Integer getSource_type() {
		return source_type;
	}
	public void setSource_type(Integer source_type) {
		this.source_type = source_type;
	}
	public String getDownload_num() {
		return download_num;
	}
	public void setDownload_num(String download_num) {
		if(null == download_num||download_num.length()<1){
			download_num = "-";
		}
		this.download_num = download_num;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getUpdate_date() {
		return update_date;
	}
	public void setUpdate_date(String update_date) {
		if(null == update_date||update_date.length()<1){
			update_date = "-";
		}
		this.update_date = update_date;
	}
	public String getRating_value() {
		return rating_value;
	}
	public void setRating_value(String rating_value) {
		if(null == rating_value||rating_value.length()<1){
			rating_value = "-";
		}
		this.rating_value = rating_value;
	}
	
	

}
