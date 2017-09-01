package cn.thinkingdata.web.persistence.table;

import cn.thinkingdata.web.domain.table.Do_table_flush_info;

import java.util.List;

/**
 * Created by Carpenter on 2017/1/4.
 */
public interface Mapper_table_flush_info {
    public List<Do_table_flush_info> getAllTableFlushInfo();
}
