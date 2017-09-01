package cn.thinkingdata.web.domain.industry;

import org.springframework.stereotype.Repository;

@Repository
public class Do_industry_type_negative_distri {
	private String platform;
	private String detail_type;
	private Float complain_rate;
	private Float negative_post_rate;
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
	public Float getComplain_rate() {
		return complain_rate;
	}
	public void setComplain_rate(Float complain_rate) {
		this.complain_rate = complain_rate;
	}
	public Float getNegative_post_rate() {
		return negative_post_rate;
	}
	public void setNegative_post_rate(Float negative_post_rate) {
		this.negative_post_rate = negative_post_rate;
	}
	
}
