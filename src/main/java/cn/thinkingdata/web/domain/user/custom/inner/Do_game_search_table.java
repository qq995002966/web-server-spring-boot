package cn.thinkingdata.web.domain.user.custom.inner;

import java.util.Date;

/**
 * Created by Xiaowu on 2016/8/25.
 */
public class Do_game_search_table {
    private Integer gt_id;
    private Integer service_id;
    private Integer game_id;
    private String table_name;
    private Date create_time;
    private String table_desc;

    public Integer getGt_id() {
        return gt_id;
    }

    public void setGt_id(Integer gt_id) {
        this.gt_id = gt_id;
    }

    public Integer getService_id() {
        return service_id;
    }

    public void setService_id(Integer service_id) {
        this.service_id = service_id;
    }

    public Integer getGame_id() {
        return game_id;
    }

    public void setGame_id(Integer game_id) {
        this.game_id = game_id;
    }

    public String getTable_name() {
        return table_name;
    }

    public void setTable_name(String table_name) {
        this.table_name = table_name;
    }

    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    public String getTable_desc() {
        return table_desc;
    }

    public void setTable_desc(String table_desc) {
        this.table_desc = table_desc;
    }
}
