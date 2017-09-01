package cn.thinkingdata.web.domain.gas;

import org.springframework.stereotype.Repository;

@Repository
public class Do_gas_source_dim {

	private Integer id;
	private Integer source_type;
	private String   source_desc;
	private Integer rank;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getSource_type() {
		return source_type;
	}
	public void setSource_type(Integer source_type) {
		this.source_type = source_type;
	}
	public String getSource_desc() {
		return source_desc;
	}
	public void setSource_desc(String source_desc) {
		this.source_desc = source_desc;
	}
	public Integer getRank() {
		return rank;
	}
	public void setRank(Integer rank) {
		this.rank = rank;
	}
}
