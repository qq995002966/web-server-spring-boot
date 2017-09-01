package cn.thinkingdata.web.domain.table;

import java.util.Date;

/**
 * @author Carpenter
 * @date 2017/1/4 15:14
 * @description Do_table_flush_info
 */
public class Do_table_flush_info {

    private Integer id;
    private String db_name;
    private String table_name;
    private Date update_time;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDb_name() {
        return db_name;
    }

    public void setDb_name(String db_name) {
        this.db_name = db_name;
    }

    public String getTable_name() {
        return table_name;
    }

    public void setTable_name(String table_name) {
        this.table_name = table_name;
    }

    public Date getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }
}
