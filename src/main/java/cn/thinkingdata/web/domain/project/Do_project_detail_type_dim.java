package cn.thinkingdata.web.domain.project;

import org.springframework.stereotype.Repository;

@Repository
public class Do_project_detail_type_dim {
	private Integer detail_type;
	private String detail_type_desc;
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
	
}
