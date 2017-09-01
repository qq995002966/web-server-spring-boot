package cn.thinkingdata.web.persistence.order;

import cn.thinkingdata.web.domain.order.Do_invoice;

import java.util.List;

public interface Mapper_invoice {
	public List<Do_invoice> getInvoiceInfo(Long userId);

	public Do_invoice getInvoiceInfoByOrderId(String orderId);

	public int insertInvoice(Do_invoice do_invoice);
}
