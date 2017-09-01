package cn.thinkingdata.web.domain.industry;

import org.springframework.stereotype.Repository;

@Repository
public class Do_industry_type_negative_distri_detail {
	private String platform;
	private String detail_type;
	private Integer project_id;
	private Integer hot_index;
	private Float complain_rate;
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
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public Integer getHot_index() {
		return hot_index;
	}
	public void setHot_index(Integer hot_index) {
		this.hot_index = hot_index;
	}
	public Float getComplain_rate() {
		return complain_rate;
	}
	public void setComplain_rate(Float complain_rate) {
		this.complain_rate = complain_rate;
	}
	
}
