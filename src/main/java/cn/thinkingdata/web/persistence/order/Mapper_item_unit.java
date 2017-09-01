package cn.thinkingdata.web.persistence.order;

import cn.thinkingdata.web.domain.order.Do_item_unit;

import java.util.List;

public interface Mapper_item_unit {

	public List<Do_item_unit> getItemUnitById(int itemId);

	public Do_item_unit getItemUnitByItemUnitId(int itemUnitId);

	
}
