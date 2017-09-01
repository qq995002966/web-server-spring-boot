package cn.thinkingdata.web.persistence.order;

import cn.thinkingdata.web.domain.order.Do_item;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_item {

	public Do_item getItemById(int itemId);
	
	public List<Do_item> getItemList();
	
	public List<Do_item> getRecommendItemList(@Param("item_id_list") List<Integer> itemIdList);

	public List<Do_item> getReportList();

	public List<Do_item> getUserReportList(@Param("user_id") Integer user_id);

	public String getReportNameById(@Param("item_id") Integer item_id);
}
