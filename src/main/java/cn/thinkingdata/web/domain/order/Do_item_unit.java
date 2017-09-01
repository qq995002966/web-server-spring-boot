package cn.thinkingdata.web.domain.order;

public class Do_item_unit {
	public static final int MONTH_UNIT = 0;
	public static final int TIMES_UNIT = 1;
	public static final int ONCE_UNIT = 2;
	
    private Integer item_unit_id;
    private Integer item_id;
    private Integer item_unit;
    private Integer unit_num;
    private String unit_name;
    private Integer price;
    private String item_name;
    private String item_desc;
    private String service_list;
    private Integer game_scope;
    private Integer is_on_sale;
    
    public Integer getItem_unit_id() {
        return item_unit_id;
    }

    public void setItem_unit_id(Integer item_unit_id) {
        this.item_unit_id = item_unit_id;
    }

    public Integer getItem_id() {
        return item_id;
    }

    public void setItem_id(Integer item_id) {
        this.item_id = item_id;
    }

    public Integer getItem_unit() {
        return item_unit;
    }

    public void setItem_unit(Integer item_unit) {
        this.item_unit = item_unit;
    }

    public Integer getUnit_num() {
        return unit_num;
    }

    public void setUnit_num(Integer unit_num) {
        this.unit_num = unit_num;
    }

    public String getUnit_name() {
        return unit_name;
    }

    public void setUnit_name(String unit_name) {
        this.unit_name = unit_name;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
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
    
}
