package cn.thinkingdata.web.domain.order;

import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public class Do_item {
	public static final int ALL_GAME = 0;
	public static final int ONE_GAME = 1;
	
	private Integer item_id;
	private String item_name;
	private String item_classify;
	private String item_slogan;
	private String item_desc;
	private String cover_pic;
	private String service_list;
	private Integer game_scope;
	private Integer is_on_sale;
	private Date create_time;
	private String item_pics;
	private String procedure_pics;
	private String refer_price;
	private String recommend_items;
	private Integer is_package;
	private Integer classify_order;
	private Integer item_order;
	private String show_pic;
	
	public Integer getItem_id() {
		return item_id;
	}

	public void setItem_id(Integer item_id) {
		this.item_id = item_id;
	}

	public String getItem_name() {
		return item_name;
	}

	public void setItem_name(String item_name) {
		this.item_name = item_name;
	}

	public String getItem_desc() {
		return item_desc;
	}

	public void setItem_desc(String item_desc) {
		this.item_desc = item_desc;
	}

	public String getService_list() {
		return service_list;
	}

	public void setService_list(String service_list) {
		this.service_list = service_list;
	}

	public Integer getGame_scope() {
		return game_scope;
	}

	public void setGame_scope(Integer game_scope) {
		this.game_scope = game_scope;
	}

	public Integer getIs_on_sale() {
		return is_on_sale;
	}

	public void setIs_on_sale(Integer is_on_sale) {
		this.is_on_sale = is_on_sale;
	}

	public Date getCreate_time() {
		return create_time;
	}

	public void setCreate_time(Date create_time) {
		this.create_time = create_time;
	}

	public String getItem_pics() {
		return item_pics;
	}

	public void setItem_pics(String item_pics) {
		this.item_pics = item_pics;
	}

	public String getItem_classify() {
		return item_classify;
	}

	public void setItem_classify(String item_classify) {
		this.item_classify = item_classify;
	}

	public String getItem_slogan() {
		return item_slogan;
	}

	public void setItem_slogan(String item_slogan) {
		this.item_slogan = item_slogan;
	}

	public String getCover_pic() {
		return cover_pic;
	}

	public void setCover_pic(String cover_pic) {
		this.cover_pic = cover_pic;
	}

	public String getProcedure_pics() {
		return procedure_pics;
	}

	public void setProcedure_pics(String procedure_pics) {
		this.procedure_pics = procedure_pics;
	}

	public String getRefer_price() {
		return refer_price;
	}

	public void setRefer_price(String refer_price) {
		this.refer_price = refer_price;
	}

	public String getRecommend_items() {
		return recommend_items;
	}

	public void setRecommend_items(String recommend_items) {
		this.recommend_items = recommend_items;
	}

	public Integer getIs_package() {
		return is_package;
	}

	public void setIs_package(Integer is_package) {
		this.is_package = is_package;
	}

	public Integer getClassify_order() {
		return classify_order;
	}

	public void setClassify_order(Integer classify_order) {
		this.classify_order = classify_order;
	}

	public Integer getItem_order() {
		return item_order;
	}

	public void setItem_order(Integer item_order) {
		this.item_order = item_order;
	}

	public String getShow_pic() {
		return show_pic;
	}

	public void setShow_pic(String show_pic) {
		this.show_pic = show_pic;
	}
	
	
}
