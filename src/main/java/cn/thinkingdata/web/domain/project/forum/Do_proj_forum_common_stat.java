package cn.thinkingdata.web.domain.project.forum;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_forum_common_stat {
	private String data_date            ; 
	private Integer project_id           ;
	private Integer title_num = 0           ;
	private Integer title_avg_num = 0       ;
	private Integer title_talent_num = 0    ;
	private Double positive_num = 0d;
	private Double positive_rate = 0d       ;
	private Double positive_avg_rate = 0d   ;
	private Double positive_talent_rate = 0d  ;
	private Double negative_num = 0d       ;
	private Double negative_rate = 0d       ;
	private Double negative_avg_rate = 0d   ;
	private Double negative_talent_rate = 0d ;
	private Double useless_rate = 0d        ;
	private Double useless_avg_rate = 0d    ;
	private Double useless_talent_rate = 0d ;
	private Integer hotword_num = 0         ;
	private Integer hotword_avg_num = 0     ;
	private Integer hotword_talent_num = 0  ;
	private Integer topic_num = 0           ;
	private Integer topic_avg_num = 0       ;
	private Integer topic_talent_num = 0    ;
	private String talent_games = ""         ;
	
	
	public String getData_date() {
		return data_date;
	}
	public void setData_date(String data_date) {
		this.data_date = data_date;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public Integer getTitle_num() {
		return title_num;
	}
	public void setTitle_num(Integer title_num) {
		this.title_num = title_num;
	}
	public Integer getTitle_avg_num() {
		return title_avg_num;
	}
	public void setTitle_avg_num(Integer title_avg_num) {
		this.title_avg_num = title_avg_num;
	}
	public Integer getTitle_talent_num() {
		return title_talent_num;
	}
	public void setTitle_talent_num(Integer title_talent_num) {
		this.title_talent_num = title_talent_num;
	}

	public Double getPositive_num() {
		return positive_num;
	}

	public void setPositive_num(Double positive_num) {
		this.positive_num = positive_num;
	}

	public Double getPositive_rate() {
		return positive_rate;
	}
	public void setPositive_rate(Double positive_rate) {
		this.positive_rate = positive_rate;
	}
	public Double getPositive_avg_rate() {
		return positive_avg_rate;
	}
	public void setPositive_avg_rate(Double positive_avg_rate) {
		this.positive_avg_rate = positive_avg_rate;
	}
	public Double getPositive_talent_rate() {
		return positive_talent_rate;
	}
	public void setPositive_talent_rate(Double positive_talent_rate) {
		this.positive_talent_rate = positive_talent_rate;
	}
	public Double getNegative_rate() {
		return negative_rate;
	}
	public void setNegative_rate(Double negative_rate) {
		this.negative_rate = negative_rate;
	}
	public Double getNegative_avg_rate() {
		return negative_avg_rate;
	}
	public void setNegative_avg_rate(Double negative_avg_rate) {
		this.negative_avg_rate = negative_avg_rate;
	}
	public Double getNegative_talent_rate() {
		return negative_talent_rate;
	}
	public void setNegative_talent_rate(Double negative_talent_rate) {
		this.negative_talent_rate = negative_talent_rate;
	}

	public Double getNegative_num() {
		return negative_num;
	}

	public void setNegative_num(Double negative_num) {
		this.negative_num = negative_num;
	}

	public Double getUseless_rate() {
		return useless_rate;
	}
	public void setUseless_rate(Double useless_rate) {
		this.useless_rate = useless_rate;
	}
	public Double getUseless_avg_rate() {
		return useless_avg_rate;
	}
	public void setUseless_avg_rate(Double useless_avg_rate) {
		this.useless_avg_rate = useless_avg_rate;
	}
	public Double getUseless_talent_rate() {
		return useless_talent_rate;
	}
	public void setUseless_talent_rate(Double useless_talent_rate) {
		this.useless_talent_rate = useless_talent_rate;
	}
	public Integer getHotword_num() {
		return hotword_num;
	}
	public void setHotword_num(Integer hotword_num) {
		this.hotword_num = hotword_num;
	}
	public Integer getHotword_avg_num() {
		return hotword_avg_num;
	}
	public void setHotword_avg_num(Integer hotword_avg_num) {
		this.hotword_avg_num = hotword_avg_num;
	}
	public Integer getHotword_talent_num() {
		return hotword_talent_num;
	}
	public void setHotword_talent_num(Integer hotword_talent_num) {
		this.hotword_talent_num = hotword_talent_num;
	}
	public Integer getTopic_num() {
		return topic_num;
	}
	public void setTopic_num(Integer topic_num) {
		this.topic_num = topic_num;
	}
	public Integer getTopic_avg_num() {
		return topic_avg_num;
	}
	public void setTopic_avg_num(Integer topic_avg_num) {
		this.topic_avg_num = topic_avg_num;
	}
	public Integer getTopic_talent_num() {
		return topic_talent_num;
	}
	public void setTopic_talent_num(Integer topic_talent_num) {
		this.topic_talent_num = topic_talent_num;
	}
	public String getTalent_games() {
		return talent_games;
	}
	public void setTalent_games(String talent_games) {
		this.talent_games = talent_games;
	}
	
	
}
