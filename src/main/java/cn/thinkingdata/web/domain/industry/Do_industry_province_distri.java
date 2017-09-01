package cn.thinkingdata.web.domain.industry;

import org.springframework.stereotype.Repository;

@Repository
public class Do_industry_province_distri {
	private String province;
	private Float active_rate;
	
	public String getProvince() {
		return province;
	}
	public void setProvince(String province) {
		this.province = province;
	}
	public Float getActive_rate() {
		return active_rate;
	}
	public void setActive_rate(Float active_rate) {
		this.active_rate = active_rate;
	}
	
}
